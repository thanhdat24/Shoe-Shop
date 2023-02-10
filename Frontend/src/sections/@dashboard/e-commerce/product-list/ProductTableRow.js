import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase, paramCase } from 'change-case';
import _ from 'lodash';
// @mui

import { useTheme, alpha, styled } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Link } from '@mui/material';
// utils

import { Link as RouterLink } from 'react-router-dom';
//
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

ProductTableRow.propTypes = {
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

export default function ProductTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { name, inventoryType, productDetail, productImages, price, idCate,idSupplier } = row;
  const color = _(productDetail)
    .groupBy((x) => x.idColor.color)
    .map((value, key) => ({
      color: key,
      colorID: value,
    }))
    .value();

  const sizes = _(productDetail)
    .groupBy((x) => x.idSize.name)
    .map((value, key) => ({
      name: key,
      nameColor: value,
    }))
    .value();

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image
          disabledEffect
          alt={name}
          src={productImages[0].url[0]}
          sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
        />
        <Typography variant="subtitle2" noWrap>
          <Link variant="subtitle2" component={RouterLink} to={PATH_DASHBOARD.eCommerce.view(paramCase(name))}>
            {name}
          </Link>
        </Typography>
      </TableCell>
      <TableCell>
        {' '}
        <div className="flex">
          {' '}
          {color.map((color1, index) => (
            <IconStyle key={color1 + index} sx={{ bgcolor: color1.color }} />
          ))}
        </div>
      </TableCell>
      <TableCell>
        {' '}
        <div className="flex"> {sizes.map((size, index) => size.name).join(', ')}</div>
      </TableCell>
      <TableCell> {idCate.name}</TableCell>
      <TableCell> {idSupplier.name}</TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={inventoryType === 'còn hàng' ? 'success' : 'error'}
          sx={{ textTransform: 'capitalize' }}
        >
          {inventoryType}
        </Label>
      </TableCell>
      <TableCell align="right">{fCurrency(price)}₫</TableCell>
      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
