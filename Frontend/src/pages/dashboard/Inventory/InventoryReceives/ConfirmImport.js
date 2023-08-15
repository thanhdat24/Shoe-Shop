import React, { useState } from 'react';
import PropTypes from 'prop-types';

// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Autocomplete,
  TextField,
  TableContainer,
  TableBody,
  Table,
} from '@mui/material';
import ModalDialog from '../../../../components/ModalDialog/DialogTitle';
import { formatPriceInVND } from '../../../../utils/formatNumber';
import { useDispatch } from '../../../../redux/store';
import { updateReceipt } from '../../../../redux/slices/receipt';

ConfirmImport.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave : PropTypes.func,
};

export default function ConfirmImport({ open, onClose, onSave }) {
  const dispatch = useDispatch();
  const handlePaymentClick = () => {};
  return (
    <Dialog fullWidth maxWidth="xs" open={open} sx={{ zIndex: '10000' }} onClose={onClose}>
      <ModalDialog onClose={onClose}> Xác nhận nhập hàng</ModalDialog>
      <hr />
      <DialogContent className="!py-4">Bạn có chắc chắn muốn tạo phiếu nhập hàng?</DialogContent>

      <DialogActions>
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Button
            sx={{
              color: 'gray',
              borderColor: 'gray ',
              '&:hover': { color: 'primary.main' },
              padding: '6px 13px !important',
              fontWeight: '700 !important',
              lineHeight: '1.71429 !important',
              fontSize: '0.8rem !important',
              textTransform: 'none !important',
              height: '38px !important',
            }}
            variant="outlined"
            onClick={onClose}
          >
            Đóng
          </Button>
          <Button
            sx={{
              padding: '6px 13px !important',
              fontWeight: '700 !important',
              lineHeight: '1.71429 !important',
              fontSize: '0.8rem !important',
              textTransform: 'none !important',
              height: '38px !important',
            }}
            size="large"
            variant="contained"
            // disabled={!isDisabledSave}
            onClick={onSave}
          >
            Đồng ý
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
