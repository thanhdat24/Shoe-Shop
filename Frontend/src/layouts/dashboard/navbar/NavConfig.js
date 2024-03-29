// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/icons/${name}.svg`} sx={{ color: '#a3aed1', fill: '#a3aed1', width: 1, height: 1 }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
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
  rating: getIcon('ic_rating'),

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

  {
    subheader: 'Quản lý khách hàng',
    items: [
      // USER
      {
        title: 'Khách hàng',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.user.list },
          // { title: 'Tài khoản', path: PATH_DASHBOARD.user.account },
        ],
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản lý danh mục hệ thống',
    items: [
      // USER
      {
        title: 'Nhân viên',
        path: PATH_DASHBOARD.staff.root,
        icon: ICONS.user,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.staff.list },
          { title: 'Tài khoản', path: PATH_DASHBOARD.staff.account },
        ],
      },
      // PRODUCT
      {
        title: 'Sản phẩm',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.cart,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.eCommerce.list }],
      },

      {
        title: 'Quản lý tồn kho',
        path: PATH_DASHBOARD.inventory.suppliers,
        icon: ICONS.cart,
        children: [
          { title: 'Nhập hàng', path: PATH_DASHBOARD.inventory.inventory_receives },
          { title: 'Nhà cung cấp', path: PATH_DASHBOARD.inventory.suppliers },
        ],
      },

      // BRAND
      {
        title: 'Thương hiệu',
        path: PATH_DASHBOARD.brand.root,
        icon: ICONS.brand,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.brand.list }],
      },
      // Color
      {
        title: 'Màu sắc',
        path: PATH_DASHBOARD.color.root,
        icon: ICONS.color,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.color.list }],
      },
      // SIZE
      {
        title: 'Kích thước',
        path: PATH_DASHBOARD.size.root,
        icon: ICONS.shoes,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.size.list }],
      },
      // SHIPPER

      // E-COMMERCE
      {
        title: 'Loại giày',
        path: PATH_DASHBOARD.cate.root,
        icon: ICONS.cate,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.cate.list }],
      },
      {
        title: 'Đối tượng sử dụng',
        path: PATH_DASHBOARD.objUse.root,
        icon: ICONS.obj,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.objUse.list }],
      },

      {
        title: 'Shipper',
        path: PATH_DASHBOARD.shipper.root,
        icon: ICONS.shipper,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.shipper.list }],
      },
      // INVOICE
      {
        title: 'Đơn hàng',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.invoice.list }],
      },
      // PROMOTION
      {
        title: 'Khuyến mãi',
        path: PATH_DASHBOARD.promotion.root,
        icon: ICONS.promotion,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.promotion.list },
          { title: 'Tạo', path: PATH_DASHBOARD.promotion.new },
          // { title: 'edit', path: PATH_DASHBOARD.promotion.edit },
        ],
      },
      // Đánh giá
      {
        title: 'Đánh giá',
        path: PATH_DASHBOARD.rating.root,
        icon: ICONS.rating,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.rating.list }],
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
    subheader: 'Ứng dụng',
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
      { title: 'Hỗ trợ', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
      // { title: 'kanban', path: PATH_DASHBOARD.kanban, icon: ICONS.kanban },
    ],
  },
];

export default navConfig;
