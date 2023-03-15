import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
  Link,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// _mock_
import { _notifications } from '../../../_mock';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { useDispatch, useSelector } from '../../../redux/store';
import { getNotifications } from '../../../redux/slices/notification';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { updateOrder } from '../../../redux/slices/order';
// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const dispatch = useDispatch();

  // const [notifications, setNotifications] = useState(_notifications);

  const { notifications } = useSelector((state) => state.notification);
  const { orderUpdate } = useSelector((state) => state.order);

  console.log('notifications', notifications);

  const totalUnRead = notifications?.filter((item) => !item.isRead).length;

  const [open, setOpen] = useState(null);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch, orderUpdate]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // const handleMarkAllAsRead = () => {
  //   setNotifications(
  //     notifications.map((notification) => ({
  //       ...notification,
  //       isUnRead: false,
  //     }))
  //   );
  // };

  return (
    <>
      <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Thông báo</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Bạn có {totalUnRead} tin nhắn chưa đọc
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButtonAnimate
                color="primary"
                // onClick={handleMarkAllAsRead}
              >
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButtonAnimate>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Mới
              </ListSubheader>
            }
          >
            {notifications
              ?.filter((item) => !item.isRead)
              .map((notification) => (
                <NotificationItem setOpen={setOpen} key={notification._id} notification={notification} />
              ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Trước đó
              </ListSubheader>
            }
          >
            {notifications
              ?.filter((item) => item.isRead)
              .map((notification) => (
                <NotificationItem setOpen={setOpen} key={notification._id} notification={notification} />
              ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            Xem tất cả
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.string,
    _id: PropTypes.string,
    isRead: PropTypes.bool,
    status: PropTypes.string,
    idUser: PropTypes.object,
  }),
  setOpen: PropTypes.func,
};

function NotificationItem({ notification, setOpen }) {
const dispatch = useDispatch()

  const { photoURL, title } = renderContent(notification);

  const handleRead = async (id) => {
    console.log(id);
   await dispatch(updateOrder(id,{isRead:true}))
    setOpen(null);
  };
  return (
    <Link
      component={RouterLink}
      to={PATH_DASHBOARD.invoice.view(notification._id)}
      sx={{ textDecoration: 'none !important' }}
      onClick={() => handleRead(notification._id)}
    >
      <ListItemButton
        sx={{
          py: 1.5,
          px: 2.5,
          mt: '1px',
          ...(!notification.isRead && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'background.neutral' }}>{photoURL}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
              {notification.createdAt}
            </Typography>
          }
        />
      </ListItemButton>
    </Link>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.idUser.displayName}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.status === 'Đang xử lý' && 'đã đặt thành công đơn hàng mới'}
      </Typography>
    </Typography>
  );

  return {
    photoURL: notification.idUser.photoURL ? (
      <img alt={notification.displayName} src={notification.idUser.photoURL} />
    ) : null,
    title,
  };
}
