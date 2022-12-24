import "./App.css";
import { useMemo, lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UsersManagement from "./pages/UsersManagement";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import AdminLayout from "./layouts/AdminLayout";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import shape from "./theme/shape";
import palette from "./theme/palette";
import typography from "./theme/typography";
import shadows, { customShadows } from "./theme/shadows";
import componentsOverride from "./theme/overrides";
import MoviesManagement from "./pages/MoviesManagement";

import Loading from "./components/Loading/index";
import TriggerLoadingLazy from "./components/TriggerLoadingLazy/index";

import ModalTrailer from "./components/ModalTrailer/ModalTrailer";
import MainLayout from "./layouts/MainLayout/index";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { TOKEN } from "./constants/config";
import { useDispatch } from "react-redux";
import NewPassword from "./pages/ResetPassword/NewPassword";
import { SnackbarProvider } from "notistack";

// page
const Homepage = lazy(() => import("./pages/Homepage"));
const MovieDetail = lazy(() => import("./pages/MovieDetail"));
const UserAccount = lazy(() => import("./pages/UsersManagement/UserAccount"));
const BookTickets = lazy(() => import("./pages/Bookticket"));
const TicketManagement = lazy(() => import("./pages/TicketManagement"));
const ReviewManagement = lazy(() => import("./pages/ReviewManagement"));
const DiscountManagement = lazy(() => import("./pages/DiscountManagement"));
const EditDiscount = lazy(() =>
  import("./pages/DiscountManagement/ActionMoreMenu/EditDiscount")
);

const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserEdit = lazy(() => import("./pages/UsersManagement/UserEdit"));
const CreateTheater = lazy(() =>
  import("./pages/TheaterManagement/CreateTheater")
);
const TheaterEdit = lazy(() => import("./pages/TheaterManagement/TheaterEdit"));
const CreateShowtimes = lazy(() =>
  import("./pages/ShowtimesManagement/CreateShowtimes")
);
const ShowtimeEdit = lazy(() =>
  import("./pages/ShowtimesManagement/ShowtimeEdit")
);
// const MoviesManagement = lazy(() => import("./pages/MoviesManagement"));s
const TheaterManagement = lazy(() => import("./pages/TheaterManagement"));
const ShowtimesManagement = lazy(() => import("./pages/ShowtimesManagement"));
const MovieEdit = lazy(() => import("./pages/MoviesManagement/MovieEdit"));
const CreateMovie = lazy(() => import("./pages/MoviesManagement/CreateMovie"));
const CreateDiscount = lazy(() =>
  import("./pages/DiscountManagement/CreateDiscount")
);
const UserProfile = lazy(() => import("./pages/UserProfile"));

const TheaterClusterManagement = lazy(() =>
  import("./pages/TheaterClusterManagement")
);
const CreateTheaterCluster = lazy(() =>
  import("./pages/TheaterClusterManagement/CreateTheaterCluster")
);
const EditTheaterCluster = lazy(() =>
  import("./pages/TheaterClusterManagement/EditTheaterCluster")
);

// guards
const AdminRoute = lazy(() => import("./guards/AdminRoute"));
const CheckoutRoute = lazy(() => import("./guards/CheckoutRoute"));
const UserProfileRoute = lazy(() => import("./guards/UserProfileRoute"));

// Configure Firebase.
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
};
firebase.initializeApp(config);

