import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import background from "../assets/Home.jpg";
import { LogoWithText } from "../assets/logo/Logo";

function HomeLayout() {
  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="w-full h-screen bg-cover bg-no-repeat bg-right -z-50"
    >
      <header className="p-5 h-[70px]">
	  <Box className="h-[100px]">
	      <LogoWithText className="w-auto h-full" />
	  </Box>
      </header>
      <main className="h-[calc(100vh-85px)]">
        <Outlet />
      </main>
    </div>
  );
}

export default HomeLayout;
