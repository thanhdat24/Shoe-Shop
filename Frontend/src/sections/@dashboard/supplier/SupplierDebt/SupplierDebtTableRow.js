import PropTypes from 'prop-types';
import _ from 'lodash';
// @mui

import { alpha, styled } from '@mui/material/styles';
import { TableRow, TableCell, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { formatDate } from '../../../../utils/formatTime';
import { formatPriceInVND } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

SupplierDebtTableRow.propTypes = {
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

export default function SupplierDebtTableRow({ row, selected }) {
  const { casNumber, tranDate, staffProcessor, amount,totalDebt } = row;

  return (
    <TableRow hover selected={selected}>
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
      <TableCell align="left">Phiếu chi</TableCell>
      <TableCell align="right">{formatPriceInVND(amount)}</TableCell>
      <TableCell align="right">{formatPriceInVND(totalDebt)}</TableCell>
    </TableRow>
  );
}
