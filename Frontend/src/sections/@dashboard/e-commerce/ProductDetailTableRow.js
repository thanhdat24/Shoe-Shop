import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
import _ from 'lodash';
// @mui

import { useTheme, alpha, styled } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, MenuItem } from '@mui/material';
import { fCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

ProductDetailTableRow.propTypes = {
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

export default function ProductDetailTableRow({ row, selected }) {
  const theme = useTheme();
  console.log('row123', row);
  const {
    color: { name: nameColor },
    size: { name: nameSize },
    gender,
    price,
    priceSale,
    quantity,
    sku,
    objectUseName: { name: objectUseName },
  } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell> {sku}</TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {`${nameSize}/${nameColor}/${objectUseName}`}
        </Typography>
      </TableCell>
      <TableCell> {quantity}</TableCell>
      <TableCell> {fCurrency(price)} ₫</TableCell>
      <TableCell> {fCurrency(priceSale)} ₫</TableCell>
    </TableRow>
  );
}
