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
import { Player } from "midi-player-js";
import { useEffect, useRef } from "react";
import { getNoteEvents } from "../utils/helpers";
import QuaverIcon from "../assets/icons/QuaverIcon";
import SemibreveIcon from "../assets/icons/SemibreveIcon";
import MinimIcon from "../assets/icons/MinimIcon";
import CrotchetIcon from "../assets/icons/CrotchetIcon";
import SemiquaverIcon from "../assets/icons/SemiquaverIcon";
import Song from "../utils/types/Song";
import MusicModalControls from "./MusicModalControls";

type Props = Omit<ModalProps, "children"> & {
  song: Song;
  player: Player;
  showTempoSlider: boolean;
  eventIndex: number;
  handleClose: () => void;
  controlButtonGetter: (extraAction?: () => any) => JSX.Element;
  handleStop: () => void;
};

const MusicModal: React.FC<Props> = (props) => {
  const {
    song,
    player,
    eventIndex,
    controlButtonGetter,
    showTempoSlider,
    handleClose,
    handleStop,
    ...modalProps
  } = props;

  const currentNoteRef = useRef<HTMLTableCellElement>(null);
  // Using the ref, scroll to the current note
  useEffect(() => {
    if (currentNoteRef.current) {
      currentNoteRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
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

  if (!(player && player.getFilesize())) {
    console.log("Playas");
    return (
      <Modal {...modalProps} className="flex justify-center items-center">
        <CircularProgress />
      </Modal>
    );
  }
  const events = getNoteEvents(player);
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

  const durationCharacterMap = {
    4: <SemibreveIcon />,
    2: <MinimIcon />,
    1: <CrotchetIcon />,
    0.5: <QuaverIcon />,
    0.25: <SemiquaverIcon />,
  };

  const scaleCopy = [...song.scale].reverse();
  return (
    <ThemeProvider theme={theme}>
      <Modal {...modalProps} className="flex justify-center items-center">
        <Paper className="sm:w-auto sm:max-w-[80vw] sm:h-auto xs:w-full xs:max-w-[100vw] xs:h-screen justify-between flex flex-col">
          <Box className="flex justify-end p-2 border-b-2 border-b-slate-500">
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
                        {durationCharacterMap[note.duration]}
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
          <MusicModalControls
            player={player}
            controlButtonGetter={controlButtonGetter}
            showTempoSlider={showTempoSlider}
            handleStop={handleStop}
          />
        </Paper>
      </Modal>
    </ThemeProvider>
  );
};

export default MusicModal;
