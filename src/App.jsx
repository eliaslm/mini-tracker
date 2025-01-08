import { Route, Routes } from "react-router-dom";

import './App.css'
import IndexPage from "@/pages/index";
import DummyPage from './pages/dummy';

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DummyPage/>} path="/dummy" />
    </Routes>
  );
}

export default App;
