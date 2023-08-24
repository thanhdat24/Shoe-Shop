import { DateRangePicker, DateRange, LoadingButton } from '@mui/lab';
import React, { Fragment, useEffect, useState } from 'react';

import {
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
  Grid,
  Card,
  Button,
  Switch,
  Box,
  TextField,
  Alert,
  Dialog,
  DialogContent,
  DialogActions,
  Autocomplete,
  Input,
  InputAdornment,
  TableContainer,
  Table,
  TableBody,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as Yup from 'yup';
import _ from 'lodash';

import moment from 'moment';
// import { LoadingButton } from '@mui/lab';
import { useFormik, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useHistory, useNavigate, Link as RouterLink, useParams } from 'react-router-dom';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { createDiscount, resetDiscount } from '../../../../redux/slices/promotion';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { fNumber, fNumberVND, formatPriceInVND } from '../../../../utils/formatNumber';
import SaveCancelButtons from '../../../../components/SaveCancelButtons/SaveCancelButtons';
import { province } from '../../../../_mock';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import { getListProvince, getListWard } from '../../../../redux/slices/address';
import { createSupplier, getSuppliers, resetSupplier } from '../../../../redux/slices/supplier';
import useAuth from '../../../../hooks/useAuth';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableHeadCustom, TableSelectedActions, TableSkeleton } from '../../../../components/table';
import { getProducts } from '../../../../redux/slices/product';
import useTable, { getComparator } from '../../../../hooks/useTable';
import { InventoryTableRow, InventoryTableToolbar } from '../../../../sections/@dashboard/Inventory/InventoryReceives';
import SearchModelProductRow from './SearchModelProductRow';
import useToggle from '../../../../hooks/useToggle';
import { createReceipt, getDetailReceipts, resetReceipt, updateReceiptDraft } from '../../../../redux/slices/receipt';
import { InventoryEditTableRow } from '../../../../sections/@dashboard/Inventory/InventoryReceivesEdit';
import Label from '../../../../components/Label';
import SupplierPaymentDialog from './SupplierPaymentDialog';
import ConfirmImport from './ConfirmImport';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      transitionDuration: '0.2s',
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
      '&:hover': {
        backgroundColor: '#00AB55',
        color: '#fff',
      },
    },
  },
}));

const TABLE_HEAD = [
  { id: 'name', label: 'Tên sản phẩm', align: 'left', minWidth: 150 },
  { id: 'soluongnhap', label: 'Số lượng nhập', align: 'center', minWidth: 50 },
  { id: 'dongia', label: 'Đơn giá', align: 'center', minWidth: 50 },
  { id: 'thanhtien', label: 'Thành tiền', align: 'center', minWidth: 50 },
];

