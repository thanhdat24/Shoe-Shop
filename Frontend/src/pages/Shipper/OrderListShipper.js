import { Box, Button, Card, Grid, Typography } from '@mui/material';
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
import { PATH_SHIPPER } from '../../routes/paths';
import { getShippers, getOrderByShipper } from '../../redux/slices/shipper';
import useAuth from '../../hooks/useAuth';

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
  const { user } = useAuth();
  console.log('user123', user);
  const [value, setValue] = React.useState(0);

  const dispatch = useDispatch();

  const [valueBottom, setValueBottom] = React.useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const { shippers, orderShipper } = useSelector((state) => state.shipper);

  console.log('orderShipper', orderShipper);

  useEffect(() => {
    dispatch(getShippers());
    dispatch(getOrderByShipper());
  }, [dispatch]);

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
          </Box>
        </Box>
        {valueBottom === 0 && (
          <Box
            sx={{
              width: '100%',
              margin: '10px 0px',
              height: '560px',
            }}
          >
            <Box sx={{ width: '100%' }}>111111</Box>
          </Box>
        )}
        {valueBottom === 1 && (
          <>
            <Box
              sx={{
                width: '100%',
                margin: '10px 0px',
                height: '560px',
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
                  <Box className="overflow-y-auto " sx={{ height: '31.2rem' }}>
                    <Grid item xs={12} sx={{ padding: 1 }}>
                      <Card sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: 'grid',
                          }}
                        >
                          123
                        </Box>
                      </Card>
                    </Grid>
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Box className="overflow-y-auto " sx={{ height: '31.2rem' }}>
                    2
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <Box className="overflow-y-auto " sx={{ height: '31.2rem' }}>
                    3
                  </Box>
                </TabPanel>
              </Box>
            </Box>
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
          </>
        )}
        {valueBottom === 2 && (
          <Box
            sx={{
              width: '100%',
              margin: '10px 0px',
              height: '560px',
            }}
          >
            <Box>222222</Box>
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
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Đơn hàng" icon={<LocalShippingIcon />} />
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
