import { Stop } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { IMusicPlayer } from "../services/IMusicPlayer";
import TempoSlider from "./TempoSlider";

type Props = {
  player: IMusicPlayer;
  controlButtonGetter: (extraAction?: () => any) => JSX.Element;
  showTempoSlider: boolean;
  handleStop: () => void;
};
const MusicModalControls: React.FC<Props> = (props) => {
  const { player, controlButtonGetter, handleStop, showTempoSlider } = props;
  const [tempo, setTempo] = useState(120);
  const handleChange = async (value: number) => {
    setTempo(value);
    await (player as any).setTempo(value);
  };

  useEffect(() => {
    var mounted = true;
    if (mounted) {
      player.on("endOfFile", () => {
        setTempo(120);
      });
    }
    return () => {
      mounted = false;
    };
  }, [player]);

  return (
    <div>
      {showTempoSlider && (
        <TempoSlider value={tempo} setValue={handleChange} player={player} />
      )}
      <Box className="flex justify-center p-2 border-t-2 border-t-slate-500">
        {controlButtonGetter(async () => {
          await handleChange(tempo);
        })}
        <Button
          onClick={() => {
            handleStop();
            setTempo(120);
          }}
          startIcon={<Stop />}
        >
          Stop
        </Button>
      </Box>
    </div>
  );
};

export default MusicModalControls;
