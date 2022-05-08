import { Article, GitHub, MusicNote } from "@mui/icons-material";
import {
  Box,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { LogoWithText } from "../assets/logo/Logo";

const Footer = () => {
  return (
    <footer className="bg-primary text-white p-7 mt-10">
      <Box>
        <Grid container rowSpacing={2}>
          <Grid item xs={12} sm={7}>
            <Grid container rowSpacing={2}>
              <Grid item xs={12}>
                <Box className="h-[50px]">
                  <LogoWithText className="h-full w-auto" />
                </Box>
              </Grid>
              <Grid item xs={12} className="flex flex-col space-y-2">
                <Typography variant="body1">
                  A simple application to serve as an easy way to interact with
                  an implementation of the WaveNet architecture for generating
                  MIDI melodies.
                </Typography>
                <Typography variant="body1">
                  This is in partial fulfillment of "Automatic Generation of Pop
                  Melody Using a Neural Network Architecture based on WaveNet",
                  a thesis of three students from the Technological Institute of
                  the Philippines - Quezon City: Genrev Zapa, Brian Valencia,
                  and Ayin Medina.
                </Typography>
                <Typography variant="body1">
                  The UI design of this application is based on the Random Music
                  Generators application by Dave Cohen (Scraggo).
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={false} sm={1} />
          <Grid item xs={12} sm={4}>
            <Box className="flex flex-col space-y-1">
              <Typography
                fontWeight="bold"
                fontFamily="Poppins, sans-serif"
                variant="h6"
              >
                Links
              </Typography>
              <Box className="flex flex-col -space-y-4">
                <a
                  href="https://github.com/qbmsvalencia/wavenet-flask-react"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ListItem className="hover:text-slate-300 duration-200">
                    <ListItemIcon>
                      <GitHub />
                    </ListItemIcon>
                    <ListItemText primary="Application Repository" />
                  </ListItem>
                </a>
                <a
                  href="https://github.com/zapagenrevdale/PopMelodyGenerationGist"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ListItem className="hover:text-slate-300 duration-200">
                    <ListItemIcon>
                      <GitHub />
                    </ListItemIcon>
                    <ListItemText primary="WaveNet Implementation Repository" />
                  </ListItem>
                </a>
                <a href="#" rel="noreferrer">
                  <ListItem className="hover:text-slate-300 duration-200">
                    <ListItemIcon>
                      <Article />
                    </ListItemIcon>
                    <ListItemText primary="Pop Melody Generation Paper" />
                  </ListItem>
                </a>
                <a
                  href="https://random-music-generators.herokuapp.com/melody"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ListItem className="hover:text-slate-300 duration-200">
                    <ListItemIcon>
                      <MusicNote />
                    </ListItemIcon>
                    <ListItemText primary="Random Music Generator (by Scraggo)" />
                  </ListItem>
                </a>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </footer>
  );
};

export default Footer;
