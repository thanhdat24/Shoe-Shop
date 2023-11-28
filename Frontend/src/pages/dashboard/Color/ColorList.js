import { paramCase } from 'change-case';
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
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// import { RHFTextField } from '../../components/hook-form';
import { useSnackbar } from 'notistack';
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

import { createColor, deleteColor, getColors, resetColor, updateColor } from '../../../redux/slices/color';
import ColorTableRow from '../../../sections/@dashboard/color/list/ColorTableRow';
import ColorTableToolBar from '../../../sections/@dashboard/color/list/ColorTableToolBar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', align: 'left' },

  { id: 'name', label: 'Tên', align: 'left' },
  { id: 'color', label: 'Màu', align: 'left' },

  { id: '' },
];

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

  const { themeStretch } = useSettings();
  const { colors, isLoading, newColor, updateColorSuccess, deleteColorSuccess } = useSelector((state) => state.color);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const defaultValues = {
    name: '',
    color: '',
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
    console.log('data', data);
    if (isEdit) {
      try {
        dispatch(updateColor({ name: data.name, color: data.color }, data.id));
        reset();
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        dispatch(createColor(data));
        reset();
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    if (updateColorSuccess) {
      enqueueSnackbar('Cập nhật thành công!');
      dispatch(getColors());
    }
    if (newColor) {
      enqueueSnackbar('Thêm màu sắc thành công!');
      dispatch(getColors());
    }
    if (deleteColorSuccess) {
      enqueueSnackbar('Xóa màu sắc thành công!');
      dispatch(getColors());
    }
    return () => dispatch(resetColor());
  }, [updateColorSuccess, newColor, deleteColorSuccess]);

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
    dispatch(getColors());
  }, [dispatch]);

  useEffect(() => {
    if (colors?.length) {
      setTableData(colors);
    }
  }, [colors]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteColor(id));
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
    setValue('color', data.color);
    setIsEdit(true);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  console.log('dataFiltered', dataFiltered);
  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Danh sách màu">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách màu"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Màu',
              href: PATH_DASHBOARD.color.root,
            },
            { name: 'Danh sách màu' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
              Thêm màu sắc
            </Button>
          }
        />
        <DialogAnimate
          open={open}
          isEdit={isEdit ? 'Cập nhật' : 'Tạo'}
          onClose={handleClose}
          title={'Tạo màu sắc'}
          onClickSubmit={handleSubmit(onSubmit)}
        >
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              {' '}
              <TextField
                name="name"
                type="text"
                label="Tên màu"
                {...register('name')}
                autoFocus
                margin="dense"
                fullWidth
                id="outlined-basic"
                variant="outlined"
              />
              <TextField
                name="color"
                type="text"
                label="Mã màu"
                {...register('color')}
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
          <ColorTableToolBar filterName={filterName} onFilterName={handleFilterName} />

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
                        <ColorTableRow
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
