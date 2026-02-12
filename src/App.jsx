import { BrowserRouter, Routes, Route } from "react-router";
import Body from "./components/Body";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Feed from "./components/Feed";
import "./App.css";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import AuthLoader from "./components/AuthLoader";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Route */}

            <Route path="/" element={<Body />}>
              <Route index element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
