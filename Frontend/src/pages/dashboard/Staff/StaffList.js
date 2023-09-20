import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { useDispatch, useSelector } from '../../../redux/store';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../components/table';
// sections
import { StaffTableToolBar, StaffTableRow } from '../../../sections/@dashboard/staff/list';

import { getUsers } from '../../../redux/slices/admin';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = ['all', 'quản trị', 'khách hàng'];

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', align: 'left' },
  { id: 'name', label: 'Tên', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'role', label: 'Quyền', align: 'left' },
  { id: 'gender', label: 'Giới tính', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function StaffList() {
  const { accountList } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
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
  } = useTable();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };
  useEffect(() => {
    if (accountList?.length) {
      setTableData(accountList);
    }
  }, [accountList]);

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
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
    navigate(PATH_DASHBOARD.staff.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  return (
    <Page title="User: List">
      <HeaderBreadcrumbs
        heading="Danh sách nhân viên"
        links={[
          { name: 'Trang chủ', href: PATH_DASHBOARD.root },
          { name: 'Người dùng', href: PATH_DASHBOARD.staff.root },
          { name: 'Danh sách' },
        ]}
        action={
          <Button
            variant="contained"
            component={RouterLink}
            to={PATH_DASHBOARD.user.new}
            startIcon={<Iconify icon={'eva:plus-fill'} />}
          >
            Thêm nhân viên
          </Button>
        }
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

        <StaffTableToolBar
          filterName={filterName}
          filterRole={filterRole}
          onFilterName={handleFilterName}
          onFilterRole={handleFilterRole}
          optionsRole={ROLE_OPTIONS}
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
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                      <Iconify icon={'eva:trash-2-outline'} />
                    </IconButton>
                  </Tooltip>
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
                {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <StaffTableRow
                    key={row.id}
                    index={index}
                    row={row}
                    selected={selected.includes(row._id)}
                    onSelectRow={() => onSelectRow(row._id)}
                    onDeleteRow={() => handleDeleteRow(row._id)}
                    onEditRow={() => handleEditRow(row._id)}
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
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterStatus, filterRole }) {
  // filterStatus = filterStatus === 'active' ? true : (filterStatus === 'banned' || filterStatus !== 'all') && false;

  if (filterStatus === 'active') {
    filterStatus = true;
  } else if (filterStatus === 'banned') {
    filterStatus = false;
  }

  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.displayName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.active === filterStatus);
  }

  if (filterRole !== 'all') {
    if (filterRole === 'quản trị') {
      tableData = tableData.filter((item) => item.role !== 'khách hàng');
    } else {
      tableData = tableData.filter((item) => item.role === filterRole);
    }
  }

  return tableData;
}
