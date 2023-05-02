// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'Trang chủ',
    icon: <Iconify icon={'eva:home-fill'} {...ICON_SIZE} />,
    path: '/',
  },

  {
    title: 'Nam',
    path: '/gender?q=Nam',
    icon: <Iconify icon={'eva:file-fill'} {...ICON_SIZE} />,
  },
  {
    title: 'Nữ',
    path: '/gender?q=Nữ',
    icon: <Iconify icon={'eva:file-fill'} {...ICON_SIZE} />,
  },
  {
    title: 'Trẻ em',
    path: '/gender?q=Trẻ em',
    icon: <Iconify icon={'eva:file-fill'} {...ICON_SIZE} />,
  },
];

export default menuConfig;
