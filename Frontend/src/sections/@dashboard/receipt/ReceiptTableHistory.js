import PropTypes from 'prop-types';
import _ from 'lodash';
// @mui

import { alpha, styled } from '@mui/material/styles';
import { TableRow, TableCell, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// utils
import { formatDate } from '../../../utils/formatTime';
import { formatPriceInVND } from '../../../utils/formatNumber';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

ReceiptTableHistory.propTypes = {
  row: PropTypes.object,
};
export default function ReceiptTableHistory({ row }) {
  const {
    casNumber,
    tranDate,
    paymentMethod: { name },
    amount,
  } = row;
  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          <Link
            underline="none"
            component={RouterLink}
            to={PATH_DASHBOARD.inventory.inventory_receives_edit(casNumber)}
          >
            {casNumber}
          </Link>
        </Typography>
      </TableCell>

      <TableCell align="left">{formatDate(tranDate)}</TableCell>
      <TableCell align="left">{name}</TableCell>
      <TableCell align="right">{formatPriceInVND(amount)}</TableCell>
    </TableRow>
  );
}
