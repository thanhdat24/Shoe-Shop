import { Font, StyleSheet } from '@react-pdf/renderer';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf' },
    { src: '/fonts/Roboto-Italic.ttf', fontStyle: 'italic' },
  ],
});

const styles = StyleSheet.create({
  col4: { width: '25%' },
  col8: { width: '75%' },
  col6: { width: '50%' },
  mt15: { marginTop: 15 },
  mt35: { marginTop: 35 },
  mb8: { marginBottom: 8 },
  mb3: { marginBottom: 3 },
  mb40: { marginBottom: 40 },
  mb25: { marginBottom: 25 },
  fontBold: { fontFamily: 'Roboto', fontWeight: 600 },
  fontItalic: { fontFamily: 'Roboto', fontStyle: 'italic' },
  overline: {
    fontSize: 8,
    marginBottom: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  h1: { fontSize: 23, fontWeight: 700, textTransform: 'uppercase' },
  h3: { fontSize: 15, fontWeight: 700 },
  h4: { fontSize: 12, fontWeight: 700 },
  h5: { fontSize: 11, fontWeight: 700 },
  h6: { fontSize: 11 },
  subtitle1: { fontSize: 11, fontWeight: 700 },
  body1: { fontSize: 10 },
  subtitle2: { fontSize: 9, fontWeight: 700 },
  subtitle3: { fontSize: 11 },
  alignRight: { textAlign: 'right' },
  page: {
    padding: '40px 24px 0 24px',
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
    position: 'relative',
    // textTransform: "capitalize",
  },
  footer: {
    left: 100,
    right: 0,
    top: 380,
    position: 'absolute',
  },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  gridEvenly: { flexDirection: 'row', justifyContent: 'space-evenly' },
  gridItem: { flexDirection: 'column', alignItems: 'center' },
  gridColumn: { flexDirection: 'column', justifyContent: 'space-between' },
  // table: { display: 'flex', width: 'auto' },
  // tableHeader: {},
  // tableBody: {},
  // tableRow: {
  //   padding: '8px 0',
  //   flexDirection: 'row',
  //   borderBottomWidth: 1,
  //   borderStyle: 'solid',
  //   borderColor: '#DFE3E8',
  // },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  tableCell_1: { width: '5%' },
  tableCell_2: { width: '50%', paddingRight: 16 },
  tableCell_3: { width: '15%' },
  tableContainer: {
    marginTop: 10,
    border: '1 solid #000',
    width: '100%',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
  },
  tableHeaderRow: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderRight: '1 solid #000',
    textAlign: 'center',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 5,
    borderRight: '1 solid #000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  hr: {
    borderBottomWidth: 1,
    borderColor: '#DFE3E8', // Màu của border
    width: '100%',
  },
});

export default styles;
