import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD, PATH_PAGE } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, user } = useAuth();
  console.log('isAuthenticated', isAuthenticated);
  console.log('userêtry', user);
  if (isAuthenticated && user?.role === 'admin') {
   return  <Navigate to={PATH_DASHBOARD.root} />;
  } 
   if (isAuthenticated && user?.role === 'staff') {
   return  <Navigate to={PATH_PAGE.root} />;
  }
  return <>{children}</>;
}
