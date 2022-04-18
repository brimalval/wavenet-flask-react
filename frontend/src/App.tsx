import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        {/* <Route path="/" element={<MainLayout />}>
        </Route> */}
        <Route path="*" element={<NotFound />}  />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
