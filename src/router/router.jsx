import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/HoomPage/Home/Home";
import AllTrainers from "../Pages/AllTrainers/AllTrainers";
import AllClasses from "../Pages/AllClasses/AllClasses";
import Community from "../Pages/Community/Community";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import SignUp from "../Pages/Authentication/SignUp/SignUp";
import ForbiddenPage from "../Pages/ForbiddenPage/ForbiddebPage";
import TrainerDetails from "../Pages/TrainersDetails/TrainersDetails";
import TrainerBooking from "../Pages/TrainerBooking/TrainerBooking";
import PrivateRoute from "../Routes/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AddClass from "../Pages/DashbordPages/AddClass/AddClass";
import AllSubscribers from "../Pages/DashbordPages/AllSubscriber/AllSubscribers";
import Trainers from "../Pages/DashbordPages/AllTraniers/Trainers";

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
        path: "trainer/:id",
        Component: TrainerDetails,
      },

      {
        path: "trainer-booking/:id",
        Component: TrainerBooking,
      },
      {
        path: "forbidden",
        Component: ForbiddenPage,
      },
    ],
  },

  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "signUp",
        Component: SignUp,
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),

    children: [
      {
        path: "add-class",
        element: <AddClass></AddClass>,
      },
      {
        path: "all-subscribers",
        element: <AllSubscribers></AllSubscribers>,
      },
      {
        path: "trainers",
        element: <Trainers></Trainers>,
      },
    ],
  },
]);
