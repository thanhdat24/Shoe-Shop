import { useState, useRef, useEffect } from "react";
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
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
  Dialog,
} from "@mui/material";
// utils
import MenuPopover from "./MenuPopover";
import Iconify from "./Iconify";
import Scrollbar from "./Scrollbar";
import formatDate, { calculateTimeout, fToNow } from "../../utils/formatDate";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTicket,
  updateUnReadTicket,
} from "../../redux/actions/BookTicket";
import useStyles from "../../pages/Bookticket/ResultBookticket/style";
import { colorTheater } from "../../constants/theaterData";
// components

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const {
    ticketList: { data },
  } = useSelector((state) => state.BookTicketReducer);
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  useEffect(() => {
    // get list user lần đầu
    if (!data) {
      dispatch(getAllTicket());
    }
  }, [data]);

  // sort từ trên xuống
  data?.sort(
    (a, b) => formatDate(b.createdAt).getTime - formatDate(a.createdAt).getTime
  );

  const totalUnRead = data?.filter((item) => item.isUnRead === true).length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    data?.map((notification) => ({
      ...notification,
      isUnRead: false,
    }));
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        color={open ? "primary" : "default"}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Thông báo</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Bạn có {totalUnRead} tin nhắn chưa đọc
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Đánh dấu tất cả đã đọc">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Scrollbar sx={{ height: { xs: 510, sm: "20" } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: "overline" }}
              >
                Mới
              </ListSubheader>
            }
          >
            {data
              ?.filter((notification) => notification.isUnRead === true)
              .map((item, index) => (
                <NotificationItem
                  key={index}
                  id={item.id}
                  notification={item}
                />
              ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: "overline" }}
              >
                Trước đó
              </ListSubheader>
            }
          >
            {data
              ?.filter((notification) => notification.isUnRead === false)
              .map((item, index) => (
                <NotificationItem
                  key={index}
                  id={item.id}
                  notification={item}
                />
              ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({ notification, id, key }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const getIdSeat = (danhSachGhe) => {
    return danhSachGhe
      .reduce((listSeat, seat) => {
        return [...listSeat, seat.name];
      }, [])
      .join(", ");
  };
  const classes = useStyles({
    notification,
    color:
      colorTheater[
        notification?.idShowtime.idTheaterCluster.name.slice(0, 3).toUpperCase()
      ],
  });
  const createdAt = formatDate(notification?.createdAt).dDMmYy;
  let formatDateTimeShow = new Date(notification?.createdAt)
    .toLocaleTimeString([], { hour12: false })
    .slice(0, 5);
  const handleClose = () => {
    setOpen(false);
  };
  const handleRead = () => {
    if (notification.id === id) {
      notification.isUnRead = false;
    }
    setOpen(true);
    dispatch(updateUnReadTicket(notification, id));
  };
  const { avatar, title } = renderContent(notification);
  return (
    <div>
      <ListItemButton
        onClick={handleRead}
        sx={{
          py: 1.5,
          px: 2.5,
          mt: "1px",
          ...(notification.isUnRead && {
            bgcolor: "action.selected",
          }),
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                color: "text.disabled",
              }}
            >
              <Iconify
                icon="eva:clock-outline"
                sx={{ mr: 0.5, width: 16, height: 16 }}
              />
              {fToNow(notification.createdAt)}
            </Typography>
          }
        />
      </ListItemButton>
      <Dialog
        classes={{ paper: classes.modal }}
        maxWidth="md"
        open={open}
        onClose={handleClose}
      >
        <div className={classes.resultBookticketOrder}>
          <div className={classes.infoTicked}>
            <div className={classes.infoTickedOrder__img}></div>
            <div className={classes.infoTicked__txt}>
              <p className={classes.tenPhim}>
                {notification?.idShowtime.idMovie.name}
              </p>
              <p className={classes.text__first}>
                <span>
                  {notification?.idShowtime.idTheaterCluster.name.split("-")[0]}
                </span>
                <span className={classes.text__second}>
                  -
                  {notification?.idShowtime.idTheaterCluster.name.split("-")[1]}
                </span>
              </p>
              <p className={classes.diaChi}>
                {notification?.idShowtime.idTheaterCluster.address}
              </p>
              <table className={classes.table}>
                <tbody>
                  <tr>
                    <td valign="top">Suất chiếu:</td>
                    <td valign="top">{`${calculateTimeout(
                      notification?.idShowtime.dateShow
                    )} ${
                      formatDate(notification?.idShowtime.dateShow).dDMmYy
                    }`}</td>
                  </tr>
                  <tr>
                    <td valign="top">Phòng chiếu:</td>
                    <td>{notification?.idShowtime.idTheater.name}</td>
                  </tr>
                  <tr>
                    <td valign="top">Ghế:</td>
                    <td>{getIdSeat(notification?.seatList)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div>
              <h3 className={classes.infoResult_label}>Thông tin đặt vé</h3>
              <table className={`${classes.table} table`}>
                <tbody>
                  <tr>
                    <td valign="top">Họ tên:</td>
                    <td>{notification?.userId?.fullName}</td>
                  </tr>
                  <tr>
                    <td valign="top">Điện thoại:</td>
                    <td valign="top">{notification?.userId?.phoneNumber}</td>
                  </tr>
                  <tr>
                    <td valign="top">Email:</td>
                    <td>{notification?.userId?.email}</td>
                  </tr>
                  <tr>
                    <td valign="top">Trạng thái:</td>
                    <td>
                      <span>
                        Đặt vé thành công qua{" "}
                        <span className={classes.paymentColor}>ZaloPay</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top">Khuyến mãi:</td>
                    <td valign="top"></td>
                  </tr>
                  <tr>
                    <td valign="top">Tổng tiền:</td>
                    <td valign="top">
                      <span className="text-lg">
                        <b>{`${notification?.totalPrice.toLocaleString(
                          "vi-VI"
                        )} đ`}</b>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top">Thời gian đặt:</td>
                    <td valign="top">
                      <span className="text-md italic font-medium text-gray-700">
                        {formatDateTimeShow} - {createdAt}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const amountTicket = notification?.seatList.length;
  const movieName = notification?.idShowtime.idMovie.name;
  const theaterName = notification?.idShowtime.idTheaterCluster.name;
  const createdAt = formatDate(notification?.createdAt).dDMmYy;
  let formatDateTimeShow = new Date(notification?.createdAt)
    .toLocaleTimeString([], { hour12: false })
    .slice(0, 5);
  const title = (
    <Typography variant="subtitle2">
      {notification?.userId?.fullName}
      <Typography
        component="span"
        variant="body2"
        sx={{ color: "text.secondary" }}
      >
        &nbsp;đã đặt {amountTicket} vé xem phim {movieName} tại rạp{" "}
        {theaterName} vào lúc {formatDateTimeShow} -{createdAt}
      </Typography>
    </Typography>
  );

  return {
    avatar: notification.userId?.photo ? (
      <img alt={notification.title} src={notification.userId?.photo} />
    ) : null,
    title,
  };
}
