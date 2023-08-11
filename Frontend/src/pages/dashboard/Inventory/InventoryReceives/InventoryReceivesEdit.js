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
} from '@mui/material';
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
import { styled, useTheme } from '@mui/material/styles';
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
import { createReceipt, getDetailReceipts } from '../../../../redux/slices/receipt';
import { InventoryEditTableRow } from '../../../../sections/@dashboard/Inventory/InventoryReceivesEdit';
import Label from '../../../../components/Label';

const SearchbarStyle = styled('div')(({ theme }) => ({
  marginTop: 20,
  height: 60,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
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
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    selectedInventory,
    onSelectRow,
    onSelectRowInventory,
    onSelectAllRows,
    setSelectedInventory,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const dispatch = useDispatch();

  const { receiptCode } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { detailReceipt } = useSelector((state) => state.receipt);
  console.log('detailReceipt', detailReceipt);

  const { products, isLoading } = useSelector((state) => state.product);
  const theme = useTheme();

  const [inventoryData, setInventoryData] = useState([]);

  console.log('inventoryData', inventoryData);

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

  const denseHeight = dense ? 60 : 80;

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
                <Box className="text-lg leading-6 text-[#212121]">{detailReceipt?.createdAt}</Box>
              </Box>
              <Box className="flex py-1 px-2 flex-col border-l-[1px]">
                <Box className="text-[#6c798f} font-medium leading-5 text-xs uppercase">TRẠNG THÁI</Box>
                <Box className="text-lg leading-6 text-[#212121]">
                  <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={detailReceipt?.inventoryStatus ? 'success' : 'default'}
                  >
                    {detailReceipt?.inventoryStatus ? 'Đã nhập hàng' : 'Đã xuất trả'}
                  </Label>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid container xs={4} sx={{ marginBottom: '30px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Box className="flex  text-end">
              <Button
                size="small"
                variant="contained"
                color="primary"
                sx={{ padding: '8px 0px !important', width: '50px', marginRight: '10px' }}
              >
                In
              </Button>
              <Button size="small" variant="contained" color="primary" sx={{ padding: '8px 20px !important' }}>
                Thanh toán
              </Button>
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
                <div className="">
                  <div className="mb-4 font-semibold  ">Nhân Viên Xử Lý</div>
                  <hr />
                  <Box>{detailReceipt?.staffProcessor.email}</Box>
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
                        <InventoryEditTableRow key={row.id} row={row} />
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
                      <div>{detailReceipt?.totalReceivedQuantity}</div>
                    </div>
                    <div className="flex justify-between py-1.5 text-sm">
                      <div>Tổng tiền hàng</div>
                      <div>{formatPriceInVND(detailReceipt?.totalPrice)}</div>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-4 mb-4">
                    <div className="flex justify-between py-1.5 text-sm font-bold">
                      <div>Tổng giá trị nhập hàng</div>
                      <div>{formatPriceInVND(detailReceipt?.totalPrice)}</div>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-4">
                    <div className="flex justify-between py-1.5 text-sm">
                      <div>Đã thanh toán NCC</div>
                      <div>{detailReceipt?.debt > 0 ? '0 ₫' : formatPriceInVND(detailReceipt?.debt)}</div>
                    </div>
                    <div className="flex justify-between py-1.5 text-sm font-bold">
                      <div>Còn nợ</div>
                      <div>{detailReceipt?.debt > 0 ? formatPriceInVND(detailReceipt?.debt) : 'Không có nợ'}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
