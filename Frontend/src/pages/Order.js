import { Box, Button, Card, Container, DialogContent, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { DialogAnimate } from '../components/animate';
import Iconify from '../components/Iconify';
import Label from '../components/Label';
import StatusOrder from '../components/order-status';
import Scrollbar from '../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom } from '../components/table';
import useSettings from '../hooks/useSettings';
import useTable from '../hooks/useTable';
import useTabs from '../hooks/useTabs';
import { getOrders, updateOrder } from '../redux/slices/order';
import { useDispatch, useSelector } from '../redux/store';
import { PATH_HOME } from '../routes/paths';
import { refundMoMoPayment } from '../redux/slices/payment';

export default function Order() {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { themeStretch } = useSettings();

  const { orders, orderUpdate } = useSelector((state) => state.order);

  const [orderItem, setOrderItem] = useState('');

  const [tableData, setTableData] = useState([]);

  // Ds đơn hàng
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch, orderUpdate]);

  useEffect(() => {
    if (orders?.length) {
      setTableData(orders);
    }
  }, [orders]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (item) => {
    setOpen(true);
    console.log('orderItem', orderItem);
    setOrderItem(item);
  };
  const handleSubmit = async (e) => {
    if (orderItem.paymentMethod.name === 'Thanh toán qua ví Momo') {
      const data = await refundMoMoPayment({
        amount: orderItem.total,
        transId: Number(orderItem.paymentMethod.transId),
      });
      console.log('data?.data', data?.data);
      if (data?.data.resultCode === 0) {
        dispatch(updateOrder(orderItem._id, { status: 'Đã hủy' }));
        setOpen(false);
        setTimeout(() => {
          onFilterStatus(e, 'Đã hủy');
          enqueueSnackbar('Hủy đơn hàng thành công!');
        }, 500);
      } else {
        setOpen(false);
        enqueueSnackbar(data?.data.message, { variant: 'error' });
      }
    } else {
      dispatch(updateOrder(orderItem._id, { status: 'Đã hủy' }));
      setOpen(false);
      setTimeout(() => {
        onFilterStatus(e, 'Đã hủy');
        enqueueSnackbar('Hủy đơn hàng thành công!');
      }, 500);
    }
  };

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const dataFiltered = applySortFilter({
    tableData,
    filterStatus,
  });
  console.log('dataFiltered', dataFiltered);
  const TABS = [
    { value: 'all', label: 'Tất cả', color: 'primary', count: tableData.length },
    { value: 'Đang xử lý', label: 'Đang xử lý', color: 'warning', count: getLengthByStatus('Đang xử lý') },
    {
      value: 'Đang vận chuyển',
      label: 'Đang vận chuyển',
      color: 'info',
      count: getLengthByStatus('Đang vận chuyển'),
    },
    { value: 'Đã giao hàng', label: 'Đã giao hàng', color: 'success', count: getLengthByStatus('Đã giao hàng') },
    { value: 'Đã hủy', label: 'Đã hủy', color: 'error', count: getLengthByStatus('Đã hủy') },
  ];
  return (
    <Box sx={{ paddingBottom: 10 }}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid spacing={3}>
          <Card sx={{ padding: '23px' }}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Đơn hàng của tôi
            </Typography>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={filterStatus}
              onChange={onFilterStatus}
              sx={{
                px: 2,
                bgcolor: 'background.neutral',
                '& .MuiTabs-flexContainer': {
                  justifyContent: 'space-between',
                },
              }}
            >
              {TABS.map((tab) => (
                <Tab
                  sx={{ fontSize: 17, textTransform: 'none' }}
                  disableRipple
                  key={tab.value}
                  value={tab.value}
                  label={
                    <Stack spacing={1} direction="row" alignItems="center">
                      <div>{tab.label}</div> <Label color={tab.color}> {tab.count} </Label>
                    </Stack>
                  }
                />
              ))}
            </Tabs>

            {dataFiltered?.map((order, index) => {
              return (
                <div
                  style={{
                    backgroundColor: 'white',
                    marginTop: '20px',
                    marginBottom: '10px',
                    padding: '20px',
                    boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 5px 2px',
                    borderRadius: '15px',
                    border: '1px solid white',
                  }}
                >
                  <div className="flex ">
                    <StatusOrder status={order.status} />
                    <p className="text-red-400 mb-3 font-semibold uppercase">{order.status}</p>
                  </div>
                  <hr />
                  {order?.orderDetail?.map((item, index) => {
                    return (
                      <div>
                        {' '}
                        <div
                          // key={index}
                          // to={`/productDetail/${item.idProduct.id}`}
                          className="truncate"
                        >
                          {' '}
                          <div className="flex justify-between py-3">
                            <div className="flex">
                              <div>
                                <img
                                  src={item.productImage}
                                  style={{
                                    width: '90px',
                                    height: '90px',
                                    marginRight: 12,
                                  }}
                                  alt={item.name}
                                />
                              </div>
                              <div>
                                <p className="text-black">{item.idProduct.name}</p>
                                <p className="text-gray-500">
                                  Phân loại hàng: {item.idColor.name}, {item.idSize.name}
                                </p>
                                <p className="text-black">Số lượng: {item.quantity}</p>
                              </div>
                            </div>
                            <div>
                              <span className="line-through text-gray-400">
                                {item.idProduct.priceSale.toLocaleString()} đ
                              </span>
                              <span className="text-red-500"> {item.idProduct.price.toLocaleString()} ₫</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <hr />
                  <div className=" text-right leading-4 pt-3">
                    <span className="text-xl  mr-2"> Tổng tiền:</span>
                    <span className="text-red-500 text-lg font-bold"> {order?.total.toLocaleString()} ₫</span>
                  </div>
                  <div className=" flex justify-end">
                    {' '}
                    {/* {order.status === "Đã nhận" ? } */}
                    {order.status === 'Đã nhận' ? (
                      <Button
                        sx={{ marginTop: 2 }}
                        variant="contained"
                        style={{ marginRight: '10px' }}
                        // onClick={() => handleClickOpen(order.id)}
                      >
                        Đánh giá
                      </Button>
                    ) : (
                      ''
                    )}
                    {order.status === 'Đã giao hàng' ? (
                      <Box>
                        {' '}
                        <Button
                          variant="contained"
                          // onClick={() => handleDoneOrder(order.id)}
                          sx={{ marginRight: 2, marginTop: 2 }}
                        >
                          Đã nhận
                        </Button>
                      </Box>
                    ) : (
                      ''
                    )}
                    <Button
                      sx={{ marginTop: 2 }}
                      color="info"
                      variant="outlined"
                      component={RouterLink}
                      to={PATH_HOME.user.view(order?.id)}
                    >
                      Xem chi tiết
                    </Button>
                    {order.status === 'Đang xử lý' ? (
                      <>
                        {' '}
                        <Button
                          sx={{ marginTop: 2 }}
                          color="error"
                          variant="outlined"
                          style={{ marginLeft: '10px' }}
                          onClick={() => handleOpen(order)}
                        >
                          Hủy đơn hàng
                        </Button>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              );
            })}
          </Card>

          <DialogAnimate
            open={open}
            onClose={handleClose}
            onClickSubmit={(e) => handleSubmit(e)}
            isCancel={'Không phải bây giờ'}
            isEdit={'Huỷ đơn hàng'}
          >
            <DialogContent>
              <Box>Bạn chắc chắn muốn hủy đơn hàng này?</Box>
            </DialogContent>
          </DialogAnimate>
        </Grid>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, filterStatus }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  tableData = stabilizedThis.map((el) => el[0]);
  // Lọc theo filter

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  return tableData;
}
