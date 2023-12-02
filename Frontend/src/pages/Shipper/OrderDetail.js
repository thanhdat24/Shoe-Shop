import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, DialogContent, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PhoneIcon from '@mui/icons-material/Phone';
import SmsIcon from '@mui/icons-material/Sms';
import { useSnackbar } from 'notistack';
import { getOrderDetail, resetOrder, updateOrder } from '../../redux/slices/order';
import { useDispatch, useSelector } from '../../redux/store';
import useAuth from '../../hooks/useAuth';
import { fCurrency } from '../../utils/formatNumber';
import { DialogAnimate } from '../../components/animate';
import Iconify from '../../components/Iconify';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function OrderDetail() {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);

  const { id = '' } = useParams();

  const dispatch = useDispatch();

  const { orderDetail, orderUpdate } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetail(id));
    return dispatch(resetOrder());
  }, [dispatch, id, orderUpdate]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    dispatch(updateOrder(id, { status: 'Đã giao hàng' }));
    setOpen(false);
    setTimeout(() => {
      enqueueSnackbar('Giao hàng thành công!');
    }, 500);
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
                <Link component={RouterLink} to="/shipper/dashboard">
                  <Iconify icon={'eva:arrow-ios-back-fill'} width={25} height={25} />
                </Link>
              </Box>
              <Box sx={{ position: 'absolute', top: '42%', fontWeight: 600 }}>Đơn hàng #{id}</Box>
            </Card>

            <Card
              sx={{
                height: 553,
                marginBottom: '20px',
                overflow: 'auto',
              }}
            >
              <Box p={1}>
                {/* Info Address */}
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Item sx={{ display: 'flex', alignItems: 'center' }}>
                        <Grid item xs={4} md={4} sx={{ padding: '10px' }}>
                          <Box>
                            <img
                              className="rounded-full h-12 w-12"
                              src="https://www.dropbox.com/s/iv3vsr5k6ib2pqx/avatar_default.jpg?dl=1"
                              alt="35"
                            />
                          </Box>
                        </Grid>
                        <Stack className="items-start">
                          <Typography variant="subtitle1" noWrap>
                            {orderDetail?.address.fullName}
                          </Typography>

                          <Typography variant="subtitle3" noWrap>
                            {orderDetail?.address.phoneNumber}
                          </Typography>
                        </Stack>
                      </Item>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Grid item xs={4} md={4} sx={{ padding: '10px' }}>
                          <Box
                            sx={{
                              height: '24px',
                              width: '24px',
                              backgroundColor: '#00AB55',
                              borderRadius: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <PhoneIcon sx={{ color: '#fff', fontSize: 15 }} />
                          </Box>
                        </Grid>
                        <Grid item xs={4} md={4} sx={{ padding: '10px' }}>
                          <Box
                            sx={{
                              height: '24px',
                              width: '24px',
                              backgroundColor: '#00AB55',
                              borderRadius: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <SmsIcon sx={{ color: '#fff', fontSize: 15 }} />
                          </Box>
                        </Grid>
                      </Item>
                    </Grid>
                  </Grid>
                </Box>
                {/* Product detail */}
                <Box sx={{ flexGrow: 1 }}>
                  {orderDetail?.orderDetail.map((item) => {
                    return (
                      <Grid container spacing={2} sx={{ paddingTop: '0px !important' }}>
                        <Grid item xs={8} sx={{ paddingTop: '0px !important' }}>
                          <Item sx={{ display: 'flex', alignItems: 'center' }}>
                            <Grid item xs={4} md={4} sx={{ padding: '10px' }}>
                              <Box>
                                <img
                                  src={item.productImage}
                                  style={{
                                    width: '90px',
                                    height: '90px',
                                    marginRight: 12,
                                  }}
                                  alt={item.productImage}
                                />
                              </Box>
                            </Grid>
                            <Stack className="items-start">
                              <Typography variant="subtitle1" noWrap>
                                {item.idProduct.name}
                              </Typography>

                              <Typography variant="subtitle2" noWrap>
                                Phân loại hàng: {item.idColor.name}, {item.idSize.name}
                              </Typography>
                              <Typography variant="subtitle3" noWrap>
                                Số lượng: {item.quantity}
                              </Typography>
                            </Stack>
                          </Item>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Item>
                            <Grid item xs={4} md={4} sx={{ padding: '10px', whiteSpace: 'nowrap' }}>
                              <Box className="text-red-500 text-base">{fCurrency(item.idProduct.price)} ₫</Box>
                              {item.idProduct.priceSale !== 0 && (
                                <Box className="line-through text-gray-400">
                                  {fCurrency(item.idProduct.priceSale)} ₫
                                </Box>
                              )}
                            </Grid>
                          </Item>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Box>
                {/* Delivery fee */}
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Item>
                        <Typography variant="subtitle1" noWrap className="text-start">
                          Phí vận chuyển
                        </Typography>
                      </Item>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Item>0 ₫</Item>
                    </Grid>
                  </Grid>
                </Box>
                {/* Amount */}
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Item>
                        <Typography variant="h5" noWrap className="text-start text-gray-900">
                          Tổng tiền
                        </Typography>
                      </Item>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Item>
                        <Box className="text-gray-900 text-lg font-semibold">{fCurrency(orderDetail?.total)} ₫</Box>
                      </Item>
                    </Grid>
                  </Grid>
                </Box>
                {/* Address */}
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Item>
                        <Typography variant="subtitle1" noWrap className="text-start">
                          Địa chỉ giao hàng
                        </Typography>
                      </Item>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={3} sx={{ paddingRight: '0px !important' }}>
                      <Item
                        sx={{
                          paddingRight: '0px !important',
                        }}
                      >
                        <img className="rounded-xl w-16 h-16" src="../../../static/gg-map.png" alt="gg-map" />
                      </Item>
                    </Grid>
                    <Grid
                      item
                      xs={9}
                      sx={{
                        paddingLeft: '0px !important',
                        justifyContent: 'flex-start',
                        display: 'flex',
                      }}
                    >
                      <Item sx={{ paddingLeft: '0px !important', textAlign: 'initial ' }}>
                        {orderDetail?.address.fullAddress}
                      </Item>
                    </Grid>
                  </Grid>
                </Box>
                {/* Payment method */}
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Item>
                        <Typography variant="subtitle2" noWrap className="text-start">
                          Phương thức thanh toán
                        </Typography>
                      </Item>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', whiteSpace: 'nowrap' }}
                    >
                      <Item>{orderDetail?.paymentMethod.name}</Item>
                    </Grid>
                  </Grid>
                </Box>
                {/* Placed On */}
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Item>
                        <Typography variant="subtitle2" noWrap className="text-start">
                          Thời gian đặt hàng
                        </Typography>
                      </Item>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', whiteSpace: 'nowrap' }}
                    >
                      <Item>{orderDetail?.createdAt}</Item>
                    </Grid>
                  </Grid>
                </Box>
                {/* Payment */}
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Item>
                        <Typography variant="h6" noWrap className="text-start text-gray-900">
                          Tóm tắt thanh toán
                        </Typography>
                      </Item>
                      <Box sx={{ display: 'flex' }}>
                        <Grid item xs={8}>
                          <Item>
                            <Typography variant="subtitle1" noWrap className="text-start">
                              Tạm tính
                            </Typography>
                          </Item>
                        </Grid>
                        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {orderDetail?.idPromotion ? (
                            <Grid
                              item
                              xs={4}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <Item>{fCurrency(orderDetail?.total + orderDetail?.idPromotion.price)} ₫</Item>
                            </Grid>
                          ) : (
                            <Item>0 ₫</Item>
                          )}
                        </Grid>
                      </Box>
                      <Box sx={{ display: 'flex' }}>
                        <Grid item xs={8}>
                          <Item>
                            <Typography variant="subtitle1" noWrap className="text-start">
                              Voucher giảm giá
                            </Typography>
                          </Item>
                        </Grid>
                        {orderDetail?.idPromotion && (
                          <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Item>-{fCurrency(orderDetail?.idPromotion.price)} ₫</Item>
                          </Grid>
                        )}
                      </Box>
                      <hr />
                      <Box sx={{ display: 'flex' }}>
                        <Grid item xs={8}>
                          <Item>
                            <Typography variant="subtitle1" noWrap className="text-start">
                              Tổng tiền
                            </Typography>
                          </Item>
                        </Grid>
                        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Grid
                            item
                            xs={4}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Item>{fCurrency(orderDetail?.total)} ₫</Item>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Card>

            <Card
              sx={{
                height: 80,
                overflow: 'auto',
              }}
            >
              <Typography variant="subtitle2" noWrap mb={1}>
                Thu hộ: <spn className="text-red-500 text-base">{fCurrency(orderDetail?.total)} ₫</spn>
              </Typography>
              <Button
                variant="contained"
                className="w-full h-3/6"
                onClick={handleClickOpen}
                disabled={orderDetail?.status !== 'Đang vận chuyển' && 1}
              >
                Đã giao hàng
              </Button>
              <DialogAnimate
                open={open}
                onClose={handleClose}
                onClickSubmit={(e) => handleSubmit(e)}
                isCancel={'Hủy bỏ'}
                isEdit={'Xác nhận'}
              >
                <DialogContent>
                  <Box>Xác nhận đã giao hàng thành công?</Box>
                </DialogContent>
              </DialogAnimate>
            </Card>
          </>
        </Box>
      </div>
    </div>
  );
}
