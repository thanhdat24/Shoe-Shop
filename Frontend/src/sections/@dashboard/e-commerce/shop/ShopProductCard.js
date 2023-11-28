import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import _ from 'lodash';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_HOME } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import { ColorPreview } from '../../../../components/color-utils';
import { formatDate, isCurrentDateGreaterThanSevenDays } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { name, cover, price, priceSale, productImages, productDetail, createdAt } = product;
  const [status, setStatus] = useState('');
  console.log('createdAt', createdAt);
  const day = new Date();
  console.log('day123', isCurrentDateGreaterThanSevenDays(createdAt));
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
      </Box>

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
