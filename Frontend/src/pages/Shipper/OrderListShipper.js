import { Box, Button, Card, DialogContent, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PlaceIcon from '@mui/icons-material/Place';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
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
import { useTheme } from '@mui/material/styles';
import { Link, NavLink as RouterLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
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
import useTabs from '../../hooks/useTabs';
import { fCurrency } from '../../utils/formatNumber';
import Iconify from '../../components/Iconify';
import { DialogAnimate } from '../../components/animate';
import { updateOrder } from '../../redux/slices/order';

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
  const theme = useTheme();

  const [tableData, setTableData] = useState([]);

  const { user } = useAuth();

  const [value, setValue] = React.useState(0);

  const dispatch = useDispatch();

  const [valueBottom, setValueBottom] = React.useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const { shippers, orderShipper } = useSelector((state) => state.shipper);

  const { orders, orderUpdate } = useSelector((state) => state.order);

  const [openDialog, setOpenDialog] = useState(false);

  console.log('orderShipper', orderShipper);

  useEffect(() => {
    dispatch(getShippers());
    dispatch(getOrderByShipper());
  }, [dispatch, orderUpdate]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCancel = (item) => {
    console.log('item123', item);
    dispatch(updateOrder(item._id, { ...item, status: 'Đang xử lý' }));
  };

  useEffect(() => {
    if (orderShipper?.length) {
      setTableData(orderShipper);
    }
  }, [orderShipper]);

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeDetail = (id) => {
    // history.push(`/orderListShipper/${id}`);
  };

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const dataFiltered = applySortFilter({
    tableData,
    filterStatus,
  });

  console.log('dataFiltered', dataFiltered);

  const TABS = [
    {
      value: 'all',
      label: 'Tất cả',
      color: 'primary',
      count: tableData.filter((item) => item.status !== 'Đang xử lý').length,
    },
    {
      value: 'Đang vận chuyển',
      label: 'Đang vận chuyển',
      color: 'info',
      count: getLengthByStatus('Đang vận chuyển'),
    },
    { value: 'Đã giao hàng', label: 'Đã giao hàng', color: 'success', count: getLengthByStatus('Đã giao hàng') },
    { value: 'Hoàn trả', label: 'Hoàn trả', color: 'error', count: getLengthByStatus('Hoàn trả') },
  ];

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
            <Card className="m-4">
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
                    <Typography variant="h4">{getLengthByStatus('Đã giao hàng')}</Typography>
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
                    <Typography variant="h4">{getLengthByStatus('Đang vận chuyển')}</Typography>
                  </Box>
                </Grid>
                {/* <Grid item xs={6} sm={6} md={6}>
                  <Box
                    style={{ backgroundColor: '#fcebf1', padding: '15px 10px', borderRadius: '15px', lineHeight: 2.5 }}
                  >
                    <CancelIcon
                      sx={{ color: '#f0588c', width: '30px', height: '30px' }}
                      style={{ fontSize: '36px !important' }}
                    />
                    <Typography variant="subtitle2">Đã hủy </Typography>
                    <Typography variant="h4">26</Typography>
                  </Box>
                </Grid> */}
                <Grid item xs={6} sm={6} md={6}>
                  <Box
                    style={{ backgroundColor: '#f0f5fb', padding: '15px 10px', borderRadius: '15px', lineHeight: 2.5 }}
                  >
                    <SettingsBackupRestoreIcon
                      sx={{ color: '#66a6dd', width: '30px', height: '30px' }}
                      style={{ fontSize: '36px !important' }}
                    />
                    <Typography variant="subtitle2">Hoàn trả</Typography>
                    <Typography variant="h4">26</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
            <Typography align="left" variant="h6" sx={{ marginLeft: '16px' }}>
              Đơn hàng mới
            </Typography>
            <Box sx={{ minHeight: '45vh', overflow: 'auto', marginBottom: '50px' }}>
              {' '}
              {orderShipper
                ?.filter((item) => item.status === 'Đang vận chuyển')
                ?.map((item, index) => {
                  return (
                    <Card className="mx-4 my-5">
                      <Box>
                        <Grid container>
                          <Grid item xs={4} md={4} sx={{ padding: '10px' }}>
                            <Box>
                              {' '}
                              <img
                                style={{ borderRadius: '10px', height: '115px' }}
                                src={item.orderDetail[0].productImage}
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
                              {item.address.fullName}
                            </Typography>
                            <Box className="flex ">
                              {' '}
                              <PlaceIcon color="primary" sx={{ marginRight: '5px' }} />
                              <Typography align="left" variant="body2">
                                {item.address.fullAddress}
                              </Typography>
                            </Box>
                            <Box className="flex">
                              <QueryBuilderIcon color="primary" sx={{ marginRight: '5px' }} />
                              <Typography align="left" variant="body2">
                                {fCurrency(item.total)} ₫
                              </Typography>
                            </Box>
                            <Box className="flex mt-2">
                              <Button
                                onClick={() => {
                                  setOpenDialog(true);
                                  // setGetID(item)
                                }}
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ textTransform: 'none' }}
                                className="mr-2 "
                                sx={{ marginRight: '10px' }}
                              >
                                Đồng ý
                              </Button>
                              <DialogAnimate
                                open={openDialog}
                                onClose={handleCloseDialog}
                                onClickSubmit={(e) => handleAccept(item)}
                                isCancel={'Hủy'}
                                isEdit={'Xác nhận'}
                              >
                                <DialogContent>
                                  <Box>Bạn đã giao hàng thành công?</Box>
                                </DialogContent>
                              </DialogAnimate>
                              <Button
                                variant="contained"
                                style={{ textTransform: 'none' }}
                                color="error"
                                size="small"
                                onClick={() => handleCancel(item)}
                              >
                                Từ chối
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  );
                })}
            </Box>
          </Box>
        )}
        {valueBottom === 1 && (
          <>
            <Box
              sx={{
                width: '100%',
                // margin: '10px 0px',
              }}
            >
              <>
                <Card
                  sx={{
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Box sx={{ position: 'absolute', top: '42%', left: '30px' }}>
                    <Link component={RouterLink} to="/shipper/dashboard" onClick={() => setValueBottom(0)}>
                      <Iconify icon={'eva:arrow-ios-back-fill'} width={25} height={25} />
                    </Link>
                  </Box>
                  <Box sx={{ position: 'absolute', top: '42%', fontWeight: 600 }}>Đơn hàng</Box>
                </Card>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                      allowScrollButtonsMobile
                      variant="scrollable"
                      scrollButtons="auto"
                      value={filterStatus}
                      onChange={onFilterStatus}
                      centered
                    >
                      {TABS.map((tab) => (
                        <Tab
                          // sx={{ fontSize: 17, textTransform: 'none' }}
                          // disableRipple
                          sx={{ marginRight: '10px !important' }}
                          key={tab.value}
                          value={tab.value}
                          label={
                            <Stack spacing={1} direction="row" alignItems="center">
                              <div>{tab.label}</div>{' '}
                              <Label sx={{ marginLeft: '5px !important' }} color={tab.color}>
                                {' '}
                                {tab.count}{' '}
                              </Label>
                            </Stack>
                          }
                        />
                      ))}
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    <Box className="overflow-y-auto " sx={{ height: '31.2rem' }}>
                      <Grid item xs={12} sx={{ padding: 1 }}>
                        {dataFiltered?.map((item) => {
                          return (
                            <Link component={RouterLink} to={PATH_SHIPPER.shipper.view(item._id)}>
                              <Card p={3} sx={{ marginBottom: 2 }}>
                                <Grid container>
                                  <Grid item xs={4} md={4} sx={{ padding: '10px' }}>
                                    <Box>
                                      {' '}
                                      <img
                                        style={{ borderRadius: '10px', height: '115px' }}
                                        src={item.orderDetail[0].productImage}
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
                                      {item.orderDetail[0].idProduct.name}
                                    </Typography>
                                    <Box className="flex mt-2">
                                      {' '}
                                      <PlaceIcon color="primary" />
                                      <Typography align="left" variant="body2">
                                        {item.address.fullAddress}
                                      </Typography>
                                    </Box>
                                    <Box className="flex py-3">
                                      <QueryBuilderIcon color="primary" />
                                      <Typography align="left" variant="body2">
                                        time
                                      </Typography>
                                    </Box>
                                    <Box className="flex mb-2">
                                      <Typography align="left" variant="body2">
                                        Tổng tiền {fCurrency(item.total)}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                                      <Label
                                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                        color={
                                          (item.status === 'Đã giao hàng' && 'success') ||
                                          (item.status === 'Đang vận chuyển' && 'info') ||
                                          (item.status === 'Đã đánh giá' && 'primary') ||
                                          (item.status === 'Đã hủy' && 'error') ||
                                          'default'
                                        }
                                        sx={{ fontSize: 14 }}
                                      >
                                        {item.status}
                                      </Label>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Card>
                            </Link>
                          );
                        })}
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
              </>
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
            <BottomNavigationAction label="Tài khoản" icon={<AccountCircleIcon />} />
          </BottomNavigation>
        </Box>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, filterStatus }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  tableData = stabilizedThis.map((el) => el[0]);
  // Lọc theo filter
  if (filterStatus === 'all') {
    tableData = tableData.filter((item) => item.status !== 'Đang xử lý');
  }
  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  console.log('tableData', tableData);
  return tableData;
}
