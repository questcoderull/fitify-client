import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/HoomPage/Home/Home";
import AllTrainers from "../Pages/AllTrainers/AllTrainers";
import AllClasses from "../Pages/AllClasses/AllClasses";
import Community from "../Pages/Community/Community";
import LogIn from "../Pages/LogIn/LogIn";
import SignUp from "../Pages/SignUp/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "all-trainers",
        Component: AllTrainers,
      },
      {
        path: "all-classes",
        Component: AllClasses,
      },
      {
        path: "community",
        Component: Community,
      },
      {
        path: "logIn",
        Component: LogIn,
      },
      {
        path: "signUp",
        Component: SignUp,
      },
    ],
  },
]);
