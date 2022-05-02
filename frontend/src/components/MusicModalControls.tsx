import { Stop } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { Player } from "midi-player-js";
import { useState } from "react";
import TempoSlider from "./TempoSlider";

type Props = {
  player: Player;
  controlButtonGetter: (extraAction?: () => any) => JSX.Element;
  handleStop: () => void;
};
const MusicModalControls: React.FC<Props> = (props) => {
  const { player, controlButtonGetter, handleStop } = props;
  const [tempo, setTempo] = useState(120);
  const handleChange = async (value: number) => {
    setTempo(value);
    await (player as any).setTempo(value);
  };

  return (
    <div>
      <TempoSlider value={tempo} setValue={handleChange} player={player} />
      <Box className="flex justify-center p-2 border-t-2 border-t-slate-500">
        {controlButtonGetter(async () => {
          await handleChange(tempo);
        })}
        <Button onClick={handleStop} startIcon={<Stop />}>
          Stop
        </Button>
      </Box>
    </div>
  );
};

export default MusicModalControls;
