import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
//
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onGotoStep, onBackStep, onNextStep, applyShipping } from '../../../../redux/slices/product';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider } from '../../../../components/hook-form';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import { createMoMoPayment, getPayments } from '../../../../redux/slices/payment';
import { createOrder } from '../../../../redux/slices/order';
import { fCurrency } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = [
  {
    value: 'paypal',
    title: 'Pay with Paypal',
    description: 'You will be redirected to PayPal website to complete your purchase securely.',
    icons: ['https://minimal-assets-api.vercel.app/assets/icons/ic_paypal.svg'],
  },
  {
    value: 'credit_card',
    title: 'Credit / Debit Card',
    description: 'We support Mastercard, Visa, Discover and Stripe.',
    icons: [
      'https://minimal-assets-api.vercel.app/assets/icons/ic_mastercard.svg',
      'https://minimal-assets-api.vercel.app/assets/icons/ic_visa.svg',
    ],
  },
  {
    value: 'cash',
    title: 'Cash on CheckoutDelivery',
    description: 'Pay with cash when your order is delivered.',
    icons: [],
  },
];

export default function CheckoutPayment() {
  // const { orderId = '', requestId } = useParams();
  const search = useLocation().search;

  const orderId = new URLSearchParams(search).get('orderId');
  const requestId = new URLSearchParams(search).get('requestId');

  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const { payments } = useSelector((state) => state.payment);

  const { total, discount, subtotal, shipping } = checkout;

  const [linkMoMo, setLinkMoMo] = useState('');

  const checkoutLinkRef = useRef();

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  // const handleApplyShipping = (value) => {
  //   dispatch(applyShipping(value));
  // };

  useEffect(() => {
    dispatch(getPayments());
  }, [dispatch]);

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Vui lòng chọn phương thức thanh toán phù hợp!'),
  });

  const defaultValues = {
    delivery: shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      const paymentMethod = {
        name: data.payment,
        resultCode: 1000,
        message: 'Giao dịch đã được khởi tạo, chờ người dùng xác nhận thanh toán.',
        orderId: '',
      };
      let cartCheckout = {};
      cartCheckout = { ...checkout, paymentMethod };

      if (data.payment === 'Thanh toán qua ví Momo') {
        const data = await createMoMoPayment({
          // _id: idShowtime,
          total: cartCheckout.total,
          extraData: { cartCheckout },
          orderInfo: `${cartCheckout.address.fullName} - ${cartCheckout.address.phoneNumber} - ${
            cartCheckout.address.fullAddress
          } - Tổng tiền ${fCurrency(cartCheckout.total)}đ`,
        });

        setLinkMoMo(data.data.payUrl);
        checkoutLinkRef.current.click();
      } else {
        dispatch(createOrder(cartCheckout));
        handleNextStep();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (orderId) {
      handleNextStep();
    }
  }, [orderId]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutPaymentMethods paymentOptions={payments} />
          <Button
            size="small"
            color="inherit"
            onClick={handleBackStep}
            startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
          >
            Trở lại
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutBillingInfo onBackStep={handleBackStep} />

          <CheckoutSummary
            enableEdit
            total={total}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            onEdit={() => handleGotoStep(0)}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!values.payment && 1}
          >
            Đặt hàng
          </LoadingButton>

          <a ref={checkoutLinkRef} style={{ display: 'none' }} href={linkMoMo}>
            checkout momo
          </a>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
