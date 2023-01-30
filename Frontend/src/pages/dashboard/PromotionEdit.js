import { DateRangePicker, DateRange, LoadingButton } from '@mui/lab';
import React, { useEffect, useState } from 'react';
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
import { useHistory, useNavigate, useParams } from 'react-router-dom';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTheme, styled } from '@mui/material/styles';

import { useStyles } from './PromotionStyle';
import Chip from '../../theme/overrides/Chip';

import Label from '../../components/Label';
import { createDiscount, getPromotionDetail, resetDiscount, updatePromotion } from '../../redux/slices/promotion';

// import { createDiscount, resetDiscount } from '/redux/actions/Discount';
import ModalDialog from '../../components/ModalDialog/DialogTitle';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

export default function PromotionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { promotionDetail, isLoading, success, error } = useSelector((state) => state.promotion);
  const [effectiveTime, setEffectiveTime] = useState([null, null]);
  const codeRegExp = /^[A-Za-z0-9_-]{5,10}$/;
  const isDisabled =
    (promotionDetail?.activeCode === 'Kết thúc' || promotionDetail?.activeCode === 'Đang diễn ra') && 1;
  const CreateSchema = Yup.object().shape({
    title: Yup.string().required('*Vui lòng nhập thông tin này'),
    code: Yup.string()
      .required('*Vui lòng nhập thông tin này')
      .matches(codeRegExp, 'Vui lòng nhập tối thiểu 5 ký tự và tối đa 10 ký tự'),
    price: Yup.string().required('*Vui lòng nhập thông tin này'),
    miniPrice: Yup.string().required('*Vui lòng nhập thông tin này'),
    quantity: Yup.string().required('*Vui lòng nhập thông tin này'),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: promotionDetail?.title,
      code: promotionDetail?.code,
      price: promotionDetail?.price,
      percent: promotionDetail?.percent,
      miniPrice: promotionDetail?.miniPrice,
      quantity: promotionDetail?.quantity,
      startDate:
        moment(effectiveTime[0])?.format('YYYY-MM-DD') !== 'Invalid date'
          ? moment(effectiveTime[0])?.format('YYYY-MM-DD')
          : promotionDetail?.startDate,
      expiryDate:
        moment(effectiveTime[1])?.format('YYYY-MM-DD') !== 'Invalid date'
          ? moment(effectiveTime[1])?.format('YYYY-MM-DD')
          : promotionDetail?.expiryDate,
      activeCode: promotionDetail?.activeCode,
      activePublic: true,
    },

    validationSchema: CreateSchema,
    onSubmit: (data) => {
      if (isLoading) {
        return;
      }
      dispatch(updatePromotion(data, id));
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, values, setFieldValue } = formik;

  const [open, setOpen] = React.useState(false);

  const handleChangePublic = (event, checked) => {
    setFieldValue('activePublic', (checked && true) || false);
  };
  const theme = useTheme();
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
      values.quantity &&
      values.startDate !== 'Invalid date' &&
      values.expiryDate !== 'Invalid date'
    )
      setIsReadyCreateDiscount(true);
    else setIsReadyCreateDiscount(false);
  }, [values.title, values.code, values.price, values.miniPrice, values.quantity, values.startDate, values.expiryDate]);

  useEffect(() => {
    dispatch(getPromotionDetail(id));
    return () => {
      //   dispatch({ type: RESET_DISCOUNT_DETAIL });
    };
  }, []);
  const handleEdit = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate(PATH_DASHBOARD.promotion.list);
        // history.push('/admin/discount/list');
      }, 100);
      setTimeout(() => {
        enqueueSnackbar('Cập nhật thành công!', { variant: 'success' });
      }, 150);
      return;
    }
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [success, error]);

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
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={7.5}>
        <Stack spacing={2}>
          <Typography variant="h4" gutterBottom>
            Tạo mã giảm giá mới
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
          <Box>
            <span className="mr-3">Trạng thái</span>
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              // color={active ? 'success' : 'error'}
              color={
                (promotionDetail?.activeCode === 'Kết thúc' && 'error') ||
                (promotionDetail?.activeCode === 'Đang diễn ra' && 'success') ||
                'warning'
              }
              sx={{ textTransform: 'capitalize' }}
            >
              {promotionDetail?.activeCode}
            </Label>
          </Box>
        </Stack>
      </Stack>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <>
            {promotionDetail !== null && (
              <Formik value={formik}>
                <Form onSubmit={handleSubmit} id="editDiscount">
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={8} sx={{ marginBottom: '80px' }}>
                      <Card
                        sx={{
                          borderRadius: ' 16px',
                          zIndex: 0,
                          padding: '24px',
                        }}
                      >
                        <div className="mb-4 text-lg font-semibold text-center uppercase text-green-600">Thông tin</div>
                        <Stack spacing={3}>
                          <TextField
                            fullWidth
                            autoComplete="title"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            label="Tên mã giảm giá "
                            {...getFieldProps('title')}
                            error={Boolean(touched.title && errors.title)}
                            helperText={touched.title && errors.title}
                            disabled={promotionDetail?.activeCode === 'Kết thúc' && 1}
                          />
                          <span className={classes.textValidation}>Chỉ bao gồm từ 5 - 10 ký tự thường và chữ số.</span>
                          <TextField
                            fullWidth
                            autoComplete="code"
                            label="Mã giảm giá"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            className="mt-0"
                            {...getFieldProps('code')}
                            error={Boolean(touched.code && errors.code)}
                            helperText={touched.code && errors.code}
                            disabled={isDisabled}
                          />
                          <Box sx={{ display: 'flex' }}>
                            <Box className="mr-28 whitespace-nowrap text-green-600 font-semibold mt-2">
                              Công khai mã giảm giá
                            </Box>
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
                                  disabled={promotionDetail?.activeCode === 'Kết thúc' && 1}
                                />
                                <Typography>Công khai</Typography>
                              </Box>
                              {values.activePublic && (
                                <span className="text-red-500 text-sm">
                                  <span className="font-semibold"> Lưu ý:</span> Mã giảm giá được công khai trong trang
                                  chi tiết sản phẩm, cho tất cả các khách hàng!
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
                        <div className="mb-4 text-lg font-semibold text-center uppercase text-green-600">Điều kiện</div>
                        <Stack spacing={3}>
                          <TextField
                            fullWidth
                            autoComplete="price"
                            type="text"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            label="Số tiền giảm giá"
                            {...getFieldProps('price')}
                            error={Boolean(touched.price && errors.price)}
                            helperText={touched.price && errors.price}
                            disabled={isDisabled}
                          />
                          <TextField
                            fullWidth
                            label="Giá trị đơn hàng tối thiểu "
                            InputLabelProps={{
                              shrink: true,
                            }}
                            {...getFieldProps('miniPrice')}
                            error={Boolean(touched.miniPrice && errors.miniPrice)}
                            helperText={touched.miniPrice && errors.miniPrice}
                            disabled={isDisabled}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box className="mr-28 whitespace-nowrap text-green-600 font-semibold">
                              Thời gian hiệu lực{' '}
                            </Box>
                            <DateRangePicker
                              startText="Ngày bắt đầu"
                              endText="Ngày kết thúc"
                              disablePast={values.activeCode === 'Sắp diễn ra' && true}
                              value={
                                effectiveTime[0] || effectiveTime[1]
                                  ? effectiveTime
                                  : [
                                      moment(promotionDetail?.startDate)?.format('YYYY-MM-DD'),
                                      moment(promotionDetail?.expiryDate)?.format('YYYY-MM-DD'),
                                    ]
                              }
                              onChange={(newValue) => {
                                setEffectiveTime(newValue);
                              }}
                              renderInput={(startProps, endProps) => (
                                <>
                                  <TextField {...startProps} disabled={isDisabled} />
                                  <Box sx={{ mx: 2 }}> đến </Box>
                                  <TextField {...endProps} disabled={promotionDetail?.activeCode === 'Kết thúc' && 1} />
                                </>
                              )}
                            />
                          </Box>
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
                        <div className="mb-3 text-lg font-semibold text-center uppercase text-green-600">
                          Điều kiện áp dụng
                        </div>
                        <hr />
                        <div className="flex p-3 flex-col items-center">
                          <div className="w-full m-w-full">
                            <Typography variant="h6" gutterBottom component="h4">
                              {values.title} -<span className="text-green-600"> {values.code}</span>
                            </Typography>
                            <Alert className={classes.alert} icon={false} severity="success">
                              <ul className={classes.alertMessage}>
                                <li className={classes.typographyInfo}>
                                  <span>
                                    Giảm{' '}
                                    <b className="text-green-600">{`${(values?.price * 1).toLocaleString(
                                      'vi-VI'
                                    )} đ`}</b>
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
                                  <b className="text-green-600">
                                    {`${(values?.miniPrice * 1).toLocaleString('vi-VI')} đ`}
                                  </b>
                                </li>
                                {effectiveTime[0] ? (
                                  <li className={classes.typographyInfo}>
                                    Thời gian hiệu lực:
                                    <b className="text-green-600">
                                      {' '}
                                      {moment(effectiveTime[0])?.format('DD/MM/YYYY hh:mm:ss ')} ~{' '}
                                      {moment(effectiveTime[1])?.format('DD/MM/YYYY hh:mm:ss ')}
                                    </b>
                                  </li>
                                ) : (
                                  <li className={classes.typographyInfo}>
                                    Thời gian hiệu lực:
                                    <b className="text-green-600">
                                      {' '}
                                      {moment(promotionDetail?.startDate)?.format('DD/MM/YYYY hh:mm:ss ')} ~{' '}
                                      {moment(promotionDetail?.expiryDate)?.format('DD/MM/YYYY hh:mm:ss ')}
                                    </b>
                                  </li>
                                )}
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
                          Hiện thị voucher
                        </div>
                        <hr />
                        <div className="flex p-3 flex-col items-center">
                          <div className="w-full m-w-full">
                            <div className={classes.couponPreviewContainer}>
                              <div className="relative overflow-hidden w-full rounded-lg h-28">
                                <img
                                  className="w-full h-full"
                                  src="/icons/ic_ticketBox.svg"
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
                                          src="/icons/ic_homeSelling.png"
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
                                      <p>Ví ZaloPay</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col p-3 w-full">
                                    <div className="flex flex-col h-full relative">
                                      <button className="absolute top-0 right-0 block bg-transparent w-4">
                                        <DiscountInfo
                                          title={
                                            <>
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
                                                <CopyToClipboard
                                                // text={item.code}
                                                // onCopy={handleCopy}
                                                >
                                                  <img
                                                    className="cursor-pointer"
                                                    src="/img/discount/copy-icon.svg"
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
                                                  {effectiveTime[1]
                                                    ? moment(effectiveTime[1])?.format('DD/MM/YYYY ')
                                                    : moment(promotionDetail?.expiryDate).format('DD/MM/YYYY ')}
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
                                                      Giảm &nbsp;
                                                      {values?.price / 1000}K Đơn hàng tối thiểu{' '}
                                                      {values.miniPrice / 1000}K
                                                    </li>
                                                    <li>Áp dụng cho tất cả sản phẩm</li>
                                                  </ul>
                                                </div>
                                              </div>
                                            </>
                                          }
                                          placement="left"
                                        >
                                          <img className="m-w-full" src="/img/discount/info_active.svg" alt="" />
                                        </DiscountInfo>
                                      </button>
                                      <div className="pr-7">
                                        <h4 className="text-sm font-medium leading-6 m-0 p-0 text-gray-900 max-h-6">
                                          Giảm&nbsp;{values?.price / 1000}K
                                        </h4>
                                        <p className="text-xs font-normal leading-5 m-0 p-0 text-gray-500 max-h-5">
                                          Đơn hàng tối thiểu&nbsp;
                                          {values.miniPrice / 1000}K
                                        </p>
                                      </div>
                                      <div className="flex items-end mt-auto">
                                        <p className="pr-7 text-xs font-normal leading-5 m-0 p-0 text-gray-500 max-h-5">
                                          HSD:
                                          {effectiveTime[1]
                                            ? moment(effectiveTime[1])?.format('DD/MM/YYYY')
                                            : moment(promotionDetail?.expiryDate).format('DD/MM/YYYY')}
                                        </p>
                                        <div className={classes.buttonSave}>Lưu</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {!values.activePublic && (
                                  <div className={classes.HiddenOverlay}>
                                    <span className="text-2xl text-white">
                                      <img src="/img/admin/discount/hidden-overlay.svg" alt="hidden-overlay" />
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
                  <Box className={classes.formActionBar}>
                    <Box className={classes.ActionWrapper}>
                      <Button
                        sx={{
                          color: 'gray',
                          borderColor: 'gray ',
                          '&:hover': { color: 'primary.main' },
                        }}
                        // size="medium"
                        variant="outlined"
                        onClick={() => navigate(PATH_DASHBOARD.promotion.list)}
                        className={classes.buttonCreate}
                      >
                        Quay lại
                      </Button>
                      {promotionDetail?.activeCode !== 'Kết thúc' && (
                        <>
                          {' '}
                          <Button
                            size="large"
                            variant="outlined"
                            //   disabled={!isReadyEditDiscount}
                            className={classes.buttonCreate}
                            onClick={handleAlertCreate}
                          >
                            Kết thúc
                          </Button>
                          <Button
                            size="large"
                            variant="contained"
                            //   disabled={!isReadyEditDiscount}
                            className={classes.buttonCreate}
                            onClick={handleAlertCreate}
                          >
                            Chỉnh sửa
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                  {/* Modal  */}

                  <Dialog
                    onClose={handleAlertClose}
                    open={open}
                    maxWidth="xs"

                    // sx={{width: "500px" }}
                    // fullWidth
                  >
                    <ModalDialog onClose={handleAlertClose} className="text-center">
                      Vui lòng kiểm tra điều kiện áp dụng
                    </ModalDialog>
                    <DialogContent dividers>
                      <Alert className={classes.alert} icon={false} severity="success">
                        <ul className={classes.alertMessage}>
                          <li className={classes.typographyInfo}>
                            <span>
                              Giảm{' '}
                              <b className="text-green-600">{`${(values?.price * 1).toLocaleString('vi-VI')} đ`}</b>
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
                            <b className="text-green-600">{`${(values?.miniPrice * 1).toLocaleString('vi-VI')} đ`}</b>
                          </li>
                          {effectiveTime[0] ? (
                            <li className={classes.typographyInfo}>
                              Thời gian hiệu lực:
                              <b className="text-green-600">
                                {' '}
                                {moment(effectiveTime[0])?.format('DD/MM/YYYY hh:mm:ss ')} ~{' '}
                                {moment(effectiveTime[1])?.format('DD/MM/YYYY hh:mm:ss ')}
                              </b>
                            </li>
                          ) : (
                            <li className={classes.typographyInfo}>
                              Thời gian hiệu lực:
                              <b className="text-green-600">
                                {' '}
                                {moment(promotionDetail?.startDate)?.format('DD/MM/YYYY hh:mm:ss ')} ~{' '}
                                {moment(promotionDetail?.expiryDate)?.format('DD/MM/YYYY hh:mm:ss ')}
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
                        //   loading={loadingUpdateDiscount}
                        className={classes.buttonCreate}
                        form="editDiscount"
                        onClick={handleEdit}
                      >
                        Chỉnh sửa
                      </LoadingButton>
                    </DialogActions>
                  </Dialog>
                </Form>
              </Formik>
            )}
          </>
        </Box>
      </Box>
    </Container>
  );
}
