import { Box, Card, Container, Table, TableBody, TableContainer, Typography } from '@mui/material';
import { paramCase } from 'change-case';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { TableHeadCustom } from '../../../components/table';
import { getProducts } from '../../../redux/slices/product';
import { PATH_DASHBOARD } from '../../../routes/paths';
import ProductDetailTableRow from '../../../sections/@dashboard/e-commerce/ProductDetailTableRow';

const TABLE_HEAD = [
  { id: 'sku', label: 'Sku', align: 'left' },
  { id: 'version', label: 'Phiên bản/gói', align: 'left' },
  { id: 'quantity', label: 'Số lượng', align: 'left' },
  { id: 'price', label: 'Giá bán', align: 'left' },

  { id: 'priceSale', label: 'Giá so sánh', align: 'left' },
];
export default function ProductDetail() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { name } = useParams();
  const currentProduct = products?.data?.find((product) => paramCase(product.name) === name);

  useEffect(() => {
    dispatch(getProducts());
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
            { name: currentProduct?.name },
          ]}
        />
        <Box>
          <Card>
            <TableContainer sx={{ minWidth: 800 }}>
              {' '}
              <Typography variant="h4" className="text-green-500 uppercase " ml={2} mt={2} mb={2}>
                Chi tiết {currentProduct?.name}
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
                  {currentProduct?.productDetail?.map((row, index) => (
                    <ProductDetailTableRow
                      key={row.id}
                      row={{
                        ...row,
                        objectUseName: currentProduct?.idObjectUse,
                        price: currentProduct.price,
                        priceSale: currentProduct.priceSale,
                      }}
                      selected={false}
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
