import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase, paramCase } from 'change-case';
import _ from 'lodash';
// @mui
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Link, Box } from '@mui/material';
// utils

import { Link as RouterLink } from 'react-router-dom';
//
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';

// ----------------------------------------------------------------------

SearchModelProductTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  selectedInventory: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onSelectRowInventory: PropTypes.func,
};

export default function SearchModelProductTableRow({
  row,
  selected,
  selectedInventory,
  onSelectRow,
  onSelectRowInventory,
}) {
  const { name, productDetail, productImages, price, idCate, idSupplier, priceSale } = row;

  const renderSortedProductDetail = () => {
    const sortedProductDetail = [...productDetail].sort((item1, item2) => {
      const sizeComparison = item1.idSize.name - item2.idSize.name;

      return sizeComparison !== 0
        ? sizeComparison
        : parseInt(item1.sku.split('-')[1], 10) - parseInt(item2.sku.split('-')[1], 10);
    });

    return sortedProductDetail.map((item, index) => (
      <TableCell key={index} sx={{ display: 'flex', alignItems: 'center', paddingLeft: '73px !important' }}>
        <Checkbox
          checked={selectedInventory.some((inventory) => inventory.id === item.id)}
          onClick={() => onSelectRowInventory(item)}
        />
        <Box className="flex flex-col ml-2">
          <Box>
            {item.idSize.name} / {item.idColor.name}
          </Box>
          <Box>
            <b className="text-[#808080]">SKU:</b> {item.sku}
          </Box>
        </Box>
      </TableCell>
    ));
  };

  const renderSortedQuantity = () => {
    const sortedProductDetail = [...productDetail].sort((item1, item2) => {
      const sizeComparison = item1.idSize.name - item2.idSize.name;

      return sizeComparison !== 0
        ? sizeComparison
        : parseInt(item1.sku.split('-')[1], 10) - parseInt(item2.sku.split('-')[1], 10);
    });

    return sortedProductDetail.map((item, index) => (
      <TableCell sx={{ height: 76, display: 'flex', alignItems: 'start', paddingLeft: '73px !important' }}>
        <Box>{item.quantity} tồn kho</Box>
      </TableCell>
    ));
  };

  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox checked={selected} onClick={onSelectRow} />
          <Image
            disabledEffect
            alt={name}
            src={productImages[0]?.url[0]}
            sx={{ borderRadius: 1.5, width: 48, height: 48, mx: 2 }}
          />
          <Typography variant="subtitle2" noWrap>
            <Link variant="subtitle2" component={RouterLink} to={PATH_DASHBOARD.eCommerce.view(paramCase(name))}>
              {name}
            </Link>
          </Typography>
        </Box>
        <TableRow>{renderSortedProductDetail()}</TableRow>
      </TableCell>
      <TableCell sx={{ opacity: '0' }}>123</TableCell>
      <TableCell sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', opacity: '0' }}>
          <Checkbox checked={selected} onClick={onSelectRow} />
          <Image
            disabledEffect
            alt={name}
            src={productImages[0]?.url[0]}
            sx={{ borderRadius: 1.5, width: 48, height: 48, mx: 2 }}
          />
          <Typography variant="subtitle2" noWrap>
            <Link variant="subtitle2" component={RouterLink} to={PATH_DASHBOARD.eCommerce.view(paramCase(name))}>
              {name}
            </Link>
          </Typography>
        </Box>
        <TableRow>{renderSortedQuantity()}</TableRow>
      </TableCell>
    </TableRow>
  );
}
