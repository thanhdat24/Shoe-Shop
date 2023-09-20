import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import _ from 'lodash';
// @mui
import { TableRow, TableCell, Typography, Link, Box, TextField } from '@mui/material';
// utils

import { Link as RouterLink } from 'react-router-dom';
//
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { formatPriceInVND } from '../../../../utils/formatNumber';
import Image from '../../../../components/Image';

// ----------------------------------------------------------------------

InventoryEditTableRow.propTypes = {
  row: PropTypes.object,
  setInventoryData: PropTypes.func,
  inventoryData: PropTypes.array,
  groupByReceiptDetail: PropTypes.array,
};

export default function InventoryEditTableRow({ row, setInventoryData, inventoryData, groupByReceiptDetail }) {
  const { name, urlImage, receiptDetail } = row;

  const [quantityValues, setQuantityValues] = useState(
    receiptDetail.reduce((quantities, item) => {
      quantities[item.id] = item.quantity;
      return quantities;
    }, {})
  );

  const [priceValues, setPriceValues] = useState(
    receiptDetail.reduce((prices, item) => {
      prices[item.id] = item.price;
      return prices;
    }, {})
  );

  useEffect(() => {
    const data = groupByReceiptDetail.flatMap((item) =>
      item.receiptDetail.map((detailItem) => ({
        id: detailItem._id,
        quantity: detailItem.quantity,
        price: detailItem.price,
      }))
    );
    setInventoryData(data);
  }, []);

  const handleQuantityChange = (newQuantityValues, idProduct) => {
    const updatedInventoryData = inventoryData.map((item) => ({ ...item }));

    Object.keys(newQuantityValues).forEach((key) => {
      const value = newQuantityValues[key];

      const index = updatedInventoryData.findIndex((item) => item.id === key);

      if (index !== -1) {
        updatedInventoryData[index].quantity = value;
      } else {
        updatedInventoryData.push({ id: key, quantity: value, idProduct });
      }
    });

    setInventoryData(updatedInventoryData);
  };

  const handlePriceChange = (newPriceValues, idProduct) => {
    const updatedInventoryData = inventoryData.map((item) => ({ ...item }));

    Object.keys(newPriceValues).forEach((key) => {
      const value = newPriceValues[key];

      const index = updatedInventoryData.findIndex((item) => item.id === key);

      if (index !== -1) {
        updatedInventoryData[index].price = value;
      } else {
        updatedInventoryData.push({ id: key, price: value, idProduct });
      }
    });

    setInventoryData(updatedInventoryData);
  };

  const renderTotalPrice = () => {
    return receiptDetail.map((item, index) => {
      const calculatedPrice = priceValues[item.id] * quantityValues[item.id];
      return (
        <TableCell
          key={index + 1}
          sx={{
            padding: '16px 30px 16px 16px !important',
            height: 76,
            display: 'flex',
            justifyContent: 'end !important',
            alignItems: 'start',
          }}
        >
          <Typography>{formatPriceInVND(calculatedPrice)}</Typography>
        </TableCell>
      );
    });
  };

  return (
    <TableRow>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'start',
          flexDirection: 'column',
          width: '230px',
          padding: ' 10px 0 0 0 !important',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image disabledEffect alt={name} src={urlImage} sx={{ borderRadius: 1.5, width: 48, height: 48, mx: 2 }} />
          <Typography variant="subtitle2" noWrap>
            <Link variant="subtitle2" component={RouterLink} to={PATH_DASHBOARD.eCommerce.view(paramCase(name))}>
              {name}
            </Link>
          </Typography>
        </Box>
        <TableRow>
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
      <TableCell sx={{ padding: ' 65px 0 0 0 !important' }}>
        {receiptDetail.map((item, index) =>
          item.idReceipt.inventoryStatus === 2 || item.idReceipt.inventoryStatus === 3 ? (
            <TableCell
              key={index}
              sx={{ height: 76, display: 'flex', alignItems: 'start', paddingLeft: '30px !important' }}
            >
              <Box>{item.quantity}</Box>
            </TableCell>
          ) : (
            <TableCell
              key={index}
              sx={{ height: 76, display: 'flex', alignItems: 'start', paddingLeft: '73px !important' }}
            >
              <TextField
                sx={{ width: '100px !important', height: '8px !important' }}
                type="number"
                size="small"
                value={quantityValues[item.id]}
                onChange={(e) => {
                  const newQuantityValues = { ...quantityValues };
                  const newValue = parseInt(e.target.value, 10);
                  newQuantityValues[item.id] = Number.isNaN(newValue) ? 0 : newValue; // Use Number.isNaN
                  setQuantityValues(newQuantityValues);
                  handleQuantityChange(newQuantityValues, item.idProductDetail.idProduct.id);
                }}
              />
            </TableCell>
          )
        )}
      </TableCell>
      <TableCell sx={{ padding: ' 65px 0 0 0 !important' }}>
        {' '}
        {receiptDetail.map((item, index) =>
          item.idReceipt.inventoryStatus === 2 || item.idReceipt.inventoryStatus === 3 ? (
            <TableCell
              key={index}
              sx={{ height: 76, display: 'flex', alignItems: 'start', paddingLeft: '30px !important' }}
            >
              <Box>{formatPriceInVND(item.price)}</Box>
            </TableCell>
          ) : (
            <TableCell
              key={index}
              sx={{ height: 76, display: 'flex', alignItems: 'start', paddingLeft: '73px !important' }}
            >
              <TextField
                sx={{ width: '100px !important', height: '8px !important' }}
                type="number"
                size="small"
                value={priceValues[item.id]}
                onChange={(e) => {
                  const newPriceValues = { ...priceValues };
                  const newValue = parseInt(e.target.value, 10);
                  newPriceValues[item.id] = Number.isNaN(newValue) ? 0 : newValue; // Use Number.isNaN
                  setPriceValues(newPriceValues);
                  handlePriceChange(newPriceValues, item.idProductDetail.idProduct.id);

                  // setInventoryData([...dat,newPriceValues]);
                }}
              />
            </TableCell>
          )
        )}
      </TableCell>
      <TableCell sx={{ padding: '65px 0 0 0 !important' }}>{renderTotalPrice()}</TableCell>
    </TableRow>
  );
}
