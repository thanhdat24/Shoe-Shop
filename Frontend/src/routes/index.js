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
import OrderDetail from '../pages/Shipper/OrderDetail';
import ShipperLayout from '../layouts/shipper';
import ProductDetail from '../pages/dashboard/Product/ProductDetail';
import GeneralAnalytics from '../pages/dashboard/GeneralAnalytics';

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
        { path: 'analytics', element: <GeneralAnalytics /> },
        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/admin/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'list', element: <EcommerceProductList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
            { path: 'product/:name/view', element: <ProductDetail /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/admin/user/profile" replace />, index: true },

            { path: 'list', element: <UserList /> },

            // { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'staff',
          children: [
            { element: <Navigate to="/admin/staff/list" replace />, index: true },
            { path: 'list', element: <StaffList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':id/edit', element: <UserCreate /> },
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
        {
          path: 'rating',
          children: [
            { element: <Navigate to="/admin/rating/list" replace />, index: true },
            { path: 'list', element: <RatingList /> },
          ],
        },
        {
          path: 'chat',
          children: [
            { element: <Chat />, index: true },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> },
          ],
        },
        {
          path: 'inventory',
          children: [
            { element: <SuppliersList />, index: true },
            { path: 'inventory_receives', element: <InventoryReceives /> },
            { path: 'inventory_receives/:receiptCode', element: <InventoryReceivesEdit /> },
            { path: 'inventory_receives/:receiptCode/return', element: <InventoryReceivesReturn /> },
            { path: 'inventory_receives_new', element: <InventoryReceivesNew /> },
            { path: 'suppliers', element: <SuppliersList /> },
            { path: 'suppliers/:supplierId', element: <SuppliersEdit /> },
            { path: 'suppliers_new', element: <SuppliersNew /> },
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
        {
          path: 'product',
          children: [{ path: ':name', element: <Product /> }],
        },
        {
          path: 'search',
          element: <Search />,
        },

        {
          path: 'gender',
          element: <SearchGender />,
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
    {
      path: 'shipper',
      element: <ShipperLayout />,
      children: [
        // { element: <OrderListShipper />, index: true },
        { path: 'dashboard', element: <OrderListShipper /> },
        { path: 'account', element: <AccountShipper /> },
        { path: 'order/view/:id', element: <OrderDetail /> },
        { path: 'change-password', element: <ChangePassword /> },
      ],
    },

    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// DASHBOARD

// ECOMMERCE
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/Product/ProductList')));
const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/Product/ProductCreate')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));

// INVENTORY
const InventoryReceives = Loadable(
  lazy(() => import('../pages/dashboard/Inventory/InventoryReceives/InventoryReceives'))
);
const InventoryReceivesNew = Loadable(
  lazy(() => import('../pages/dashboard/Inventory/InventoryReceives/InventoryReceivesNew'))
);

const InventoryReceivesEdit = Loadable(
  lazy(() => import('../pages/dashboard/Inventory/InventoryReceives/InventoryReceivesEdit'))
);

const InventoryReceivesReturn = Loadable(
  lazy(() => import('../pages/dashboard/Inventory/InventoryReceives/InventoryReceivesReturn'))
);

const SuppliersList = Loadable(lazy(() => import('../pages/dashboard/Inventory/Suppliers/SuppliersList')));
const SuppliersEdit = Loadable(lazy(() => import('../pages/dashboard/Inventory/Suppliers/SuppliersEdit')));
const SuppliersNew = Loadable(lazy(() => import('../pages/dashboard/Inventory/Suppliers/SuppliersNew')));

// INVOICE
const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/Invoice/InvoiceList')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/Invoice/InvoiceDetails')));
const InvoiceCreate = Loadable(lazy(() => import('../pages/dashboard/Invoice/InvoiceCreate')));
const InvoiceEdit = Loadable(lazy(() => import('../pages/dashboard/Invoice/InvoiceEdit')));

// USER
const UserList = Loadable(lazy(() => import('../pages/dashboard/User/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/User/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/User/UserCreate')));

// STAFF
const StaffList = Loadable(lazy(() => import('../pages/dashboard/Staff/StaffList')));

// PROMOTION
const PromotionList = Loadable(lazy(() => import('../pages/dashboard/Promotion/PromotionList')));
const PromotionEdit = Loadable(lazy(() => import('../pages/dashboard/Promotion/PromotionEdit')));
const PromotionCreate = Loadable(lazy(() => import('../pages/dashboard/Promotion/PromotionCreate')));
// Brand
const BrandList = Loadable(lazy(() => import('../pages/dashboard/Brand/BrandList')));
const BrandCreate = Loadable(lazy(() => import('../pages/dashboard/Brand/BrandCreate')));
// Color
const ColorList = Loadable(lazy(() => import('../pages/dashboard/Color/ColorList')));
// const PromotionEdit = Loadable(lazy(() => import('../pages/dashboard/PromotionEdit')));

// Size

const SizeList = Loadable(lazy(() => import('../pages/dashboard/Size/SizeList')));
// shipper

const ShipperList = Loadable(lazy(() => import('../pages/dashboard/Shipper/ShipperList')));
const ShipperCreate = Loadable(lazy(() => import('../pages/dashboard/Shipper/ShipperCreate')));

// cate
const CateList = Loadable(lazy(() => import('../pages/dashboard/Category/CateList')));
// ObjectUse
const ObjectUseList = Loadable(lazy(() => import('../pages/dashboard/ObjectUse/ObjectUseList')));

// APP
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat/Chat')));

// MAIN
const HomePage = Loadable(lazy(() => import('../pages/Home')));
const Account = Loadable(lazy(() => import('../pages/Account')));
const OrderView = Loadable(lazy(() => import('../pages/OrderView')));
const Order = Loadable(lazy(() => import('../pages/Order')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Product = Loadable(lazy(() => import('../pages/Product')));
const Search = Loadable(lazy(() => import('../pages/Search')));
const SearchGender = Loadable(lazy(() => import('../pages/SearchGender')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));

// shipper

const LoginShipper = Loadable(lazy(() => import('../pages/Shipper/login/LoginShipper')));
const OrderListShipper = Loadable(lazy(() => import('../pages/Shipper/OrderListShipper')));
const AccountShipper = Loadable(lazy(() => import('../pages/Shipper/Account')));
const ChangePassword = Loadable(lazy(() => import('../pages/Shipper/ChangePassword')));

// Rating
const RatingList = Loadable(lazy(() => import('../pages/dashboard/Rating/RatingList')));
