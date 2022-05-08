import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import womanImg from "../assets/Woman-min.png";

function Home() {
  return (
    <Grid container className="h-full">
      <Grid
        item
        sm={8}
        className="flex flex-col items-start justify-center sm:pl-20 p-10 space-y-10 z-1"
      >
        <Typography variant="body1">
          A simple application to serve as an easy way to interact with an
          implementation of the WaveNet architecture for generating MIDI
          melodies.
        </Typography>
        <Typography variant="body1">
          This is in partial fulfillment of "Automatic Generation of Pop Melody
          Using a Neural Network Architecture based on WaveNet", a thesis of
          three students from the Technological Institute of the Philippines -
          Quezon City: Genrev Zapa, Brian Valencia, and Ayin Medina.
        </Typography>
        <Link to="/dashboard">
          <Button
            type="button"
            variant="contained"
            className="bg-secondary-400 hover:bg-secondary-500"
          >
            Try it now!
          </Button>
        </Link>
      </Grid>
      <div
        style={{
          backgroundImage: `url(${womanImg})`,
        }}
        className="absolute w-2/3 h-2/3 max-h-xl max-w-xl right-0 bottom-0 bg-contain bg-no-repeat bg-right-bottom"
      ></div>
    </Grid>
  );
}

export default Home;
