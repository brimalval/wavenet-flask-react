import { Close } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
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
import { useEffect, useRef, useState } from "react";
import QuaverIcon from "../assets/icons/QuaverIcon";
import SemibreveIcon from "../assets/icons/SemibreveIcon";
import MinimIcon from "../assets/icons/MinimIcon";
import CrotchetIcon from "../assets/icons/CrotchetIcon";
import SemiquaverIcon from "../assets/icons/SemiquaverIcon";
import Song from "../utils/types/Song";
import MusicModalControls from "./MusicModalControls";
import { IMusicPlayer } from "../services/IMusicPlayer";

type Props = Omit<ModalProps, "children"> & {
  song: Song;
  player: IMusicPlayer;
  handleClose: () => void;
};

const MusicModal: React.FC<Props> = (props) => {
  const { song, player, handleClose, ...modalProps } = props;

  const [eventIndex, setEventIndex] = useState(0);
  const currentNoteRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    player.setPlayCallback((eventIndex) => {
      setEventIndex(eventIndex);
    });

    player.setStopCallback(() => {
      setEventIndex(0);
    });
  }, []);

  // Using the ref, scroll to the current note
  useEffect(() => {
    if (currentNoteRef.current) {
      currentNoteRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center",
      });
    }
  }, [currentNoteRef, eventIndex]);

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

  if (!(player && player.getSong())) {
    return (
      <Modal {...modalProps} className="flex justify-center items-center">
        <CircularProgress />
      </Modal>
    );
  }
  const events = player.getNotes();
  const isBeingPlayed = (note: string, index: number) => {
    if (eventIndex < 1) {
      return false;
    }
    const isSameIndex = eventIndex - 1 === index;
    const currentEvent = events[eventIndex - 1];
    const isSameNote = currentEvent.note === note;
    // Check for equivalence of note in terms of sharp/flat
    const sharpToFlatMap = {
      "C#": "Db",
      "D#": "Eb",
      "F#": "Gb",
      "G#": "Ab",
      "A#": "Bb",
    };
    const isEquivalentNote = () => {
      const currentEventNote = currentEvent.note;
      const sameOctaves = currentEventNote?.at(-1) === note.at(-1);
      return (
        sharpToFlatMap[note.slice(0, 2) as keyof typeof sharpToFlatMap] ===
          currentEvent.note.slice(0, 2) && sameOctaves
      );
    };

    return isSameIndex && (isSameNote || isEquivalentNote());
  };

  const durationMap = {
    4: {
      name: "Whole note",
      icon: <SemibreveIcon />,
    },
    2: {
      name: "Half note",
      icon: <MinimIcon />,
    },
    1: {
      name: "Quarter note",
      icon: <CrotchetIcon />,
    },
    0.5: {
      name: "Eighth note",
      icon: <QuaverIcon />,
    },
    0.25: {
      name: "Sixteenth note",
      icon: <SemiquaverIcon />,
    },
  };

  const scaleCopy = [...song.scale].reverse();
  return (
    <ThemeProvider theme={theme}>
      <Modal {...modalProps} className="flex justify-center items-center">
        <Paper className="sm:w-auto sm:max-w-[80vw] sm:h-auto xs:w-full xs:max-w-[100vw] xs:h-screen justify-between flex flex-col">
          <Box className="flex justify-between p-2 border-b-2 border-b-slate-500">
            <Typography variant="h6">{song.title}</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <TableContainer component={Box} className="max-h-[65vh]">
            <Table className="table-fixed" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    className="bg-secondary-400 text-white"
                    align="center"
                    ref={eventIndex === 0 ? currentNoteRef : null}
                  >
                    Scale
                  </TableCell>
                  {song.notes.map((note, index) => (
                    <TableCell
                      key={index}
                      align="center"
                      className="bg-secondary-400 text-white"
                    >
                      <Typography fontSize={12} variant="subtitle2">
                        {note.name}
                        {durationMap[note.duration].icon}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {scaleCopy.map((note, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className="sticky left-0 text-white bg-secondary-400"
                      align="center"
                    >
                      <Typography
                        fontSize={12}
                        variant="subtitle2"
                        className="leading-[5px]"
                      >
                        {note}
                      </Typography>
                    </TableCell>
                    {events.map((event, innerIndex) => (
                      <TableCell
                        key={innerIndex}
                        ref={
                          isBeingPlayed(note, innerIndex)
                            ? currentNoteRef
                            : null
                        }
                        className={
                          isBeingPlayed(note, innerIndex)
                            ? "bg-primary text-white text-center leading-[5px]"
                            : ""
                        }
                      >
                        {isBeingPlayed(note, innerIndex) ? note : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <MusicModalControls player={player} />
        </Paper>
      </Modal>
    </ThemeProvider>
  );
};

export default MusicModal;
