import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
import _ from 'lodash';
import { Link as RouterLink } from 'react-router-dom';

// @mui

import { useTheme, alpha, styled } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Box, Link } from '@mui/material';
import Label from '../../../components/Label';
// utils
import { formatPriceInVND } from '../../../utils/formatNumber';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { formatDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

ReceiptTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};
const IconStyle = styled('div')(({ theme }) => ({
  marginLeft: -4,
  borderRadius: '50%',
  width: theme.spacing(2),
  height: theme.spacing(2),
  border: `solid 2px ${theme.palette.background.paper}`,
  boxShadow: `inset -1px 1px 2px ${alpha(theme.palette.common.black, 0.24)}`,
}));

export default function ReceiptTableRow({ row, selected }) {
  const theme = useTheme();

  const { receiptCode, createdAt, supplier, inventoryStatus, totalPrice, supplierPaidCost, supplierCost } = row;
  console.log('row123', row);
  let labelText = 'Nháp';
  if (inventoryStatus === 2) {
    labelText = 'Đã nhập hàng';
  } else if (inventoryStatus === 3) {
    labelText = 'Đã xuất trả';
  }

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          <Link
            underline="none"
            component={RouterLink}
            to={PATH_DASHBOARD.inventory.inventory_receives_edit(receiptCode)}
          >
            {receiptCode}
          </Link>
        </Typography>
      </TableCell>

      <TableCell align="left">{formatDate(createdAt)}</TableCell>

      <TableCell align="left">{supplier.name}</TableCell>
      <TableCell align="left">Địa chỉ mặc định</TableCell>
      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={inventoryStatus === 2 || inventoryStatus === 3 ? 'success' : 'default'}
          sx={{ textTransform: 'none' }}
        >
          {labelText}
        </Label>
      </TableCell>
      <TableCell align="left">{formatPriceInVND(totalPrice)}</TableCell>
      <TableCell align="left">
        <Box className="text-red-500">
          {supplierPaidCost === supplierCost ? '--' : formatPriceInVND(supplierCost - supplierPaidCost)}
        </Box>
      </TableCell>
    </TableRow>
  );
}