function App() {
  // const [isSignedIn, setIsSignedIn] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (!user) {
          return;
        }
        const token = await user.getIdToken();
        const data = {
          user: {
            _id: user.uid,
            fullName: user.displayName,
            email: user.email,
            photo: user.photoURL,
            providerId: user.providerId,
            active: true,
            dateOfBirth: "",
            gender: "",
            phoneNumber: user.phoneNumber,
            role: "user",
          },
          token,
          status: "success",
        };
        if (user) {
          dispatch({
            type: "LOGIN_FIREBASE",
            payload: {
              data,
              token,
            },
          });
          localStorage.setItem(TOKEN, token);
        }
      });
    return () => unregisterAuthObserver();
  }, []);

  const themeOptions = useMemo(
    () => ({
      palette,
      shape,
      typography,
      shadows,
      customShadows,
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Loading />
          <ModalTrailer />
          <Suspense fallback={<TriggerLoadingLazy />}>
            <Switch>
              <Route exact path={["/", "/movie/:idMovie", "/profile"]}>
                <MainLayout>
                  <Route exact path="/" component={Homepage} />
                  <Route exact path="/movie/:idMovie" component={MovieDetail} />
                  <UserProfileRoute
                    exact
                    path="/profile"
                    component={UserProfile}
                  />
                </MainLayout>
              </Route>
              <CheckoutRoute
                exact
                path="/booking-tickets/:idShowtime"
                component={BookTickets}
              />
              <Route exact path={["/admin/dashboard"]}>
                <AdminLayout>
                  <AdminRoute
                    exact
                    path="/admin/dashboard"
                    component={Dashboard}
                  />
                </AdminLayout>
              </Route>
              <Route
                exact
                path={[
                  "/admin/users/list",
                  "/admin/users/account",
                  "/admin/users/edit/:userId",
                ]}
              >
                <AdminLayout>
                  <AdminRoute
                    exact
                    path="/admin/users/list"
                    component={UsersManagement}
                  />
                  <AdminRoute
                    exact
                    path="/admin/users/account"
                    component={UserAccount}
                  />
                  <AdminRoute
                    exact
                    path="/admin/users/edit/:userId"
                    component={UserEdit}
                  />
                </AdminLayout>
              </Route>
              <Route
                exact
                path={[
                  "/admin/movies/list",
                  "/admin/movies/create",
                  "/admin/movies/edit/:idMovie",
                ]}
              >
                <AdminLayout>
                  <AdminRoute
                    exact
                    path="/admin/movies/list"
                    component={MoviesManagement}
                  />
                  <AdminRoute
                    exact
                    path="/admin/movies/create"
                    component={CreateMovie}
                  />{" "}
                  <AdminRoute
                    exact
                    path="/admin/movies/edit/:idMovie"
                    component={MovieEdit}
                  />
                </AdminLayout>
              </Route>
              <Route
                exact
                path={[
                  "/admin/theater/list",
                  "/admin/theater/create",
                  "/admin/theater/edit/:theaterId",
                ]}
              >
                <AdminLayout>
                  <AdminRoute
                    exact
                    path="/admin/theater/list"
                    component={TheaterManagement}
                  />
                  <AdminRoute
                    exact
                    path="/admin/theater/create"
                    component={CreateTheater}
                  />
                  <AdminRoute
                    exact
                    path="/admin/theater/edit/:theaterId"
                    component={TheaterEdit}
                  />
                </AdminLayout>
              </Route>
              <Route
                exact
                path={[
                  "/admin/theater-cluster/list",
                  "/admin/theater-cluster/create",
                  "/admin/theater-cluster/edit/:theaterClusterId",
                ]}
              >
                <AdminLayout>
                  <AdminRoute
                    exact
                    path="/admin/theater-cluster/list"
                    component={TheaterClusterManagement}
                  />
                  <AdminRoute
                    exact
                    path="/admin/theater-cluster/create"
                    component={CreateTheaterCluster}
                  />
                  <AdminRoute
                    exact
                    path="/admin/theater-cluster/edit/:theaterClusterId"
                    component={EditTheaterCluster}
                  />
                </AdminLayout>
              </Route>
              <Route
                exact
                path={[
                  "/admin/showtimes/list",
                  "/admin/showtimes/create",
                  "/admin/showtimes/edit/:showtimeId",
                ]}
              >
                <AdminLayout>
                  <AdminRoute
                    exact
                    path="/admin/showtimes/list"
                    component={ShowtimesManagement}
                  />
                  <AdminRoute
                    exact
                    path="/admin/showtimes/create"
                    component={CreateShowtimes}
                  />
                  <AdminRoute
                    exact
                    path="/admin/showtimes/edit/:showtimeId"
                    component={ShowtimeEdit}
                  />
                </AdminLayout>
              </Route>
              <Route exact path={["/admin/ticket/list"]}>
                <AdminLayout>
                  <AdminRoute
                    exact
                    path="/admin/ticket/list"
                    component={TicketManagement}
                  />
                </AdminLayout>
              </Route>
              <Route exact path={["/admin/review/list"]}>
                <AdminLayout>
                  <AdminRoute
                    exact
                    path="/admin/review/list"
                    component={ReviewManagement}
                  />
                </AdminLayout>
              </Route>
              <Route
                exact
                path={[
                  "/admin/discount/list",
                  "/admin/discount/create",
                  "/admin/discount/edit/:discountId",
                ]}
              >
                <AdminLayout>
                  <AdminRoute
                    exact
                    path="/admin/discount/list"
                    component={DiscountManagement}
                  />
                  <AdminRoute
                    exact
                    path="/admin/discount/create"
                    component={CreateDiscount}
                  />
                  <AdminRoute
                    exact
                    path="/admin/discount/edit/:discountId"
                    component={EditDiscount}
                  />
                </AdminLayout>
              </Route>
              <Route
                exact
                path={[
                  "/login",
                  "/register",
                  "/reset-password",
                  "/new-password",
                ]}
              >
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/reset-password" component={ResetPassword} />
                <SnackbarProvider
                  maxSnack={3}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{
                    "& .SnackbarItem-variantSuccess": {
                      backgroundColor: "rgb(255, 255, 255)",
                      color: "rgb(33, 43, 54)",
                    },
                    "& .SnackbarItem-variantError": {
                      backgroundColor: "rgb(255, 255, 255)",
                      color: "rgb(33, 43, 54)",
                    },
                    "& .SnackbarContent-root": {
                      width: "100% !important",
                      padding: " 8px !important",
                      margin: "2px 0px !important",
                      boxShadow:
                        "rgba(145 158 171 !important , 0.16) 0px 8px 16px 0px !important",
                      borderRadius: " 8px !important",
                    },
                    "& .SnackbarItem-message": {
                      fontWeight: "600",
                      padding: "0px !important",
                    },
                  }}
                  iconVariant={{
                    success: (
                      <span
                        className="mr-3 w-10 h-10 flex rounded-xl items-center justify-center"
                        style={{
                          color: "rgb(84, 214, 44)",
                          backgroundColor: "rgba(84, 214, 44, 0.16)",
                        }}
                      >
                        <img
                          className="w-6 h-6"
                          src="./img/icon-success.svg"
                          alt="icon-success"
                        />
                      </span>
                    ),
                    error: (
                      <span
                        className="mr-3 w-10 h-10 flex rounded-xl items-center justify-center"
                        style={{
                          color: "rgb(122, 12, 46)",
                          backgroundColor: "rgb(255, 231, 217)",
                        }}
                      >
                        <img
                          className="w-6 h-6"
                          src="./img/icon-error.svg"
                          alt="icon-error"
                        />
                      </span>
                    ),
                  }}
                >
                  <Route exact path="/new-password" component={NewPassword} />
                </SnackbarProvider>
              </Route>
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
