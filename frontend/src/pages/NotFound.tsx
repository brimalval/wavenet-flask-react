import { Button, Grid, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import peopleImg from "../assets/People.png";

function NotFound() {
  const theme = useTheme();
  return (
    <div className="flex flex-col w-full h-full items-center justify-center -space-y-8">
      <div className="flex flex-col items-center space-y-5">
        <Grid item>
          <Typography
            className="text-secondary-100"
            variant="h4"
            fontWeight="800"
            fontFamily="Poppins, sans-serif"
          >
            Sorry, page not found!
          </Typography>
        </Grid>
        <Grid item>
          <Link to="/">
            <Button
              variant="contained"
              style={{
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              Back to Homepage
            </Button>
          </Link>
        </Grid>
      </div>
      <div
        style={{
          backgroundImage: `url(${peopleImg})`,
        }}
        className="h-2/3 w-2/3 bg-contain bg-no-repeat bg-center"
      />
    </div>
  );
}

export default NotFound;
