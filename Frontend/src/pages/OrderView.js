import {
  Box,
  Card,
  Container,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { NavLink as RouterLink, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Label from '../components/Label';
import useSettings from '../hooks/useSettings';
import { getOrderDetail } from '../redux/slices/order';
import { useDispatch, useSelector } from '../redux/store';
import CustomizedSteppers from '../sections/custom-step/CustomizedSteppers';
import { TableHeadCustom } from '../components/table';
import { fCurrency } from '../utils/formatNumber';
import { PATH_HOME } from '../routes/paths';

export default function OrderView() {
  const theme = useTheme();

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { id = '' } = useParams();

  const { orderDetail } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetail(id));
    //   return dispatch(resetProduct());
  }, [dispatch, id]);

  const TABLE_HEAD = [
    { id: 'product', label: 'Sản phẩm', alignRight: false },
    { id: 'price', label: 'Giá', alignRight: false },
    { id: 'amount', label: 'Số lượng', alignRight: false },
    { id: 'total', label: 'Tổng tiền', alignRight: false },
  ];

  return (
    <Box sx={{ paddingBottom: 7 }}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid spacing={3} sx={{ marginBottom: 2 }}>
          <Card sx={{ padding: '23px' }}>
            <Typography variant="h5" sx={{ mb: 5, color: '#242424', fontWeight: 'normal' }}>
              Chi tiết đơn hàng #{id} <span className="px-2">-</span>
              {/* <span className="font-semibold">{orderDetail?.status}</span> */}
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (orderDetail?.status === 'Đã nhận' && 'success') ||
                  (orderDetail?.status === 'Đã giao hàng' && 'success') ||
                  (orderDetail?.status === 'Đang vận chuyển' && 'info') ||
                  (orderDetail?.status === 'Đã đánh giá' && 'primary') ||
                  (orderDetail?.status === 'Đang xử lý' && 'warning') ||
                  (orderDetail?.status === 'Đã hủy' && 'error') ||
                  'default'
                }
                sx={{ fontSize: 18 }}
              >
                {orderDetail?.status}
              </Label>
            </Typography>

            <CustomizedSteppers orderDetail={orderDetail} />
            <Grid sx={{ mt: 2 }} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6} sx={{ marginBottom: '50px' }}>
                <Typography variant="h6" sx={{ marginLeft: 1, marginBottom: 2, textTransform: 'uppercase' }}>
                  Địa chỉ người nhận
                </Typography>
                <Card
                  sx={{
                    borderRadius: ' 16px',
                    zIndex: 0,
                    padding: '24px',
                    height: '86% !important',
                  }}
                >
                  <div>
                    <p className="font-semibold text-xl">{orderDetail?.address.fullName}</p>
                    <div className="text-gray-500">
                      <p className=" py-2">Địa chỉ: {orderDetail?.address.fullAddress}</p>
                      <p>Điện thoại : {orderDetail?.address.phoneNumber}</p>
                    </div>
                  </div>
                </Card>
              </Grid>
              <Grid item xs={6} sx={{ marginBottom: '50px' }}>
                <Typography variant="h6" sx={{ marginLeft: 1, marginBottom: 2, textTransform: 'uppercase' }}>
                  Thông tin thanh toán
                </Typography>
                <Card
                  sx={{
                    borderRadius: ' 16px',
                    zIndex: 0,
                    padding: '24px',
                    paddingBottom: '25px',
                    height: '86% !important',
                  }}
                >
                  <div>
                    <p className="text-gray-500">{orderDetail?.paymentMethod?.name}</p>
                    <p className="font-semibold mt-2">
                      Vui lòng thanh toán{' '}
                      <span className="text-red-500">
                        {orderDetail?.paymentMethod?.name === 'Thanh toán tiền mặt khi nhận hàng.'
                          ? fCurrency(orderDetail?.total)
                          : 0}{' '}
                        ₫
                      </span>{' '}
                      khi nhận hàng.
                    </p>
                  </div>
                </Card>
              </Grid>
            </Grid>

            <Card>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHeadCustom headLabel={TABLE_HEAD} />
                  <TableBody>
                    {orderDetail?.orderDetail.map((row) => {
                      const { idProduct, _id, quantity, price, productImage, idSize, idColor } = row;
                      return (
                        <TableRow hover key={_id}>
                          <TableCell align="flex">
                            <div className="flex">
                              {/* <img className="w-16 h-16 mr-4" src={productImage} alt={idProduct.name} /> */}{' '}
                              <div className="flex">
                                <div>
                                  <img
                                    src={productImage}
                                    style={{
                                      width: '90px',
                                      height: '90px',
                                      marginRight: 12,
                                    }}
                                    alt={idProduct.name}
                                  />
                                </div>
                                <div>
                                  <p className="text-black">{idProduct.name}</p>
                                  <p className="text-gray-500">
                                    Phân loại hàng: {idColor.name}, {idSize.name}
                                  </p>
                                  <p className="text-black">Số lượng: {quantity}</p>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="flex">
                            {idProduct.priceSale !== 0 && (
                              <span className="line-through text-gray-400">{fCurrency(idProduct.priceSale)} ₫</span>
                            )}
                            <span className="text-red-500"> {fCurrency(idProduct?.price)} ₫</span>
                          </TableCell>
                          <TableCell align="flex">{quantity}</TableCell>
                          <TableCell align="flex">
                            <span className="text-red-500">{fCurrency(price * quantity)} ₫</span>
                          </TableCell>
                        </TableRow>
                      );
                    })}{' '}
                    <TableRow>
                      <TableCell rowSpan={4} />
                      <TableCell>{''}</TableCell>
                      <TableCell>Tạm tính </TableCell>
                      <TableCell>
                        {orderDetail?.idPromotion
                          ? fCurrency(orderDetail?.total + orderDetail?.idPromotion?.price)
                          : fCurrency(orderDetail?.total)}{' '}
                        ₫
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{''}</TableCell>
                      <TableCell>Phí vận chuyển</TableCell>
                      <TableCell>0 ₫</TableCell>
                    </TableRow>
                    {orderDetail?.idPromotion && (
                      <TableRow>
                        <TableCell>{''}</TableCell>
                        <TableCell>Vourcher giảm giá</TableCell>
                        <TableCell>- {fCurrency(orderDetail?.idPromotion.price)} ₫</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>{''}</TableCell>
                      <TableCell>Tổng cộng</TableCell>
                      <TableCell>
                        <span className="text-red-500 text-xl">{fCurrency(orderDetail?.total)} ₫</span>
                      </TableCell>
                    </TableRow>
                    {/* <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={2}>Subtotal</TableCell>
                        <TableCell align="right">1234</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tax</TableCell>
                        <TableCell align="right">1234</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell align="right">1234</TableCell>
                      </TableRow> */}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Card>
        </Grid>
        <Link component={RouterLink} to={PATH_HOME.user.order}>
          {' '}
          Quay lại đơn hàng của tôi
        </Link>
      </Container>
    </Box>
  );
}
