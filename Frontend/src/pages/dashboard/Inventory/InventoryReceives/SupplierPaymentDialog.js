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

SupplierPaymentDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  detailReceipt: PropTypes.object,
};

export default function SupplierPaymentDialog({ open, onClose, detailReceipt }) {
  const dispatch = useDispatch();
  const handlePaymentClick = () => {
    try {
      dispatch(updateReceipt(detailReceipt?._id, { supplierPaidCost: detailReceipt?.supplierCost }));
      onClose();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Dialog fullWidth maxWidth="xs" open={open} sx={{ zIndex: '10000' }} onClose={onClose}>
      <ModalDialog onClose={onClose}> Thanh toán cho nhà cung cấp</ModalDialog>
      <hr />
      <DialogContent className="!py-4">
        <div>
          <div className="flex justify-between py-1.5 text-sm">
            <div>Tổng tiền cần trả NCC</div>
            <div>{formatPriceInVND(detailReceipt?.supplierCost)}</div>
            {/* <div>{isNaN(totalReceivedQuantity()) ? 0 : totalReceivedQuantity()}</div> */}
          </div>
          <div className="flex justify-between py-1.5 text-sm">
            <div>Đã trả NCC</div>
            <div>{detailReceipt?.supplierPaidCost > 0 ? formatPriceInVND(detailReceipt?.supplierPaidCost) : '0 ₫'}</div>
            {/* <div>{formatPriceInVND(totalPrice())}</div> */}
          </div>
          <div className="flex justify-between py-1.5 text-sm mb-2">
            <div>Cần trả thêm</div>
            <div>{formatPriceInVND(detailReceipt?.totalPrice)}</div>
            {/* <div>{formatPriceInVND(totalPrice())}</div> */}
          </div>
          <hr />
          <div className="flex justify-between mt-2 text-sm mb-2 font-bold">
            <div>Tổng tiền thanh toán</div>
            <div>{formatPriceInVND(detailReceipt?.supplierCost)}</div>
            {/* <div>{formatPriceInVND(totalPrice())}</div> */}
          </div>
        </div>
      </DialogContent>

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
            onClick={handlePaymentClick}
          >
            Thanh toán
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
