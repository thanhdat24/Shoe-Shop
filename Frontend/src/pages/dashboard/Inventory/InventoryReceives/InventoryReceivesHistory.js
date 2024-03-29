import PropTypes from 'prop-types';
// @mui
import { Box, Table, TableBody, TableContainer, TablePagination } from '@mui/material';
// redux
import { useSelector } from '../../../../redux/store';

// routes

// hooks
import useTable, { emptyRows } from '../../../../hooks/useTable';
// components
import { TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom } from '../../../../components/table';
// sections
import SupplierDebtTableRow from '../../../../sections/@dashboard/supplier/SupplierDebt/SupplierDebtTableRow';
import ReceiptTableHistory from '../../../../sections/@dashboard/receipt/ReceiptTableHistory';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'receiptCode', label: 'Mã phiếu', align: 'left' },
  { id: 'time', label: 'Thời gian', align: 'left' },
  { id: 'type', label: 'Phương thức', align: 'left' },
  { id: 'amount', label: 'Giá trị', align: 'right' },
];

// ----------------------------------------------------------------------

InventoryReceivesHistory.propTypes = {
  paymentHistory: PropTypes.arrayOf(),
};

export default function InventoryReceivesHistory({ paymentHistory }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const { isLoading } = useSelector((state) => state.supplier);


  const denseHeight = dense ? 60 : 80;

  const isNotFound = !paymentHistory?.length || (!isLoading && !paymentHistory?.length);

  return (
    <Box>
      <TableContainer sx={{ minWidth: 800 }}>
        <Table size={dense ? 'small' : 'medium'}>
          <TableHeadCustom
            order={order}
            orderBy={orderBy}
            headLabel={TABLE_HEAD}
            rowCount={paymentHistory?.length}
            numSelected={selected.length}
            onSort={onSort}
          />

          <TableBody>
            {(isLoading ? [...Array(rowsPerPage)] : paymentHistory)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) =>
                row ? (
                  <ReceiptTableHistory key={row.id} row={row} />
                ) : (
                  !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                )
              )}

            <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, paymentHistory?.length)} />

            <TableNoData isNotFound={isNotFound} />
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={paymentHistory?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
}
