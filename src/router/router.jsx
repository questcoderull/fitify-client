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
import BeTrainer from "../Pages/BeTrainer/BeTrainer";
import PendingTrainers from "../Pages/DashbordPages/PendingTrainers/PendingTrainers";
import AddForum from "../Pages/DashbordPages/AddForum/AddForum";
import AddSlot from "../Pages/DashbordPages/AddSlot/AddSlot";
import ActivityLog from "../Pages/DashbordPages/ActivityLog/ActivityLog";
import MyProfile from "../Pages/DashbordPages/MyProfile/MyProfile";
import Payment from "../Pages/Payment/Payment";
import ManageSlots from "../Pages/DashbordPages/ManageSlots/ManageSlots";
import BookedTrainer from "../Pages/DashbordPages/BookedTrainers/BookedTrainers";
import MakeAdmin from "../Pages/DashbordPages/MakeAdmin/MakeAdmin";
import ClassDetails from "../Pages/ClassDetails/ClassDetails";
import AdminRoute from "../Routes/AdminRoute";

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
        path: "payment/:trainerId",
        element: (
          <PrivateRoute>
            <Payment></Payment>,
          </PrivateRoute>
        ),
      },
      {
        path: "be-trainer",
        element: (
          <PrivateRoute>
            <BeTrainer></BeTrainer>
          </PrivateRoute>
        ),
      },
      {
        path: "class-details/:id",
        element: <ClassDetails></ClassDetails>,
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
        element: (
          <AdminRoute>
            <AddClass></AddClass>,
          </AdminRoute>
        ),
      },
      {
        path: "all-subscribers",
        element: (
          <AdminRoute>
            <AllSubscribers></AllSubscribers>,
          </AdminRoute>
        ),
      },
      {
        path: "trainers",
        element: <Trainers></Trainers>,
      },
      {
        path: "pending-trainers",
        element: (
          <AdminRoute>
            <PendingTrainers></PendingTrainers>,
          </AdminRoute>
        ),
      },
      {
        path: "add-forum",
        element: <AddForum></AddForum>,
      },
      {
        path: "add-slot",
        element: <AddSlot></AddSlot>,
      },
      {
        path: "activity-log",
        element: <ActivityLog></ActivityLog>,
      },
      {
        path: "my-profile",
        element: <MyProfile></MyProfile>,
      },
      {
        path: "manage-slots",
        element: <ManageSlots></ManageSlots>,
      },
      {
        path: "booked-trainer",
        element: <BookedTrainer></BookedTrainer>,
      },
      {
        path: "make-admin",
        element: (
          <AdminRoute>
            <MakeAdmin></MakeAdmin>,
          </AdminRoute>
        ),
      },
    ],
  },
]);
