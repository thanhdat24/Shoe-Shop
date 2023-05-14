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
  DialogContent,
} from '@mui/material';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { DialogAnimate } from '../../components/animate';
import { useDispatch, useSelector } from '../../redux/store';

import { getOrders } from '../../redux/slices/order';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';

import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import InvoiceAnalytic from '../../sections/@dashboard/invoice/InvoiceAnalytic';
import { RatingTableRow } from '../../sections/@dashboard/rating/list';
import { getAllRating, updateRating } from '../../redux/slices/rating';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = ['Tất cả', 'Thông tin khách hàng', 'Mã đơn hàng'];

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Tên giày', align: 'left' },

  { id: 'phone', label: 'Hình ảnh', align: 'center' },
  { id: 'createDay', label: 'Người đánh giá', align: 'center', width: 100 },
  { id: 'status', label: 'Nội dung', align: 'left', width: 180 },
  { id: 'price', label: 'Số sao', align: 'left' },
  { id: 'payment', label: 'Ngày đánh giá', align: 'center' },
  { id: 'payment', label: 'Trạng thái', align: 'center' },
];

// ----------------------------------------------------------------------
const STATUS_OPTIONS = ['Tất cả', 'Đã duyệt', 'Chưa duyệt'];

export default function RatingList() {
  const theme = useTheme();

  const dispatch = useDispatch();
  const { themeStretch } = useSettings();
  const { allRating, updateRatingSSuccess } = useSelector((state) => state.rating);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [idRating, setIdRating] = useState('');
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
    dispatch(getAllRating());
  }, [dispatch, updateRatingSSuccess]);
  const { enqueueSnackbar } = useSnackbar();
  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterService, setFilterService] = useState('Tất cả');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Tất cả');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };
  useEffect(() => {
    if (allRating?.length) {
      setTableData(allRating);
    }
  }, [allRating]);
  const handleFilterService = (event) => {
    setFilterService(event.target.value);
  };
  const handleClose = () => {
    setOpen(false);
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

  const handleSubmit = async () => {
    dispatch(updateRating(idRating, { active: true }));
    setOpen(false);
    enqueueSnackbar('Duyệt đánh giá thành công!');
  };
  const handleViewRow = (id) => {
    setOpen(true);
    setIdRating(id);
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

  return (
    <Page title="Đơn hàng: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách đánh giá "
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Đánh giá', href: PATH_DASHBOARD.invoice.root },
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

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative', marginTop: '10px' }}>
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
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <RatingTableRow
                      key={row.id}
                      row={row}
                      onViewRow={() => handleViewRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}
                  <DialogAnimate
                    open={open}
                    onClose={handleClose}
                    onClickSubmit={handleSubmit}
                    isCancel={'Quay lại'}
                    isEdit={'Duyệt'}
                  >
                    <DialogContent>
                      <Box>Bạn chắc chắn muốn duyệt đánh giá này?</Box>
                    </DialogContent>
                  </DialogAnimate>

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

  if (filterStatus !== 'Tất cả') {
    if (filterStatus === 'Đã duyệt') tableData = tableData.filter((item) => item.active === true);
    else tableData = tableData.filter((item) => item.active === false);
  }

  // if (filterService !== 'all') {
  //   tableData = tableData.filter((item) => item.items.some((c) => c.service === filterService));
  // }

  // Lọc theo service

  return tableData;
}
