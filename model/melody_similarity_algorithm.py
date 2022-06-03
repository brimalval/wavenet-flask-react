import numpy as np


def pitch_note_split(melody):
    melody = np.array(melody)
    durations = melody % 5

    melody = (melody - durations) / 5
    durations = 4 / 2 ** durations
    return melody, durations


def transform_relative_pitch(melody):
    # using the formula x = p - avg(p)

    average_pitch = np.average(melody)
    melody = melody - average_pitch
    return melody


def relationship_comparative_line(melody, durations):
    # using the formula tan (a) = (x_b - x_a) / length_x_a

    relationship = (melody[1:] - melody[:-1]) / durations[:-1]
    return relationship


def pitch_difference_limit(relative_melody_1, relative_melody_2):
    """
    LIMIT_x = Max_x - Min_x
    Limit_x : The limit value for the relative pitch difference value
    Max_x : The maximum relative pitch value
    Min_x : The minimum relative pitch value
    Max_x = MAX(Max_x1, Max_x2)
    Minx = MIN(Min_x1, Min_x2)
    Max_x1, Max_x2 : Maximum relative pitch values of melody 1 and melody 2, respectively
    Min_x1, Min_x2 : Minimum relative pitch values of melody 1 and melody 2, respectively
    :param relative_melody_1: main relatively pitched comparative unit (preset)
    :param relative_melody_2: secondary relatively pitched comparative unit (melody to be checked)
    :return: maximum limit of pitch difference
    """

    min_x = min(min(relative_melody_1), min(relative_melody_2))
    max_x = max(max(relative_melody_1), max(relative_melody_2))
    limit = max_x - min_x
    return limit


def inclination_difference_limit(inclination_1, inclination_2):
    """
    Limit_tan(α) = Max_tan(α) – Min_tan(α)
    Limit_tan(α) : The limit value for the inclination
    difference value
    Max_tan(α) : The maximum inclination value
    Min_tan(α) : The minimum inclination value
    Max_tan(α) = MAX(Max_tan(α1), Max_tan(α2))
    Min_tan(α) = MIN(Min_tan(a1), Min_tan(a2))
    Max_tan(α1), Max_tan(α2) : Maximum inclination values of melody 1 and melody 2, respectively
    Min_tan(a1), Min_tan(a2): Minimum inclination values of melody 1 and melody 2, respectively

    :param inclination_1: inclination values of melody 1
    :param inclination_2: inclination values of melody 2
    :return: limit of inclination difference
    """

    min_x = min(min(inclination_1), min(inclination_2))
    max_x = max(max(inclination_1), max(inclination_2))
    limit = max_x - min_x
    return limit


def pitch_similarity(x1, x2, pitch_diff_limit):
    """
    Formula: 1 -  | x1 = x2 | / Limit_x

    :param x1: relative pitch values of the preset
    :param x2: relative pitch values of the melody being compared
    :param pitch_diff_limit: maximum limit of pitch difference
    :return: pitch similarity score
    """
    return 1 - abs(x1 - x2) / pitch_diff_limit


def inclination_similarity(inclination_1, inclination_2, inclination_diff_limit):
    """
    Formula: 1 - | tan(a1) - tan(a2) | / Limit_tan(a)
    :param inclination_1: inclination values of the preset
    :param inclination_2: inclination values of the melody to be compared
    :param inclination_diff_limit: maximum limit of inclination difference
    :return: inclination similarity score
    """
    return 1 - abs(inclination_1 - inclination_2) / inclination_diff_limit


def unit_weighted_pitch_similarity(x1, x2, pitch_diff_limit, durations):
    """
    Calculates the weighted average of pitch similarity scores having the note duration as weights

    :param x1: relative pitch values of the preset
    :param x2: relative pitch values of the melody being compared
    :param pitch_diff_limit: maximum limit of pitch difference
    :param durations: duration of notes/pitches of the preset
    :return: weighted average of pitch similarity scores
    """
    pitch_similarity_score = pitch_similarity(x1, x2, pitch_diff_limit)
    return np.sum(pitch_similarity_score * durations) / np.sum(durations)


def unit_weighted_inclination_similarity(inclination_1, inclination_2, inclination_diff_limit, durations):
    """
    Calculates the weighted average of pitch similarity scores having the note duration as weights

    :param inclination_1: inclination values of the preset
    :param inclination_2: inclination values of the melody to be compared
    :param inclination_diff_limit: maximum limit of inclination difference
    :param durations: duration of notes/pitches of the preset
    :return: weighted average of pitch similarity scores
    """
    inclination_similarity_score = inclination_similarity(inclination_1, inclination_2, inclination_diff_limit)
    return np.sum(inclination_similarity_score * durations[:-1]) / np.sum(durations[:-1])


