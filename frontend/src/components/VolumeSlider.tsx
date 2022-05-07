import { VolumeDown, VolumeUp } from "@mui/icons-material";
import { Box, Slider, Stack } from "@mui/material";
import { useState } from "react";
import { IMusicPlayer } from "../services/IMusicPlayer";

type Props = {
  player: IMusicPlayer;
};

const VolumeSlider: React.FC<Props> = (props) => {
  const { player } = props;
  const [volume, setVolume] = useState(1);
  type SliderChangeEvent = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => void;
  const handleSliderChange: SliderChangeEvent = (event, value) => {
    console.log(player.getInstrument(), value);
    player.setVolume((Number(value) / 100) * 8);
    setVolume(value as number);
  };
  return (
    <Box className="sm:p-10 xs:p-3 flex justify-center">
      <Stack
        spacing={2}
        direction="row"
        sx={{ mb: 1 }}
        className="w-full flex items-center"
      >
        <VolumeDown />
        <Slider
          aria-label="Volume"
          min={0}
          max={100}
          defaultValue={25}
          value={volume}
          onChange={handleSliderChange}
        />
        <VolumeUp />
      </Stack>
    </Box>
  );
};

export default VolumeSlider;
