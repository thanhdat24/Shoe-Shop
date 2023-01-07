// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
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
    subheader: 'Tổng quan',
    items: [{ title: 'Thống kê', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics }],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản lý',
    items: [
      // USER
      {
        title: 'Người dùng',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.user.list },
          { title: 'Tạo', path: PATH_DASHBOARD.user.new },

          { title: 'Tài khoản', path: PATH_DASHBOARD.user.account },
        ],
      },
      // PROMOTION
      {
        title: 'promotion',
        path: PATH_DASHBOARD.promotion.root,
        icon: ICONS.promotion,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.promotion.list },
          // { title: 'Tạo', path: PATH_DASHBOARD.promotion.new },
          // { title: 'edit', path: PATH_DASHBOARD.promotion.edit },
        ],
      },
      // Ưu đãi
      {
        title: 'Thương hiệu',
        path: PATH_DASHBOARD.brand.root,
        icon: ICONS.brand,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.brand.list },
          // { title: 'Tạo', path: PATH_DASHBOARD.promotion.new },
          // { title: 'edit', path: PATH_DASHBOARD.promotion.edit },
        ],
      },
      // Color
      {
        title: 'Màu sắc',
        path: PATH_DASHBOARD.color.root,
        icon: ICONS.color,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.color.list },
          // { title: 'Tạo', path: PATH_DASHBOARD.color.new },
          // { title: 'edit', path: PATH_DASHBOARD.color.edit },
        ],
      },
      // SIZE
      {
        title: 'Kích thước',
        path: PATH_DASHBOARD.size.root,
        icon: ICONS.shoes,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.size.list },
          // { title: 'Tạo', path: PATH_DASHBOARD.size.new },
          // { title: 'edit', path: PATH_DASHBOARD.color.edit },
        ],
      },
      // SHIPPER
      {
        title: 'Shipper',
        path: PATH_DASHBOARD.shipper.root,
        icon: ICONS.shipper,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.shipper.list },
          { title: 'Tạo', path: PATH_DASHBOARD.shipper.new },
          // { title: 'edit', path: PATH_DASHBOARD.color.edit },
        ],
      },

      // E-COMMERCE
      {
        title: 'Sản phẩm',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.cart,
        children: [
          { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
          { title: 'product', path: PATH_DASHBOARD.eCommerce.demoView },
          { title: 'Danh sách', path: PATH_DASHBOARD.eCommerce.list },
          { title: 'Tạo', path: PATH_DASHBOARD.eCommerce.new },
          { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit },
          { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
        ],
      },

      // INVOICE
      {
        title: 'invoice',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.invoice.list },
          { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
          { title: 'Tạo', path: PATH_DASHBOARD.invoice.new },
          { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
        ],
      },

      // BLOG
      // {
      //   title: 'blog',
      //   path: PATH_DASHBOARD.blog.root,
      //   icon: ICONS.blog,
      //   children: [
      //     { title: 'posts', path: PATH_DASHBOARD.blog.posts },
      //     { title: 'post', path: PATH_DASHBOARD.blog.demoView },
      //     { title: 'Tạo', path: PATH_DASHBOARD.blog.new },
      //   ],
      // },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'app',
    items: [
      // {
      //   title: 'mail',
      //   path: PATH_DASHBOARD.mail.root,
      //   icon: ICONS.mail,
      //   info: (
      //     <Label variant="outlined" color="error">
      //       +32
      //     </Label>
      //   ),
      // },
      // { title: 'kanban', path: PATH_DASHBOARD.kanban, icon: ICONS.kanban },
    ],
  },
];

export default navConfig;
