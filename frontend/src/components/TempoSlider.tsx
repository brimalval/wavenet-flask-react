import { Box, Typography, Input, Slider } from "@mui/material";
import { Player } from "midi-player-js";
import { useState } from "react";

type Props = {
  player: Player;
};

const TempoSlider: React.FC<Props> = (props) => {
  const [tempo, setTempo] = useState(120);
  const { player } = props;
  type TextElement = HTMLTextAreaElement | HTMLInputElement;
  const handleChange: React.ChangeEventHandler<TextElement> = (event) => {
    console.log(event.target.value);
    (player as any).setTempo(event.target.value);
    setTempo(Number(event.target.value));
  };
  type SliderChangeEvent = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => void;
  const handleSliderChange: SliderChangeEvent = (event, value) => {
    (player as any).setTempo(value);
    setTempo(value as number);
  };
  return (
    <Box className="p-10 flex justify-center">
      <Box className="flex space-x-4">
        <Typography id="tempo">Tempo:</Typography>
        <Input
          id="tempo"
          name="tempo"
          type="number"
          size="small"
          value={tempo}
          onChange={handleChange}
          inputProps={{
            min: 45,
            max: 280,
          }}
        />
      </Box>
      <Slider
        value={tempo}
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
