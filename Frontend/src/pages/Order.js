import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
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
import { getMeOrder, getOrders, updateOrder } from '../redux/slices/order';
import { useDispatch, useSelector } from '../redux/store';
import { PATH_HOME } from '../routes/paths';
import { refundMoMoPayment } from '../redux/slices/payment';
import { fCurrency } from '../utils/formatNumber';
import RatingItem from './RatingItem';
import { changeRating, createRating } from '../redux/slices/rating';

export default function Order() {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const [confirmOrder, setConfirmOrder] = useState(false);

  const [ratingOrder, setRatingOrder] = useState(false);

  const dispatch = useDispatch();

  const { themeStretch } = useSettings();

  const { orders, orderUpdate, orderUser } = useSelector((state) => state.order);

  const { successRating, ratingList } = useSelector((state) => state.rating);

  const [orderItem, setOrderItem] = useState('');

  const [itemReview, setItemReview] = useState('');

  const groupByItemReview = _(itemReview.orderDetail)
    .groupBy((x) => x.idProduct.id)
    .map((value, key) => ({ idProduct: key, productDetail: value }))
    .value();

  const [tableData, setTableData] = useState([]);

  // Ds đơn hàng
  useEffect(() => {
    dispatch(getMeOrder());
  }, [dispatch, orderUpdate, successRating]);

  useEffect(() => {
    if (orderUser?.length) {
      setTableData(orderUser);
    }
  }, [orderUser]);

  const handleClose = () => {
    dispatch(changeRating({ resetRatingList: '' }));
    setOpen(false);
    setConfirmOrder(false);
    setRatingOrder(false);
  };
  const handleOpen = (item) => {
    setOpen(true);
    setOrderItem(item);
  };
  const handleSubmit = async (e) => {
    if (orderItem.paymentMethod.name === 'Thanh toán qua ví Momo') {
      const data = await refundMoMoPayment({
        amount: orderItem.total,
        transId: Number(orderItem.paymentMethod.transId),
      });
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

  const handleConfirmOrder = (e) => {
    dispatch(updateOrder(orderItem, { status: 'Đã nhận' }));
    setConfirmOrder(false);
    setTimeout(() => {
      enqueueSnackbar('Xác nhận thành công!');
    }, 500);
  };

  const handleReviewOrder = (e) => {
    dispatch(createRating(ratingList));
    setRatingOrder(false);
    setTimeout(() => {
      onFilterStatus(e, 'Hoàn thành');
      enqueueSnackbar('Xời, tuyệt vời! Cảm ơn bạn');
      dispatch(changeRating({ resetRatingList: '' }));
    }, 500);
  };

  const handleOpenConfirmOrder = (id) => {
    setOrderItem(id);
    setConfirmOrder(true);
  };
  const handleOpenReview = (item) => {
    setItemReview(item);
    setRatingOrder(true);
  };

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const getLengthComplete = () =>
    tableData.filter((item) => item.status === 'Đã nhận' || item.status === 'Đã đánh giá').length;

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
    { value: 'Hoàn thành', label: 'Hoàn thành', color: 'success', count: getLengthComplete() },
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
                  sx={{ fontSize: 15, textTransform: 'none', marginRight: '10px !important' }}
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
                  <div className="flex mb-3 items-center">
                    <StatusOrder status={order.status} />
                    <p className="text-red-400 font-semibold uppercase mr-5">{order.status}</p>
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
                              {item.idProduct.priceSale !== 0 && (
                                <span className="line-through text-gray-400">
                                  {fCurrency(item.idProduct.priceSale)} ₫
                                </span>
                              )}

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
                        onClick={() => handleOpenReview(order)}
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
                          onClick={() => handleOpenConfirmOrder(order._id)}
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

          <DialogAnimate
            open={confirmOrder}
            onClose={handleClose}
            onClickSubmit={(e) => handleConfirmOrder(e)}
            isCancel={'Không phải bây giờ'}
            isEdit={'Xác nhận'}
          >
            <DialogContent>
              <Box>Xác nhận đã nhận được hàng?</Box>
            </DialogContent>
          </DialogAnimate>

          <Dialog
            fullWidth
            maxWidth="sm"
            // sx={{ maxWidth: '655px !important' }}
            sx={{
              '& .MuiDialog-container': {
                '& .MuiPaper-root': {
                  width: '100%',
                  maxWidth: '670px !important', // Set your width here
                },
              },
            }}
            open={ratingOrder}
            onClose={handleClose}
            // onClickSubmit={(e) => handleReviewOrder(e)}
          >
            <Paper>
              <DialogContent sx={{ paddingBottom: '0px !important' }}>
                {groupByItemReview?.map((item, index) => (
                  <RatingItem itemReview={item} idOrder={itemReview._id} idProduct={item.idProduct} />
                ))}
              </DialogContent>

              <DialogActions sx={{ paddingTop: '0px !important' }}>
                <Button onClick={handleClose} variant="contained" color="error">
                  Trở lại
                </Button>
                <Button type="submit" onClick={(e) => handleReviewOrder(e)} variant="outlined">
                  Hoàn thành
                </Button>
              </DialogActions>
            </Paper>
          </Dialog>
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

  if (filterStatus !== 'all' && filterStatus !== 'Hoàn thành') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  } else if (filterStatus === 'Hoàn thành') {
    tableData = tableData.filter((item) => item.status === 'Hoàn thành' || item.status === 'Đã đánh giá');
  }
  // Nếu filterStatus là 'all' thì không cần áp dụng bất kỳ bộ lọc nào, trả về tất cả dữ liệu

  return tableData;
}
