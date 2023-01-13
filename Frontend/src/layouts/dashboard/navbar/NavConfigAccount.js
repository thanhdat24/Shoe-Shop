// routes
import { PATH_DASHBOARD, PATH_HOME } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  shipper: getIcon('ic_shipper'),
  color: getIcon('ic_color'),
  shoes: getIcon('ic_shoes'),
  brand: getIcon('ic_brand'),
  user: getIcon('ic_user'),
  obj: getIcon('ic_obj'),
  cate: getIcon('ic_cate'),
  // kanban: getIcon('ic_kanban'),
  promotion: getIcon('ic_promotion'),
  invoice: getIcon('ic_invoice'),

  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Thông tin tài khoản',
    items: [{ title: 'Thông tin tài khoản', path: PATH_HOME.user.root, icon: ICONS.user }],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    items: [
      {
        title: 'Quản lý đơn hàng',
        path: PATH_HOME.user.order,
        icon: ICONS.invoice,
      },
    ],
  },

  // APP
];

export default navConfig;
