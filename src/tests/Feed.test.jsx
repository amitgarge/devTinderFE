import { vi } from "vitest";

// 🔥 Mock axios BEFORE imports
vi.mock("../services/axiosInstance", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          data: [
            {
              _id: "1",
              firstName: "John",
              lastName: "Doe",
              age: 25,
              gender: "male",
              photoURL: "https://dummyimage.com/200x200",
              about: "Test user",
              skills: ["React"],
            },
          ],
        },
      }),
    ),
    post: vi.fn(() => Promise.resolve({})),
  },
}));

import {
  render,
  screen,
  fireEvent,  
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "../utils/slices/feedSlice";
import userReducer from "../utils/slices/userSlice";
import Feed from "../components/Feed";
import { MemoryRouter } from "react-router";

function renderFeed() {
  const store = configureStore({
    reducer: {
      feed: feedReducer,
      user: userReducer,
    },
    preloadedState: {
      user: { _id: "123", firstName: "Amit" },
      feed: [],
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Feed />
      </MemoryRouter>
    </Provider>,
  );
}

describe("Feed component", () => {
  test("renders user from feed and removes on Interested click", async () => {
    renderFeed();

    // Wait for user to appear (robust matcher)
    const userName = await screen.findByText(
      (content, element) => element?.textContent === "John Doe",
    );

    expect(userName).toBeInTheDocument();

    const interestedButton = screen.getByRole("button", {
      name: /interested/i,
    });

    fireEvent.click(interestedButton);

    // Wait for removal properly (prevents act warning)
    await waitForElementToBeRemoved(() =>
      screen.queryByText(
        (content, element) => element?.textContent === "John Doe",
      ),
    );
  });
});
