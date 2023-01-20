import sumBy from 'lodash/sumBy';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
import moment from 'moment';
import { useDispatch, useSelector } from '../../redux/store';

import { getOrders } from '../../redux/slices/order';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';

import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _invoices } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import InvoiceAnalytic from '../../sections/@dashboard/invoice/InvoiceAnalytic';
import { InvoiceTableRow, InvoiceTableToolbar } from '../../sections/@dashboard/invoice/list';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = ['all', 'Thông tin khách hàng', 'Mã đơn hàng'];

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Khách hàng', align: 'left' },

  { id: 'phone', label: 'Số điện thoại', align: 'center' },
  { id: 'createDay', label: 'Ngày đặt ', align: 'center', width: 140 },
  { id: 'status', label: 'Trạng thái', align: 'center', width: 140 },
  { id: 'price', label: 'Giá tiền', align: 'left' },
  { id: 'payment', label: 'Thanh toán', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function InvoiceList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const { orders } = useSelector((state) => state.order);
  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  // Ds đơn hàng
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterService, setFilterService] = useState('all');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };
  useEffect(() => {
    if (orders?.length) {
      setTableData(orders);
    }
  }, [orders]);
  const handleFilterService = (event) => {
    setFilterService(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.invoice.edit(id));
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.invoice.view(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const denseHeight = dense ? 56 : 76;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalPriceByStatus = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'total'
    );

  const getPercentByStatus = (status) => (getLengthByStatus(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'Tất cả', color: 'primary', count: tableData.length },
    { value: 'Đang xử lý', label: 'Đang xử lý', color: 'default', count: getLengthByStatus('Đang xử lý') },
    {
      value: 'Đang vận chuyển',
      label: 'Đang vận chuyển',
      color: 'warning',
      count: getLengthByStatus('Đang vận chuyển'),
    },
    { value: 'Đã giao hàng', label: 'Đã giao hàng', color: 'info', count: getLengthByStatus('Đã giao hàng') },
    { value: 'Đã nhận', label: 'Đã nhận', color: 'success', count: getLengthByStatus('Đã nhận') },
    { value: 'Đã đánh giá', label: 'Đã đánh giá', color: 'primary', count: getLengthByStatus('Đã đánh giá') },
    { value: 'Đã hủy', label: 'Đã hủy', color: 'error', count: getLengthByStatus('Đã hủy') },
  ];

  return (
    <Page title="Đơn hàng: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách đơn hàng "
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Đơn hàng', href: PATH_DASHBOARD.invoice.root },
            { name: 'Danh sách' },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     component={RouterLink}
          //     to={PATH_DASHBOARD.invoice.new}
          //     startIcon={<Iconify icon={'eva:plus-fill'} />}
          //   >
          //     New Invoice
          //   </Button>
          // }
        />

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="Tất cả"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'total')}
                icon="ic:round-receipt"
                color={theme.palette.primary.main}
              />
              <InvoiceAnalytic
                title="Đang xử lý"
                total={getLengthByStatus('Đang xử lý')}
                percent={getPercentByStatus('Đang xử lý')}
                price={getTotalPriceByStatus('Đang xử lý')}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.text.secondary}
              />
              <InvoiceAnalytic
                sx={{ padding: 2 }}
                title="Đang vận chuyển"
                total={getLengthByStatus('Đang vận chuyển')}
                percent={getPercentByStatus('Đang vận chuyển')}
                price={getTotalPriceByStatus('Đang vận chuyển')}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />

              <InvoiceAnalytic
                title="Đã giao hàng"
                total={getLengthByStatus('Đã giao hàng')}
                percent={getPercentByStatus('Đã giao hàng')}
                price={getTotalPriceByStatus('Đã giao hàng')}
                icon="eva:car-fill"
                color={theme.palette.info.main}
              />
              <InvoiceAnalytic
                title="Đã nhận"
                total={getLengthByStatus('Đã nhận')}
                percent={getPercentByStatus('Đã nhận')}
                price={getTotalPriceByStatus('Đã nhận')}
                icon="eva:cube-fill"
                color={theme.palette.success.main}
              />
              <InvoiceAnalytic
                title="Đã đánh giá"
                total={getLengthByStatus('Đã đánh giá')}
                percent={getPercentByStatus('Đã đánh giá')}
                price={getTotalPriceByStatus('Đã đánh giá')}
                icon="eva:bell-fill"
                color={theme.palette.primary.main}
              />
              <InvoiceAnalytic
                title="Đã hủy"
                total={getLengthByStatus('Đã hủy')}
                percent={getPercentByStatus('Đã hủy')}
                price={getTotalPriceByStatus('Đã hủy')}
                icon="eva:file-fill"
                color={theme.palette.error.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                label={
                  <Stack spacing={1} direction="row" alignItems="center">
                    <div>{tab.label}</div> <Label color={tab.color}> {tab.count} </Label>
                  </Stack>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <InvoiceTableToolbar
            filterName={filterName}
            filterService={filterService}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterName}
            onFilterService={handleFilterService}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
            optionsService={SERVICE_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
                      <Tooltip title="Sent">
                        <IconButton color="primary">
                          <Iconify icon={'ic:round-send'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Download">
                        <IconButton color="primary">
                          <Iconify icon={'eva:download-outline'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Print">
                        <IconButton color="primary">
                          <Iconify icon={'eva:printer-fill'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <InvoiceTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterService,
  filterStartDate,
  filterEndDate,
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);
  // Lọc theo filter

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.id.indexOf(filterName) !== -1 ||
        item.address.phoneNumber.indexOf(filterName.toLowerCase()) !== -1 ||
        item.address.fullName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  // if (filterService !== 'all') {
  //   tableData = tableData.filter((item) => item.items.some((c) => c.service === filterService));
  // }

  // Lọc theo service

  if (filterService === 'Mã đơn hàng') {
    if (filterName) {

      // tableData = tableData.filter((item) => item.id === filterName);
    }
    // tableData = tableData.filter((item) => item.address.fullName === filterService);
  }

  if (filterService === 'Thông tin khách hàng') {
    if (filterName) {
      tableData = tableData.filter(
        (item) =>
          item.address.phoneNumber.indexOf(filterName.toLowerCase()) !== -1 ||
          item.address.fullName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
    }
    // tableData = tableData.filter((item) => item.address.fullName === filterService);
  }
  // filter theo ngày
  if (filterStartDate && filterEndDate) {
    tableData = tableData.filter(
      (item) =>
        moment(item.createdAt).format('DD/MM/YYYY') >= moment(filterStartDate).format('DD/MM/YYYY') &&
        moment(item.createdAt).format('DD/MM/YYYY') <= moment(filterEndDate).format('DD/MM/YYYY')
    );
  }

  return tableData;
}
