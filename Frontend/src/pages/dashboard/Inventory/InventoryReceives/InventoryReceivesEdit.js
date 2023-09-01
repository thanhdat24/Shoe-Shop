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
import { formatDate } from '../../../../utils/formatTime';
import { getPayments } from '../../../../redux/slices/payment';
import InventoryReceivesPrint from './InventoryReceivesPrint';


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

export default function InventoryReceivesNew() {
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
  const [openPrint, setOpenPrint] = useState(false);
  const [openConfirmInvalidProduct, setOpenConfirmInvalidProduct] = useState(false);
  const { receiptCode } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { detailReceipt, updateReceiptSuccess, updateReceiptDraftSuccess, newReceipt, makeSupplierPaymentSuccess } =
    useSelector((state) => state.receipt);
  console.log('makeSupplierPaymentSuccess', makeSupplierPaymentSuccess);
  const { products, isLoading } = useSelector((state) => state.product);
  const theme = useTheme();
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  console.log('inventoryData456', inventoryData);
  const handleClosePrint = () => {
    setOpenPrint(false);
  };
  const handleOpenPrint = () => {
    setOpenPrint(true);
  };
  const handleCloseConfirmImport = () => {
    setOpenConfirmImport(false);
  };

  const handleOpenConfirmImport = () => {
    setOpenConfirmImport(true);
  };
  const handleCloseConfirmInvalidProduct = () => {
    setOpenConfirmInvalidProduct(false);
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
    dispatch(getPayments());
  }, [dispatch, newReceipt]);

  useEffect(() => {
    if (makeSupplierPaymentSuccess) {
      enqueueSnackbar('Thanh toán thành công', { variant: 'success' });
      dispatch(getDetailReceipts(receiptCode));
      handleCloseConfirmImport();
    }
    if (updateReceiptDraftSuccess) {
      enqueueSnackbar('Cập nhật phiếu nhập hàng thành công', { variant: 'success' });
      dispatch(getDetailReceipts(receiptCode));
      handleCloseConfirmImport();
    }
  }, [makeSupplierPaymentSuccess, updateReceiptDraftSuccess]);

  const handleImport = async () => {
    const handleSave = async () => {
      try {
        dispatch(updateReceiptDraft(detailReceipt?._id, data));
        handleCloseConfirmImport();
        handleCloseConfirmInvalidProduct();
      } catch (error) {
        console.log('error', error);
      }
    };
    console.log('inventoryData123', inventoryData);
    console.log('detailReceipt123', detailReceipt);
    const data = {
      ...detailReceipt,
      inventoryStatus: 2,
      supplierCost: totalPrice(),
      totalPrice: totalPrice(),
      totalReceivedQuantity: totalReceivedQuantity(),
      receiptDetail: inventoryData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const totalQuantity = inventoryData.reduce((total, item) => total + item.quantity, 0);

    if (totalQuantity <= 0) {
      enqueueSnackbar('Tổng số lượng nhập phải lớn hơn 0', { variant: 'error' });
      handleCloseConfirmImport();
    } else {
      const hasInvalidProducts = inventoryData.some((item) => item.quantity === 0);
      if (hasInvalidProducts && !openConfirmInvalidProduct) {
        setOpenConfirmInvalidProduct(true);
        handleCloseConfirmImport();
      } else {
        await handleSave();
      }
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
  }, [updateReceiptDraftSuccess, updateReceiptSuccess]);

  return (
    <Container sx={{ paddingRight: '0px !important', paddingLeft: '0px !important' }}>
      <Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid container xs={8} sx={{ marginBottom: '30px' }}>
            <Box className="flex justify-start">
              <Box className="flex py-1 px-2 flex-col">
                <Box className="text-[#6c798f} font-medium leading-5 text-xs uppercase">Mã phiếu nhập hàng</Box>
                <Box className="text-lg leading-6 text-[#212121]">{detailReceipt?.receiptCode}</Box>
              </Box>
              <Box className="flex py-1 px-2 flex-col">
                <Box className="text-[#6c798f} font-medium leading-5 text-xs uppercase">NGÀY NHẬP HÀNG</Box>
                <Box className="text-lg leading-6 text-[#212121]">{formatDate(detailReceipt?.createdAt)}</Box>
              </Box>
              <Box className="flex py-1 px-2 flex-col border-l-[1px]">
                <Box className="text-[#6c798f} font-medium leading-5 text-xs uppercase">TRẠNG THÁI</Box>
                <Box className="text-lg leading-6 text-[#212121]">
                  <Label variant={labelVariant} color={labelColor}>
                    {labelText}
                  </Label>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid container xs={4} sx={{ marginBottom: '30px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Box className="flex  text-end gap-3 ">
              <Button
                size="small"
                variant="contained"
                color="primary"
                sx={{ padding: '8px 0px !important', width: '50px' }}
                onClick={handleOpenPrint}
              >
                In
              </Button>
              {(inventoryStatus === 2 || inventoryStatus === 3) && (
                <Box className="flex gap-3 ">
                  <Button
                    variant="contained"
                    disableElevation
                    size="small"
                    color="inherit"
                    sx={{ padding: '8px 20px !important' }}
                    onClick={() => navigate(PATH_DASHBOARD.inventory.inventory_receives_return(receiptCode))}
                  >
                    Trả hàng
                  </Button>
                  {detailReceipt?.supplierPaidCost !== detailReceipt?.supplierCost && (
                    <Button
                      id="demo-customized-button"
                      aria-controls={openMenu ? 'demo-customized-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? 'true' : undefined}
                      variant="contained"
                      disableElevation
                      onClick={handleClick}
                      endIcon={<KeyboardArrowDownIcon />}
                      size="small"
                      color="primary"
                      sx={{ padding: '8px 20px !important' }}
                    >
                      Thanh toán
                    </Button>
                  )}
                </Box>
              )}

              <Box>
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                  }}
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => onOpen()} disableRipple>
                    Thanh toán cho nhà cung cấp
                  </MenuItem>
                </StyledMenu>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
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
                <Box className="">
                  <Box className="mb-4 font-semibold  ">Nhân Viên Xử Lý</Box>
                  <hr />
                  <Box className="mt-4">{detailReceipt?.staffProcessor.email}</Box>
                  {/* <RHFTextField name="staffProcessor.email" className="!mt-3" /> */}
                </Box>
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
                      <div>{formatPriceInVND(detailReceipt?.supplierPaidCost)}</div>
                    </div>
                    <div className="flex justify-between py-1.5 text-sm font-bold">
                      <div>Còn nợ</div>
                      <div>
                        {detailReceipt?.supplierPaidCost === detailReceipt?.supplierCost
                          ? 'Không có nợ'
                          : formatPriceInVND(detailReceipt?.supplierCost - detailReceipt?.supplierPaidCost)}
                      </div>
                    </div>
                  </div>
                  {inventoryStatus === 1 && (
                    <div className="mt-4">
                      <LoadingButton
                        size="large"
                        variant="contained"
                        sx={{ width: '100%', height: '40px', textTransform: 'none' }}
                        onClick={() => handleOpenConfirmImport()}
                      >
                        Nhập hàng
                      </LoadingButton>
                    </div>
                  )}
                </div>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <InventoryReceivesPrint open={openPrint} onClose={handleClosePrint} detailReceipt={detailReceipt} />
      <SupplierPaymentDialog open={open} onClose={onClose} detailReceipt={detailReceipt} />
      <ConfirmImport
        title="Xác nhận nhập hàng"
        content="Bạn có chắc chắn muốn tạo phiếu nhập hàng?"
        open={openConfirmImport}
        onClose={() => handleCloseConfirmImport()}
        onSave={() => handleImport()}
      />
      <ConfirmImport
        title="Số lượng sản phẩm không hợp lệ"
        content="Những sản phẩm có số lượng nhập hàng bằng 0 sẽ được loại ra khỏi danh sách nhập hàng. Bạn có chắc muốn tiếp tục?"
        open={openConfirmInvalidProduct}
        onClose={() => handleCloseConfirmInvalidProduct()}
        onSave={() => handleImport()}
      />
    </Container>
  );
}
