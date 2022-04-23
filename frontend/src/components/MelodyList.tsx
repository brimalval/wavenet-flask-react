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
  instrument?: InstrumentName;
};

const MelodyList: React.FC<Props> = (props) => {
  const [player, setPlayer] = useState<Player | undefined>();
  const handleDownload = async (path: string) => {
    const response = await getFile(path);
    downloadBlob(response.data);
  };
  const handlePlay = async (path: string) => {
    if (player?.isPlaying()) {
      console.log("Player is playing");
      player.pause();
      return;
    }
    const response = await getFile(path);
    if (response.status !== 200) {
      console.error("Please try again");
      return;
    }
    await playBlob(response.data, props.instrument || "acoustic_grand_piano", player);
  };
  useEffect(() => {
    const setup = async () => {
      if (props.instrument){
        const newPlayer = await setupPlayer(props.instrument);
        setPlayer(newPlayer);
      }
    };
    setup();
  }, [props.instrument]);
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
