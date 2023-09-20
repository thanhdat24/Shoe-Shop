import { paramCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { useSnackbar } from 'notistack';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';

// routes

// hooks
import useSettings from '../../../../hooks/useSettings';
import useTable, {  emptyRows } from '../../../../hooks/useTable';
// components
import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
} from '../../../../components/table';

import SupplierHistoryTableRow from '../../../../sections/@dashboard/supplier/SupplierHistory/SupplierHistoryTableRow';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'receiptCode', label: 'Mã phiếu', align: 'left' },
  { id: 'time', label: 'Thời gian', align: 'left' },
  { id: 'paidBy', label: 'Người tạo', align: 'left' },
  { id: 'total', label: 'Tổng cộng', align: 'right' },
];

// ----------------------------------------------------------------------

export default function SuppliersHistoryList({ supplierAll }) {
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
  const { supplierList, isLoading, newSupplier, error } = useSelector((state) => state.supplier);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const denseHeight = dense ? 60 : 80;

  const isNotFound = !supplierAll?.length || (!isLoading && !supplierAll?.length);

  return (
    <Box>
      <TableContainer sx={{ minWidth: 800 }}>
        <Table size={dense ? 'small' : 'medium'}>
          <TableHeadCustom
            order={order}
            orderBy={orderBy}
            headLabel={TABLE_HEAD}
            rowCount={supplierAll?.length}
            numSelected={selected.length}
            onSort={onSort}
          />

          <TableBody>
            {(isLoading ? [...Array(rowsPerPage)] : supplierAll)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) =>
                row ? (
                  <SupplierHistoryTableRow key={row.id} row={row} />
                ) : (
                  !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                )
              )}

            <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, supplierAll?.length)} />

            <TableNoData isNotFound={isNotFound} />
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={supplierAll?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
}
