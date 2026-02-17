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
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            {/* Protected Route */}

            <Route path="/" element={<Body />}>
              <Route index element={<Feed />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
