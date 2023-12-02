import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Box, Button, Divider, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// redux
import { resetCart } from '../../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_AUTH } from '../../../../routes/paths';
// components
import { DialogAnimate } from '../../../../components/animate';
import Iconify from '../../../../components/Iconify';
// assets
import { OrderCompleteIllustration } from '../../../../assets';
import { createOrder } from '../../../../redux/slices/order';

// ----------------------------------------------------------------------

const DialogStyle = styled(DialogAnimate)(({ theme }) => ({
  '& .MuiDialog-paper': {
    margin: 0,
    [theme.breakpoints.up('md')]: {
      maxWidth: 'calc(100% - 48px)',
      maxHeight: 'calc(100% - 48px)',
    },
  },
}));

// ----------------------------------------------------------------------

export default function CheckoutOrderComplete({ ...other }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const search = useLocation().search;

  const orderId = new URLSearchParams(search).get('orderId');
  const requestId = new URLSearchParams(search).get('requestId');
  const resultCode = new URLSearchParams(search).get('resultCode');
  const message = new URLSearchParams(search).get('message');
  const transId = new URLSearchParams(search).get('transId');

  const { createOrderSuccess } = useSelector((state) => state.order);

  const { checkout } = useSelector((state) => state.product);

  const handleResetStep = () => {
    dispatch(resetCart());
    navigate(PATH_AUTH.home);
  };

  useEffect(async () => {
    let cartCheckout = {};
    if (resultCode && checkout) {
      const paymentMethod = {
        name: checkout.payment,
        resultCode,
        message,
        orderId,
        transId,
      };
      cartCheckout = {
        ...checkout,
        status: Number(resultCode) === 1006 ? 'Đã hủy' : 'Đang xử lý',
        paymentMethod,
      };

      await dispatch(createOrder(cartCheckout));
    }
  }, [checkout]);

  return (
    <DialogStyle fullScreen {...other} isInvoice={'yes'}>
      <Box sx={{ p: 4, maxWidth: 480, margin: 'auto' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" paragraph>
            Cám ơn vì đã mua hàng!
          </Typography>

          <OrderCompleteIllustration sx={{ height: 260, my: 10 }} />

          <Typography align="left" paragraph>
            Cảm ơn đã đặt hàng &nbsp;
            <Link href="#">#{createOrderSuccess?._id}</Link>
          </Typography>

          <Typography align="left" sx={{ color: 'text.secondary' }}>
            Chúng tôi sẽ gửi thông báo cho bạn khi hàng được giao.
            <br /> <br /> Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào thì hãy liên hệ với chúng tôi. <br /> <br /> Tất
            cả những điều tốt nhất,
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="space-between" spacing={2}>
          <Button color="inherit" onClick={handleResetStep} startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}>
            Tiếp tục mua sắm
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon={'ant-design:file-pdf-filled'} />}
            onClick={handleResetStep}
          >
            Tải xuống PDF
          </Button>
        </Stack>
      </Box>
    </DialogStyle>
  );
}
