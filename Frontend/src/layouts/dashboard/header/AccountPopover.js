import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_AUTH, PATH_HOME } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

const MENU_OPTIONS_ADMIN = [
  {
    label: 'Trang chủ',
    linkTo: PATH_DASHBOARD.general.analytics,
  },
  {
    label: 'Tài khoản',
    linkTo: PATH_DASHBOARD.staff.account,
  },
  // {
  //   label: 'Settings',
  //   linkTo: PATH_DASHBOARD.user.account,
  // },
];

const MENU_OPTIONS_USER = [
  {
    label: 'Thông tin tài khoản',
    linkTo: PATH_HOME.user.root,
  },
  {
    label: 'Đơn hàng của tôi',
    linkTo: PATH_HOME.user.order,
  },
  // {
  //   label: 'Settings',
  //   linkTo: PATH_DASHBOARD.user.account,
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const { user, logout, logoutAdmin } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const handleLogout = async () => {
    console.log('user567', user);
    if (user.googleId !== undefined) {
      try {
        await logout();
        navigate(PATH_AUTH.home, { replace: true });
        window.location.reload();
        if (isMountedRef.current) {
          handleClose();
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Unable to logout!', { variant: 'error' });
      }
    } else {
      try {
        await logoutAdmin();
        navigate(PATH_AUTH.login, { replace: true });

        if (isMountedRef.current) {
          handleClose();
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Unable to logout!', { variant: 'error' });
      }
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <MyAvatar />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName || user?.phoneNumber}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
        {user.role === 'quản trị' && (
          <Stack sx={{ p: 1 }}>
            {MENU_OPTIONS_ADMIN.map((option) => (
              <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
                {option.label}
              </MenuItem>
            ))}
          </Stack>
        )}
        {user.role === 'khách hàng' && (
          <Stack sx={{ p: 1 }}>
            {MENU_OPTIONS_USER.map((option) => (
              <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
                {option.label}
              </MenuItem>
            ))}
          </Stack>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Đăng xuất
        </MenuItem>
      </MenuPopover>
    </>
  );
}
