import { BrowserRouter, Routes, Route } from "react-router";
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

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
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
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
