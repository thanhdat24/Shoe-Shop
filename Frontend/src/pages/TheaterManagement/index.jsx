import React, { useEffect } from "react";
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useSnackbar } from "notistack";

import { Link as RouterLink } from "react-router-dom";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
// import UserListToolbar from "../../components/user";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTheater,
  getTheaterList,
  resetCreateTheater,
} from "../../redux/actions/Theater";
import NameMoreMenu from "../../components/skeleton/NameMoreMenu";
import NameListHead from "../../components/skeleton/NameListHead";
import NameListToolbar from "../../components/skeleton/NameListToolbar";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Tên rạp", alignRight: false },
  { id: "theaterSystem", label: "Hệ thống rạp", alignRight: false },
  { id: "nameTheaterCluster", label: "Tên cụm rạp", alignRight: false },
  { id: "address", label: "Địa Chỉ", alignRight: false },
  // { id: "type", label: "Loại Rạp", alignRight: false },
  { id: "seatsTotal", label: "Số lượng ghế", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_theater) =>
        _theater.name?.indexOf(query) !== -1
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function TheaterManagement() {
  const dispatch = useDispatch();
  const { theaterList, loadingDeleteTheater } = useSelector(
    (state) => state.TheaterReducer
  );
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { enqueueSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {
    successUpdateTheater,
    successCreateTheater,
    errorDeleteTheater,
    successDeleteTheater,
  } = useSelector((state) => state.TheaterReducer);

  useEffect(() => {
    // get list user lần đầu
    dispatch(getTheaterList());
    // return () => dispatch(resetUserList());
  }, []);

  useEffect(() => {
    if (successCreateTheater || successDeleteTheater || successUpdateTheater) {
      dispatch(getTheaterList());
    }
    return () => dispatch(resetCreateTheater());
  }, [successCreateTheater, successDeleteTheater, successUpdateTheater]);

  useEffect(() => {
    if (successDeleteTheater) {
      enqueueSnackbar(successDeleteTheater, { variant: "success" });
      return;
    }
    if (errorDeleteTheater) {
      enqueueSnackbar(errorDeleteTheater, { variant: "error" });
    }
  }, [successDeleteTheater, errorDeleteTheater]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = theaterList?.data.map((n) => n.fullName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleFilterByTheaterCluster = (event) => {
    setFilterStatus(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - theaterList?.result) : 0;

  const filteredTheater = applySortFilter(
    theaterList?.data,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = theaterList?.result === 0;

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      href="/admin/dashboard"
      color="text.primary"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Trang chủ
    </Link>,
    <Typography key="2" color="inherit">
      Danh sách
    </Typography>,
  ];
  return (
    <Container
      sx={{ paddingRight: "0px !important", paddingLeft: "0px !important" }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
        mt={7.5}
      >
        <Stack spacing={2}>
          <Typography variant="h4" gutterBottom>
            Danh sách rạp
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>

        <Button
          variant="contained"
          component={RouterLink}
          to="/admin/theater/create"
          sx={{ "&:hover": { color: "#fff" } }}
          startIcon={<Icon icon={plusFill} />}
        >
          Thêm Rạp
        </Button>
      </Stack>
      <Card>
        <NameListToolbar
          numSelected={selected.length}
          searchLabelName={"Tìm rạp..."}
          onFilterName={handleFilterByName}
        />

        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <NameListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={theaterList?.result}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
              isExistsCheckBox={false}
            />
            <TableBody>
              {filteredTheater
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { _id, name, type, seatsTotal, idTheaterCluster } = row;
                  const isItemSelected = selected.indexOf(name) !== -1;

                  return (
                    <TableRow
                      hover
                      key={_id}
                      tabIndex={-1}
                      _id="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell align="left">{name}</TableCell>
                      <TableCell align="left">
                        <img
                          className="max-w-2xl h-14 rounded"
                          src={idTheaterCluster?.idTheaterSystem?.logo}
                          alt="logo"
                        />
                      </TableCell>
                      <TableCell align="left">
                        {idTheaterCluster?.name}
                      </TableCell>

                      <TableCell align="left">
                        {idTheaterCluster?.address}
                      </TableCell>

                      {/* <TableCell align="left">{type}</TableCell> */}
                      <TableCell align="left">{seatsTotal}</TableCell>

                      <TableCell align="right">
                        <NameMoreMenu
                          id={_id}
                          loadingDelete={loadingDeleteTheater}
                          actionName={deleteTheater}
                          editURL={"/admin/theater/edit/"}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {isUserNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    {/* <SearchNotFound searchQuery={filterName} /> */}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={theaterList?.result || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
