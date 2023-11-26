import { Box, Button, Card, DialogContent, Grid, ListItemButton, ListItemIcon, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import PlaceIcon from '@mui/icons-material/Place';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
// import SearchIcon from "@mui/icons-material/Search";
import Tabs from '@mui/material/Tabs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tab from '@mui/material/Tab';
// import PersonIcon from "@mui/icons-material/Person";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import { Link, NavLink as RouterLink, useNavigate } from 'react-router-dom';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import EmailIcon from '@mui/icons-material/Email';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Label from '../../components/Label';
import { PATH_SHIPPER } from '../../routes/paths';
import { getShippers, getOrderByShipper } from '../../redux/slices/shipper';
import { navConfig } from './NavConfig';
import useAuth from '../../hooks/useAuth';
import useTabs from '../../hooks/useTabs';
import { fCurrency } from '../../utils/formatNumber';
import Iconify from '../../components/Iconify';
import { DialogAnimate } from '../../components/animate';
import { updateOrder } from '../../redux/slices/order';
import SvgIconStyle from '../../components/SvgIconStyle';
import { ICON, NAVBAR } from '../../config';
import useIsMountedRef from '../../hooks/useIsMountedRef';

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

export const ListItemStyle = styled(
  ListItemButton,
  {}
)(({ theme }) => ({
  ...theme.typography.body2,
  position: 'relative',
  height: NAVBAR.DASHBOARD_ITEM_ROOT_HEIGHT,
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
}));

export const ListItemIconStyle = styled(ListItemIcon)({
  width: ICON.NAVBAR_ITEM,
  height: ICON.NAVBAR_ITEM,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: '100%', height: '100%' },
  marginRight: '0px',
  color: 'white',
});

export default function OrderListShipper() {
  const navigate = useNavigate();

  const theme = useTheme();

  const [tableData, setTableData] = useState([]);

  const { user, logoutAdmin } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const [value, setValue] = React.useState(0);

  const dispatch = useDispatch();

  const [valueBottom, setValueBottom] = React.useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const { shippers, orderShipper } = useSelector((state) => state.shipper);

  const { orderUpdate } = useSelector((state) => state.order);

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(getShippers());
    dispatch(getOrderByShipper());
  }, [dispatch, orderUpdate]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleAccept = (item) => {
    dispatch(updateOrder(item._id, { ...item, status: 'Đã giao hàng' }));
  };
  const handleCancel = (item) => {
    dispatch(updateOrder(item._id, { ...item, status: 'Đang xử lý' }));
  };

  useEffect(() => {
    if (orderShipper?.length) {
      setTableData(orderShipper);
    }
  }, [orderShipper]);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const getLengthComplete = () =>
    tableData.filter(
      (item) => item.status === 'Đã giao hàng' || item.status === 'Đã nhận' || item.status === 'Đã đánh giá'
    ).length;

  const dataFiltered = applySortFilter({
    tableData,
    filterStatus,
  });

  const TABS = [
    {
      value: 'all',
      label: 'Tất cả',
      color: 'primary',
      count: tableData.filter((item) => item.status !== 'Đang xử lý' && item.status !== 'Đã hủy').length,
    },
    {
      value: 'Đang vận chuyển',
      label: 'Đang vận chuyển',
      color: 'info',
      count: getLengthByStatus('Đang vận chuyển'),
    },
    { value: 'Hoàn thành', label: 'Hoàn thành', color: 'success', count: getLengthComplete() },
    { value: 'Hoàn trả', label: 'Hoàn trả', color: 'error', count: getLengthByStatus('Hoàn trả') },
  ];
  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate(PATH_SHIPPER.shipper.login, { replace: true });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <div className="h-full">
      {valueBottom === 0 && (
        <Box>
          <Card className="mx-4">
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
                    <Link component={RouterLink} to={PATH_SHIPPER.shipper.view(item._id)}>
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
                        </Grid>
                      </Grid>
                    </Link>
                    <Box className="flex mb-2 justify-center">
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
                        Đã giao
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
                  </Card>
                );
              })}
          </Box>
        </Box>
      )}
      {valueBottom === 1 && (
        <>
          <Card
            sx={{
              height: 100,
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
      )}
      {valueBottom === 2 && (
        <>
          <Card
            sx={{
              height: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // marginBottom: '20px',
              overflow: 'inherit !important',
              backgroundColor: 'orange',
            }}
          >
            <Box className="absolute h-28 w-28 rounded-full left-1/2 transform  translate-y-1/2 -translate-x-1/2 border-4 border-white ring-4 ring-green-400 0 cursor-pointer">
              <Box className="relative flex-shrink-0 w-full h-full">
                <img
                  className="h-full w-full select-none bg-white rounded-full object-cover flex-shrink-0 filter hover:brightness-110"
                  src={user.photoURL}
                  alt="ph"
                  referrerpolicy="no-referrer"
                />
              </Box>
            </Box>
          </Card>
          <Box sx={{ width: '100%', marginTop: 6 }}>
            <Typography variant="h5">{user.displayName}</Typography>
            <Typography variant="subtitle3">{user.email}</Typography>
          </Box>
          <Box>
            <Stack sx={{ p: 1 }}>
              {navConfig.map((item) => (
                <ListItemStyle className="flex" to={item.href} component={RouterLink}>
                  <Box
                    className="h-8 w-8  rounded-full flex justify-center items-center mr-3"
                    sx={{ backgroundColor: item.color }}
                  >
                    <ListItemIconStyle>{item.icon}</ListItemIconStyle>
                  </Box>
                  <Typography variant="subtitle1">{item.subheader}</Typography>
                </ListItemStyle>
              ))}

              <ListItemStyle className="flex" onClick={handleLogout}>
                <Box
                  className="h-8 w-8  rounded-full flex justify-center items-center mr-3"
                  sx={{ backgroundColor: '#442BBA' }}
                >
                  <ListItemIconStyle>
                    <SvgIconStyle src="/icons/ic_logout.svg" sx={{ width: 1, height: 1 }} />
                  </ListItemIconStyle>
                </Box>
                <Typography variant="subtitle1">Đăng xuất</Typography>
              </ListItemStyle>
            </Stack>
          </Box>
        </>
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
          <BottomNavigationAction label="Trang chủ" icon={<HomeIcon />} />
          <BottomNavigationAction label="Đơn hàng" icon={<LocalShippingIcon />} />
          <BottomNavigationAction label="Tài khoản" icon={<AccountCircleIcon />} />
        </BottomNavigation>
      </Box>
    </div>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, filterStatus }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  tableData = stabilizedThis.map((el) => el[0]);
  // Lọc theo filter

  if (filterStatus !== 'all' && filterStatus !== 'Hoàn thành') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  } else {
    tableData = tableData.filter(
      (item) => item.status === 'Đã giao hàng' || item.status === 'Đã nhận' || item.status === 'Đã đánh giá'
    );
  }


  return tableData;
}
