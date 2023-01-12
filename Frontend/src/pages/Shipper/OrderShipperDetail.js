import { Box, Button, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  useParams } from 'react-router-dom';
// import HomeIcon from "@mui/icons-material/Home";
import moment from 'moment';
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import { getOrderList, updateOrder } from "../../redux/action/orderAction";

export default function OrderShipperDetail() {
  const idOrder = useParams();
  const dispatch = useDispatch();
  // const history = useHistory();
  const { orderList } = useSelector((state) => state.OrderReducer);
  // useEffect(() => {
  //   if (orderList === null) dispatch(getOrderList());
  // }, [orderList]);
  console.log('orderList', orderList);
  const orderDetail = orderList?.data?.filter((item) => item.id === idOrder.orderId);

  const handleChangeStatus = (idOrder) => {
    console.log('idOrder12', idOrder);
    // dispatch(
    // updateOrder(idOrder, {
    //   status: "Đã giao hàng",
    //   updatedAt: moment().format(),
    //   paymentMethod: {
    //     resultCode: 0,
    //     message: "Giao dịch thành công.",
    //     name: "Thanh toán tiền mặt khi nhận hàng",
    //   },
    // })
    // );
    // history.push('/orderListShipper');
  };

  const handleChangeOrder = (id) => {
    // dispatch(
    //   updateOrder(id, {
    //     status: 'Đang xử lý',
    //     shipper: null,
    //   })
    // );
    // history.push('/orderListShipper');
  };

  console.log('orderDetail', orderDetail);
  console.log('idOrder', idOrder);
  return (
    orderDetail[0] && (
      <div className=" mx-auto p-2 text-center md:w-96 relative h-screen " style={{ backgroundColor: '#e7edef' }}>
        <Box
          sx={{
            background: 'white',
            overflow: 'hidden',
            position: 'absolute',
            top: 5,
            display: 'flex',
            height: '50px',
            width: '96%',
            paddingTop: '10px',
            borderBottom: '10px solid #e7edef',
          }}
        >
          {/* <ChevronLeftIcon onClick={() => history.goBack()} /> */}
          <p className="text-left">Mã đơn hàng : {idOrder.orderId} </p>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'grid',
            padding: '60px 10px 0 10px',

            background: 'white',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={2}>
              {/* <HomeIcon /> */}
            </Grid>
            <Grid item xs={10}>
              <div className="text-left leading-5">
                {' '}
                <p>Địa chỉ nhười nhận </p>
                <p className="m-0">{orderDetail[0]?.address?.fullName}</p>
                <p className="m-0">{orderDetail[0]?.address?.phoneNumber}</p>
                <p>
                  {/* {orderDetail[0]?.address?.address +
                    ', ' +
                    orderDetail[0]?.address?.ward +
                    ', ' +
                    orderDetail[0]?.address?.district +
                    ', ' +
                    orderDetail[0]?.address?.city} */}
                </p>
              </div>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            background: 'white',
            overflow: 'hidden',
            margin: '10px 0',
            width: '100%',
            lineHeight: 1.2,
            padding: '10px',
          }}
        >
          {orderDetail[0]?.orderDetail.map((item, index) => {
            return (
              <Grid container spacing={2} style={{ padding: '10px 0' }}>
                <Grid item xs={4}>
                  <img src={item?.book?.image} width={80} height={80} alt="" />
                </Grid>
                <Grid item xs={6}>
                  <div className="text-left">
                    {' '}
                    <p>{item?.book?.name}</p>
                    <p>x{item?.quantity}</p>
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div className="text-left">
                    {' '}
                    <p>{item?.price.toLocaleString()}₫</p>
                  </div>
                </Grid>
              </Grid>
            );
          })}

          <Box className="text-right">
            <p>Giảm giá: {orderDetail[0].promotion ? (orderDetail[0].promotion.price * 1).toLocaleString() : 0}₫</p>
            <p>Tổng tiền: {orderDetail[0].totalPrice.toLocaleString()}₫</p>
          </Box>
        </Box>
        <Box
          sx={{
            background: 'white',
            overflow: 'hidden',
            margin: '10px 0',
            width: '100%',
            lineHeight: 1.2,
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <p>Thanh toán</p>
          <p>{orderDetail[0]?.paymentMethod.name}</p>
        </Box>
        <Box
          sx={{
            borderRadius: '5px',
            overflow: 'hidden',
            position: 'absolute',
            height: '80px',
            bottom: 10,
            width: '96%',
            display: 'flex',
            background: 'white',
            justifyContent: 'flex-end',
            alignItems: 'center',
            boxShadow: 'rgb(100 100 111 / 18%) 1px -2px 8px 4px',
          }}
        >
          <div style={{ marginRight: '10px', padding: '20px 0', lineHeight: 0.5 }}>
            <p style={{ fontSize: '16px', marginTop: '30px' }}>Thu hộ: </p>
            <p style={{ fontSize: '18px', color: 'green' }}>
              {orderDetail[0]?.paymentMethod.name === 'Thanh toán bằng ví MoMo'
                ? 0
                : orderDetail[0].totalPrice.toLocaleString()}{' '}
              ₫
            </p>
          </div>
          {orderDetail[0].status === 'Đã giao hàng' ||
          orderDetail[0].status === 'Đã nhận' ||
          orderDetail[0].status === 'Đã đánh giá' ? (
            ''
          ) : (
            <Button
              color="error"
              variant="contained"
              sx={{ fontSize: '13px', padding: '6px 12px' }}
              onClick={() => {
                handleChangeOrder(idOrder.orderId);
              }}
            >
              Trả đơn
            </Button>
          )}
          {orderDetail[0].status === 'Đang vận chuyển' ? (
            <Button
              variant="contained"
              sx={{ margin: '20px', fontSize: '13px', padding: '6px 12px' }}
              onClick={() => {
                handleChangeStatus(idOrder.orderId);
              }}
            >
              Đã giao hàng
            </Button>
          ) : (
            <Button
              disabled
              variant="contained"
              sx={{ margin: '20px', fontSize: '13px', padding: '6px 12px' }}
              onClick={() => {
                handleChangeStatus(idOrder.orderId);
              }}
            >
              Đã giao hàng
            </Button>
          )}
        </Box>
      </div>
    )
  );
}
