import { Stop } from "@mui/icons-material";
import { Box, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { IMusicPlayer } from "../services/IMusicPlayer";
import TempoSlider from "./TempoSlider";
import PlayPauseButton from "./PlayPauseButton";
import VolumeSlider from "./VolumeSlider";

type Props = {
  player: IMusicPlayer;
};
const MusicModalControls: React.FC<Props> = (props) => {
  const { player } = props;
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

  const handlePlay = async () => {
    if (player.isPlaying()) {
      player.pause();
    } else {
      await player.play();
    }
  };

  const handleStop = async () => {
    await player.stop();
    setTempo(120);
  };

  const handleIsPlaying = () => {
    return player.isPlaying();
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={8}>
          <TempoSlider value={tempo} setValue={handleChange} player={player} />
        </Grid>
        <Grid item xs={12} md={4}>
          <VolumeSlider player={player} />
        </Grid>
      </Grid>
      <Box className="flex justify-center p-2 border-t-2 border-t-slate-500">
        <PlayPauseButton
          handleIsPlaying={handleIsPlaying}
          onClick={handlePlay}
        />
        <Button onClick={handleStop} startIcon={<Stop />}>
          Stop
        </Button>
      </Box>
    </div>
  );
};

export default MusicModalControls;
