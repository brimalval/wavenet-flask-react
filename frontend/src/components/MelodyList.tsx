import { Download, PlayArrow, Pause } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { getFile } from "../utils/api";
import { downloadBlob, setupPlayer, loadBlob } from "../utils/helpers";
import Song from "../utils/types/Song";
import { InstrumentName } from "soundfont-player";
import React, { useEffect, useState } from "react";
import { toast } from "material-react-toastify";
import MusicModal from "./MusicModal";
import { useInjection } from "inversify-react";
import SemibreveIcon from "../assets/icons/SemibreveIcon";
import MinimIcon from "../assets/icons/MinimIcon";
import CrotchetIcon from "../assets/icons/CrotchetIcon";
import QuaverIcon from "../assets/icons/QuaverIcon";
import SemiquaverIcon from "../assets/icons/SemiquaverIcon";
import { IMusicPlayer } from "../services/IMusicPlayer";
import { TYPES } from "../inversify.config";

type Props = {
  songs: Song[];
  instrument: InstrumentName;
};

const MelodyList: React.FC<Props> = (props) => {
  const [
    { currentSong, cache, playing, paused, musicModalOpen, eventIndex },
    setState,
  ] = useState<{
    currentSong?: Song;
    cache: { [path: string]: Blob };
    playing: boolean;
    paused: boolean;
    musicModalOpen: boolean;
    eventIndex: number;
  }>({
    cache: {},
    playing: false,
    paused: false,
    musicModalOpen: false,
    eventIndex: 0,
  });

  const player: IMusicPlayer = useInjection(TYPES.IMusicPlayer);

  const { songs, instrument } = props;

  const clearCache = () => {
    setState((prevState) => ({ ...prevState, cache: {} }));
  };

  useEffect(() => {
    var mounted = true;
    if (mounted) {
      player.on("endOfFile", () => {
        setState((prevState) => ({
          ...prevState,
          playing: false,
          paused: false,
          eventIndex: 0,
        }));
      });

      player.setPlayCallback(() => {
        setState((prevState) => {
          return {
            ...prevState,
            eventIndex: prevState.eventIndex + 1,
          };
        });
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const setup = async () => {
      if (currentSong) {
        const blob = cache[currentSong.path];
        await player.loadSong(blob);
      }
    };
    setup();
  }, [currentSong]);

  useEffect(() => {
    const setup = async () => {
      toast.info("Loading instrument...");
      try {
        player.setInstrument(instrument);
      } catch (e) {
        toast.error("Error loading instrument. Please try again!");
        return;
      }
      setState((prev) => ({ ...prev, playing: false }));
      toast.success("Instrument loaded!");
    };
    setup();
  }, [instrument]);

  useEffect(() => {
    clearCache();
  }, [songs]);

  if (!player) {
    return (
      <Paper className="flex justify-center items-center p-5">
        <CircularProgress />
      </Paper>
    );
  }

  if (songs.length === 0) {
    return (
      <Paper className="flex justify-center items-center p-5">
        <Typography>Press "generate" for some melodies!</Typography>
      </Paper>
    );
  }

  const getSong = async (path: string) => {
    var songBlob: Blob;
    if (path in cache) {
      songBlob = cache[path];
    } else {
      toast.info("Loading song...");
      const response = await getFile(path);
      if (response.status !== 200) {
        toast.error("Error loading song. Please try again!");
        return;
      }
      songBlob = response.data;
      cache[path] = songBlob;
    }
    return songBlob;
  };

  const handleDownload = async (path: string) => {
    const response = await getFile(path);
    downloadBlob(response.data);
  };

  const handlePlay = async (song: Song) => {
    if (player.isPlaying()) {
      player.pause();
      setState((prev) => ({ ...prev, playing: false, paused: true }));
      if (song.path === currentSong?.path) {
        return;
      }
    }

    if (song.path === currentSong?.path && player.getSong()) {
      try {
        player.play();
      } catch (e) {
        toast.error("Error playing song. Please try again!");
      }
      setState((prev) => ({
        ...prev,
        playing: true,
        paused: false,
        musicModalOpen: true,
      }));
      return;
    }

    const songBlob = await getSong(song.path);
    if (songBlob) {
      await player.loadSong(songBlob);
      try {
        player.play();
      } catch (e) {
        toast.error("Error playing song. Please try again!");
        return;
      }
      setState((prevState) => ({
        ...prevState,
        currentSong: song,
        eventIndex: 0,
        playing: true,
        paused: false,
        musicModalOpen: true,
      }));
    }
  };

  const handleStop = () => {
    player.stop();
    setState((prev) => ({
      ...prev,
      playing: false,
      paused: false,
      eventIndex: 0,
    }));
  };

  const getPlayPauseButton = (song: Song, extraAction?: () => any) => {
    const handleClick = async () => {
      handlePlay(song);
      if (extraAction) {
        await extraAction();
      }
    };
    return song.path === currentSong?.path && playing ? (
      <Button variant="text" startIcon={<Pause />} onClick={handleClick}>
        Pause
      </Button>
    ) : (
      <Button variant="text" startIcon={<PlayArrow />} onClick={handleClick}>
        Play
      </Button>
    );
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
  return (
    <Paper>
      {currentSong && (
        <MusicModal
          open={musicModalOpen}
          eventIndex={eventIndex}
          song={currentSong}
          showTempoSlider={paused}
          player={player}
          handleClose={() => {
            player.stop();
            setState((prev) => ({
              ...prev,
              playing: false,
              paused: false,
              musicModalOpen: false,
              eventIndex: 0,
            }));
          }}
          handleStop={handleStop}
          controlButtonGetter={(extraAction) =>
            getPlayPauseButton(currentSong, extraAction)
          }
        />
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={5}>No.</TableCell>
            <TableCell>Melody</TableCell>
            <TableCell width={10}>Duration</TableCell>
            <TableCell width={15}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.songs.map((song, index) => (
            <TableRow
              key={index}
              className={
                song.path === currentSong?.path && musicModalOpen
                  ? "bg-green-300"
                  : ""
              }
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {song.notes.map((note, index) => (
                  <Tooltip
                    key={`note${index}_${index}`}
                    title={
                      <>
                        {durationMap[note.duration].name}
                        {durationMap[note.duration].icon}
                      </>
                    }
                    placement="top"
                  >
                    <Typography variant="body2" className="inline-block mr-1">
                      {note.name}
                    </Typography>
                  </Tooltip>
                ))}
              </TableCell>
              <TableCell>
                <Tooltip title="Assuming 120 BPM and x/4 time signature">
                  <Typography variant="body2">
                    {song.duration.toFixed(2)} seconds
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  {getPlayPauseButton(song)}
                  <Button
                    variant="text"
                    startIcon={<Download />}
                    onClick={() => handleDownload(song.path)}
                  >
                    Download
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default MelodyList;
