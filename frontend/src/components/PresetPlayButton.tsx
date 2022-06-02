import { IconButton, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import presets from "../utils/presets";
import { useEffect, useRef, useState } from "react";
import { toast } from "material-react-toastify";

interface Props {
  presetIdx: number;
}

const PresetPlayButton: React.FC<Props> = (props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePresetPlay = () => {
    if (audioRef.current) {
      if (audioRef.current.readyState !== 4) {
        toast.info("Loading preset...");
        return;
      }

      if (audioRef.current.paused) {
        audioRef.current.play();
        setPlaying(true);
        return;
      }

      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const handlePresetEnd = () => {
    setPlaying(false);
  };

  useEffect(() => {
    setPlaying(false);
    if (audioRef.current && props.presetIdx >= 0) {
      const preset = presets.find((p) => p.id === props.presetIdx);
      if (preset) {
        audioRef.current.src = preset.path;
      }
    }
  }, [props.presetIdx]);

  return (
    <Tooltip title="Preview selected preset">
      <IconButton
        color="primary"
        disabled={props.presetIdx < 0}
        onClick={handlePresetPlay}
        component="span"
      >
        <audio
          id="audio-player"
          className="hidden"
          ref={audioRef}
          onEnded={handlePresetEnd}
        ></audio>
        {!playing ? <PlayArrowIcon /> : <PauseIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default PresetPlayButton;
