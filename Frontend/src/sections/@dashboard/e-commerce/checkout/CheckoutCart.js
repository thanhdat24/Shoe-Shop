import sum from 'lodash/sum';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Grid, Card, Button, CardHeader, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import {
  deleteCart,
  onNextStep,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
} from '../../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import EmptyContent from '../../../../components/EmptyContent';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutProductList from './CheckoutProductList';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const { cart, total, discount, subtotal } = checkout;

  const totalItems = sum(cart.map((item) => item.quantity));

  const isEmptyCart = cart.length === 0;

  const handleDeleteCart = (itemIndex) => {
    console.log('itemIndex', itemIndex);
    dispatch(deleteCart(itemIndex));
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleIncreaseQuantity = (itemIndex) => {
    dispatch(increaseQuantity(itemIndex));
  };

  const handleDecreaseQuantity = (itemIndex) => {
    dispatch(decreaseQuantity(itemIndex));
  };

  const handleApplyDiscount = (value) => {
    dispatch(applyDiscount(value));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Tất cả
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({totalItems} sản phẩm)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {!isEmptyCart ? (
            <Scrollbar>
              <CheckoutProductList
                products={cart}
                onDelete={handleDeleteCart}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
              />
            </Scrollbar>
          ) : (
            <EmptyContent
              title="Cart is empty"
              description="Có vẻ như bạn không có mặt hàng nào trong giỏ hàng của bạn."
              img="./static/empty_cart.svg"
            />
          )}
        </Card>

        <Button color="inherit" component={RouterLink} to="/" startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}>
          Tiếp tục mua sắm
        </Button>
      </Grid>

      <Grid item xs={12} md={4}>
        <CheckoutSummary
          enableDiscount
          total={total}
          discount={discount}
          subtotal={subtotal}
          onApplyDiscount={handleApplyDiscount}
        />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={cart.length === 0}
          onClick={handleNextStep}
        >
          Thanh toán
        </Button>
      </Grid>
    </Grid>
  );
}
