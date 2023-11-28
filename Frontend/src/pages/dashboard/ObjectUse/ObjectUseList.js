import { useEffect, useRef, useState } from 'react';
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
import {
  createObjUse,
  deleteObjectUse,
  getObjects,
  resetObjectUse,
  updateObjectUse,
} from '../../../redux/slices/objectUse';

import { DialogAnimate } from '../../../components/animate';
import CateTableRow from '../../../sections/@dashboard/cate/list/CateTableRow';
import ObjectUseTableToolBar from '../../../sections/@dashboard/objectUse/list/ObjectUseableToolBar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', align: 'left' },
  { id: 'name', label: 'Đối tượng sử dụng', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function ObjectUseList() {
  const [open, setOpen] = useState(false);
  const valueRef = useRef('');
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);

  const defaultValues = {
    name: '',
  };

  const methods = useForm({ defaultValues });

  const {
    reset,
    handleSubmit,
    register,
    setValue,
    // formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if (isEdit) {
      try {
        dispatch(updateObjectUse({ name: data.name }, data.id));
        reset();
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        dispatch(createObjUse(data));
        resetObjectUse();
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
    setIsEdit(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    setOpen(false);
    dispatch(createObjUse({ name: valueRef.current.value }));
  };

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

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { objects, isLoading, updateObjectUseSuccess, newObjectUse, deleteObjectUseSuccess } = useSelector(
    (state) => state.objectUse
  );

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(getObjects());
  }, [dispatch]);

  useEffect(() => {
    if (updateObjectUseSuccess) {
      enqueueSnackbar('Cập nhật thành công!');
      dispatch(getObjects());
    }
    if (newObjectUse) {
      enqueueSnackbar('Thêm đối tượng thành công!');
      dispatch(getObjects());
    }
    if (deleteObjectUseSuccess) {
      enqueueSnackbar('Xóa đối tượng thành công!');
      dispatch(getObjects());
    }
    return () => dispatch(resetObjectUse());
  }, [updateObjectUseSuccess, newObjectUse, deleteObjectUseSuccess]);

  useEffect(() => {
    if (objects?.length) {
      setTableData(objects);
    }
  }, [objects]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteObjectUse(id));
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row._id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (data) => {
    setOpen(true);
    setValue('id', data._id);
    setValue('name', data.name);
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
    <Page title="Danh sách đối tượng sử dụng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách đối tượng sử dụng"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Đối tượng sử dụng',
              href: PATH_DASHBOARD.brand.root,
            },
            { name: 'Danh sách' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              // component={RouterLink}
              // to={PATH_DASHBOARD.brand.new}
              onClick={handleClickOpen}
            >
              Thêm đối tượng sử dụng
            </Button>
          }
        />
        <DialogAnimate
          open={open}
          isEdit={isEdit ? 'Cập nhật' : 'Tạo'}
          onClose={handleClose}
          title={'Tạo đối tương sử dụng'}
          onClickSubmit={handleSubmit(onSubmit)}
        >
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <TextField
                name="name"
                type="text"
                label="Tên đối tượng"
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
          <ObjectUseTableToolBar filterName={filterName} onFilterName={handleFilterName} />

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
                        <CateTableRow
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
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
