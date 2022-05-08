import { Close } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Modal,
  ModalProps,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { createTheme, useTheme } from "@mui/material/styles";
import Song from "../utils/types/Song";
import MusicModalControls from "./MusicModalControls";
import { IMusicPlayer } from "../services/IMusicPlayer";
import MusicGrid from "./MusicGrid";

type Props = Omit<ModalProps, "children"> & {
  song: Song;
  player: IMusicPlayer;
  handleClose: () => void;
};

const MusicModal: React.FC<Props> = (props) => {
  const { song, player, handleClose, ...modalProps } = props;

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
          <MusicGrid player={player} song={song} />
          <MusicModalControls player={player} />
        </Paper>
      </Modal>
    </ThemeProvider>
  );
};

export default MusicModal;
