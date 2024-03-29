import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';

import { Autocomplete, Box, Card, Container, Grid, Table, TableBody, TableContainer, TextField } from '@mui/material';
import _ from 'lodash';
import * as Yup from 'yup';

// import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

// routes
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import SaveCancelButtons from '../../../../components/SaveCancelButtons/SaveCancelButtons';
import { TableHeadCustom, TableSkeleton } from '../../../../components/table';
import useAuth from '../../../../hooks/useAuth';
import useTable from '../../../../hooks/useTable';
import useToggle from '../../../../hooks/useToggle';
import { getProducts } from '../../../../redux/slices/product';
import { createReceipt, resetReceipt } from '../../../../redux/slices/receipt';
import { getSuppliers } from '../../../../redux/slices/supplier';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { InventoryTableRow, InventoryTableToolbar } from '../../../../sections/@dashboard/Inventory/InventoryReceives';
import { formatPriceInVND } from '../../../../utils/formatNumber';
import ConfirmImport from './ConfirmImport';
import SearchModelProductRow from './SearchModelProductRow';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên sản phẩm', align: 'left', minWidth: 150 },
  { id: 'tonkho', label: 'Tồn kho', align: 'center', minWidth: 50 },
  { id: 'soluongnhap', label: 'Số lượng nhập', align: 'center', minWidth: 50 },
  { id: 'dongia', label: 'Đơn giá', align: 'center', minWidth: 50 },
  { id: 'thanhtien', label: 'Thành tiền', align: 'center', minWidth: 50 },
];

