import { paramCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  Button,
  Switch,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  DialogContent,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
// import { RHFTextField } from '../../components/hook-form';
import { useSnackbar } from 'notistack';
import { DialogAnimate } from '../../../../components/animate';
import { FormProvider } from '../../../../components/hook-form';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { getProducts } from '../../../../redux/slices/product';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
// components
import Page from '../../../../components/Page';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedActions,
} from '../../../../components/table';
// sections

import { getSuppliers } from '../../../../redux/slices/supplier';
import SupplierTableRow from '../../../../sections/@dashboard/supplier/SupplierTableRow';
import SupplierTableToolBar from '../../../../sections/@dashboard/supplier/SupplierTableToolBar';
import { getReceipts } from '../../../../redux/slices/receipt';
import ReceiptTableRow from '../../../../sections/@dashboard/receipt/ReceiptTableRow';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Mã phiếu nhập', align: 'left' },
  { id: 'time', label: 'Thời gian nhập', align: 'left' },
  { id: 'supplier', label: 'Nhà cung cấp', align: 'left' },
  { id: 'receivingWarehouse', label: 'Kho nhập', align: 'left' },
  { id: 'active', label: 'Trạng thái', align: 'left' },
  { id: 'total', label: 'Tổng tiền', align: 'left' },
  { id: 'debt', label: 'Còn nợ', align: 'left' },
];

// ----------------------------------------------------------------------

export default function InventoryReceives() {
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
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const { themeStretch } = useSettings();
  const { receiptList, isLoading, newReceipt, error } = useSelector((state) => state.receipt);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    name: '',
    color: '',
  };

  const methods = useForm({ defaultValues });

  const {
    reset,
    handleSubmit,
    register,
    // formState: { isSubmitting },
  } = methods;

  const dispatch = useDispatch();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(getReceipts());
  }, [dispatch]);
  console.log('receiptList', receiptList);
  useEffect(() => {
    if (receiptList?.length) {
      setTableData(receiptList);
    }
  }, [receiptList]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.eCommerce.edit(paramCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Danh sách phiếu nhập hàng">
      <HeaderBreadcrumbs
        heading="Danh sách phiếu nhập hàng"
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            component={RouterLink}
            to={PATH_DASHBOARD.inventory.inventory_receives_new}
            sx={{ textTransform: 'none !important' }}
          >
            Tạo phiếu nhập
          </Button>
        }
      />
      <Card>
        <SupplierTableToolBar filterName={filterName} onFilterName={handleFilterName} />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            {selected.length > 0 && (
              <TableSelectedActions
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
                actions={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                      <Iconify icon={'eva:trash-2-outline'} />
                    </IconButton>
                  </Tooltip>
                }
              />
            )}

            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
              />

              <TableBody>
                {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) =>
                    row ? (
                      <ReceiptTableRow key={row.id} row={row} selected={selected.includes(row.id)} />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}

                <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Box>
      </Card>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
