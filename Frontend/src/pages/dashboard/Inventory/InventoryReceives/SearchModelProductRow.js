import React, { useState } from 'react';
import PropTypes from 'prop-types';

// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Autocomplete,
  TextField,
  TableContainer,
  TableBody,
  Table,
} from '@mui/material';
import useTable from '../../../../hooks/useTable';
import { TableHeadCustom, TableSelectedActions, TableSkeleton } from '../../../../components/table';
import { InventoryTableToolbar } from '../../../../sections/@dashboard/Inventory/InventoryReceives';
import SearchModelProductTableRow from '../../../../sections/@dashboard/Inventory/InventoryReceives/SearchModelProductTableRow';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên sản phẩm', align: 'left', width: 450 },
  { id: 'donvi', label: 'Đơn vị tính', align: 'left', width: 200 },
  { id: 'inventory', label: 'Số tồn kho nhập', align: 'center', width: 250 },
];

SearchModelProductRow.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dataFiltered: PropTypes.array,
  tableData: PropTypes.array,
  filterName: PropTypes.string,
  isLoading: PropTypes.bool,
  handleFilterName: PropTypes.func,
  onSelectRowInventory: PropTypes.func,
  selectedInventory: PropTypes.array,
};

export default function SearchModelProductRow({
  open,
  onClose,
  onNextStep,
  dataFiltered,
  tableData,
  filterName,
  isLoading,
  handleFilterName,
  onSelectRowInventory,
  selectedInventory,
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
    // selectedInventory,
    onSelectRow,
    // onSelectRowInventory,
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

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const [confirm, setConfirm] = useState(false);

  const handleCancel = () => {
    setSelectedInventory([]);
    setConfirm(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} sx={{ zIndex: '10000' }} onClose={onClose}>
      <DialogTitle> Tìm kiếm sản phẩm</DialogTitle>
      <DialogContent>
        <InventoryTableToolbar filterName={filterName} onFilterName={handleFilterName} />

        <TableContainer sx={{ minWidth: 800, marginTop: 5 }}>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData.length} onSort={onSort} />

            <TableBody>
              {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) =>
                  row ? (
                    <SearchModelProductTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onSelectRowInventory={onSelectRowInventory}
                      selectedInventory={selectedInventory}
                    />
                  ) : (
                    !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}

              {/* <TableEmptyRows
                          height={denseHeight}
                          emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                        /> */}

              {/* <TableNoData isNotFound={isNotFound} /> */}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between !important' }}>
        <Box sx={{ color: selectedInventory.length > 0 ? '#00AB55' : 'black' }}>
          {selectedInventory.length > 0 ? selectedInventory.length : 0} sản phẩm đã được chọn
        </Box>
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Button
            sx={{
              color: 'gray',
              borderColor: 'gray ',
              '&:hover': { color: 'primary.main' },
              padding: '6px 13px !important',
              fontWeight: '700 !important',
              lineHeight: '1.71429 !important',
              fontSize: '0.8rem !important',
              textTransform: 'none !important',
              height: '38px !important',
            }}
            variant="outlined"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            sx={{
              padding: '6px 13px !important',
              fontWeight: '700 !important',
              lineHeight: '1.71429 !important',
              fontSize: '0.8rem !important',
              textTransform: 'none !important',
              height: '38px !important',
            }}
            size="large"
            variant="contained"
            // disabled={!isDisabledSave}
            onClick={onClose}
          >
            Hoàn tất chọn
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
