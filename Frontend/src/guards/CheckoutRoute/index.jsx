import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { SnackbarProvider } from "notistack";

function CheckoutRoute(props) {
  // props: { exact, path="/datve/:maLichChieu", component={BookTickets}}
  const { currentUser } = useSelector((state) => state.AuthReducer);
  const { component: BookTickets, ...routeProps } = props;
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Route
        {...routeProps}
        render={(propsInRoute) => {
          if (currentUser) {
            return <BookTickets {...propsInRoute} />;
          }
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: propsInRoute.location.state,
              }}
            />
          );
        }}
      />
    </SnackbarProvider>
  );
}
export default CheckoutRoute;
