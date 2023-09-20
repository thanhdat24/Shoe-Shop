import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { sentenceCase, paramCase } from 'change-case';
import _ from 'lodash';
// @mui
import {
  TableRow,
  Checkbox,
  TableCell,
  Typography,
  MenuItem,
  Link,
  Box,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
// utils

import { Link as RouterLink } from 'react-router-dom';
//
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { formatPriceInVND } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';

// ----------------------------------------------------------------------

InventoryTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  selectedInventory: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onSelectRowInventory: PropTypes.func,
  setInventoryData: PropTypes.func,
  inventoryData: PropTypes.array,
};

export default function InventoryTableRow({
  row,
  selected,
  selectedInventory,
  onSelectRow,
  onSelectRowInventory,
  setInventoryData,
  inventoryData,
}) {
  const { name, productDetail } = row;
  const [quantityValues, setQuantityValues] = useState(
    productDetail.reduce((quantities, item) => {
      quantities[item.id] = 0;
      return quantities;
    }, {})
  );
  const [priceValues, setPriceValues] = useState(
    productDetail.reduce((prices, item) => {
      prices[item.id] = 0;
      return prices;
    }, {})
  );


  const sortedProductDetail = [...productDetail].sort((item1, item2) => {
    const sizeComparison = item1.idSize.name - item2.idSize.name;

    return sizeComparison !== 0
      ? sizeComparison
      : parseInt(item1.sku.split('-')[1], 10) - parseInt(item2.sku.split('-')[1], 10);
  });

  const [priceQuantity, setPriceQuantity] = useState([]);

  useEffect(() => {
    const updatedPriceQuantity = [...priceQuantity];

    sortedProductDetail.forEach((product) => {
      const productId = product.id;
      const name = product.name;
      const quantity = quantityValues[productId] || 0;
      const price = priceValues[productId] || 0;

      const existingIndex = updatedPriceQuantity.findIndex((item) => item.id === productId);
      if (existingIndex !== -1) {
        // Update existing item
        updatedPriceQuantity[existingIndex] = {
          id: productId,
          name,
          quantity,
          price,
        };
      } else {
        // Add new item
        updatedPriceQuantity.push({
          id: productId,
          name,
          quantity,
          price,
        });
      }
    });
    setPriceQuantity(updatedPriceQuantity);
  }, [priceValues, quantityValues]);

  useEffect(() => {
    const updatedData = selectedInventory.map((item) => ({
      id: item._id,
      quantity: 0,
      price: 0,
      idProduct: item.idProduct._id,
    }));

    setInventoryData(updatedData);
  }, [selectedInventory]);
  const handlePriceChange = (newPriceValues, idProduct) => {
    setInventoryData((prevInventoryData) => {
      const updatedInventoryData = prevInventoryData.map((item) => ({ ...item }));

      Object.keys(newPriceValues).forEach((key) => {
        const value = newPriceValues[key];
        const existingItem = updatedInventoryData.find((item) => item.id === key);

        if (existingItem) {
          existingItem.price = value;
        } else {
          updatedInventoryData.push({ id: key, price: value, idProduct });
        }
      });

      return updatedInventoryData;
    });
  };

  const handleQuantityChange = (newQuantityValues, idProduct) => {
    setInventoryData((prevInventoryData) => {
      const updatedInventoryData = prevInventoryData.map((item) => ({ ...item }));

      Object.keys(newQuantityValues).forEach((key) => {
        const value = newQuantityValues[key];
        const existingItem = updatedInventoryData.find((item) => item.id === key);

        if (existingItem) {
          existingItem.quantity = value;
        } else {
          updatedInventoryData.push({ id: key, quantity: value, idProduct });
        }
      });

      return updatedInventoryData;
    });
  };


  const renderSortedProductDetail = () => {
    return sortedProductDetail.map((item, index) => (
      <TableCell key={index} sx={{ display: 'flex', alignItems: 'center', paddingLeft: '73px !important' }}>
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

  const renderSortedInventory = () => {
    return sortedProductDetail.map((item, index) => (
      <TableCell key={index} sx={{ height: 76, display: 'flex', alignItems: 'start', paddingLeft: '73px !important' }}>
        <Box>{item.quantity}</Box>
      </TableCell>
    ));
  };

  const renderQuantity = () => {
    return sortedProductDetail.map((item, index) => (
      <TableCell key={index} sx={{ height: 76, display: 'flex', alignItems: 'start', paddingLeft: '73px !important' }}>
        <TextField
          sx={{ width: '100px !important', height: '8px !important' }}
          type="number"
          size="small"
          onChange={(e) => {
            const newQuantityValues = { ...quantityValues };
            const newValue = parseInt(e.target.value, 10);
            newQuantityValues[item.id] = Number.isNaN(newValue) ? 0 : newValue;
            setQuantityValues(newQuantityValues);
            handleQuantityChange(newQuantityValues, item.idProduct.id);
          }}
        />
      </TableCell>
    ));
  };

  const renderPrice = () => {
    return sortedProductDetail.map((item, index) => (
      <TableCell key={index} sx={{ height: 76, display: 'flex', alignItems: 'start', paddingLeft: '73px !important' }}>
        <TextField
          sx={{ width: '100px !important', height: '8px !important' }}
          type="number"
          size="small"
          onChange={(e) => {
            const newPriceValues = { ...priceValues };
            const newValue = parseInt(e.target.value, 10);
            newPriceValues[item.id] = Number.isNaN(newValue) ? 0 : newValue;
            setPriceValues(newPriceValues);
            handlePriceChange(newPriceValues, item.idProduct.id);
            // setInventoryData([...dat,newPriceValues]);
          }}
        />
      </TableCell>
    ));
  };

  const renderTotalPrice = () => {
    return sortedProductDetail.map((item, index) => {
      const calculatedPrice = priceValues[item.id] * quantityValues[item.id];
      return (
        <TableCell
          key={index}
          sx={{ height: 76, display: 'flex', alignItems: 'start', paddingLeft: '30px !important' }}
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
          <Image
            disabledEffect
            alt={name}
            src={productDetail[0]?.idProduct.urlImage}
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
      <TableCell sx={{ padding: '65px 0 0 0 !important' }}>{renderSortedInventory()}</TableCell>
      <TableCell sx={{ padding: '65px 0 0 0 !important' }}>{renderQuantity()}</TableCell>
      <TableCell sx={{ padding: '65px 0 0 0 !important' }}>{renderPrice()}</TableCell>
      <TableCell sx={{ padding: '65px 0 0 0 !important' }}>{renderTotalPrice()}</TableCell>
    </TableRow>
  );
}
