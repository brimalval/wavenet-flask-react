import { Close, Stop } from "@mui/icons-material";
import {
  Box,
  Button,
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
  ThemeProvider,
  Typography,
} from "@mui/material";
import { createTheme, useTheme } from "@mui/material/styles";
import { Event } from "midi-player-js";
import { useEffect, useRef } from "react";
import Song from "../utils/types/Song";

type Props = Omit<ModalProps, "children"> & {
  events: Event[];
  song: Song;
  tempo: number;
  eventIndex: number;
  handleClose: () => void;
  controlButton: React.ReactElement;
  handleStop: () => void;
};

const MusicModal: React.FC<Props> = (props) => {
  const {
    events,
    song,
    tempo,
    eventIndex,
    controlButton,
    handleClose,
    handleStop,
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

  const currentNoteRef = useRef<HTMLTableCellElement>(null);
  // Using the ref, scroll to the current note
  useEffect(() => {
    if (currentNoteRef.current) {
      currentNoteRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [currentNoteRef, eventIndex]);

  const scaleCopy = [...song.scale].reverse();
  const mainTheme = useTheme();
  // Create MUI theme
  const getTheme = () =>
    createTheme({
      components: {
        MuiTableCell: {
          styleOverrides: {
            root: {
              width: "60px",
            },
            head: {
              borderRight: `1px solid ${mainTheme.palette.primary.main}`,
              "&:last-child": {
                borderRight: "none",
              },
            },
            body: {
              // Apply a right border except for the last child
              borderRight: "1px solid #ccc",
              "&:last-child": {
                borderRight: "none",
              },
            },
          },
        },
      },
    });
  const theme = getTheme();
  return (
    <ThemeProvider theme={theme}>
      <Modal {...modalProps} className="flex justify-center items-center">
        <Paper className="w-auto max-w-[80vw]">
          <Box className="flex justify-end p-2 border-b-2 border-b-slate-500">
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <TableContainer component={Box} className="max-h-[80vh]">
            <Table className="table-fixed">
              <TableHead>
                <TableRow>
                  {events.map((event, index) => (
                    <TableCell
                      key={index}
                      align="center"
                      className="bg-secondary-400 text-white"
                      width={5}
                      ref={index === eventIndex ? currentNoteRef : null}
                    >
                      <Typography fontSize={12} variant="subtitle2">
                        {event.noteName}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {scaleCopy.map((note, index) => (
                  <TableRow key={index}>
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
            <Button onClick={handleStop} startIcon={<Stop />}>
              Stop
            </Button>
          </Box>
        </Paper>
      </Modal>
    </ThemeProvider>
  );
};

export default MusicModal;
