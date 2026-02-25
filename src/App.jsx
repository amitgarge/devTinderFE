import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import Body from "./components/Body";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import ErrorBoundary from "./components/ErrorBoundary";

import appStore from "./utils/appStore";
import { setNavigator } from "./utils/navigateHelper";
import "./App.css";

function NavigatorSetter() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <NavigatorSetter />

        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <ErrorBoundary>
          <Routes>

            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />

            {/* PROTECTED LAYOUT */}
            <Route path="/" element={<Body />}>
              <Route index element={<Feed />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<Login />} />

          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
}

export default App;