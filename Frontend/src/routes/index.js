import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';

// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';
import AccountLayoutLayout from '../layouts/account';

// import PromotionCreate from '../pages/dashboard/PromotionCreate';
// import BrandList from '../pages/dashboard/BrandList';
// import BrandCreate from '../pages/dashboard/BrandCreate';
// import ColorList from '../pages/dashboard/ColorList';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'admin',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        // { path: 'booking', element: <GeneralBooking /> },

        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/admin/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'list', element: <EcommerceProductList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/admin/user/profile" replace />, index: true },

            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':name/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'promotion',
          children: [
            { element: <Navigate to="/admin/promotion/list" replace />, index: true },
            { path: 'list', element: <PromotionList /> },
            { path: 'new', element: <PromotionCreate /> },
            { path: 'edit/:id', element: <PromotionEdit /> },
          ],
        },
        {
          path: 'brand',
          children: [
            { element: <Navigate to="/admin/brand/list" replace />, index: true },
            { path: 'list', element: <BrandList /> },
            // { path: 'new', element: <BrandCreate /> },
            // { path: 'edit/:id', element: <PromotionCreate /> },
          ],
        },
        {
          path: 'cate',
          children: [
            { element: <Navigate to="/admin/cate/list" replace />, index: true },
            { path: 'list', element: <CateList /> },
            // { path: 'new', element: <BrandCreate /> },
            // { path: 'edit/:id', element: <PromotionCreate /> },
          ],
        },
        {
          path: 'objUse',
          children: [
            { element: <Navigate to="/admin/objUse/list" replace />, index: true },
            { path: 'list', element: <ObjectUseList /> },
            // { path: 'new', element: <BrandCreate /> },
            // { path: 'edit/:id', element: <PromotionCreate /> },
          ],
        },
        {
          path: 'color',
          children: [
            { element: <Navigate to="/admin/color/list" replace />, index: true },
            { path: 'list', element: <ColorList /> },
            { path: 'new', element: <BrandCreate /> },
            // { path: 'edit/:id', element: <PromotionCreate /> },
          ],
        },
        {
          path: 'size',
          children: [
            { element: <Navigate to="/admin/size/list" replace />, index: true },
            { path: 'list', element: <SizeList /> },

            // { path: 'edit/:id', element: <PromotionCreate /> },
          ],
        },
        {
          path: 'shipper',
          children: [
            { element: <Navigate to="/admin/shipper/list" replace />, index: true },
            { path: 'list', element: <ShipperList /> },
            { path: 'new', element: <ShipperCreate /> },
            // { path: 'edit/:id', element: <PromotionCreate /> },
          ],
        },

        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/admin/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceList /> },
            { path: ':id', element: <InvoiceDetails /> },
            { path: ':id/edit', element: <InvoiceEdit /> },
            { path: 'new', element: <InvoiceCreate /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Product /> },
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'about-us', element: <About /> },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <Faqs /> },
        {
          path: 'product',
          children: [
            { element: <Contact />, index: true },
            { path: '', element: <Contact /> },
            { path: ':name', element: <Product /> },
          ],
        },
        {
          path: 'account',
          element: <AccountLayoutLayout />,
          children: [
            { element: <Account />, index: true },
            // { path: 'order', element: <Order /> },
          ],
        },
        {
          path: 'order',
          element: <AccountLayoutLayout />,
          children: [
            { element: <Order />, index: true },
            { path: 'view/:id', element: <OrderView /> },
          ],
        },
        { path: 'checkout', element: <EcommerceCheckout /> },
      ],
    },
    { path: '/shipper/login', element: <LoginShipper /> },
    { path: '/shipper/orderListShipper', element: <OrderListShipper /> },
    { path: '/shipper/orderDetailShipper', element: <OrderShipperDetail /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
// const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));

// ECOMMERCE
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductCreate')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));

// INVOICE
const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/InvoiceList')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/InvoiceDetails')));
const InvoiceCreate = Loadable(lazy(() => import('../pages/dashboard/InvoiceCreate')));
const InvoiceEdit = Loadable(lazy(() => import('../pages/dashboard/InvoiceEdit')));

// USER

const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

// PROMOTION
const PromotionList = Loadable(lazy(() => import('../pages/dashboard/PromotionList')));
const PromotionEdit = Loadable(lazy(() => import('../pages/dashboard/PromotionEdit')));
const PromotionCreate = Loadable(lazy(() => import('../pages/dashboard/PromotionCreate')));
// Brand
const BrandList = Loadable(lazy(() => import('../pages/dashboard/BrandList')));
const BrandCreate = Loadable(lazy(() => import('../pages/dashboard/BrandCreate')));
// Color
const ColorList = Loadable(lazy(() => import('../pages/dashboard/ColorList')));
// const PromotionEdit = Loadable(lazy(() => import('../pages/dashboard/PromotionEdit')));

// Size

const SizeList = Loadable(lazy(() => import('../pages/dashboard/SizeList')));
// shipper

const ShipperList = Loadable(lazy(() => import('../pages/dashboard/ShipperList')));
const ShipperCreate = Loadable(lazy(() => import('../pages/dashboard/ShipperCreate')));

// cate
const CateList = Loadable(lazy(() => import('../pages/dashboard/CateList')));
// ObjectUse
const ObjectUseList = Loadable(lazy(() => import('../pages/dashboard/ObjectUseList')));
// APP

// MAIN
const HomePage = Loadable(lazy(() => import('../pages/Home')));
const About = Loadable(lazy(() => import('../pages/About')));
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const Account = Loadable(lazy(() => import('../pages/Account')));
const OrderView = Loadable(lazy(() => import('../pages/OrderView')));
const Order = Loadable(lazy(() => import('../pages/Order')));
const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Product = Loadable(lazy(() => import('../pages/Product')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));

// shipper

const LoginShipper = Loadable(lazy(() => import('../pages/Shipper/LoginShipper')));
const OrderListShipper = Loadable(lazy(() => import('../pages/Shipper/OrderListShipper')));
const OrderShipperDetail = Loadable(lazy(() => import('../pages/Shipper/OrderShipperDetail')));
