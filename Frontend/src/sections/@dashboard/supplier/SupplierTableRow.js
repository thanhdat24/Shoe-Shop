import PropTypes from 'prop-types';
// @mui

import { Link, TableCell, TableRow, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import Label from '../../../components/Label';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { formatPriceInVND } from '../../../utils/formatNumber';
// utils

// ----------------------------------------------------------------------

SupplierTableRow.propTypes = {
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

export default function SupplierTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { name, contactPhone, contactEmail, active, totalDebt, totalCost, id } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          <Link underline="none" component={RouterLink} to={PATH_DASHBOARD.inventory.suppliers_edit(id)}>
            {name}
          </Link>
        </Typography>
      </TableCell>

      <TableCell align="left">
        {' '}
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={active ? 'success' : 'default'}
          sx={{ textTransform: 'none' }}
        >
          {active ? 'Đang hoạt động' : 'Tạm ngừng'}
        </Label>
      </TableCell>
      <TableCell align="left">{contactPhone}</TableCell>
      <TableCell align="left">{contactEmail}</TableCell>
      <TableCell align="left">{formatPriceInVND(totalDebt)}</TableCell>
      <TableCell align="left">{formatPriceInVND(totalCost)}</TableCell>
    </TableRow>
  );
}
