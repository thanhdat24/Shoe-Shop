import PropTypes from 'prop-types';
// @mui

import { Link, TableCell, TableRow, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { formatPriceInVND } from '../../../../utils/formatNumber';
import { formatDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

SupplierHistoryTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
const IconStyle = styled('div')(({ theme }) => ({
  marginLeft: -4,
  borderRadius: '50%',
  width: theme.spacing(2),
  height: theme.spacing(2),
  border: `solid 2px ${theme.palette.background.paper}`,
  boxShadow: `inset -1px 1px 2px ${alpha(theme.palette.common.black, 0.24)}`,
}));

export default function SupplierHistoryTableRow({ row, selected }) {
  const { receiptCode, createdAt, staffProcessor, supplierCost } = row;

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
      <TableCell align="left">{staffProcessor.email}</TableCell>
      <TableCell align="right">{formatPriceInVND(supplierCost)}</TableCell>
    </TableRow>
  );
}
