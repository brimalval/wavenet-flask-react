import { Typography } from "@mui/material";
import { ToastContainer } from "material-react-toastify";
import { Link, Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <header className="bg-primary p-4 h-[65px]">
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
          <Typography
            variant="h6"
            fontWeight="bold"
            fontFamily="Poppins, sans-serif"
            className="uppercase border-b-2 border-slate-400 inline-block"
            color="white"
          >
            Pop Melody Generator
          </Typography>
        </Link>
      </header>
      <main className="min-h-[calc(100vh-65px)] h-full bg-gray-200">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
