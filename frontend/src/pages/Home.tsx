import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import background from "../assets/Home.png";

function Home() {
  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="w-full h-screen bg-cover bg-no-repeat bg-right"
    >
      <header className="p-5 h-[85px]">
        <Typography
          variant="h4"
          fontWeight="bold"
          fontFamily="Poppins, sans-serif"
          className="uppercase border-b-2 border-slate-400 inline-block bg-primary"
          color="white"
        >
          Pop Melody Generator
        </Typography>
      </header>
      <main className="h-[calc(100vh-85px)]">
        <Grid container className="h-full">
          <Grid
            item
            sm={8}
            className="flex flex-col items-start justify-center sm:pl-20 p-10 space-y-10"
          >
            <Typography>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic
              ipsam recusandae, omnis distinctio deserunt atque exercitationem
              amet dolorem ipsum reiciendis alias, at numquam. Minus, iste ut
              dolorem eveniet deleniti suscipit?
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
        </Grid>
      </main>
    </div>
  );
}

export default Home;
