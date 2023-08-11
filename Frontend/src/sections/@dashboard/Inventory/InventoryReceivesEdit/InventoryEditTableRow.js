import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import _ from 'lodash';
// @mui
import { TableRow, TableCell, Typography, Link, Box } from '@mui/material';
// utils

import { Link as RouterLink } from 'react-router-dom';
//
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { formatPriceInVND } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

InventoryEditTableRow.propTypes = {
  row: PropTypes.object,
};

export default function InventoryEditTableRow({ row }) {
  const { name, receiptDetail } = row;

  return (
    <TableRow>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'start',
          flexDirection: 'column',
          width: '230px',
          padding: '0px !important',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" noWrap>
            <Link variant="subtitle2" component={RouterLink} to={PATH_DASHBOARD.eCommerce.view(paramCase(name))}>
              {name}
            </Link>
          </Typography>
        </Box>
        <TableRow>
          {' '}
          {receiptDetail.map((item, index) => (
            <TableCell key={index} sx={{ display: 'flex', alignItems: 'center', paddingLeft: '73px !important' }}>
              <Box className="flex flex-col ml-2">
                <Box>
                  {item.idProductDetail.idSize.name} / {item.idProductDetail.idColor.name}
                </Box>
                <Box>
                  <b className="text-[#808080]">SKU:</b> {item.idProductDetail.sku}
                </Box>
              </Box>
            </TableCell>
          ))}
        </TableRow>
      </TableCell>
      <TableCell sx={{ padding: '0px !important' }}>
        {' '}
        {receiptDetail.map((item, index) => (
          <TableCell key={index} sx={{ display: 'flex', alignItems: 'center', paddingLeft: '73px !important' }}>
            <Box>{item.quantity}</Box>
          </TableCell>
        ))}
      </TableCell>
      <TableCell sx={{ padding: '0px !important' }}>
        {' '}
        {receiptDetail.map((item, index) => (
          <TableCell key={index} sx={{ display: 'flex', alignItems: 'center', paddingLeft: '73px !important' }}>
            <Box>{formatPriceInVND(item.price)}</Box>
          </TableCell>
        ))}
      </TableCell>
      <TableCell sx={{ padding: '0px !important' }}>
        {' '}
        {receiptDetail.map((item, index) => (
          <TableCell key={index} sx={{ display: 'flex', alignItems: 'center', paddingLeft: '73px !important' }}>
            <Box>{formatPriceInVND(item.totalPrice)}</Box>
          </TableCell>
        ))}
      </TableCell>
    </TableRow>
  );
}
