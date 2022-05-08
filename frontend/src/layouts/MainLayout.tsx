import { Box } from "@mui/material";
import { ToastContainer } from "material-react-toastify";
import { Link, Outlet } from "react-router-dom";
import { LogoWithText } from "../assets/logo/Logo";

function MainLayout() {
  return (
    <>
      <header className="bg-primary p-4 h-[65px] flex items-center">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Link to="/">
          <Box className="h-[65px]">
            <LogoWithText className="h-full w-auto" />
          </Box>
        </Link>
      </header>
      <main className="min-h-[calc(100vh-65px)] h-full flex flex-col justify-between bg-gray-200">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
