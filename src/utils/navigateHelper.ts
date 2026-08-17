import type { NavigateFunction } from "react-router-dom";

let navigateFunction: NavigateFunction | null = null;

export const setNavigator = (nav: NavigateFunction) => {
  navigateFunction = nav;
};

export const navigateTo = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path);
  }
};