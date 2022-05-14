from tensorflow import keras
from keras import layers
import tensorflow as tf
import numpy as np


class DilatedCausalConvolution1D(layers.Layer):
    def __init__(self, filters, kernel_size, dilation_rate):
        super(DilatedCausalConvolution1D, self).__init__()
        self.conv1D = keras.layers.Conv1D(filters=filters, kernel_size=kernel_size,
                                          dilation_rate=dilation_rate,
                                          padding="causal")
        self.index_of_ignored_data = (kernel_size - 1) * dilation_rate

    def call(self, x, training=False):
        x = self.conv1D(x, training=training)
        return x[:, self.index_of_ignored_data:]


class ResidualBlock(layers.Layer):
    def __init__(self, res_channels, skip_channels, kernel_size, dilation_rate):
        super(ResidualBlock, self).__init__()
        self.dilated_causal_convolution = DilatedCausalConvolution1D(res_channels, kernel_size,
                                                                     dilation_rate=dilation_rate)
        self.residual_conv1D = layers.Conv1D(filters=res_channels, kernel_size=1)
        self.skip_conv1D = layers.Conv1D(filters=skip_channels, kernel_size=1)

    def call(self, x, skip_size, training=False):
        x = self.dilated_causal_convolution(x, training=training)
        tanh_result = keras.activations.tanh(x)
        sigmoid_result = keras.activations.sigmoid(x)
        x = tanh_result * sigmoid_result
        residual_output = self.residual_conv1D(x)
        residual_output = residual_output + x[:, -residual_output.shape[1]:]
        skip_connection_output = self.skip_conv1D(x)
        skip_connection_output = skip_connection_output[:, -skip_size:]
        return residual_output, skip_connection_output


class StacksResidualBlocks(layers.Layer):
    def __init__(self, residual_channels, skip_channels, kernel_size, stack_size, layer_size):
        super(StacksResidualBlocks, self).__init__()
        build_dilation_function = self.build_dilation
        dilations = build_dilation_function(stack_size, layer_size)
        self.residual_blocks = []

        for stack_level, dilations_per_stack in enumerate(dilations):
            for layer_level, dilation_rate in enumerate(dilations_per_stack):
                residual_block = ResidualBlock(residual_channels, skip_channels, kernel_size, dilation_rate)
                self.residual_blocks.append(residual_block)

    def build_dilation(self, stack_size, layer_size):
        stacks_dilations = []
        for stack in range(stack_size):
            dilations = []
            for layer in range(layer_size):
                dilations.append(2 ** layer)
            stacks_dilations.append(dilations)
        return stacks_dilations

    def call(self, x, skip_size, training=False):
        residual_output = x
        skip_connection_outputs = []
        for residual_block in self.residual_blocks:
            residual_output, skip_connection_output = residual_block(residual_output, skip_size)
            skip_connection_outputs.append(skip_connection_output)
        return residual_output, tf.convert_to_tensor(skip_connection_outputs)


class DenseLayer(layers.Layer):
    def __init__(self, channel, num_classes):
        super(DenseLayer, self).__init__()
        # add conv1d with twice the given channel size
        self.conv1D = layers.Conv1D(filters=channel, kernel_size=1)
        self.dense = layers.Dense(num_classes)
        self.flatten = layers.Flatten()

    def call(self, skip_connection_outputs, training=False):
        x = tf.reduce_mean(skip_connection_outputs, 0)
        x = keras.activations.relu(x)
        x = self.conv1D(x, training=training)
        x = keras.activations.relu(x)
        x = self.conv1D(x, training=training)
        x = self.flatten(x)
        x = self.dense(x)
        x = keras.activations.softmax(x)
        return x


class WaveNet(keras.Model):
    def __init__(self, input_channels, output_channels, stack_size, kernel_size, layer_size, num_classes,
                 sequence_length):
        super(WaveNet, self).__init__()
        self.sequence_length = sequence_length
        self.kernel_size = kernel_size
        self.stack_size = stack_size
        self.layer_size = layer_size
        self.causal_conv1D = DilatedCausalConvolution1D(output_channels, kernel_size=1, dilation_rate=1)
        # TODO: Might only need one channel
        self.stack_residual_blocks = StacksResidualBlocks(input_channels, output_channels, kernel_size, stack_size,
                                                          layer_size)
        self.classifier = DenseLayer(output_channels, num_classes)

    def calculate_receptive_field(self):
        return np.sum([(self.kernel_size - 1) * (2 ** level) for level in range(self.layer_size)] * self.stack_size)

    def calculate_skip_size(self, x):
        return x.shape[1] - self.calculate_receptive_field()

    def call(self, input_x, training=False):
        x = self.causal_conv1D(input_x)
        skip_size = self.calculate_skip_size(x)
        _, skip_connection_outputs = self.stack_residual_blocks(x, skip_size=skip_size, training=training)
        x = self.classifier(skip_connection_outputs)
        return x

    def model(self):
        x = keras.Input(shape=(self.sequence_length, 1))
        return keras.Model(inputs=[x], outputs=self.call(x))
