import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink, useParams } from 'react-router-dom';
import {
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  InputAdornment,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TableContainer,
  TableBody,
  Table,
  Paper,
  Container,
} from '@mui/material';

import _ from 'lodash';

import { TableHeadCustom } from '../../../components/table';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Iconify from '../../../components/Iconify';
import { getProduct } from '../../../redux/slices/product';
import ProductDetailTableRow from '../../../sections/@dashboard/e-commerce/ProductDetailTableRow';

const TABLE_HEAD = [
  { id: 'sku', label: 'Sku', align: 'left' },
  { id: 'version', label: 'Phiên bản/gói', align: 'left' },
  { id: 'quantity', label: 'Số lượng', align: 'left' },
  { id: 'price', label: 'Giá bán', align: 'left' },

  { id: 'priceSale', label: 'Giá so sánh', align: 'left' },
];
export default function ProductDetail() {
  const [arrayNewProduct, setArrayNewProduct] = useState();
  const dispatch = useDispatch();
  const { cates, sizes, colors, productSave, product } = useSelector((state) => state.product);
  // const { product } = useSelector((state) => state.product);
  const { name } = useParams();
  useEffect(() => {
    if (product === null) dispatch(getProduct(name));
  }, [dispatch]);

  return (
    <Page title="Ecommerce: Danh sách sản phẩm">
      <Container>
        <HeaderBreadcrumbs
          heading="Danh sách sản phẩm"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Sản phẩm',
              href: PATH_DASHBOARD.eCommerce.list,
            },
            { name: product?.name },
          ]}
        />
        <Box>
          <Card>
            <TableContainer sx={{ minWidth: 800 }}>
              {' '}
              <Typography variant="h4" className="text-green-500 uppercase " ml={2} mt={2} mb={2}>
                Chi tiết {product?.name}
              </Typography>
              {/* {productUpdate.name} */}
              {/* <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={arrayNewProduct} columns={columns} />
              </div> */}
              <Table>
                <TableHeadCustom
                  // order={order}
                  // orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  // rowCount={arrayNewProduct?.length}
                  // numSelected={selected.length}
                  // onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {product?.productDetail?.map((row, index) => (
                    <ProductDetailTableRow
                      key={row.id}
                      row={{
                        ...row,
                        objectUseName: product?.idObjectUse,
                        price: product.price,
                        priceSale: product.priceSale,
                      }}
                      selected={false}
                      // onSelectRow={() => onSelectRow(row.id)}
                      // onDeleteRow={() => handleDeleteRow(row.id)}
                      // onEditRow={() => handleEditRow(row.name)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>{' '}
          </Card>
        </Box>
      </Container>
    </Page>
  );
}
