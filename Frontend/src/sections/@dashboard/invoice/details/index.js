import PropTypes from 'prop-types';
// @mui
import moment from 'moment';
import sum from 'lodash/sum';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
  TableFooter,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  TextareaAutosize,
  DialogContent,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { useParams } from 'react-router';
import { refundMoMoPayment } from '../../../../redux/slices/payment';
import { DialogAnimate } from '../../../../components/animate';
import { getOrderDetail, resetOrder, updateOrder } from '../../../../redux/slices/order';
import { dispatch } from '../../../../redux/store';
import { getShipperDetail } from '../../../../redux/slices/shipper';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

InvoiceDetails.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default function InvoiceDetails({ invoice, shippers }) {
  console.log('invoice354', invoice);
  console.log('shippers', shippers);
  const theme = useTheme();
  const [shipper, setShipper] = useState();
  const [shipperInfo, setShipperInfo] = useState('');
  const { id } = useParams();
  const { shipperDetail } = useSelector((state) => state.shipper);
  const { orderUpdate } = useSelector((state) => state.order);
  console.log('shipperDetail', shipperDetail);
  console.log('orderUpdate', orderUpdate);
  const { enqueueSnackbar } = useSnackbar();
  const handleChange = (event) => {
    // dispatch(getShipperDetail(shipper));
    const shipperNew = shippers.filter((item) => item._id === event.target.value);
    setShipper(shipperNew[0]);
  };

  console.log('shipper', shipper);
  const defaultValues = useMemo(
    () => ({
      fullName: shipperDetail?.fullName || null,
      phoneNumber: shipperDetail?.phoneNumber || null,
      gender: shipperDetail?.gender || '',
      email: shipperDetail?.email || '',
      dateOfBirth: shipperDetail?.dateOfBirth || '',
      licensePlates: shipperDetail?.licensePlates,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shipper]
  );
  console.log('defaultValues', defaultValues);
  const methods = useForm({ defaultValues });
  const [open, setOpen] = useState(false);
  const [openDialog, setOpeDialog] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  // let subTotal = 0;
  // const subTotal = invoice?.orderDetail?.reduce((total, item) => {
  //   return (total += item.price);
  // });
  const subtotal = sum(invoice?.orderDetail.map((total) => total.price * total.quantity));

  if (!invoice) {
    return null;
  }
  useEffect(() => {
    if (orderUpdate) {
      enqueueSnackbar('Cập nhật trạng thái đơn hàng thành công!');
    }
    setTimeout(() => {
      dispatch(resetOrder());
    }, 5000);
  }, [orderUpdate]);

  // mở khung chọn shipper

  const hanldeOpen = () => {
    setOpen(true);
  };

  const hanldeUpdate = () => {
    setOpenInfo(true);
    dispatch(updateOrder(id, { ...invoice, status: 'Đang vận chuyển', idShipper: shipper._id }));
  };
  const handleCancel = () => {
    setOpeDialog(true);
  };
  const handleClose = () => {
    setOpeDialog(false);
  };

  const handleSubmit = async () => {
    setOpeDialog(false);
    if (invoice?.paymentMethod.name === 'Thanh toán qua ví Momo') {
      console.log('invoice.total', invoice.total);
      console.log('invoice.paymentMethod.transId', typeof invoice.paymentMethod.transId);
      const data = await refundMoMoPayment({
        amount: invoice.total,
        transId: Number(invoice.paymentMethod.transId),
      });
      console.log('data',  data);
      if (data?.data.resultCode === 0) {
        dispatch(updateOrder(id, { ...invoice, status: 'Đã hủy' }));
        enqueueSnackbar('Cập nhật trạng thái đơn hàng thành công!');
      } else {
        enqueueSnackbar(data?.data.message, { variant: 'error' });
      }
    } else {
      dispatch(updateOrder(id, { ...invoice, status: 'Đã hủy' }));
      enqueueSnackbar('Cập nhật trạng thái đơn hàng thành công!');
    }
  };
  const { orderDetail, address, status, paymentMethod, idUser, idShipper } = invoice;

  return (
    <>
      <Table sx={{ marginBottom: '30px', maxWidth: '700px' }}>
        {' '}
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }} align="left">
            Mã đơn hàng
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="left">
            Ngày tạo
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="left">
            Trạng thái giao hàng
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="left">
            Trạng thái thanh toán
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="left">{invoice?.id}</TableCell>
          <TableCell align="left">{moment(invoice?.createdAt).format('DD-MM-YYYY')}</TableCell>
          <TableCell align="left">
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={
                (status === 'Đã nhận' && 'success') ||
                (status === 'Đã giao hàng' && 'info') ||
                (status === 'Đang vận chuyển' && 'warning') ||
                (status === 'Đã đánh giá' && 'primary') ||
                (status === 'Đang xử lý' && 'default') ||
                (status === 'Đã hủy' && 'error') ||
                'default'
              }
            >
              {status}
            </Label>
          </TableCell>
          <TableCell align="left">
            {' '}
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={
                (paymentMethod.resultCode === 0 && 'success') ||
                (paymentMethod.resultCode === 1000 && 'warning') ||
                'error'
              }
              sx={{ textTransform: 'capitalize' }}
            >
              {(paymentMethod.resultCode === 0 && 'Đã thanh toán') ||
                (paymentMethod.resultCode === 1000 && 'Chờ thanh toán') ||
                'Đã hủy'}
            </Label>
          </TableCell>
        </TableRow>
      </Table>
      {status === 'Đang xử lý' && (
        <Button
          variant="contained"
          color="error"
          sx={{ position: 'absolute', right: '110px', top: '260px' }}
          onClick={handleCancel}
        >
          Hủy
        </Button>
      )}

      <DialogAnimate
        open={openDialog}
        onClose={handleClose}
        title={'Hủy đơn'}
        onClickSubmit={handleSubmit}
        isEdit={'Hủy đơn hàng'}
      >
        <DialogContent>
          <Box>Bạn chắc chắn muốn hủy đơn hàng này?</Box>
        </DialogContent>
      </DialogAnimate>
      <Grid container spacing={3}>
        {/* <InvoiceToolbar invoice={invoice} /> */}
        <Grid item xs={12} sm={6} md={8} sx={{ mb: 3 }}>
          {' '}
          <Card sx={{ pt: 2, px: 2, height: 'auto' }}>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 500 }}>
                <Table>
                  <TableHead
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                      '& th': { backgroundColor: 'transparent' },
                    }}
                  >
                    <TableRow>
                      <TableCell align="left">
                        {' '}
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={
                            (status === 'Đã nhận' && 'success') ||
                            (status === 'Đã giao hàng' && 'info') ||
                            (status === 'Đang vận chuyển' && 'warning') ||
                            (status === 'Đã đánh giá' && 'primary') ||
                            (status === 'Đang xử lý' && 'default') ||
                            (status === 'Đã hủy' && 'error') ||
                            'default'
                          }
                          sx={{ textTransform: 'uppercase', mb: 1 }}
                        >
                          {status}
                        </Label>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell align="left">{''}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="left">
                        Số lượng
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        Giá
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        Thành tiền
                      </TableCell>
                    </TableRow>
                    {orderDetail.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                        }}
                      >
                        <TableCell align="left">
                          <Box sx={{ maxWidth: 560, display: 'flex' }}>
                            <Box sx={{ marginRight: '20px' }}>
                              {' '}
                              <img src={row.productImage} alt="" width={50} height={50} />
                            </Box>
                            <Box>
                              {' '}
                              <Typography variant="subtitle2">{row.idProduct.name}</Typography>
                              <Typography variant="body2">
                                {row.idColor.name} / {row.idSize.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                {row.idProduct.sku}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="left">{row.quantity}</TableCell>
                        <TableCell align="right">{fCurrency(row.idProduct.price)} ₫</TableCell>
                        <TableCell align="right">{fCurrency(row.price * row.quantity)} ₫</TableCell>
                      </TableRow>
                    ))}

                    <RowResultStyle>
                      <TableCell colSpan={2} />
                      <TableCell align="right">
                        <Box sx={{ mt: 2 }} />
                        <Typography>Tạm tính</Typography>
                      </TableCell>
                      <TableCell align="right" width={140}>
                        <Box sx={{ mt: 2 }} />
                        <Typography>{fCurrency(subtotal)} ₫</Typography>
                      </TableCell>
                    </RowResultStyle>
                    {invoice.idPromotion && (
                      <RowResultStyle>
                        <TableCell colSpan={2} />
                        <TableCell align="right">
                          <Typography>Giảm giá</Typography>
                        </TableCell>
                        <TableCell align="right" width={140}>
                          <Typography sx={{ color: 'error.main' }}>
                            - {fCurrency(invoice.idPromotion?.price)} ₫
                          </Typography>
                        </TableCell>
                      </RowResultStyle>
                    )}

                    <RowResultStyle>
                      <TableCell colSpan={2} />
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 'bold' }}>Tổng cộng</Typography>
                      </TableCell>
                      <TableCell align="right" width={140}>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {fCurrency(subtotal - (invoice.idPromotion?.price ? invoice.idPromotion?.price : 0))} ₫
                        </Typography>
                      </TableCell>
                    </RowResultStyle>
                  </TableBody>
                  {status !== 'Đang xử lý' && (
                    <TableFooter sx={{ borderTop: 'solid 1px rgba(145, 158, 171, 0.24)', marginBottom: '10px' }}>
                      <Typography variant="subtitle1" sx={{ color: '#00ab55', margin: '10px 0 5px 0' }} noWrap>
                        Thông tin người giao hàng
                      </Typography>
                      <TableRow>
                        <TableCell sx={{ fontSize: '0.875rem', padding: '5px 5px 5px 0' }}>Họ tên</TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', padding: '5px 5px 5px 0' }}>
                          {idShipper?.fullName}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', padding: '5px 5px 5px 0' }}>
                          Trạng thái vận chuyển
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', padding: '5px 5px 5px 0' }}>
                          {' '}
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={
                              (status === 'Đã nhận' && 'success') ||
                              (status === 'Đã giao hàng' && 'info') ||
                              (status === 'Đang vận chuyển' && 'warning') ||
                              (status === 'Đã đánh giá' && 'primary') ||
                              (status === 'Đang xử lý' && 'default') ||
                              (status === 'Đã hủy' && 'error') ||
                              'default'
                            }
                            sx={{ textTransform: 'uppercase', mb: 1 }}
                          >
                            {status}
                          </Label>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontSize: '0.875rem', padding: '5px 5px 5px 0' }}>Số điện thoại</TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', padding: '5px 5px 5px 0' }}>
                          {idShipper?.phoneNumber}
                        </TableCell>
                        <TableCell colSpan={2}>{''}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontSize: '0.875rem', padding: '5px 5px 10px 0', marginBottom: '10px' }}>
                          Biển số xe
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', padding: '5px 5px 10px 0' }}>
                          {idShipper?.licensePlates}
                        </TableCell>
                        <TableCell colSpan={2}>{''}</TableCell>
                      </TableRow>
                    </TableFooter>
                  )}
                  {!open && status === 'Đang xử lý' ? (
                    <TableFooter sx={{ borderTop: 'solid 1px rgba(145, 158, 171, 0.24)' }}>
                      <RowResultStyle>
                        <TableCell colSpan={3} />
                        <Button variant="contained" sx={{ textAlign: 'right', margin: '10px' }} onClick={hanldeOpen}>
                          Giao hàng
                        </Button>
                      </RowResultStyle>
                    </TableFooter>
                  ) : (
                    open &&
                    !openInfo && (
                      <TableFooter>
                        <TableRow sx={{ borderTop: '1px solid rgba(145, 158, 171, 0.24)' }}>
                          <Typography variant="subtitle1" sx={{ color: '#00ab55', margin: '10px 0 20px 0' }} noWrap>
                            Thông tin người giao hàng
                          </Typography>
                        </TableRow>

                        <TableRow>
                          <FormControl sx={{ minWidth: 160 }}>
                            <InputLabel id="demo-simple-select-autowidth-label">Shipper</InputLabel>
                            <Select
                              labelId="demo-simple-select-autowidth-label"
                              id="demo-simple-select-autowidth"
                              value={shipper}
                              onChange={handleChange}
                              autoWidth
                              label="Shipper"
                            >
                              {shippers?.map((item, index) => {
                                return <MenuItem value={item._id}>{item.fullName}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ padding: '5px 5px 5px 0' }}>
                            {' '}
                            <TextField
                              fullWidth
                              disabled="true"
                              margin="dense"
                              name="fullName"
                              label="Họ tên"
                              value={shipper ? shipper?.fullName : ''}
                            />
                          </TableCell>
                          <TableCell sx={{ padding: '5px 5px 5px 0' }}>
                            {' '}
                            <TextField
                              fullWidth
                              disabled="true"
                              margin="dense"
                              name="gender"
                              label="Giới tính"
                              value={shipper ? shipper?.gender : ''}
                            />
                          </TableCell>
                          <TableCell colSpan={2} sx={{ padding: '5px 5px 5px 0' }}>
                            {' '}
                            <TextField
                              fullWidth
                              disabled="true"
                              margin="dense"
                              name="email"
                              label="Email"
                              value={shipper ? shipper?.email : ''}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ padding: '5px 5px 5px 0' }}>
                            {' '}
                            <TextField
                              fullWidth
                              disabled="true"
                              margin="dense"
                              name="phoneNumber"
                              label="Số điện thoại"
                              value={shipper ? shipper?.phoneNumber : ''}
                            />
                          </TableCell>
                          <TableCell sx={{ padding: '5px 5px 5px 0' }}>
                            {' '}
                            <TextField
                              margin="dense"
                              disabled="true"
                              fullWidth
                              name="dateOfBirth"
                              label="Ngày sinh"
                              value={shipper ? moment(shipper?.dateOfBirth).format('DD/MM/YYYY') : ''}
                            />
                          </TableCell>
                          <TableCell colSpan={2} sx={{ padding: '5px 5px 5px 0' }}>
                            {' '}
                            <TextField
                              fullWidth
                              disabled="true"
                              margin="dense"
                              name="licensePlates"
                              label="Biển số xe"
                              value={shipper ? shipper?.licensePlates : ''}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {' '}
                          <TableCell align="right" colSpan={4}>
                            <Button
                              variant="contained"
                              sx={{ textAlign: 'right', margin: '10px 0' }}
                              onClick={hanldeUpdate}
                            >
                              Giao hàng
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    )
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {' '}
          <Card sx={{ p: 2 }}>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 150 }}>
                <Table>
                  <TableHead
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                      '& th': { backgroundColor: 'transparent' },
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: '#00ab55' }} noWrap>
                      Thông tin người mua
                    </Typography>
                  </TableHead>

                  <TableBody>
                    <Grid container sx={{ margin: '5px 0' }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <p>Họ tên</p>
                      </Grid>
                      <Grid item xs={12} sm={6} md={8}>
                        <p> {invoice.idUser.displayName}</p>
                      </Grid>
                    </Grid>
                  </TableBody>
                </Table>
              </TableContainer>
              <TableContainer sx={{ minWidth: 150, marginTop: '10px' }}>
                <Table>
                  <TableHead
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                      '& th': { backgroundColor: 'transparent' },
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: '#00ab55' }} noWrap>
                      Thông tin người nhận
                    </Typography>
                  </TableHead>

                  <TableBody>
                    <Grid container sx={{ margin: '5px 0' }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <p>Họ tên</p>
                      </Grid>
                      <Grid item xs={12} sm={6} md={8}>
                        <p> {invoice.address.fullName}</p>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ marginBottom: '5px' }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <p>Số điện thoại</p>
                      </Grid>
                      <Grid item xs={12} sm={6} md={8}>
                        <p> {invoice.address.phoneNumber}</p>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ marginBottom: '5px' }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <p>Địa chỉ</p>
                      </Grid>
                      <Grid item xs={12} sm={6} md={8}>
                        <p> {invoice.address.fullAddress}</p>
                      </Grid>
                    </Grid>
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
          <Card sx={{ p: 2 }}>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 150 }}>
                <Table>
                  <TableHead
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                      '& th': { backgroundColor: 'transparent' },
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: '#00ab55' }} noWrap>
                      Ghi chú
                    </Typography>
                  </TableHead>
                  <TextField
                    fullWidth
                    margin="dense"
                    name="note"
                    label="Ghi chú"
                    value={shipperDetail ? shipperDetail?.fullName : ''}
                  />
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
