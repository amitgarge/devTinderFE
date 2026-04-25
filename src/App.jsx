import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Body from "./components/Body";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthLoader from "./components/AuthLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import { setNavigator } from "./utils/navigateHelper";
import "./App.css";
import Chat from "./components/Chat";

function NavigatorSetter() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <NavigatorSetter />

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <ErrorBoundary>
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />

          {/* PROTECTED */}
          <Route
            path="/"
            element={
              <AuthLoader>
                <ProtectedRoute>
                  <Body />
                </ProtectedRoute>
              </AuthLoader>
            }
          >
            <Route index element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="requests" element={<Requests />} />
            <Route path="chat/:targetUserId" element={<Chat />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Login />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
