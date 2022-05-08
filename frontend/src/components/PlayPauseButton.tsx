import { Button, ButtonProps } from "@mui/material";
import { Pause, PlayArrow } from "@mui/icons-material";

type Props = ButtonProps & {
  isPlaying: boolean;
};

const PlayPauseButton: React.FC<Props> = (props) => {
  const { isPlaying, onClick, ...rest } = props;
  return (
    <Button
      variant="text"
      {...rest}
      onClick={onClick}
      startIcon={isPlaying ? <Pause /> : <PlayArrow />}
    >
      {isPlaying ? "Pause" : "Play"}
    </Button>
  );
};

export default PlayPauseButton;
