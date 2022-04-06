import { BrowserRouter, Route, Routes } from "react-router-dom";
import Bar from "./pages/Bar";
import Foo from "./pages/Foo";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Foo />} />
        <Route path="/bar" element={<Bar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
