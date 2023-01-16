import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
// import SearchIcon from "@mui/icons-material/Search";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import PersonIcon from "@mui/icons-material/Person";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import moment from 'moment';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import EmailIcon from '@mui/icons-material/Email';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Label from '../../components/Label';
import OrderShipperDetail from './OrderShipperDetail';
import { PATH_SHIPPER } from '../../routes/paths';
// import { getOrderList, resetOrder } from '../../redux/action/orderAction';
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  paddingRight: 20,
  marginLeft: 80,

  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  color: 'white',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 80,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',

  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    '&::placeholder': {
      color: 'white',
    },
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export default function OrderListShipper() {
  const [value, setValue] = React.useState(0);
  // const history = useHistory();
  const dispatch = useDispatch();
  const [valueBottom, setValueBottom] = React.useState(0);
  console.log('valueBottom', valueBottom);
  // const { orderList, successUpdateOrder } = useSelector((state) => state.OrderReducer);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    // history.push('/shipper');
    setAnchorEl(null);

    dispatch({ type: 'LOGOUT_SHIPPER' });
  };
  // const handleLogout = () => {
  //   console.log("1414");

  // };
  const shipper = JSON.parse(localStorage.getItem('shipper'));
  console.log('shipper', shipper);
  // useEffect(() => {
  //   if (orderList === null) dispatch(getOrderList());
  //   return () => dispatch(resetOrder());
  // }, [orderList]);

  // useEffect(() => {
  //   if (successUpdateOrder) {
  //     dispatch(getOrderList());
  //   }
  // }, [successUpdateOrder]);
  // const order = orderList?.data?.filter((item) => item.shipper?.id === shipper.user.id);
  // console.log('order', order);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeDetail = (id) => {
    // history.push(`/orderListShipper/${id}`);
  };

  return (
    <div className="h-full">
      <div
        className=" mx-auto text-center bg-white md:w-96 relative "
        style={{
          boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 5px 2px',
          borderRadius: '15px',
          border: '1px solid white',
        }}
      >
        {valueBottom === 0 ? (
          <Box>
            {' '}
            <Box sx={{ backgroundColor: '#57b159', height: '160px' }}>
              {' '}
              <Typography
                sx={{
                  color: 'white',
                  padding: '50px 0 20px 0',
                  fontSize: '25px',
                  fontWeight: 'bold',
                }}
              >
                My Shipments
              </Typography>
              <Box sx={{ marginRight: '20px' }}>
                {/* <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    classnName="placeholder:text-slate-400"
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search> */}
              </Box>
            </Box>
            <Box
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                margin: '10px 0px',
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    {' '}
                    <Tab label="Tất cả" {...a11yProps(0)} />
                    <Tab label="Đang giao" {...a11yProps(1)} />
                    <Tab label="Đã giao" {...a11yProps(2)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  {/* <div className="overflow-scroll"> */}
                  <Box className="overflow-y-auto " sx={{ height: '31.2rem' }}>
                    {/* {order?.map((orderDetailShip, index) => {
                      return (
                        <Box
                          orderDetailShip={orderDetailShip}
                          onClick={() => handleChangeDetail(orderDetailShip?.id)}
                          sx={{
                            maxWidth: 580,
                            padding: '15px',
                            margin: '8px',
                            display: 'flex',
                            borderRadius: '10px',
                            backgroundColor: '#f3f3f3',
                            justifyContent: 'space-between',
                            '&:last-child': {
                              marginBottom: '80px',
                            },
                          }}
                        >
                          <div className="flex justify-center">
                            {' '}
                            <div>
                              {' '}
                              <p>#{orderDetailShip?.id}</p>
                              <p>
                                {orderDetailShip?.address?.fullName} - {orderDetailShip?.address?.phoneNumber}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p> {orderDetailShip?.totalPrice.toLocaleString()} ₫</p>
                            <Label
                              variant="ghost"
                              color={
                                // orderDetailShip?.status === "Đang xử lý"
                                //   ? "default"
                                // :
                                orderDetailShip?.status === 'Đang vận chuyển' ? 'info' : 'success'
                                // orderDetailShip?.status === "Đã giao hàng"
                                // ?
                                // : orderDetailShip?.status === "Đã nhận"
                                // ? "success"
                                // : orderDetailShip?.status === "Đã đánh giá"
                                // ? "warning"
                                // : "error"
                              }
                            >
                              <span style={{ fontSize: '0.68rem' }}>
                                {orderDetailShip?.status === 'Đang vận chuyển' ? 'Đang vận chuyển' : 'Đã giao hàng'}
                              </span>
                            </Label>
                          </div>
                        </Box>
                      );
                    })} */}
                  </Box>
                  {/* </div> */}
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Box className="overflow-y-auto " sx={{ height: '31.2rem' }}>
                    {/* {order
                      ?.filter((state) => state.status === 'Đang vận chuyển')
                      ?.map((orderDetailShip, index) => {
                        return (
                          <Box
                            orderDetailShip={orderDetailShip}
                            onClick={() => handleChangeDetail(orderDetailShip?.id)}
                            sx={{
                              maxWidth: 580,
                              padding: '15px',
                              margin: '8px',
                              display: 'flex',
                              borderRadius: '10px',
                              backgroundColor: '#f3f3f3',
                              justifyContent: 'space-between',
                              '&:last-child': {
                                marginBottom: '80px',
                              },
                            }}
                          >
                            <div className="flex justify-center">
                              {' '}
                              <div>
                                {' '}
                                <p>#{orderDetailShip?.id}</p>
                                <p>
                                  {orderDetailShip?.address?.fullName} - {orderDetailShip?.address?.phoneNumber}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p> {orderDetailShip?.totalPrice.toLocaleString()} ₫</p>
                              <Label
                                sx={{ fontSize: '11px' }}
                                variant="ghost"
                                // color={
                                //   orderDetailShip?.status === 'Đang xử lý'
                                //     ? 'default'
                                //     : orderDetailShip?.status === 'Đang vận chuyển'
                                //     ? 'info'
                                //     : orderDetailShip?.status === 'Đã giao hàng'
                                //     ? 'success'
                                //     : orderDetailShip?.status === 'Đã nhận'
                                //     ? 'success'
                                //     : orderDetailShip?.status === 'Đã đánh giá'
                                //     ? 'warning'
                                //     : 'error'
                                // }
                              >
                                {orderDetailShip?.status}
                              </Label>
                            </div>
                          </Box>
                        );
                      })} */}
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <Box className="overflow-y-auto " sx={{ height: '31.2rem' }}>
                    {' '}
                    {/* {order
                      ?.filter((state) => state.status !== 'Đang xử lý' && state.status !== 'Đang vận chuyển')
                      .map((orderDetailShip, index) => {
                        return (
                          <Box
                            orderDetailShip={orderDetailShip}
                            onClick={() => handleChangeDetail(orderDetailShip?.id)}
                            sx={{
                              maxWidth: 580,
                              padding: '15px',
                              margin: '8px',
                              display: 'flex',
                              borderRadius: '10px',
                              fontSize: '13px',
                              backgroundColor: '#f3f3f3',
                              justifyContent: 'space-between',
                              '&:last-child': {
                                marginBottom: '80px',
                              },
                            }}
                          >
                            <div className="flex justify-center">
                              {' '}
                              <div>
                                {' '}
                                <p>#{orderDetailShip?.id}</p>
                                <p>
                                  {orderDetailShip?.address?.fullName} - {orderDetailShip?.address?.phoneNumber}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p> {orderDetailShip?.totalPrice.toLocaleString()} ₫</p>
                              <Label color="primary">Đã giao hàng</Label>
                            </div>
                          </Box>
                        );
                      })} */}
                  </Box>
                </TabPanel>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ backgroundColor: '#e7edef' }} className="h-screen">
            {' '}
            <>
              {/* <MoreVertIcon onClick={handleClick} className="absolute right-5 top-5 " style={{ color: 'white' }} /> */}
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                // onClose={handleClose}
              >
                <MenuItem onClick={handleClose} disableRipple>
                  Đăng xuất
                </MenuItem>
              </StyledMenu>
            </>
            <Box
              sx={{
                backgroundColor: '#57b159',
                height: '160px',
                paddingTop: '90px',
              }}
            >
              <div className="w-32 h-32 relative m-auto rounded-full p-2 border-2 border-dashed border-gray-200 flex  ">
                <Avatar
                  {...stringAvatar(shipper?.user.name)}
                  sx={{
                    width: 110,
                    height: 110,
                    margin: '0 auto',
                    fontSize: '40px',
                  }}
                  // className="w-full h-full object-cover mt-5"
                />
              </div>{' '}
              {/* <div className="w-36 h-36 relative m-auto rounded-full p-2 border-2 border-dashed border-gray-200 flex">
                <label className="w-full h-full outline-none overflow-hidden rounded-full bottom-6 right-1.5 items-center justify-center absolute flex cursor-pointer  ">
                  <span className="overflow-hidden z-10 w-full h-full block  ">
                    <span className=" w-full h-full bg-cover inline-block">
                      <img
                        src="../../../../img/dk.svg"
                        alt="avatar"
                       
                      />
                    </span>
                  </span>
                </label>
              </div> */}
            </Box>
            <Box
              sx={{
                background: 'white',
                height: 'auto',

                marginTop: '90px',
                marginBottom: '10px',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  {/* <PersonIcon /> */}
                </Grid>
                <Grid item xs={10}>
                  <div className="text-left leading-5">
                    {' '}
                    <p className="m-0">Họ và tên </p>
                    <p>{shipper?.user.name}</p>
                  </div>
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                background: 'white',
                height: 'auto',
                marginTop: '20px',
                marginBottom: '10px',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  {/* <PhoneIcon /> */}
                </Grid>
                <Grid item xs={10}>
                  <div className="text-left leading-5">
                    {' '}
                    <p className="m-0">Số điện thoại </p>
                    <p>{shipper?.user.phoneNumber}</p>
                  </div>
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                background: 'white',
                height: 'auto',
                marginTop: '20px',
                marginBottom: '10px',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  {/* <CalendarMonthIcon /> */}
                </Grid>
                <Grid item xs={10}>
                  <div className="text-left leading-5">
                    {' '}
                    <p className="m-0">Ngày sinh</p>
                    <p>{moment(shipper?.user.dateOfBirth)?.format('DD/MM/YYYY')}</p>
                  </div>
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                background: 'white',
                height: 'auto',
                marginTop: '20px',
                marginBottom: '10px',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  {/* <EmailIcon /> */}
                </Grid>
                <Grid item xs={10}>
                  <div className="text-left leading-5">
                    {' '}
                    <p className="m-0">Email</p>
                    <p>{shipper?.user.email}</p>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        <Box
          sx={{
            // borderTop:"1px solid gray",
            overflow: 'hidden',
            position: 'absolute',
            bottom: 0,

            width: '100%',
            boxShadow: 'rgb(100 100 111 / 18%) 1px -2px 8px 4px',
          }}
        >
          <BottomNavigation
            showLabels
            value={valueBottom}
            onChange={(event, newValue) => {
              setValueBottom(newValue);
            }}
          >
            <BottomNavigationAction
              component={RouterLink}
              to={PATH_SHIPPER.shipper.root}
              label="Home"
              icon={<HomeIcon />}
            />
            <BottomNavigationAction
              component={RouterLink}
              to={PATH_SHIPPER.shipper.order}
              label="Đơn hàng"
              icon={<LocalShippingIcon />}
            />
            <BottomNavigationAction
              // component={RouterLink}
              // to={PATH_SHIPPER.shipper.account}
              label="Cá nhân"
              icon={<AccountCircleIcon />}
            />
          </BottomNavigation>
        </Box>
      </div>
    </div>
  );
}
