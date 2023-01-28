// routes
import { PATH_HOME } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: getIcon('ic_user'),
  key: getIcon('ic_key'),
  message: getIcon('ic_message'),
  // logout: getIcon('ic_logout'),
  calendar: getIcon('ic_calendar'),
  gender: getIcon('ic_gender'),
  phone: getIcon('ic_phone'),
  email: getIcon('ic_email'),
  drivers_license: getIcon('ic_drivers_license'),
};

const COLORS = {
  cyan: '#2BB8AF',
  orange: '#FF5E34',
  yellow: '#FFC641',
  pink: '#FF86A2',
  // violet: '#442BBA',
};
const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Thông tin tài khoản',
    icon: ICONS.user,
    color: COLORS.cyan,
    href: '/shipper/account',
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Thay đổi mật khẩu',
    icon: ICONS.key,
    color: COLORS.orange,
    href: '/shipper/change-password',
  },
  {
    subheader: 'Hỗ trợ',
    icon: ICONS.message,
    color: COLORS.pink,
    href: '/shipper/help',
  },
  // {
  //   subheader: 'Đăng xuất',
  //   icon: ICONS.logout,
  //   color: COLORS.violet,
  //   href: '/shipper/logout',
  // },

  // APP
];

const navInfoShipper = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    label: 'Họ & Tên',
    icon: ICONS.user,
    key: 'displayName',
  },
  {
    label: 'Ngày sinh',
    icon: ICONS.calendar,
    key: 'dayOfBirth',
  },
  {
    label: 'Giới tính',
    icon: ICONS.gender,
    key: 'gender',
  },
  {
    label: 'Số điện thoại',
    icon: ICONS.phone,
    key: 'phoneNumber',
  },
  {
    label: 'Địa chỉ email',
    icon: ICONS.email,
    key: 'email',
  },
  {
    label: 'GPLX',
    icon: ICONS.drivers_license,
    key: 'licensePlates',
  },

  // APP
];

export { navConfig, navInfoShipper };
