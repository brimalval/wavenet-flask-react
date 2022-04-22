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
import Song from "../utils/types/Song";

type Props = {
  songs: Song[];
};

const MelodyList: React.FC<Props> = (props) => {
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
                  <Button variant="text" startIcon={<PlayArrow />}>
                    Play
                  </Button>
                  <Button variant="text" startIcon={<Download />} >
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