export default function InventoryReceivesReturn() {
  const {
    dense,

    rowsPerPage,

    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { toggle: open, onOpen, onClose } = useToggle();
  const [openConfirmImport, setOpenConfirmImport] = useState(false);
  const { receiptCode } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { detailReceipt, updateReceiptSuccess } = useSelector((state) => state.receipt);

  const { products, isLoading } = useSelector((state) => state.product);
  const theme = useTheme();

  const [inventoryData, setInventoryData] = useState([]);
  console.log('inventoryData456', inventoryData);
  const handleCloseConfirmImport = () => {
    setOpenConfirmImport(false);
  };
  const handleOpenConfirmImport = () => {
    setOpenConfirmImport(true);
  };

  const totalReceivedQuantity = () => {
    return inventoryData.reduce((sum, item) => sum + item.quantity, 0);
  };

  const totalPrice = () => {
    return inventoryData.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const groupByReceiptDetail = _(detailReceipt?.receiptDetail)
    .groupBy((x) => x.idProductDetail.idProduct.name)
    .map((value, key) => ({
      name: key,
      receiptDetail: value,
    }))
    .value();

  useEffect(() => {
    dispatch(getDetailReceipts(receiptCode));
  }, [dispatch]);

  useEffect(() => {
    if (updateReceiptSuccess) {
      enqueueSnackbar('Thanh toán thành công', { variant: 'success' });
      dispatch(getDetailReceipts(receiptCode));
    }
  }, [updateReceiptSuccess]);

  const handleImport = () => {
    try {
      console.log('inventoryData123', inventoryData);
      console.log('detailReceipt123', detailReceipt);
      const data = {
        ...detailReceipt,
        inventoryStatus: 2,
        supplierCost: totalPrice(),
        totalPrice: totalPrice(),
        totalReceivedQuantity: totalReceivedQuantity(),
        receiptDetail: inventoryData,
        updateAt: new Date(),
      };
      dispatch(updateReceiptDraft(detailReceipt?._id, data));
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  const inventoryStatus = detailReceipt?.inventoryStatus;
  const labelVariant = theme.palette.mode === 'light' ? 'ghost' : 'filled';
  let labelColor = 'default';
  let labelText = 'Nhập';
  let costDisplay;
  const supplierCost = detailReceipt?.supplierCost;
  if (inventoryStatus === 2) {
    labelText = 'Đã nhập hàng';
    labelColor = 'success';
  } else if (inventoryStatus === 3) {
    labelText = 'Đã xuất trả';
    labelColor = 'success';
  }

  if (totalPrice()) {
    costDisplay = formatPriceInVND(totalPrice());
  } else {
    costDisplay = formatPriceInVND(supplierCost);
  }

  useEffect(() => {
    return () => {
      dispatch(resetReceipt());
    };
  }, []);

  return (
    <Container sx={{ paddingRight: '0px !important', paddingLeft: '0px !important' }}>
      <Box sx={{ width: '100%', typography: 'body1', marginTop: 2 }}>
        <Box>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid container xs={8} sx={{ marginBottom: '30px' }}>
              <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} className="w-full">
                <Box gridColumn="span 6">
                  <Card
                    sx={{
                      borderRadius: ' 3px !important',
                      zIndex: 0,
                      padding: '24px',
                      height: '100%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div className="mb-4 font-semibold  ">Nhà Cung Cấp</div>
                    <hr />
                    {/* <RHFTextField fullWidth className="!mt-5" supplier="supplier" label="Chọn nhà cung cấp" /> */}
                    <Box className="pt-3 text-sm text-[#637381]">
                      <Box className="font-medium text-black mb-2">{detailReceipt?.supplier.name}</Box>
                      <Box>{detailReceipt?.supplier.fullAddress} Vietnam</Box>
                      <Box className=" pt-3">{detailReceipt?.supplier.phoneNumber}</Box>
                    </Box>
                  </Card>
                </Box>

                <Box gridColumn="span 6">
                  <Card
                    sx={{
                      borderRadius: ' 3px !important',
                      zIndex: 0,
                      padding: '24px',
                      height: '100%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div className="mb-4 font-semibold  ">Kho Nhập</div>
                    <hr />
                    <Box className="mt-5 text-sm">
                      <Box className="font-medium">Địa điểm mặc định</Box>
                      <Box className="text-[#637381] pt-3">{detailReceipt?.receivingWarehouse.warehouseAddress}</Box>
                      <Box className="text-[#637381] pt-3">
                        {detailReceipt?.receivingWarehouse.warehousePhoneNumber}
                      </Box>
                    </Box>
                  </Card>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: '0px !important' }}>
              <Card
                sx={{
                  borderRadius: ' 3px !important',
                  zIndex: 0,
                  padding: '24px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <div className="">
                  <div className="mb-4 font-semibold  ">Nhân Viên Xử Lý</div>
                  <hr />
                  <Box className="mt-4">{detailReceipt?.staffProcessor.email}</Box>
                  {/* <RHFTextField name="staffProcessor.email" className="!mt-3" /> */}
                </div>
              </Card>
            </Grid>
          </Grid>

          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid xs={8} sx={{ marginBottom: '80px' }}>
              <Card
                sx={{
                  borderRadius: ' 3px !important',
                  zIndex: 0,
                  padding: '16px',
                  height: '100%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  width: '100%',
                }}
              >
                <div className="mb-4 font-semibold  ">Sản Phẩm</div>
                <hr />
                {/* <Scrollbar> */}
                <TableContainer sx={{ marginTop: 5 }}>
                  <Table size={dense ? 'small' : 'medium'}>
                    <TableHeadCustom
                      className="!text-xs"
                      headLabel={TABLE_HEAD}
                      rowCount={groupByReceiptDetail.length}
                      onSort={onSort}
                    />

                    <TableBody>
                      {(isLoading ? [...Array(rowsPerPage)] : groupByReceiptDetail).map((row, index) => (
                        <InventoryEditTableRow
                          groupByReceiptDetail={groupByReceiptDetail}
                          key={row.id}
                          row={row}
                          setInventoryData={setInventoryData}
                          inventoryData={inventoryData}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
            <Grid item xs={4} sx={{ paddingTop: '0px !important' }}>
              <Card
                sx={{
                  borderRadius: '3px !important',
                  zIndex: 0,
                  padding: '24px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <div className="">
                  <div className="mb-4 font-semibold  ">Giá Trị Nhập</div>
                  <hr />
                  <div className="mt-4 mb-4">
                    <div className="flex justify-between py-1.5 text-sm">
                      <div>Tổng số lượng nhập</div>
                      <div>
                        {totalReceivedQuantity() ? totalReceivedQuantity() : detailReceipt?.totalReceivedQuantity}
                      </div>
                    </div>

                    <div className="flex justify-between py-1.5 text-sm">
                      <div>Tổng tiền hàng</div>
                      <div>
                        {totalPrice() ? formatPriceInVND(totalPrice()) : formatPriceInVND(detailReceipt?.totalPrice)}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-4 mb-4">
                    <div className="flex justify-between py-1.5 text-sm font-bold">
                      <div>Tổng giá trị nhập hàng</div>
                      <div>
                        {totalPrice() ? formatPriceInVND(totalPrice()) : formatPriceInVND(detailReceipt?.totalPrice)}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-4">
                    <div className="flex justify-between py-1.5 text-sm">
                      <div>Đã thanh toán NCC</div>
                      <div>
                        {detailReceipt?.supplierPaidCost > 0
                          ? formatPriceInVND(detailReceipt?.supplierPaidCost)
                          : '0 ₫'}
                      </div>
                    </div>
                    <div className="flex justify-between py-1.5 text-sm font-bold">
                      <div>Còn nợ</div>
                      <div>{detailReceipt?.supplierPaidCost > 0 ? 'Không có nợ' : costDisplay}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <LoadingButton
                      size="large"
                      variant="contained"
                      sx={{ width: '100%', height: '40px', textTransform: 'none' }}
                      onClick={() => handleOpenConfirmImport()}
                    >
                      Trả hàng
                    </LoadingButton>
                  </div>
                </div>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* {openPayment && <SupplierPaymentDialog open={open} />} */}
      <SupplierPaymentDialog open={open} onClose={onClose} detailReceipt={detailReceipt} />
      <ConfirmImport
        title="Xác nhận trả hàng"
        content="Bạn có chắc chắn muốn tạo phiếu trả hàng?"
        open={openConfirmImport}
        onClose={() => handleCloseConfirmImport()}
        onSave={() => handleImport()}
      />
    </Container>
  );
}