export default function InventoryReceivesNew() {
  const {
    dense,
    rowsPerPage,
    setPage,
    //
    selectedInventory,
    onSelectRowInventory,
    //
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { toggle: open, onOpen, onClose } = useToggle();
  const [openConfirmImport, setOpenConfirmImport] = useState(false);
  const [openConfirmInvalidProduct, setOpenConfirmInvalidProduct] = useState(false);
  const handleCloseConfirmImport = () => {
    setOpenConfirmImport(false);
  };
  const handleOpenConfirmImport = () => {
    setOpenConfirmImport(true);
  };

  const handleCloseConfirmInvalidProduct = () => {
    setOpenConfirmInvalidProduct(false);
  };
  const groupBySelectedInventory = _(selectedInventory)
    .groupBy((x) => x.idProduct.name)
    .map((value, key) => ({
      name: key,
      productDetail: value,
    }))
    .value();
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const { supplierList } = useSelector((state) => state.supplier);

  const { newReceipt, error } = useSelector((state) => state.receipt);

  const { products, isLoading } = useSelector((state) => state.product);

  const [filterName, setFilterName] = useState('');

  const [inventoryData, setInventoryData] = useState([]);

  const [confirmSaveDraft, setConfirmSaveDraft] = useState(false);

  const [tableData, setTableData] = useState([]);

  const totalReceivedQuantity = () => {
    return inventoryData.reduce((sum, item) => sum + item.quantity, 0);
  };

  const totalPrice = () => {
    return inventoryData.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const CreateSchema = Yup.object().shape({
    supplier: Yup.object().required('*Vui lòng nhập thông tin này'),
  });
  const defaultValues = {
    supplier: '',
    staffProcessor: user,
    warehouseAddress: '121, CMT8, An Thới, Bình Thuỷ, Cần Thơ, Vietnam',
    warehousePhoneNumber: '0916671366',
  };
  const methods = useForm({
    resolver: yupResolver(CreateSchema),
    defaultValues,
  });

  const { handleSubmit, watch, control } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    const inventoryStatus = openConfirmImport || openConfirmInvalidProduct ? 2 : 1;

    const newData = {
      supplier: data.supplier._id,
      receivingWarehouse: {
        warehouseAddress: data.warehouseAddress,
        warehousePhoneNumber: data.warehousePhoneNumber,
      },
      staffProcessor: data.staffProcessor._id,
      totalPrice: totalPrice(),
      totalReceivedQuantity: totalReceivedQuantity(),
      inventoryData,
      inventoryStatus,
      createdAt: inventoryStatus === 2 ? new Date() : null,
      updatedAt: new Date(),
    };

    const handleSave = async () => {
      try {
        dispatch(createReceipt(newData));
        handleCloseConfirmImport();
      } catch (error) {
        console.log('error', error);
      }
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

  const onSubmitDraft = async (data) => {
    const inventoryStatus = openConfirmImport || openConfirmInvalidProduct ? 2 : 1;

    const newData = {
      supplier: data.supplier._id,
      receivingWarehouse: {
        warehouseAddress: data.warehouseAddress,
        warehousePhoneNumber: data.warehousePhoneNumber,
      },
      staffProcessor: data.staffProcessor._id,
      totalPrice: totalPrice(),
      totalReceivedQuantity: totalReceivedQuantity(),
      inventoryData,
      inventoryStatus,
      createdAt: inventoryStatus === 2 ? new Date() : null,
      updatedAt: new Date(),
    };
    try {
      dispatch(createReceipt(newData));
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' }); // Hiển thị thông báo lỗi bằng enqueueSnackbar
    } else if (newReceipt) {
      const message = newReceipt.inventoryStatus === 1 ? 'Lưu nháp thành công!' : 'Nhập hàng thành công!';
      enqueueSnackbar(message);
      navigate(PATH_DASHBOARD.inventory.inventory_receives_edit(newReceipt.receiptCode));
    }

    setTimeout(() => {
      dispatch(resetReceipt());
    }, 1000);
  }, [error, newReceipt]);

  useEffect(() => {
    dispatch(getSuppliers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products?.result) {
      setTableData(products.data);
    }
  }, [products.data]);

  const [isReadyCreateSupplier, setIsReadyCreateSupplier] = useState(false);
  useEffect(() => {
    if (values.supplier && selectedInventory.length > 0) setIsReadyCreateSupplier(true);
    else setIsReadyCreateSupplier(false);
  }, [values.supplier, selectedInventory]);
  const dataFiltered = applySortFilter({
    tableData,
    filterName,
    filterSupplier: values.supplier,
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
    onOpen();
  };

  return (
    <Container sx={{ paddingRight: '0px !important', paddingLeft: '0px !important' }}>
      <Box sx={{ width: '100%', typography: 'body1', marginTop: 2 }}>
        <FormProvider methods={methods}>
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
                    <Controller
                      name="supplier"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          className="!mt-5"
                          isOptionEqualToValue={(option, value) => option?._id === value?._id}
                          getOptionLabel={(option) => option?.name || ''}
                          onChange={(event, newValue) => field.onChange(newValue)}
                          options={supplierList?.filter((item) => item.active) || []}
                          renderInput={(params) => <TextField label="Chọn nhà cung cấp" {...params} />}
                        />
                      )}
                    />

                    {values.supplier && (
                      <Box className="pt-3 text-sm text-[#637381]">
                        <Box>{values.supplier.fullAddress} Vietnam</Box>
                        <Box className=" pt-3">{values.phoneNumber}</Box>
                      </Box>
                    )}
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
                      <Box className="text-[#637381] pt-3">{values.warehouseAddress}</Box>
                      <Box className="text-[#637381] pt-3">{values.warehousePhoneNumber}</Box>
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
                  <RHFTextField name="staffProcessor.email" className="!mt-3" />
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
                <InventoryTableToolbar filterName={filterName} onFilterName={handleFilterName} />
                <SearchModelProductRow
                  selectedInventory={selectedInventory}
                  onSelectRowInventory={onSelectRowInventory}
                  handleFilterName={handleFilterName}
                  open={open}
                  onClose={onClose}
                  dataFiltered={dataFiltered}
                  tableData={tableData}
                  filterName={filterName}
                  isLoading={isLoading}
                />
                <hr />
                {/* <Scrollbar> */}
                <TableContainer sx={{ marginTop: 5 }}>
                  <Table size={dense ? 'small' : 'medium'}>
                    <TableHeadCustom
                      className="!text-xs"
                      headLabel={TABLE_HEAD}
                      rowCount={tableData.length}
                      onSort={onSort}
                    />

                    <TableBody>
                      {(isLoading ? [...Array(rowsPerPage)] : groupBySelectedInventory).map((row, index) =>
                        row ? (
                          <InventoryTableRow
                            selectedInventory={selectedInventory}
                            key={row.id}
                            row={row}
                            setInventoryData={setInventoryData}
                            inventoryData={inventoryData}
                          />
                        ) : (
                          !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                        )
                      )}
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
                      <div>{Number.isNaN(totalReceivedQuantity()) ? 0 : totalReceivedQuantity()}</div>
                    </div>
                    <div className="flex justify-between py-1.5 text-sm">
                      <div>Tổng tiền hàng</div>
                      <div>{formatPriceInVND(totalPrice())}</div>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-4 mb-4">
                    <div className="flex justify-between py-1.5 text-sm font-bold">
                      <div>Tổng giá trị nhập hàng</div>
                      <div>{formatPriceInVND(totalPrice())}</div>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-4">
                    <div className="flex justify-between py-1.5 text-sm font-bold">
                      <div>Còn nợ</div>
                      <div>{totalPrice() ? formatPriceInVND(totalPrice()) : 'Không có nợ'}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <LoadingButton
                      size="large"
                      variant="contained"
                      sx={{ width: '100%', height: '40px', textTransform: 'none' }}
                      disabled={!isReadyCreateSupplier}
                      onClick={() => handleOpenConfirmImport()}
                    >
                      Nhập hàng
                    </LoadingButton>
                  </div>
                </div>
              </Card>
            </Grid>
          </Grid>
          <SaveCancelButtons
            onSave={handleSubmit(onSubmitDraft)}
            isDisabledSave={isReadyCreateSupplier}
            textCreate="Lưu nháp"
            onCancel={() => navigate(PATH_DASHBOARD.inventory.inventory_receives)}
          />
          <ConfirmImport
            title="Xác nhận nhập hàng"
            content="Bạn có chắc chắn muốn tạo phiếu nhập hàng?"
            open={openConfirmImport}
            onClose={() => handleCloseConfirmImport()}
            onSave={handleSubmit(onSubmit)}
          />

          <ConfirmImport
            title="Số lượng sản phẩm không hợp lệ"
            content="Những sản phẩm có số lượng nhập hàng bằng 0 sẽ được loại ra khỏi danh sách nhập hàng. Bạn có chắc muốn tiếp tục?"
            open={openConfirmInvalidProduct}
            onClose={() => handleCloseConfirmInvalidProduct()}
            onSave={handleSubmit(onSubmit)}
          />
        </FormProvider>
      </Box>
    </Container>
  );
}

function applySortFilter({ tableData, filterName, filterSupplier }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }
  if (filterSupplier) {
    tableData = tableData.filter((item) => item.idSupplier._id === filterSupplier._id);
  }

  return tableData;
}
