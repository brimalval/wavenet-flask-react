import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import womanImg from "../assets/Woman.png";

function Home() {
  return (
    <Grid container className="h-full">
      <Grid
        item
        sm={8}
        className="flex flex-col items-start justify-center sm:pl-20 p-10 space-y-10 z-1"
      >
        <Typography>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic ipsam
          recusandae, omnis distinctio deserunt atque exercitationem amet
          dolorem ipsum reiciendis alias, at numquam. Minus, iste ut dolorem
          eveniet deleniti suscipit?
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
