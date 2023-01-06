import sum from 'lodash/sum';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Badge } from '@mui/material';
// redux
import { useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(RouterLink)(({ theme }) => ({
  zIndex: 999,
  right: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(16),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  boxShadow: `-12px 12px 32px -4px ${alpha(
    theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.common.black,
    0.36
  )}`,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: Number(theme.shape.borderRadius) * 2,
  borderBottomLeftRadius: Number(theme.shape.borderRadius) * 2,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 },
}));

// ----------------------------------------------------------------------

export default function CartWidget() {
  const { checkout } = useSelector((state) => state.product);
  console.log('checkoutCartWidget', checkout);
  const totalItems = sum(checkout.cart.map((item) => item.quantity));
  console.log('totalItems', totalItems);

  return (
    <RootStyle to="/checkout">
      <Badge showZero badgeContent={totalItems} color="error" max={99}>
        <Iconify icon={'eva:shopping-cart-fill'} width={24} height={24} />
      </Badge>
    </RootStyle>
  );
}
