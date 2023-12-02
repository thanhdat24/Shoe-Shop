import { paramCase } from 'change-case';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Box, Card, IconButton, Link, Stack, Typography } from '@mui/material';
// routes
import { PATH_HOME } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import { ColorPreview } from '../../../../components/color-utils';
import Image from '../../../../components/Image';
import Label from '../../../../components/Label';
import { isCurrentDateGreaterThanSevenDays } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { name, cover, price, priceSale, productImages, productDetail, createdAt } = product;
  const [status, setStatus] = useState('');
  const day = new Date();
  useEffect(() => {
    setStatus(!createdAt && isCurrentDateGreaterThanSevenDays(createdAt) ? 'old' : 'new');
  }, [createdAt]);

  const linkTo = PATH_HOME.product.view(paramCase(name));
  const colors = [];
  const sizes = [];
  const today = day.getDay();
  const groupByColor = _(productDetail)
    .groupBy((x) => x.idColor.color)
    .map((value, key) => ({ color: key, productDetail: value }))
    .value();

  const groupBySizes = _(productDetail)
    .groupBy((x) => x.idSize.name)
    .map((value, key) => ({ size: key, productDetail: value }))
    .value();

  groupByColor.map((item) => {
    return colors.push(item.color);
  });

  groupBySizes.map((item) => {
    return sizes.push(Number(item.size));
  });

  return (
    <Card>
      <Link to={linkTo} color="inherit" component={RouterLink}>
        <Box sx={{ position: 'relative' }}>
          {status && status !== 'old' && (
            <Label
              variant="filled"
              color={(status === 'sale' && 'error') || 'info'}
              sx={{
                top: 16,
                right: 16,
                zIndex: 9,
                position: 'absolute',
                textTransform: 'uppercase',
              }}
            >
              {status}
            </Label>
          )}
          <Image alt={name} src={productImages[0].url[0]} ratio="1/1" />
          {/* <IconButton
          aria-label="delete"
          size="large"
          sx={{
            bottom: 16,
            right: 16,
            zIndex: 9,
            position: 'absolute',
            textTransform: 'uppercase',
            backgroundColor: 'rgb(255, 171, 0)',
            color: 'rgb(33, 43, 54)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: 'rgb(183, 110, 0)',
            },
          }}
        >
          <AddShoppingCartIcon fontSize="inherit" sx={{ width: '24px', height: '24px' }} />
        </IconButton> */}
        </Box>
      </Link>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ColorPreview colors={colors} />
          <Stack direction="row" spacing={0.5}>
            {priceSale !== 0 && (
              <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                {fCurrency(priceSale)}
              </Typography>
            )}

            <Typography variant="subtitle1">{fCurrency(price)}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
