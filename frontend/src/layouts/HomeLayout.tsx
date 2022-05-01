import { Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import background from "../assets/Home.png";

function HomeLayout() {
  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="w-full h-screen bg-cover bg-no-repeat bg-right -z-50"
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
        <Outlet />
      </main>
    </div>
  );
}

export default HomeLayout;
