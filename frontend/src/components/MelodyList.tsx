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
  Typography,
} from "@mui/material";
import { getFile } from "../utils/api";
import {
  downloadBlob,
  setupPlayer,
  getNoteEvents,
  loadBlob,
} from "../utils/helpers";
import Song from "../utils/types/Song";
import { InstrumentName } from "soundfont-player";
import { Player } from "midi-player-js";
import { useEffect, useState } from "react";
import { toast } from "material-react-toastify";
import MusicModal from "./MusicModal";

type Props = {
  songs: Song[];
  instrument: InstrumentName;
};

const MelodyList: React.FC<Props> = (props) => {
  const [
    { player, currentSong, cache, playing, musicModalOpen, eventIndex },
    setState,
  ] = useState<{
    player?: Player;
    currentSong?: Song;
    cache: { [path: string]: Blob };
    playing: boolean;
    musicModalOpen: boolean;
    eventIndex: number;
  }>({ cache: {}, playing: false, musicModalOpen: false, eventIndex: 0 });

  const { songs, instrument } = props;

  const clearCache = () => {
    setState((prevState) => ({ ...prevState, cache: {} }));
  };

  const setPlayer = (player: Player) => {
    setState((prevState) => {
      if (prevState.player) {
        prevState.player.stop();
      }
      return { ...prevState, player };
    });
  };

  useEffect(() => {
    const setup = async () => {
      toast.info("Loading instrument...");
      try {
        const newPlayer = await setupPlayer(
          instrument,
          cache[currentSong?.path ?? ""],
          () => {
            setState((prevState) => {
              return {
                ...prevState,
                eventIndex: prevState.eventIndex + 1,
              };
            });
          }
        );
        newPlayer.on("endOfFile", () => {
          setState((prevState) => ({
            ...prevState,
            playing: false,
            eventIndex: 0,
          }));
        });
        setPlayer(newPlayer);
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
        <Typography>Press "generate" to see some melodies!</Typography>
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
      setState((prev) => ({ ...prev, playing: false }));
      if (song.path === currentSong?.path) {
        return;
      }
    }

    if (song.path === currentSong?.path && player.getFilesize()) {
      player.play();
      setState((prev) => ({ ...prev, playing: true, musicModalOpen: true }));
      return;
    }

    const songBlob = await getSong(song.path);
    if (songBlob) {
      await loadBlob(songBlob, player);
      player.play();
      setState((prevState) => ({
        ...prevState,
        currentSong: song,
        eventIndex: 0,
        playing: true,
        musicModalOpen: true,
      }));
    }
  };

  const handleStop = () => {
    player.stop();
    setState((prev) => ({
      ...prev,
      playing: false,
      eventIndex: 0,
    }));
  };

  const getPlayPauseButton = (song: Song) => {
    return song.path === currentSong?.path && playing ? (
      <Button
        variant="text"
        startIcon={<Pause />}
        onClick={() => handlePlay(song)}
      >
        Pause
      </Button>
    ) : (
      <Button
        variant="text"
        startIcon={<PlayArrow />}
        onClick={() => handlePlay(song)}
      >
        Play
      </Button>
    );
  };

  return (
    <Paper>
      {currentSong && (
        <MusicModal
          open={musicModalOpen}
          eventIndex={eventIndex}
          events={getNoteEvents(player)}
          song={currentSong}
          tempo={120}
          handleClose={() => {
            player.stop();
            setState((prev) => ({
              ...prev,
              playing: false,
              musicModalOpen: false,
              eventIndex: 0,
            }));
          }}
          handleStop={handleStop}
          controlButton={getPlayPauseButton(currentSong)}
        />
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={5}>No.</TableCell>
            <TableCell>Melody</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.songs.map((song, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{song.notes.map((note) => note.name + " ")}</TableCell>
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
