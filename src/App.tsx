import "./App.css";

import { Route, Routes } from "react-router-dom";

import { About } from "./About";
import { Home } from "./Home";
import { NotFound } from "./NotFound";

export function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
