import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Feed from "./components/Feed";
import "./App.css";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import ProtectedRoute from "./components/ProtectedRoute";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import AuthLoader from "./components/AuthLoader";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import { setNavigator } from "./utils/navigateHelper";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function App() {
  const NavigatorSetter = () => {
    const navigate = useNavigate();
    useEffect(() => {
      setNavigator(navigate);
    }, [navigate]);
    return null;
  };
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <NavigatorSetter />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Protected Routes FIRST */}
          <Route
            path="/"
            element={
              <AuthLoader>
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Body />
                  </ErrorBoundary>
                </ProtectedRoute>
              </AuthLoader>
            }
          >
            <Route index element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="requests" element={<Requests />} />
          </Route>

          {/* Public Route AFTER */}
          <Route path="/login" element={<Login />} />

          {/* Optional fallback */}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
export default App;
