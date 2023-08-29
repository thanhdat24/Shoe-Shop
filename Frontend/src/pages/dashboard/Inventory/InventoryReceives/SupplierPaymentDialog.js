import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// @mui
import { Box, Stack, Dialog, Button, DialogContent, DialogActions, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import ModalDialog from '../../../../components/ModalDialog/DialogTitle';
import { formatPriceInVND } from '../../../../utils/formatNumber';
import { useDispatch, useSelector } from '../../../../redux/store';
import { makeSupplierPayment,  } from '../../../../redux/slices/receipt';
import { FormProvider, RHFRadioGroupName } from '../../../../components/hook-form';

SupplierPaymentDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  detailReceipt: PropTypes.object,
};

export default function SupplierPaymentDialog({ open, onClose, detailReceipt }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { payments } = useSelector((state) => state.payment);
  const [amount, setAmount] = useState(0);
  const defaultValues = {
    paymentMethod: null,
  };
  const methods = useForm({ defaultValues });

  const {  watch, setValue } = methods;
  const values = watch();

  const handlePaymentClick = () => {
    const receipt = {
      totalPrice: detailReceipt?.totalPrice,
      amount,
      paymentHistory: {
        amount,
        paymentMethod: {
          name: values.paymentMethod,
          resultCode: 0,
          message: 'Giao dịch thành công.',
        },
      },
    };
    try {
      if (!values.paymentMethod) {
        enqueueSnackbar('Vui lòng chọn phương thức thanh toán', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      } else if (amount > detailReceipt?.supplierCost - detailReceipt?.supplierPaidCost) {
        enqueueSnackbar('Tổng số tiền thanh toán không được lớn hơn số tiền cần thanh toán', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      } else {
        dispatch(makeSupplierPayment(detailReceipt?._id, receipt));
        setValue('paymentMethod', null);
        onClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseModal = () => {
    setValue('paymentMethod', null);
    onClose();
  };

  useEffect(() => {
    if (!values.paymentMethod) {
      setAmount(0);
    } else {
      setAmount(detailReceipt?.supplierCost - detailReceipt?.supplierPaidCost);
    }
  }, [values.paymentMethod]);

  return (
    <FormProvider methods={methods}>
      <Dialog fullWidth maxWidth="xs" open={open} sx={{ zIndex: '10000' }} onClose={handleCloseModal}>
        <ModalDialog onClose={handleCloseModal}> Thanh toán cho nhà cung cấp</ModalDialog>
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
              <div>{formatPriceInVND(detailReceipt?.supplierPaidCost)}</div>
              {/* <div>{formatPriceInVND(totalPrice())}</div> */}
            </div>
            <div className="flex justify-between py-1.5 text-sm mb-2">
              <div>Cần trả thêm</div>
              <div>{formatPriceInVND(detailReceipt?.totalPrice - detailReceipt?.supplierPaidCost)}</div>
              {/* <div>{formatPriceInVND(totalPrice())}</div> */}
            </div>
            <hr />
            {payments?.length > 0 && payments[0] !== null && (
              <Box>
                <Box className="flex justify-between items-center ">
                  <RHFRadioGroupName
                    name="paymentMethod"
                    options={[
                      {
                        name: payments[0]?.name.includes('tiền mặt') ? 'Tiền mặt' : payments[0]?.name,
                        id: payments[0]?._id,
                      },
                    ]}
                    row={false}
                  />
                  {values.paymentMethod && (
                    <TextField
                      sx={{
                        width: '150px !important',
                        padding: '10px 0px',
                      }}
                      inputProps={{
                        style: { textAlign: 'end' },
                      }}
                      type="number"
                      size="small"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.valueAsNumber);
                      }}
                    />
                  )}
                </Box>
                {values.paymentMethod && (
                  <Box className="pl-[30px] text-left text-sm py-3">
                    <Box className="font-bold mb-3">Chi nhánh</Box>
                    <Box>121, CMT8, An Thới, Bình Thuỷ, Cần Thơ, Vietnam</Box>
                  </Box>
                )}
              </Box>
            )}

            <div className="flex justify-between mt-2 text-sm mb-2 font-bold">
              <div>Tổng tiền thanh toán</div>
              <div>{formatPriceInVND(amount)}</div>
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
              onClick={handleCloseModal}
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
    </FormProvider>
  );
}
