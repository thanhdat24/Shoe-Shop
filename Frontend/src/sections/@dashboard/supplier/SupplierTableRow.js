import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
import _ from 'lodash';
// @mui

import { useTheme, alpha, styled } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, MenuItem } from '@mui/material';
import Label from '../../../components/Label';
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

  const { name, contactPhone, contactEmail, active } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {name}
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
    </TableRow>
  );
}
