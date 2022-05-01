import { createTheme, ThemeProvider } from "@mui/material";
import createPalette from "@mui/material/styles/createPalette";
import createTypography from "@mui/material/styles/createTypography";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  const theme = createTheme({
    palette: createPalette({
      primary: {
        main: "#577B7C",
      },
      secondary: {
        main: "#345556",
      },
    }),
    typography: createTypography(createPalette({}), {
      fontFamily: "Open Sans, sans-serif",
    }),
  });
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="*" element={<HomeLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
