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
import * as Yup from 'yup';
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

import { createBrand, deleteBrand, getBrands, resetBrand, updateBrand } from '../../../redux/slices/brand';
import BrandTableRow from '../../../sections/@dashboard/brand/list/BrandTableRow';
import BrandTableToolbar from '../../../sections/@dashboard/brand/list/BrandTableToolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [{ id: 'id', label: 'Id', align: 'left' }, { id: 'name', label: 'Tên', align: 'left' }, { id: '' }];

// ----------------------------------------------------------------------

export default function BrandList() {
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
  const { brandList, isLoading, newBrand, error, updateBrandSuccess, deleteBrandSuccess } = useSelector(
    (state) => state.brand
  );
  const { themeStretch } = useSettings();
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const defaultValues = {
    name: '',
    id: '',
  };

  const methods = useForm({ defaultValues });

  const { reset, watch, setValue, handleSubmit, register } = methods;

  const onSubmit = async (data) => {
    if (isEdit) {
      try {
        dispatch(updateBrand({ name: data.name }, data.id));
        reset();
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        dispatch(createBrand(data));
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
  console.log('deleteBrandSuccess ', deleteBrandSuccess);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    if (updateBrandSuccess) {
      enqueueSnackbar('Cập nhật thành công!');
      dispatch(getBrands());
    }
    if (newBrand) {
      enqueueSnackbar('Thêm thương hiệu thành công!');
      dispatch(getBrands());
    }
    if (deleteBrandSuccess) {
      enqueueSnackbar('Xóa thương hiệu thành công!');
      dispatch(getBrands());
    }

    return () => dispatch(resetBrand());
  }, [updateBrandSuccess, newBrand, deleteBrandSuccess]);

  useEffect(() => {
    if (brandList?.length) {
      setTableData(brandList);
    }
  }, [brandList]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteBrand(id));
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
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
    <Page title="Danh sách Thương hiệu">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách thương hiệu"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Thương hiệu',
              href: PATH_DASHBOARD.brand.root,
            },
            { name: 'Danh sách Thương hiệu' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
              Thêm Thương hiệu
            </Button>
          }
        />
        <DialogAnimate
          open={open}
          isEdit={isEdit ? 'Cập nhật' : 'Tạo'}
          onClose={handleClose}
          title={'Tạo Thương hiệu'}
          onClickSubmit={handleSubmit(onSubmit)}
        >
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              {' '}
              <TextField
                name="name"
                type="text"
                label="Tên Thương hiệu"
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
          <BrandTableToolbar filterName={filterName} onFilterName={handleFilterName} />

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
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <BrandTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
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
