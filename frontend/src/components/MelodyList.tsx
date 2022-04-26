import { Download, PlayArrow } from "@mui/icons-material";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { getFile } from "../utils/api";
import { downloadBlob, playBlob, setupPlayer } from "../utils/helpers";
import Song from "../utils/types/Song";
import { InstrumentName } from "soundfont-player";
import { Player } from "midi-player-js";
import { useEffect, useState } from "react";

type Props = {
  songs: Song[];
  instrument: InstrumentName;
};

const MelodyList: React.FC<Props> = (props) => {
  const [{ player, songPath, cache }, setState] = useState<{
    player?: Player;
    songPath?: string;
    cache: { [path: string]: Blob };
  }>({ cache: {} });

  const setPlayer = (player: Player) => {
    setState((prevState) => ({ ...prevState, player }));
  };

  const clearCache = () => {
    setState((prevState) => ({ ...prevState, cache: {} }));
  };

  const { songs, instrument } = props;

  const playSong = async (song: Blob) => {
    const currentPlayer = player ?? await setupPlayer(instrument || "acoustic_grand_piano");
    console.log("Checking if player exists");
    if (!player) {
      await playBlob(song, currentPlayer);
      setPlayer(currentPlayer);
      return;
    }
    await playBlob(song, currentPlayer);
  };

  const getSong = async (path: string) => {
    var songBlob: Blob;
    console.log("Cache", cache);
    if (path in cache) {
      songBlob = cache[path];
    } else {
      const response = await getFile(path);
      if (response.status !== 200) {
        //TODO: Replace with error notification
        console.error("Please try again");
        return;
      }
      songBlob = response.data;
      cache[path] = songBlob;
    }
    return songBlob;
  }

  const handleDownload = async (path: string) => {
    const response = await getFile(path);
    downloadBlob(response.data);
  };
  const handlePlay = async (path: string) => {
    if (player?.isPlaying()) {
      console.log("Player is playing");
      player.pause();
      if (path === songPath) {
        return;
      }
    }

    console.log(`Getting song at path: ${path}...`);
    const songBlob = await getSong(path);

    if (songBlob) {
      console.log("Playing blob")
      await playSong(songBlob);
      setState((prevState) => ({ ...prevState, songPath: path }));
    }
  };

  useEffect(() => {
    const setup = async () => {
      console.log("Player initializing...");
      const newPlayer = await setupPlayer(props.instrument);
      setPlayer(newPlayer);
      console.log("Player initialized!");
    };
    setup();
  }, [props.instrument]);

  useEffect(() => {
    clearCache();
  }, [songs]);

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
