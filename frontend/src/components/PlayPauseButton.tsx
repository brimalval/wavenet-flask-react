import { Button, ButtonProps } from "@mui/material";
import { Pause, PlayArrow } from "@mui/icons-material";
import { useState } from "react";

type Props = ButtonProps & {
  handleIsPlaying: () => boolean;
};

const PlayPauseButton: React.FC<Props> = (props) => {
  const { handleIsPlaying, onClick, ...rest } = props;
  const [isPlaying, setIsPlaying] = useState(handleIsPlaying());
  return (
    <Button
      variant="text"
      {...rest}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
        setIsPlaying(handleIsPlaying());
      }}
      startIcon={isPlaying ? <Pause /> : <PlayArrow />}
    >
      {isPlaying ? "Pause" : "Play"}
    </Button>
  );
};

export default PlayPauseButton;
