import { ExitToApp } from "@mui/icons-material";
import {
  Box,
  Button,
  Modal,
  ModalProps,
  Paper,
  Typography,
} from "@mui/material";
import { Event } from "midi-player-js";
import Song from "../utils/types/Song";

type Props = Omit<ModalProps, "children"> & {
  events: Event[];
  scale: string[];
  tempo: number;
  eventIndex: number;
  handleClose: () => void;
  controlButton: React.ReactElement;
};

const MusicModal: React.FC<Props> = (props) => {
  const { events, scale, tempo, eventIndex, controlButton, ...modalProps } =
    props;
  return (
    <Modal {...modalProps} className="flex justify-center items-center">
      <Paper>
        <Box>
          <Button onClick={props.handleClose}>
            <ExitToApp />
          </Button>
        </Box>
        <Typography variant="h6">Hello world</Typography>
        <Typography variant="h6">Event index: {eventIndex}</Typography>
        {controlButton}
      </Paper>
    </Modal>
  );
};

export default MusicModal;
