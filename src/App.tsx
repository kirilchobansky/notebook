import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/home/Home";
import Noun from "./pages/noun/Noun";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add/noun" element={<Noun />} />
      </Routes >
    </Router >
  );
}

export default App;
