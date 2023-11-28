import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TextField,
  Tooltip,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
// import { RHFTextField } from '../../components/hook-form';
import { DialogAnimate } from '../../../components/animate';
import { FormProvider } from '../../../components/hook-form';
// redux
import { useDispatch, useSelector } from '../../../redux/store';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useTable, { emptyRows, getComparator } from '../../../hooks/useTable';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from '../../../components/table';
// sections

import { createSize, deleteSize, getSizes, resetSize, updateSize } from '../../../redux/slices/size';
import SizeTableRow from '../../../sections/@dashboard/size/list/SizeTableRow';
import SizeTableToolBar from '../../../sections/@dashboard/size/list/SizeTableToolBar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [{ id: 'id', label: 'Id', align: 'left' }, { id: 'name', label: 'Tên', align: 'left' }, { id: '' }];

// ----------------------------------------------------------------------

export default function ColorList() {
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
  const { enqueueSnackbar } = useSnackbar();
  const { sizes, isLoading, newSize, error, updateSizeSuccess, deleteSizeSuccess } = useSelector((state) => state.size);
  const { themeStretch } = useSettings();
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const defaultValues = {
    name: '',
    color: '',
    id: '',
  };

  const methods = useForm({ defaultValues });

  const { reset, watch, setValue, handleSubmit, register } = methods;

  const onSubmit = async (data) => {
    console.log('data', data);
    if (isEdit) {
      try {
        dispatch(updateSize({ name: data.name }, data.id));
        reset();
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        dispatch(createSize(data));
        reset();
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
    setIsEdit(false);
  };

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(getSizes());
  }, [dispatch]);

  useEffect(() => {
    if (updateSizeSuccess) {
      enqueueSnackbar('Cập nhật thành công!');
      dispatch(getSizes());
    }
    if (newSize) {
      enqueueSnackbar('Thêm kích cỡ thành công!');
      dispatch(getSizes());
    }
    if (deleteSizeSuccess) {
      enqueueSnackbar('Xóa kích cỡ thành công!');
      dispatch(getSizes());
    }
    return () => dispatch(resetSize());
  }, [updateSizeSuccess, newSize, deleteSizeSuccess]);

  useEffect(() => {
    if (sizes?.length) {
      setTableData(sizes);
    }
  }, [sizes]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteSize(id));
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row._id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (data) => {
    setOpen(true);
    setValue('name', data.name);
    setValue('id', data._id);
    setIsEdit(true);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Danh sách kích thước">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách kích thước"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Kích thước',
              href: PATH_DASHBOARD.size.root,
            },
            { name: 'Danh sách kích thước' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
              Thêm kích thước
            </Button>
          }
        />
        <DialogAnimate
          open={open}
          isEdit={isEdit ? 'Cập nhật' : 'Tạo'}
          onClose={handleClose}
          title={'Tạo kích thước'}
          onClickSubmit={handleSubmit(onSubmit)}
        >
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              {' '}
              <TextField
                name="name"
                type="text"
                label="Tên kích thước"
                {...register('name')}
                autoFocus
                margin="dense"
                fullWidth
                id="outlined-basic"
                variant="outlined"
              />
            </DialogContent>
          </FormProvider>
        </DialogAnimate>
        <Card>
          <SizeTableToolBar filterName={filterName} onFilterName={handleFilterName} />

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
                      tableData.map((row) => row._id)
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
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <SizeTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          onEditRow={() => handleEditRow(row)}
                        />
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
      </Container>
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
    tableData = tableData.filter((item) => item.name.toString().indexOf(filterName) !== -1);
  }

  return tableData;
}
