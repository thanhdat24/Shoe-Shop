import React from 'react';
import PropTypes from 'prop-types';
import { Box, Dialog, DialogActions, IconButton, Tooltip } from '@mui/material';
import { Page, View, Text, Image, Document, PDFViewer } from '@react-pdf/renderer';
import JsBarcode from 'jsbarcode';
import { alpha } from '@mui/material/styles';
import Iconify from '../../../../components/Iconify';
import styles from './InventoryReceivesPrintStyle';
import { formatPriceInVND } from '../../../../utils/formatNumber';
import {  formatDateReceipt } from '../../../../utils/formatTime';

const generateBarcode = (data) => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, data, {
    format: 'CODE128', // Loại mã vạch
    displayValue: true, // Hiển thị giá trị mã vạch bên dưới
  });
  return canvas.toDataURL('image/png'); // Trả về URL của hình ảnh mã vạch
};

InventoryReceivesPrint.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  detailReceipt: PropTypes.object,
};

export default function InventoryReceivesPrint({ open, onClose, detailReceipt }) {
  const barcodeData = '123456789'; // Dữ liệu mã vạch
  const barcodeImage = generateBarcode(detailReceipt?.receiptCode); // Tạo hình ảnh mã vạch

  const { supplier, receivingWarehouse, receiptDetail, totalReceivedQuantity, totalPrice, supplierCost } =
    detailReceipt || {};
  return (
    <Dialog fullScreen open={open}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DialogActions
          sx={{
            zIndex: 9,
            padding: '12px !important',
            boxShadow: `0 8px 16px 0 ${alpha('#919EAB', 0.16)}`,
          }}
        >
          <Tooltip title="Close">
            <IconButton color="inherit" onClick={onClose}>
              <Iconify icon={'eva:close-fill'} />
            </IconButton>
          </Tooltip>
        </DialogActions>
        <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            <Document>
              <Page size="A4" style={styles.page}>
                <View style={[styles.gridContainer, styles.mb25]}>
                  <View style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.h3, { marginRight: '10px' }]}>PHIẾU NHẬP HÀNG</Text>
                      <Text>({formatDateReceipt(detailReceipt?.createdAt)})</Text>
                    </View>
                    <Text>
                      <Text style={styles.h5}>Shop Giày Thể Thao</Text>
                    </Text>
                    <Text>
                      <Text style={styles.h5}>Website:</Text>
                    </Text>
                    <Text>
                      <Text style={styles.h5}>Email:</Text>
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
                    <Image style={{ width: 220, height: 110 }} src={barcodeImage} alt="Barcode" />
                  </View>
                </View>
                <View style={[styles.gridContainer]}>
                  <View
                    style={{
                      alignItems: 'flex-start',
                      flexDirection: 'column',
                    }}
                  >
                    <Text style={[styles.h4]}>THÔNG TIN NHÀ CUNG CẤP</Text>
                    <Text style={[styles.h6]}>{supplier?.name}</Text>
                    <Text style={[styles.h6]}>{supplier?.contactPhone}</Text>
                    <Text style={[styles.h6]}>{supplier?.contactEmail}</Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'flex-end',
                      flexDirection: 'column',
                    }}
                  >
                    <View
                      style={{
                        alignItems: 'flex-start',
                      }}
                    >
                      <Text style={[styles.h4]}>THÔNG TIN KHO NHẬP</Text>
                      <Text style={[styles.h6]}>Địa điểm mặc định</Text>
                      <Text style={[styles.h6]}>{receivingWarehouse?.warehousePhoneNumber}</Text>
                      <Text style={[styles.h6]}>{receivingWarehouse?.warehouseAddress}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.tableContainer]}>
                  <View style={[styles.tableRow, styles.tableHeaderRow]}>
                    <Text style={[styles.tableHeaderCell]}>Hình ảnh</Text>
                    <Text style={[styles.tableHeaderCell]}>Mã sản phẩm</Text>
                    <Text style={[styles.tableHeaderCell]}>Tên</Text>
                    <Text style={[styles.tableHeaderCell]}>Số lượng</Text>
                    <Text style={[styles.tableHeaderCell]}>Giá</Text>
                  </View>
                  {/* Product Rows */}
                  {receiptDetail?.map((item) => (
                    <>
                      <View style={[styles.tableRow]}>
                        <Text style={[styles.tableCell]}>Hình ảnh ở đây</Text>
                        <Text style={[styles.tableCell]}>{item.idProductDetail.sku}</Text>
                        <Text style={[styles.tableCell]}>{item.idProductDetail.idProduct.name}</Text>
                        <Text style={[styles.tableCell]}>{item.quantity}</Text>
                        <Text style={[styles.tableCell]}>{formatPriceInVND(item.price)}</Text>
                      </View>
                    </>
                  ))}
                </View>
                <View style={[styles.gridContainer, { marginTop: 10 }]}>
                  <View
                    style={{
                      flex: 6,
                      alignItems: 'flex-start',
                      flexDirection: 'column',
                    }}
                  >
                    <Text style={[styles.h6]}>Ghi chú</Text>
                    {/* Các phần khác của cột ghi chú */}
                  </View>
                  <View
                    style={{
                      flex: 6,
                      alignItems: 'flex-end',
                      flexDirection: 'column',
                    }}
                  >
                    <View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          padding: '5px 0px',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text style={[styles.subtitle3, { marginRight: 150 }]}>Tổng số lượng nhập</Text>
                        <Text style={[styles.h6]}>{totalReceivedQuantity}</Text>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <View style={[styles.hr]} />
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: '5px 0px',
                        }}
                      >
                        <Text style={[styles.subtitle3, { marginRight: 150 }]}>Tổng tiền hàng</Text>
                        <Text style={[styles.h6]}>{formatPriceInVND(totalPrice)}</Text>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: '5px 0px',
                        }}
                      >
                        <Text style={[styles.subtitle3, { marginRight: 150 }]}>Chiết khấu</Text>
                        <Text style={[styles.h6]}>{formatPriceInVND(0)}</Text>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: '5px 0px',
                        }}
                      >
                        <Text style={[styles.subtitle1, { marginRight: 150 }]}>Cần trả nhà cung cấp </Text>
                        <Text style={[styles.h6]}>{formatPriceInVND(supplierCost)}</Text>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <View style={[styles.hr]} />
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: '5px 0px',
                        }}
                      >
                        <Text style={[styles.subtitle1, { marginRight: 150 }]}>Tổng giá trị nhập hàng </Text>
                        <Text style={[styles.h6]}>{formatPriceInVND(totalPrice)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Page>
            </Document>
          </PDFViewer>
          123
        </Box>
      </Box>
    </Dialog>
  );
}
