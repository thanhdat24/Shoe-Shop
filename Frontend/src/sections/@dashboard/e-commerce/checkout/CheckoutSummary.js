import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment,
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import Discount from './Discount';
import { useDispatch, useSelector } from '../../../../redux/store';
import { getPromotions } from '../../../../redux/slices/promotion';

// ----------------------------------------------------------------------

CheckoutSummary.propTypes = {
  total: PropTypes.number,
  discount: PropTypes.number,
  subtotal: PropTypes.number,
  shipping: PropTypes.number,
  onEdit: PropTypes.func,
  enableEdit: PropTypes.bool,
  onApplyDiscount: PropTypes.func,
};

export default function CheckoutSummary({
  total,
  onEdit,
  discount,
  subtotal,
  shipping,
  onApplyDiscount,
  enableEdit = false,
}) {
  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const displayShipping = shipping !== null ? 'Free' : '-';
  
  const { promotions } = useSelector((state) => state.promotion);

  useEffect(() => {
    dispatch(getPromotions());
  }, [dispatch]);

  //
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {checkout.activeStep === 0 && (
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title="Mã khuyến mãi"
            action={
              enableEdit && (
                <Button size="small" onClick={onEdit} startIcon={<Iconify icon={'eva:edit-fill'} />}>
                  Edit
                </Button>
              )
            }
          />

          <CardContent>
            <Stack spacing={2}>
              <button
                className="flex align-center cursor-pointer leading-6 mt-2"
                style={{ color: 'rgb(11, 116, 229)' }}
                onClick={handleClickOpen}
              >
                <img className="mr-2" src="./icons/ic_discount.svg" alt="ic_discount" />
                <span>Chọn hoặc nhập Khuyến mãi khác</span>
              </button>
              <Discount open={open} onClose={handleClose} promotions={promotions} onApplyDiscount={onApplyDiscount} />
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Tóm tắt đơn hàng"
          action={
            enableEdit && (
              <Button size="small" onClick={onEdit} startIcon={<Iconify icon={'eva:edit-fill'} />}>
                Edit
              </Button>
            )
          }
        />

        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Tạm tính
              </Typography>
              <Typography variant="subtitle2">{fCurrency(subtotal)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Giảm giá
              </Typography>
              <Typography variant="subtitle2">{discount ? fCurrency(-discount) : '-'}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Shipping
              </Typography>
              <Typography variant="subtitle2">{shipping ? fCurrency(shipping) : displayShipping}</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1">Tổng tiền</Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                  {fCurrency(total)}
                </Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                  (Đã bao gồm VAT nếu có)
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
