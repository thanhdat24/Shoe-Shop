import { Box, Button, Card, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import PlaceIcon from '@mui/icons-material/Place';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
// import SearchIcon from "@mui/icons-material/Search";
import Tabs from '@mui/material/Tabs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tab from '@mui/material/Tab';
// import PersonIcon from "@mui/icons-material/Person";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink as RouterLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
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
        className=" mx-auto text-center bg-white relative"
        style={{
          boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 5px 2px',
          position: 'relative',
          border: '1px solid white',
          maxWidth: '475px',
          margin: { xs: 2.5, md: 3 },
          '& > *': {
            flexGrow: 1,
            flexBasis: '50%',
          },
        }}
      >
        {valueBottom === 0 && (
          <Box>
            <Card className="m-8">
              {' '}
              <Grid container sx={{ p: '15px' }} spacing={2}>
                <Grid item xs={6} sm={6} md={6}>
                  <Box
                    style={{ backgroundColor: '#effbf9', padding: '15px 10px', borderRadius: '15px', lineHeight: 2.5 }}
                  >
                    <CheckCircleIcon
                      sx={{ color: '#90e9d5', width: '30px', height: '30px' }}
                      style={{ fontSize: '36px !important' }}
                    />
                    <Typography variant="subtitle2">Đã giao </Typography>
                    <Typography variant="h4">26</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <Box
                    style={{ backgroundColor: '#fdf9ee', padding: '15px 10px', borderRadius: '15px', lineHeight: 2.5 }}
                  >
                    <DeliveryDiningIcon
                      sx={{
                        color: '#ddb840',
                        width: '30px',
                        height: '30px',
                      }}
                      style={{ fontSize: '50px !important' }}
                    />
                    <Typography variant="subtitle2">Đang vận chuyển</Typography>
                    <Typography variant="h4">26</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <Box
                    style={{ backgroundColor: '#fcebf1', padding: '15px 10px', borderRadius: '15px', lineHeight: 2.5 }}
                  >
                    <CheckCircleIcon
                      sx={{ color: '#f0588c', width: '30px', height: '30px' }}
                      style={{ fontSize: '36px !important' }}
                    />
                    <Typography variant="subtitle2">Đã giao </Typography>
                    <Typography variant="h4">26</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6} md={6}>
                  <Box
                    style={{ backgroundColor: '#f0f5fb', padding: '15px 10px', borderRadius: '15px', lineHeight: 2.5 }}
                  >
                    <CheckCircleIcon
                      sx={{ color: '#66a6dd', width: '30px', height: '30px' }}
                      style={{ fontSize: '36px !important' }}
                    />
                    <Typography variant="subtitle2">Đã giao </Typography>
                    <Typography variant="h4">26</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
            <Typography align="left" variant="h6" sx={{ marginLeft: '32px' }}>
              Đơn hàng mới
            </Typography>
            <Box sx={{ maxHeight: 255, overflow: 'auto', marginBottom: '50px' }}>
              {' '}
              <Card className="mx-8 my-3">
                <Box>
                  <Grid container>
                    <Grid item xs={4} md={4} sx={{ padding: '10px' }}>
                      <Box>
                        {' '}
                        <img
                          style={{ borderRadius: '10px', height: '115px' }}
                          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1099&q=80"
                          alt="35"
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      md={8}
                      sx={{
                        padding: '10px 5px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                      }}
                    >
                      <Typography align="left" variant="subtitle2">
                        Teen khach
                      </Typography>
                      <Box className="flex ">
                        {' '}
                        <PlaceIcon color="primary" />
                        <Typography align="left" variant="body2">
                          DDiaj chi
                        </Typography>
                      </Box>
                      <Box className="flex">
                        <QueryBuilderIcon color="primary" />
                        <Typography align="left" variant="body2">
                          time
                        </Typography>
                      </Box>
                      <Box className="flex ">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className="mr-2"
                          sx={{ marginRight: '10px' }}
                        >
                          <Typography variant="body2"> Đồng ý</Typography>
                        </Button>
                        <Button variant="contained" color="error" size="small">
                          <Typography variant="body2"> Từ chối</Typography>
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
              <Card className="mx-8 my-3">
                <Box>
                  <Grid container>
                    <Grid item xs={4} md={4} sx={{ padding: '10px' }}>
                      <Box>
                        {' '}
                        <img
                          style={{ borderRadius: '10px', height: '115px' }}
                          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1099&q=80"
                          alt="35"
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      md={8}
                      sx={{
                        padding: '10px 5px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                      }}
                    >
                      <Typography align="left" variant="subtitle2">
                        Teen khach
                      </Typography>
                      <Box className="flex ">
                        {' '}
                        <PlaceIcon color="primary" />
                        <Typography align="left" variant="body2">
                          DDiaj chi
                        </Typography>
                      </Box>
                      <Box className="flex">
                        <QueryBuilderIcon color="primary" />
                        <Typography align="left" variant="body2">
                          time
                        </Typography>
                      </Box>
                      <Box className="flex ">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className="mr-2"
                          sx={{ marginRight: '10px' }}
                        >
                          <Typography variant="body2"> Đồng ý</Typography>
                        </Button>
                        <Button variant="contained" color="error" size="small">
                          <Typography variant="body2"> Từ chối</Typography>
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
              <Card className="mx-8 my-3">
                <Box>
                  <Grid container>
                    <Grid item xs={4} md={4} sx={{ padding: '10px' }}>
                      <Box>
                        {' '}
                        <img
                          style={{ borderRadius: '10px', height: '115px' }}
                          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1099&q=80"
                          alt="35"
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      md={8}
                      sx={{
                        padding: '10px 5px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                      }}
                    >
                      <Typography align="left" variant="subtitle2">
                        Teen khach
                      </Typography>
                      <Box className="flex ">
                        {' '}
                        <PlaceIcon color="primary" />
                        <Typography align="left" variant="body2">
                          DDiaj chi
                        </Typography>
                      </Box>
                      <Box className="flex">
                        <QueryBuilderIcon color="primary" />
                        <Typography align="left" variant="body2">
                          time
                        </Typography>
                      </Box>
                      <Box className="flex ">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className="mr-2"
                          sx={{ marginRight: '10px' }}
                        >
                          <Typography variant="body2"> Đồng ý</Typography>
                        </Button>
                        <Button variant="contained" color="error" size="small">
                          <Typography variant="body2"> Từ chối</Typography>
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Box>
          </Box>
        )}
        {valueBottom === 1 && (
          <>
            <Box
              sx={{
                width: '100%',
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
            left: 0,
            right: 0,
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
