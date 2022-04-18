import { Button, Grid, Typography } from "@mui/material";
import background from "../assets/Home.png";

function Home() {
  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="w-full h-screen bg-cover bg-no-repeat bg-right"
    >
      <header className="p-5">
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
      <main>
        <Grid container>
          <Grid item sm={6}>
            <div>
              <Typography>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic ipsam
                recusandae, omnis distinctio deserunt atque exercitationem amet
                dolorem ipsum reiciendis alias, at numquam. Minus, iste ut dolorem
                eveniet deleniti suscipit?
              </Typography>
              <Button
                variant="contained"
                className="bg-secondary-400 hover:bg-secondary-500"
              >
                Try it now!
              </Button>
            </div>
          </Grid>
        </Grid>
      </main>
    </div>
  );
}

export default Home;
