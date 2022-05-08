import { Box, Typography, Input, Slider } from "@mui/material";
import { IMusicPlayer } from "../services/IMusicPlayer";

type Props = {
  player: IMusicPlayer;
  value: number;
  setValue: (value: number) => void;
};

const TempoSlider: React.FC<Props> = (props) => {
  const { player, value, setValue } = props;
  type TextElement = HTMLTextAreaElement | HTMLInputElement;
  const handleChange: React.ChangeEventHandler<TextElement> = (event) => {
    player.setTempo(Number(event.target.value));
    setValue(Number(event.target.value));
  };
  type SliderChangeEvent = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => void;
  const handleSliderChange: SliderChangeEvent = (event, value) => {
    (player as any).setTempo(value);
    setValue(value as number);
  };
  return (
    <Box className="sm:p-10 xs:p-3 space-x-4 flex justify-center">
      <Box className="flex items-center space-x-4">
        <Typography id="tempo">Tempo:</Typography>
        <Input
          id="tempo"
          name="tempo"
          type="number"
          size="medium"
          value={value}
          onChange={handleChange}
          inputProps={{
            min: 45,
            max: 280,
            className: "w-auto",
          }}
        />
      </Box>
      <Slider
        value={value}
        onChange={handleSliderChange}
        aria-labelledby="tempo-slider"
        valueLabelDisplay="auto"
        step={1}
        min={45}
        max={280}
      />
    </Box>
  );
};

export default TempoSlider;
