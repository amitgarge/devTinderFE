import { BrowserRouter, Routes, Route } from "react-router";
import Body from "./components/Body";
import Profile from "./components/Profile";
import Login from "./components/Login";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
