import { Close } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Modal,
  ModalProps,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Event } from "midi-player-js";

type Props = Omit<ModalProps, "children"> & {
  events: Event[];
  scale: string[];
  tempo: number;
  eventIndex: number;
  handleClose: () => void;
  controlButton: React.ReactElement;
};

const MusicModal: React.FC<Props> = (props) => {
  const {
    events,
    scale,
    tempo,
    eventIndex,
    controlButton,
    handleClose,
    ...modalProps
  } = props;

  const isBeingPlayed = (note: string, index: number) => {
    if (eventIndex < 1) {
      return false;
    }
    const isSameIndex = eventIndex - 1 === index;
    const currentEvent = events[eventIndex - 1];
    const isSameNote = currentEvent.noteName === note;
    // Check for equivalence of note in terms of sharp/flat
    const sharpToFlatMap = {
      "C#": "Db",
      "D#": "Eb",
      "F#": "Gb",
      "G#": "Ab",
      "A#": "Bb",
    };
    const isEquivalentNote = () => {
      const currentEventNote = currentEvent.noteName;
      const sameOctaves = currentEventNote?.at(-1) === note.at(-1);
      return (
        sharpToFlatMap[note.slice(0, 2) as keyof typeof sharpToFlatMap] ===
          currentEvent.noteName?.slice(0, 2) && sameOctaves
      );
    };

    return isSameIndex && (isSameNote || isEquivalentNote());
  };

  const scaleCopy = [...scale].reverse();
  return (
    <Modal {...modalProps} className="flex justify-center items-center">
      <Paper className="w-auto max-w-[75vw]">
        <Box className="flex justify-end p-2 border-b-2 border-b-slate-500">
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <TableContainer component={Box} className="max-h-[75vh]">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="sticky left-0 bg-secondary-400 text-white">
                  Note
                </TableCell>
                {events.map((event, index) => (
                  <TableCell key={index} align="right" className="bg-secondary-400 text-white">
                    {event.noteName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {scaleCopy.map((note, index) => (
                <TableRow key={index}>
                  <TableCell className="sticky left-0 bg-secondary-400 text-white">
                    {note}
                  </TableCell>
                  {events.map((event, innerIndex) => (
                    <TableCell
                      key={innerIndex}
                      className={
                        isBeingPlayed(note, innerIndex) ? "bg-primary" : ""
                      }
                    ></TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="flex justify-center p-2 border-t-2 border-t-slate-500">
          {controlButton}
        </Box>
      </Paper>
    </Modal>
  );
};

export default MusicModal;
