import { useSelector } from "react-redux";
import { Redirect, Route, useLocation } from "react-router";

const AdminRoute = (props) => {
  const { currentUser } = useSelector((state) => state.AuthReducer);
  const { component: ComponentAdmin, ...rest } = props;
  let location = useLocation();

  return (
    <Route
      {...rest}
      render={(propsRoute) => {
        if (currentUser) {
          if (currentUser?.user.role === "admin") {
            return <ComponentAdmin {...propsRoute} />;
          }
          // CanNotAccess
        }
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: location.pathname,
            }}
          />
        );
      }}
    />
  );
};

export default AdminRoute;