def complex_similarity(pitch_weight, inclination_weight, relative_pitch_1, relative_pitch_2, comparative_line_1,
                       comparative_line_2, pitch_diff_limit, inclination_diff_limit, durations):
    total_weight = pitch_weight + inclination_weight
    weighted_pitch_res = pitch_weight * unit_weighted_pitch_similarity(relative_pitch_1, relative_pitch_2,
                                                                       pitch_diff_limit, durations)
    weighted_inclination_res = inclination_weight * unit_weighted_inclination_similarity(
        comparative_line_1, comparative_line_2, inclination_diff_limit, durations)

    return (weighted_pitch_res + weighted_inclination_res) / total_weight


def get_similarity_percentage(preset, melody):
    n = len(preset) - len(melody)
    results = []
    for i in range(n + 1):
        melody_1, duration_1 = pitch_note_split(preset[i:i + len(melody)])
        melody_2, duration_2 = pitch_note_split(melody)
        relative_pitch_1 = transform_relative_pitch(melody_1)
        relative_pitch_2 = transform_relative_pitch(melody_2)

        comparative_line_1 = relationship_comparative_line(relative_pitch_1, duration_1)
        comparative_line_2 = relationship_comparative_line(relative_pitch_2, duration_2)
        pitch_limit = pitch_difference_limit(relative_pitch_1, relative_pitch_2)
        inclination_limit = inclination_difference_limit(comparative_line_1, comparative_line_2)
        results.append(
            complex_similarity(0.5, 0.5, relative_pitch_1, relative_pitch_2, comparative_line_1, comparative_line_2,
                               pitch_limit, inclination_limit, duration_1))

    normalization = (np.max(results) - 0.6) / (1 - 0.6)
    return normalization


if __name__ == "__main__":
    comp_1 = [58, 103, 118, 68, 59, 118, 108, 94, 68, 93, 103, 83, 103, 108, 49, 83, 83, 93, 103, 58, 73, 83, 68,
              49, 83, 108, 84, 84, 49, 108, 47, 68, 84, 84, 103, 48, 58, 67, 67, 68, 57, 68, 73, 83, 59, 83, 73, 83,
              48, 49]

    comp_2 = [58, 103, 118, 68, 59, 118, 108, 94, 68, 93, 103, 83, 103, 108, 49, 83, 83, 93, 103, 58, 73, 83, 68,
              49, 83, 108, 84, 84, 30, 108, 47, 68, 84, 40, 103, 48, 58, 67, 67, 68, 57, 68, 73, 83, 59, 83, 73, 83,
              48, 49]

    m1, d1 = pitch_note_split(comp_1)
    m2, d2 = pitch_note_split(comp_2)

    rp_1 = transform_relative_pitch(m1)
    rp_2 = transform_relative_pitch(m2)

    cl_1 = relationship_comparative_line(rp_1, d1)
    cl_2 = relationship_comparative_line(rp_2, d2)

    pl = pitch_difference_limit(rp_1, rp_2)
    il = inclination_difference_limit(cl_1, cl_2)

    print("SCORE", complex_similarity(0.5, 0.5, rp_1, rp_2, cl_1, cl_2, pl, il, d1))
    pass

    #
    # def similarity_error(self, melody, preset):
    #
    #     melody, preset = self.to_numpy(melody, preset)
    #     n = self.len_diff(melody, preset)
    #     errors = self.get_distances(n, melody, preset)
    #
    #     print(self.get_min_error(errors))
    #
    # def similarity_error_2(self, melody, preset):
    #
    #     melody, preset = self.to_numpy(melody, preset)
    #
    #     note_difference_preset = preset[0:-1] - preset[1:]
    #     note_difference_melody = melody[0:-1] - melody[1:]
    #     n = self.len_diff(note_difference_preset, note_difference_melody)
    #
    #     errors = self.get_distances(n, note_difference_melody, note_difference_preset)
    #
    #     print(self.get_min_error(errors))
    #
    # def pitch_error(self, melody, preset):
    #     print("Pitch Error", end=": ")
    #     melody, preset = self.to_numpy(melody, preset)
    #
    #     pitch_preset = preset - preset % 5
    #     pitch_melody = melody - melody % 5
    #     n = self.len_diff(pitch_preset, pitch_melody)
    #
    #     errors = self.get_distances(n, pitch_melody, pitch_preset)
    #     print(self.get_min_error(errors))
    #
    # def duration_error(self, melody, preset):
    #     print("Duration Error", end=": ")
    #     melody, preset = self.to_numpy(melody, preset)
    #     pitch_preset = preset % 5
    #     pitch_melody = melody % 5
    #     n = self.len_diff(pitch_preset, pitch_melody)
    #     errors = self.get_distances(n, pitch_melody, pitch_preset)
    #     print(self.get_min_error(errors))
    #
    #
    # @staticmethod
    # def len_diff(melody, preset):
    #     return len(preset) - len(melody)
    #
    # @staticmethod
    # def to_numpy(melody, preset):
    #     return np.array(melody), np.array(preset)
    #
    # @staticmethod
    # def get_min_error(errors):
    #     return np.min(np.sum(errors, axis=1))
    #
    # @staticmethod
    # def get_distances(n, melody, preset):
    #     errors = []
    #     for index in range(n + 1):
    #         errors.append(
    #             abs(preset[index:index + len(melody)] - melody))
    #
    #     return errors
