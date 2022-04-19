import { createTheme, ThemeProvider } from "@mui/material";
import createPalette from "@mui/material/styles/createPalette";
import createTypography from "@mui/material/styles/createTypography";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  const theme = createTheme({
    typography: createTypography(createPalette({}), {
      fontFamily: "Open Sans, sans-serif",
    })
  })
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
