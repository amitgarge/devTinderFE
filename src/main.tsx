import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root Element not found!")
}

createRoot(root).render(
  <Provider store={appStore}>
    <App />
  </Provider>,
);
