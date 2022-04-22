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
import { downloadBlob, playBlob } from "../utils/helpers";
import Song from "../utils/types/Song";
import Soundfont from "soundfont-player";

type Props = {
  songs: Song[];
  instrument?: Soundfont.InstrumentName;
};

const MelodyList: React.FC<Props> = (props) => {
  const handleDownload = async (path: string) => {
    const response = await getFile(path);
    downloadBlob(response.data);
  };
  const handlePlay = async (path: string) => {
    const response = await getFile(path);
    await playBlob(response.data, props.instrument || "acoustic_grand_piano");
  };
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
