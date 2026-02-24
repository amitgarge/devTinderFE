import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router";
import ProtectedRoute from "../components/ProtectedRoute";
import userReducer from "../utils/slices/userSlice";

function renderWithStore(userState) {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: userState },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/auth/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe("ProtectedRoute", () => {
  test("redirects to login if user is not authenticated", () => {
    renderWithStore(null);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("renders children if user is authenticated", () => {
    renderWithStore({ _id: "123", firstName: "Amit" });

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
