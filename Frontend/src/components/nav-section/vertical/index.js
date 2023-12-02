import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader } from '@mui/material';
//
import { NavListRoot } from './NavList';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------
export const ListSubheaderStyle = styled(({ subheader, ...rest }) => (
  <ListSubheader {...rest} disableSticky disableGutters>
    {subheader}
  </ListSubheader>
))(({ theme }) => ({
  ...theme.typography.overline,
  paddingTop: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  fontFamily: 'Public Sans,sans-serif',
  color: '#a3aed1 !important',
  fontWeight: '700',
  lineHeight: '1.5',
  fontSize: ' 0.75rem',
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
};

export default function NavSectionVertical({ isNavUser, navConfig, isCollapse = false, ...other }) {
  const { user } = useAuth();
  console.log('user123123', user);

  return (
    <Box {...other} sx={isNavUser === 'yes' && { marginTop: 2 }}>
      {navConfig.map((group) => {
        console.log('group.subheader', group.subheader);
        if (
          user.email === 'admin@gmail.com' ||
          (user.role === 'nhân viên bán hàng'
            ? group.subheader === 'Quản lý danh mục hệ thống'
            : user.role === 'nhân viên kho'
            ? group.subheader === 'Quản lý danh mục hệ thống'
            : user.role === 'khách hàng' &&
              (group.subheader === 'Thông tin tài khoản' || group.subheader === 'Quản lý đơn hàng'))
        ) {
          return (
            <List key={group.subheader} disablePadding sx={{ px: 2 }}>
              {isNavUser !== 'yes' && <ListSubheaderStyle subheader={group.subheader} />}
              {group.items
                .filter((item) => {
                  const isNhanVienBanHang = user.role === 'nhân viên bán hàng';
                  const isNhanVienKho = user.role === 'nhân viên kho';

                  return (
                    (isNhanVienBanHang && item.title === 'Đơn hàng') ||
                    (isNhanVienKho && (item.title === 'Quản lý tồn kho' || item.title === 'Sản phẩm')) ||
                    (!isNhanVienBanHang && !isNhanVienKho)
                  );
                })
                .map((list) => (
                  <NavListRoot key={list.title} list={list} />
                ))}
            </List>
          );
        } else {
          return null; // Skip rendering for other cases
        }
      })}
    </Box>
  );
}
