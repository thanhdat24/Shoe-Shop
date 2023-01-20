import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import { Box, Grid, Card, Button, Typography, DialogContent } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onBackStep, onNextStep, createBilling } from '../../../../redux/slices/product';
// _mock_
import { _addressBooks } from '../../../../_mock';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutNewAddressForm from './CheckoutNewAddressForm';
import { deleteAddress, getAddress, resetAddress } from '../../../../redux/slices/address';
import { DialogAnimate } from '../../../../components/animate';

// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {
  //
  const dispatch = useDispatch();
  const { checkout } = useSelector((state) => state.product);
  const { total, discount, subtotal } = checkout;
  const { address, createAddressSuccess, deleteAddressSuccess } = useSelector((state) => state.address);
  //
  useEffect(() => {
    dispatch(getAddress());
    return dispatch(resetAddress());
  }, [dispatch, createAddressSuccess, deleteAddressSuccess]);

  //
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleCreateBilling = (value) => {
    dispatch(createBilling(value));
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {address?.map((address, index) => (
            <AddressItem
              key={index}
              address={address}
              onNextStep={handleNextStep}
              onCreateBilling={handleCreateBilling}
            />
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              size="small"
              color="inherit"
              onClick={handleBackStep}
              startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
            >
              Trở lại
            </Button>
            <Button size="small" onClick={handleClickOpen} startIcon={<Iconify icon={'eva:plus-fill'} />}>
              Thêm địa chỉ mới
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary subtotal={subtotal} total={total} discount={discount} />
        </Grid>
      </Grid>

      <CheckoutNewAddressForm
        open={open}
        onClose={handleClose}
        onNextStep={handleNextStep}
        onCreateBilling={handleCreateBilling}
      />
    </>
  );
}

// ----------------------------------------------------------------------

AddressItem.propTypes = {
  address: PropTypes.object,
  onNextStep: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

function AddressItem({ address, onNextStep, onCreateBilling }) {
  const { fullName, fullAddress, addressType, phoneNumber, isDefault, _id } = address;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [idDelete, setIdDelete] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleCreateBilling = () => {
    onCreateBilling(address);
    onNextStep();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (id) => {
    setIdDelete(id);
    setOpen(true);
  };

  const handleDeleteAddress = async (e) => {
    console.log('idDelete', idDelete);
    dispatch(deleteAddress(idDelete));
    setOpen(false);
    setTimeout(() => {
      enqueueSnackbar('Xoá địa chỉ thành công!');
    }, 500);
  };
  return (
    <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1">{fullName}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({addressType})
        </Typography>
        {isDefault && (
          <Label color="info" sx={{ ml: 1 }}>
            Mặt định
          </Label>
        )}
      </Box>
      <Typography variant="body2" gutterBottom>
        {fullAddress}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {phoneNumber}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          position: { sm: 'absolute' },
          right: { sm: 24 },
          bottom: { sm: 24 },
        }}
      >
        {!isDefault && (
          <Button variant="outlined" size="small" color="inherit" onClick={(e) => handleOpen(_id)}>
            Xoá
          </Button>
        )}
        <Box sx={{ mx: 0.5 }} />
        <Button variant="outlined" size="small" onClick={handleCreateBilling}>
          Giao đến địa chỉ này
        </Button>

        <DialogAnimate
          open={open}
          onClose={handleClose}
          onClickSubmit={(e) => handleDeleteAddress()}
          isCancel={'Hủy bỏ'}
          isEdit={'Xác nhận'}
        >
          <DialogContent>
            <Box>Xác nhận xoá địa chỉ này?</Box>
          </DialogContent>
        </DialogAnimate>
      </Box>
    </Card>
  );
}
