import PropTypes from 'prop-types';
// @mui
import { Card, Button, Typography, CardHeader, CardContent } from '@mui/material';
// redux
import { useSelector } from '../../../../redux/store';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

CheckoutBillingInfo.propTypes = {
  onBackStep: PropTypes.func,
};

export default function CheckoutBillingInfo({ onBackStep }) {
  const { checkout } = useSelector((state) => state.product);

  const { address } = checkout;

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Billing Address"
        action={
          <Button size="small" startIcon={<Iconify icon={'eva:edit-fill'} />} onClick={onBackStep}>
            Edit
          </Button>
        }
      />
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {address?.receiver}&nbsp;
          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
            ({address?.addressType})
          </Typography>
        </Typography>

        <Typography variant="body2" gutterBottom>
          {address?.fullAddress}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {address?.phone}
        </Typography>
      </CardContent>
    </Card>
  );
}
