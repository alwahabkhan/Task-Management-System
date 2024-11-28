import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/Components/HomePage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
  </BrowserRouter>
  );
}

export default App;
