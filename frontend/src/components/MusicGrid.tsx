import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import Song from "../utils/types/Song";
import QuaverIcon from "../assets/icons/QuaverIcon";
import SemibreveIcon from "../assets/icons/SemibreveIcon";
import MinimIcon from "../assets/icons/MinimIcon";
import CrotchetIcon from "../assets/icons/CrotchetIcon";
import SemiquaverIcon from "../assets/icons/SemiquaverIcon";
import { IMusicPlayer } from "../services/IMusicPlayer";

type Props = {
  song: Song;
  player: IMusicPlayer;
};

const MusicGrid: React.FC<Props> = (props) => {
  const { player, song } = props;
  const scaleCopy = [...song.scale].reverse();
  const [eventIndex, setEventIndex] = useState(0);

  const currentNoteRef = useRef<HTMLTableCellElement>(null);
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

  useEffect(() => {
    player.setPlayCallback((eventIndex) => {
      setEventIndex(eventIndex);
    });

    player.setStopCallback(() => {
      setEventIndex(0);
    });
  }, []);

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

  type MemoCellProps = TableCellProps & {
    note: string;
    isBeingPlayed: boolean;
  };
  const MemoizedTableCell = React.memo<MemoCellProps>(
    forwardRef((props, ref) => {
      const { note, isBeingPlayed, ...rest } = props;
      return (
        <TableCell
          {...rest}
          ref={ref}
          className={
            isBeingPlayed
              ? "bg-primary text-white text-center leading-[5px]"
              : ""
          }
        >
          {isBeingPlayed ? note : ""}
        </TableCell>
      );
    })
  );

  return (
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
                <MemoizedTableCell
                  key={innerIndex}
                  ref={isBeingPlayed(note, innerIndex) ? currentNoteRef : null}
                  isBeingPlayed={isBeingPlayed(note, innerIndex)}
                  note={note}
                />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MusicGrid;
