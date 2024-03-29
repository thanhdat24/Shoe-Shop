import { DateRangePicker, DateRange, LoadingButton } from '@mui/lab';
import React, { Fragment, useEffect, useState } from 'react';

import {
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
  Grid,
  Card,
  Button,
  Switch,
  Box,
  TextField,
  Alert,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import * as Yup from 'yup';

import moment from 'moment';
// import { LoadingButton } from '@mui/lab';
import { useFormik, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useHistory, useNavigate, Link as RouterLink } from 'react-router-dom';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import CopyToClipboard from 'react-copy-to-clipboard';

import { styled } from '@mui/material/styles';
import { useStyles } from './PromotionStyle';
import { createDiscount, resetDiscount } from '../../../redux/slices/promotion';

// import { createDiscount, resetDiscount } from '../../../redux/actions/Discount';
import ModalDialog from '../../../components/ModalDialog/DialogTitle';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { fNumber, fNumberVND, formatPriceInVND } from '../../../utils/formatNumber';
import SaveCancelButtons from '../../../components/SaveCancelButtons/SaveCancelButtons';

export default function PromotionCreate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { newDiscount, error, isLoading } = useSelector((state) => state.promotion);

  const [isLimited, setIsLimited] = useState(false);

  const codeRegExp = /^[A-Za-z0-9_-]{5,10}$/;

  const CreateSchema = Yup.object().shape({
    title: Yup.string().required('*Vui lòng nhập thông tin này'),
    code: Yup.string()
      .required('*Vui lòng nhập thông tin này')
      .matches(codeRegExp, 'Vui lòng nhập tối thiểu 5 ký tự và tối đa 10 ký tự'),
    price: Yup.number().min(5000, '*Giá trị phải lớn hơn hoặc bằng 5.000').required('*Vui lòng nhập thông tin này'),
    miniPrice: Yup.number().required('*Vui lòng nhập thông tin này'),
    // quantity: Yup.string().required('*Vui lòng nhập thông tin này'),
    // maxUsagePerCustomer: Yup.number()
    //   .min(1, 'Giá trị phải lớn hơn hoặc bằng 1')
    //   .required('*Vui lòng nhập thông tin này'),
  });
  const formik = useFormik({
    initialValues: {
      title: '',
      code: '',
      price: '',
      percent: '',
      miniPrice: '',
      // maxUsagePerCustomer: null,
      // quantity: '',
      startDate: '',
      expiryDate: '',
      activeCode: '',
      activePublic: true,
    },

    validationSchema: CreateSchema,
    onSubmit: (data) => {
      if (isLoading) {
        return;
      }
      dispatch(createDiscount(data));
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, values, setFieldValue } = formik;

  const [open, setOpen] = React.useState(false);

  const [effectiveTime, setEffectiveTime] = useState([null, null]);

  const handleChangePublic = (event, checked) => {
    setFieldValue('activePublic', (checked && true) || false);
  };

  const handleAlertCreate = () => {
    if (isReadyCreateDiscount) setOpen(true);
  };
  const handleAlertClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    values.startDate = moment(effectiveTime[0])?.format('YYYY-MM-DDTHH:mm:SS');
    values.expiryDate = moment(effectiveTime[1])?.format('YYYY-MM-DDTHH:mm:SS');
    const currentDay = moment().format('YYYY-MM-DDTHH:mm:SS');
    if (currentDay < values.startDate) {
      values.activeCode = 'Sắp diễn ra';
    } else {
      values.activeCode = 'Đang diễn ra';
    }
  }, [effectiveTime]);

  const DiscountInfo = styled(({ className, ...props }) => (
    <Tooltip
      PopperProps={{
        sx: {
          '& .MuiTooltip-arrow': {
            '&::before': {
              backgroundColor: 'rgb(255, 255, 255)',
            },
          },
        },
      }}
      arrow
      {...props}
      classes={{ popper: className }}
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'white',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: '400px',
      borderRadius: '8px',
      boxShadow: 'rgb(0 0 0 / 15%) 0px 1px 18px',
      fontSize: theme.typography.pxToRem(12),
      padding: '24px 0px',
      pointerEvents: 'auto',
    },
  }));

  const [isReadyCreateDiscount, setIsReadyCreateDiscount] = useState(false);
  useEffect(() => {
    if (
      values.title &&
      values.code &&
      values.price &&
      values.miniPrice &&
      // values.quantity &&
      // values.maxUsagePerCustomer &&
      values.startDate !== 'Invalid date' &&
      values.expiryDate !== 'Invalid date'
    )
      setIsReadyCreateDiscount(true);
    else setIsReadyCreateDiscount(false);
  }, [
    values.title,
    values.code,
    values.price,
    values.miniPrice,
    // values.quantity,
    // values.maxUsagePerCustomer,
    values.startDate,
    values.expiryDate,
  ]);

  useEffect(() => {
    if (newDiscount) {
      setTimeout(() => {
        navigate(PATH_DASHBOARD.promotion.list);
        // history.push('/admin/discount/list');
      }, 100);
      setTimeout(() => {
        enqueueSnackbar('Tạo thành công!', { variant: 'success' });
      }, 150);
      return;
    }
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [newDiscount, error]);

  useEffect(() => {
    return () => {
      dispatch(resetDiscount());
    };
  }, []);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="text.primary"
      href="/admin/dashboard"
      sx={{ '&:hover': { color: '#212B36' } }}
    >
      Trang chủ
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="text.primary"
      href="/admin/movies/list"
      sx={{ '&:hover': { color: '#212B36' } }}
    >
      Mã giảm giá
    </Link>,
    <Typography key="3" color="inherit">
      Tạo mã giảm giá
    </Typography>,
  ];
  return (
    <Container sx={{ paddingRight: '0px !important', paddingLeft: '0px !important' }}>
      <Box sx={{ width: '100%', typography: 'body1', marginTop: 2 }}>
        <Formik value={formik}>
          <Form onSubmit={handleSubmit} id="createDiscount">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={8} sx={{ marginBottom: '80px' }}>
                <Card
                  sx={{
                    borderRadius: ' 16px',
                    zIndex: 0,
                    padding: '24px',
                  }}
                >
                  <div className="mb-4 text-lg font-semibold  ">1. Thông tin cơ bản</div>
                  <Stack spacing={3}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                      <Box className="mr-16 whitespace-nowrap  font-semibold  flex">Tên mã giảm giá</Box>
                      <TextField
                        fullWidth
                        autoComplete="title"
                        type="text"
                        label="Điền tên mã giảm giá "
                        {...getFieldProps('title')}
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                      />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                      <Box className="mr-16 whitespace-nowrap  font-semibold  flex">Mã giảm giá</Box>
                      <Box className="flex flex-col ">
                        <Box className="flex justify-between items-center">
                          <div className={classes.textValidation}>Chỉ bao gồm từ 5 - 10 ký tự thường và chữ số.</div>
                          <Link to="#" variant="subtitle2" component={RouterLink} className="text-sm" underline="none">
                            Tạo mã tự động
                          </Link>
                        </Box>
                        <TextField
                          fullWidth
                          autoComplete="code"
                          label="Điền ký tự mã giảm giá"
                          className="!mt-0"
                          {...getFieldProps('code')}
                          error={Boolean(touched.code && errors.code)}
                          helperText={touched.code && errors.code}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                      <Box className="mr-16 whitespace-nowrap  font-semibold  flex">Thời gian hiệu lực</Box>
                      <DateRangePicker
                        startText="Ngày bắt đầu"
                        endText="Ngày kết thúc"
                        value={effectiveTime}
                        disablePast={values.activeCode === 'Sắp diễn ra' && true}
                        onChange={(newValue) => {
                          setEffectiveTime(newValue);
                        }}
                        renderInput={(startProps, endProps) => (
                          <>
                            <TextField {...startProps} />
                            <Box sx={{ mx: 2 }}> đến </Box>
                            <TextField {...endProps} />
                          </>
                        )}
                      />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
                      <Box className="mr-16 whitespace-nowrap  font-semibold  flex mt-2">Chế độ hiển thị</Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>Ẩn</Typography>
                          <Switch
                            name="activePublic"
                            checked={values.activePublic}
                            value={values.activePublic}
                            onChange={handleChangePublic}
                          />
                          <Typography>Công khai</Typography>
                        </Box>
                        {values.activePublic && (
                          <span className="text-red-500 text-sm">
                            <span className="font-semibold"> Lưu ý:</span> Mã giảm giá được công khai trong trang chi
                            tiết sản phẩm, cho tất cả các khách hàng!
                          </span>
                        )}
                      </Box>
                    </Box>
                  </Stack>
                </Card>
                <Card
                  sx={{
                    borderRadius: ' 16px',
                    zIndex: 0,
                    padding: '24px',
                    marginTop: '20px',
                  }}
                >
                  <div className="mb-4 text-lg font-semibold ">2. Điều kiện áp dụng</div>
                  <Stack spacing={3}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                      <Box className="mr-16 whitespace-nowrap  font-semibold  flex">Mức giảm giá</Box>
                      <TextField
                        fullWidth
                        autoComplete="price"
                        type="number"
                        label="Điền số tiền giảm giá"
                        {...getFieldProps('price')}
                        error={Boolean(touched.price && errors.price)}
                        helperText={touched.price && errors.price}
                      />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                      <Box className="mr-16 whitespace-nowrap  font-semibold  flex">Giá trị đơn hàng tối thiểu</Box>

                      <TextField
                        fullWidth
                        type="number"
                        label="Điền số tiền giảm giá"
                        {...getFieldProps('miniPrice')}
                        error={Boolean(touched.miniPrice && errors.miniPrice)}
                        helperText={touched.miniPrice && errors.miniPrice}
                      />
                    </Box>
                    {/* <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                      <Box className="mr-16 whitespace-nowrap  font-semibold  flex">Số lượng mã giảm giá</Box>
                      <TextField
                        fullWidth
                        label="Điền số lượng"
                        {...getFieldProps('quantity')}
                        error={Boolean(touched.quantity && errors.quantity)}
                        helperText={touched.quantity && errors.quantity}
                      />
                    </Box> */}
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card
                  sx={{
                    borderRadius: ' 16px',
                    zIndex: 0,
                    padding: '24px 0 ',
                  }}
                >
                  <div className="mb-3 text-lg font-semibold text-center">Tóm tắt điều kiện áp dụng mã</div>
                  <hr />
                  <div className="flex p-3 flex-col items-center">
                    <div className="w-full m-w-full">
                      <Alert className={classes.alert} icon={false} severity="success">
                        <ul className={classes.alertMessage}>
                          <li className={classes.typographyInfo}>
                            <span>
                              Giảm <b className="text-green-600">{formatPriceInVND(values?.price)}</b>
                            </span>
                          </li>
                          <li className={classes.typographyInfo}>
                            <b className="text-green-600">{values.activePublic ? 'Hiện' : 'Ẩn'}</b> mã giảm giá
                          </li>
                          <li className={classes.typographyInfo}>
                            Thời gian hiệu lực:{' '}
                            {effectiveTime[0] && (
                              <b className="text-green-600">
                                {moment(effectiveTime[0])?.format('DD/MM/YYYY hh:mm:ss ')} →{' '}
                              </b>
                            )}
                            {effectiveTime[1] && (
                              <b className="text-green-600">
                                {effectiveTime[1] && moment(effectiveTime[1])?.format('DD/MM/YYYY hh:mm:ss ')}
                              </b>
                            )}
                          </li>
                          <li className={classes.typographyInfo}>
                            Giá trị đơn hàng tối thiểu:{' '}
                            <b className="text-green-600">{`${formatPriceInVND(values?.miniPrice)}`}</b>
                          </li>
                          {/* <li className={classes.typographyInfo}>
                            Tổng số lượng mã giảm giá:{' '}
                            <b className="text-green-600">{`${fNumber(values?.quantity)}`}</b>
                          </li> */}
                          {/* <li className={classes.typographyInfo}>
                            {values?.maxUsagePerCustomer || isLimited ? (
                              <span>
                                Giới hạn <b className="text-green-600">{fNumber(values?.maxUsagePerCustomer)}</b> lần sử
                                dụng mỗi khách hàng
                              </span>
                            ) : (
                              'Không giới hạn số lần sử dụng mỗi khách hàng'
                            )}
                          </li> */}
                          {/* <li className={classes.typographyInfo}>
                            Áp dụng cho:
                            <b className="text-green-600"> Tất cả sản phẩm</b>
                          </li> */}
                        </ul>
                      </Alert>
                    </div>
                  </div>
                </Card>
                <Card
                  sx={{
                    borderRadius: ' 16px',
                    zIndex: 0,
                    padding: '24px 0 ',
                    marginTop: '20px',
                  }}
                >
                  <div className="mb-3 text-lg font-semibold text-center uppercase text-green-600">
                    Hiển thị voucher
                  </div>
                  <hr />
                  <div className="flex p-3 flex-col items-center">
                    <div className="w-full m-w-full">
                      <div className={classes.couponPreviewContainer}>
                        <div className="relative overflow-hidden w-full rounded-lg h-28">
                          <img
                            className="w-full h-full"
                            src="../../icons/ic_ticketBox.svg"
                            alt=""
                            style={{
                              filter: 'drop-shadow(rgba(0, 0, 0, 0.15) 0px 1px 3px)',
                            }}
                          />
                          <div className="flex absolute top-0 left-0 w-full h-full ">
                            <div className="flex flex-col items-center w-32 h-24 self-center justify-center">
                              <div className="relative w-14 h-14">
                                <div className="w-full relative">
                                  <img
                                    src="../../icons/ic_homeSelling.png"
                                    alt="home-selling-products"
                                    className="object-contain rounded-lg"
                                  />
                                </div>
                              </div>
                              <div
                                style={{
                                  margin: '4px 4px 0px',
                                  textAlign: 'center',
                                  fontSize: '13px',
                                }}
                              >
                                <p>Voucher</p>
                              </div>
                            </div>
                            <div className="flex flex-col p-3 w-full">
                              <div className="flex flex-col h-full relative">
                                <button className="absolute top-0 right-0 block bg-transparent w-4">
                                  <DiscountInfo
                                    title={
                                      <Box>
                                        <div
                                          className="pr-4 flex items-center"
                                          style={{
                                            backgroundColor: 'rgb(250, 250, 250)',
                                          }}
                                        >
                                          <div
                                            style={{
                                              width: '50%',
                                              minWidth: '110px',
                                              flex: '0 0 auto',
                                              padding: '12px 24px',
                                              fontSize: '13px',
                                              lineHeight: '20px',
                                              color: 'rgb(120, 120, 120)',
                                            }}
                                          >
                                            Mã
                                          </div>
                                          <div className="pr-2 overflow-hidden">{values.code}</div>
                                          <CopyToClipboard>
                                            <img
                                              className="cursor-pointer"
                                              src="../../img/discount/copy-icon.svg"
                                              alt="copy-icon"
                                            />
                                          </CopyToClipboard>
                                        </div>
                                        <div className="pr-4 flex items-center">
                                          <div
                                            style={{
                                              width: '50%%',
                                              minWidth: '110px',
                                              flex: '0 0 auto',
                                              padding: '12px 24px',
                                              fontSize: '13px',
                                              lineHeight: '20px',
                                              color: 'rgb(120, 120, 120)',
                                            }}
                                          >
                                            Hạn sử dụng
                                          </div>
                                          <div className="pr-2 overflow-hidden">
                                            {effectiveTime[1] && moment(effectiveTime[1])?.format('DD/MM/YYYY ')}
                                          </div>
                                        </div>
                                        <div
                                          className=""
                                          style={{
                                            backgroundColor: ' rgb(250, 250, 250)',
                                            display: 'flex',
                                            flexFlow: 'row wrap',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <div
                                            style={{
                                              width: '50%',
                                              minWidth: ' 35px',
                                              flex: '0 0 auto',
                                              padding: '12px 24px',
                                              fontSize: '13px',
                                              lineHeight: '20px',
                                              color: 'rgb(120, 120, 120)',
                                            }}
                                          >
                                            Điều kiện
                                          </div>
                                          <div
                                            className="description"
                                            style={{
                                              padding: '12px 24px',
                                              fontSize: '13px',
                                              lineHeight: ' 20px',
                                              color: 'rgb(36, 36, 36)',
                                            }}
                                          >
                                            <ul className={classes.description}>
                                              <li>
                                                Giảm Giảm&nbsp;
                                                {fNumberVND(values?.price)} Đơn hàng tối thiểu{' '}
                                                {fNumberVND(values.miniPrice)}
                                              </li>
                                              <li>Áp dụng cho tất cả sản phẩm</li>
                                            </ul>
                                          </div>
                                        </div>
                                      </Box>
                                    }
                                    placement="left"
                                  >
                                    <img className="m-w-full" src="../../img/discount/info_active.svg" alt="" />
                                  </DiscountInfo>
                                </button>
                                <div className="pr-7">
                                  <h4 className="text-sm font-medium leading-6 m-0 p-0 text-gray-900 max-h-6">
                                    Giảm&nbsp;{`${formatPriceInVND(values?.price)}`}
                                  </h4>
                                  <p className="text-xs font-normal leading-5 m-0 p-0 text-gray-500 max-h-5">
                                    Đơn hàng tối thiểu&nbsp;
                                    {`${formatPriceInVND(values?.miniPrice)}`}
                                  </p>
                                </div>
                                <div className="flex items-end mt-auto">
                                  <p className="pr-7 text-xs font-normal leading-5 m-0 p-0 text-gray-500 max-h-5">
                                    HSD:
                                    {effectiveTime[1] && moment(effectiveTime[1])?.format('DD/MM/YYYY')}
                                  </p>
                                  <div className={classes.buttonSave}>Lưu</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {!values.activePublic && (
                            <div className={classes.HiddenOverlay}>
                              <span className="text-2xl text-white">
                                <img src="../../img/admin/discount/hidden-overlay.svg" alt="" />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Grid>
            </Grid>
            <SaveCancelButtons onSave={handleAlertCreate} isDisabledSave={isReadyCreateDiscount} />
            {/* <Box className={classes.formActionBar}>
                <Box className={classes.ActionWrapper}>
                  <Button
                    sx={{
                      color: 'gray',
                      borderColor: 'gray ',
                      '&:hover': { color: 'primary.main' },
                    }}
                    variant="outlined"
                    // onClick={() => history.push('/admin/discount/list')}
                    className={classes.buttonCreate}
                  >
                    Quay lại
                  </Button>
                  <LoadingButton
                    size="large"
                    variant="contained"
                    disabled={!isReadyCreateDiscount}
                    className={classes.buttonCreate}
                    onClick={handleAlertCreate}
                  >
                    Tạo mới
                  </LoadingButton>
                </Box>
              </Box> */}

            <Dialog onClose={handleAlertClose} open={open} maxWidth="xs">
              <ModalDialog onClose={handleAlertClose} className="text-center">
                Vui lòng kiểm tra điều kiện áp dụng
              </ModalDialog>
              <DialogContent dividers>
                <Alert className={classes.alert} icon={false} severity="success">
                  <ul className={classes.alertMessage}>
                    <li className={classes.typographyInfo}>
                      <span>
                        Giảm{' '}
                       {' '}
                        <b className="text-green-600">{`${formatPriceInVND(values?.price ? values?.price * 1 : 0)}`}</b>
                      </span>
                    </li>
                    <li className={classes.typographyInfo}>
                      <b className="text-green-600">{values.activePublic ? 'Hiện' : 'Ẩn'}</b> mã giảm giá
                    </li>
                    <li className={classes.typographyInfo}>
                      Áp dụng cho:
                      <b className="text-green-600"> Tất cả sản phẩm</b>
                    </li>
                    <li className={classes.typographyInfo}>
                      Giá trị đơn hàng tối thiểu:{' '}
                      <b className="text-green-600">{`${formatPriceInVND(values?.miniPrice)}`}</b>
                    </li>
                    {/* <li className={classes.typographyInfo}>
                      Số lượng mã giảm giá: <b className="text-green-600">{values?.quantity}</b>
                    </li> */}
                    {(effectiveTime[0] && effectiveTime[1]) !== null && (
                      <li className={classes.typographyInfo}>
                        Thời gian hiệu lực:{' '}
                        <b className="text-green-600">
                          {' '}
                          {moment(effectiveTime[0])?.format('DD/MM/YYYY hh:mm:ss ')} ~{' '}
                          {moment(effectiveTime[1])?.format('DD/MM/YYYY hh:mm:ss ')}
                        </b>
                      </li>
                    )}
                  </ul>
                </Alert>
              </DialogContent>
              <DialogActions sx={{ margin: '0 16px !important' }}>
                <Button
                  sx={{
                    color: 'gray',
                    borderColor: 'gray ',
                    '&:hover': { color: 'primary.main' },
                    width: '100%',
                    height: '33px !important',
                  }}
                  variant="outlined"
                  onClick={handleAlertClose}
                  className={classes.buttonCreate}
                >
                  Huỷ
                </Button>
                <LoadingButton
                  sx={{ width: '100%', height: '33px !important' }}
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                  className={classes.buttonCreate}
                  form="createDiscount"
                >
                  Tạo mới
                </LoadingButton>
              </DialogActions>
            </Dialog>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
}
