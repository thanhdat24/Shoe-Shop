import React from 'react';
// @mui
import { Box, Table, TableBody, TableContainer, TablePagination } from '@mui/material';

import { TableHeadCustom } from '../../../../components/table';
import useTable from '../../../../hooks/useTable';
import { InventoryEditTableRow } from '../../../../sections/@dashboard/Inventory/InventoryReceivesEdit';
import { useSelector } from '../../../../redux/store';

const TABLE_HEAD = [
  { id: 'receiptCode', label: 'Mã phiếu', align: 'left' },
  { id: 'time', label: 'Số lượng', align: 'left' },
  { id: 'paidBy', label: 'Đơn giá', align: 'left' },
  { id: 'total', label: 'Thành tiền', align: 'right' },
];

export default function InventoryReceivesListEdit({
  groupByReceiptDetail,
  inventoryData,
  setInventoryData,
  isLoading,
}) {
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
  console.log('groupByReceiptDetail', groupByReceiptDetail);
  return (
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
  );
}
