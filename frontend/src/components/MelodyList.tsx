import { Download, PlayArrow } from "@mui/icons-material";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getFile } from "../utils/api";
import { downloadBlob, playBlob, setupPlayer } from "../utils/helpers";
import Song from "../utils/types/Song";
import { InstrumentName } from "soundfont-player";
import { Player } from "midi-player-js";
import { useEffect, useState } from "react";
import { toast } from "material-react-toastify";

type Props = {
  songs: Song[];
  instrument: InstrumentName;
  tempo: number;
};

const MelodyList: React.FC<Props> = (props) => {
  const [{ player, songPath, cache }, setState] = useState<{
    player?: Player;
    songPath?: string;
    cache: { [path: string]: Blob };
  }>({ cache: {} });

  const setPlayer = (player: Player) => {
    setState((prevState) => {
      if (prevState.player) {
        prevState.player.stop();
      }
      return { ...prevState, player };
    });
  };

  const clearCache = () => {
    setState((prevState) => ({ ...prevState, cache: {} }));
  };

  const { songs, instrument, tempo } = props;

  const playSong = async (song: Blob) => {
    const currentPlayer =
      player ?? (await setupPlayer(instrument || "acoustic_grand_piano"));
    if (!player) {
      await playBlob(song, currentPlayer);
      setPlayer(currentPlayer);
      return;
    }
    await playBlob(song, currentPlayer);
  };

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
  const handlePlay = async (path: string) => {
    if (player?.isPlaying()) {
      player.pause();
      if (path === songPath) {
        return;
      }
    }

    const songBlob = await getSong(path);
    if (songBlob) {
      await playSong(songBlob);
      setState((prevState) => ({ ...prevState, songPath: path }));
    }
  };

  useEffect(() => {
    const setup = async () => {
      toast.info("Loading instrument...");
      try {
        const newPlayer = await setupPlayer(instrument);
        setPlayer(newPlayer);
      } catch (e) {
        toast.error("Error loading instrument. Please try again!");
        return;
      }
      toast.success("Instrument loaded!");
    };
    setup();
  }, [instrument]);

  useEffect(() => {
    clearCache();
  }, [songs]);

  useEffect(() => {
    var mounted = true;
    if (mounted) {
      if (player) {
        (player as any).setTempo(tempo);
      }
    }
    return () => {
      mounted = false;
    };
  }, [player, tempo]);

  if (songs.length === 0) {
    return (
      <Paper className="flex justify-center items-center p-5">
        <Typography>Press "generate" to see some melodies!</Typography>
      </Paper>
    );
  }

  return (
    <Paper>
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
              <TableCell>{song.notes.join(" ")}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button
                    variant="text"
                    startIcon={<PlayArrow />}
                    onClick={() => handlePlay(song.path)}
                  >
                    Play
                  </Button>
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
