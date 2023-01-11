import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Divider, Typography, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { resetCart } from '../../../../redux/slices/product';
// routes
import { PATH_AUTH } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import { DialogAnimate } from '../../../../components/animate';
// assets
import { OrderCompleteIllustration } from '../../../../assets';

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
  const { createOrderSuccess } = useSelector((state) => state.order);
  console.log('createOrderSuccess', createOrderSuccess);
  const handleResetStep = () => {
    dispatch(resetCart());
    navigate(PATH_AUTH.home);
  };

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
