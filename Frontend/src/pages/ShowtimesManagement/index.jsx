import React, { useEffect } from "react";
import {
  Card,
  Table,
  Stack,
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
  Tooltip,
  Zoom,
  IconButton,
} from "@mui/material";
import { useSnackbar } from "notistack";

import { Link as RouterLink, NavLink, useHistory } from "react-router-dom";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { useDispatch, useSelector } from "react-redux";

import { getAllShowTimes } from "../../redux/actions/Theater";
import moment from "moment";
import {
  deleteShowTimes,
  resetCreateShowtime,
} from "../../redux/actions/BookTicket";
import NameMoreMenu from "../../components/skeleton/NameMoreMenu";
import NameListHead from "../../components/skeleton/NameListHead";
import NameListToolbar from "../../components/skeleton/NameListToolbar";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "idMovie", label: "Phim", alignRight: false },
  { id: "TheaterSystem", label: "Hệ thống rạp", alignRight: false },
  { id: "NameTheaterCluster", label: "Tên cụm rạp", alignRight: false },
  { id: "Address", label: "Địa chỉ", alignRight: false },
  { id: "idTheater", label: "Rạp", alignRight: false },

  {
    id: "dateShow",
    label: "Ngày chiếu giờ chiếu",
    alignRight: false,
  },
  { id: "ticketPrice", label: "Giá vé (vnđ)", alignRight: false },
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
      (_movie) =>
        _movie.idMovie?.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function ShowtimesManagement() {
  const dispatch = useDispatch();
  const { showtimesList } = useSelector((state) => state.TheaterReducer);

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterNameMovie, setFilterNameMovie] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {
    successCreateShowtime,
    successDeleteShowtime,
    errorDeleteShowtime,
    successUpdateShowtime,
    loadingCreateShowtime,
  } = useSelector((state) => state.BookTicketReducer);
  useEffect(() => {
    // get list user lần đầu
    // if (!showtimesList.result) {
    dispatch(getAllShowTimes());
    // }
  }, []);

  useEffect(() => {
    if (
      successCreateShowtime ||
      successDeleteShowtime ||
      successUpdateShowtime
    ) {
      dispatch(getAllShowTimes());
    }
    return () => dispatch(resetCreateShowtime());
  }, [successCreateShowtime, successDeleteShowtime, successUpdateShowtime]);

  useEffect(() => {
    if (successDeleteShowtime) {
      enqueueSnackbar(successDeleteShowtime, { variant: "success" });
      return;
    }
    if (errorDeleteShowtime) {
      enqueueSnackbar(errorDeleteShowtime, { variant: "error" });
    }
  }, [successDeleteShowtime, errorDeleteShowtime]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = showtimesList?.data.map((n) => n.name);
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
    setFilterNameMovie(event.target.value);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - showtimesList?.result)
      : 0;

  const filteredMovies = applySortFilter(
    showtimesList?.data,
    getComparator(order, orderBy),
    filterNameMovie
  );
  const isUserNotFound = showtimesList?.result === 0;
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="text.primary"
      href="/admin/dashboard"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Trang chủ
    </Link>,
    <Typography key="3" color="inherit">
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
            Danh sách lịch chiếu
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>

        <Button
          variant="contained"
          component={RouterLink}
          to="#"
          startIcon={<Icon icon={plusFill} />}
          sx={{ "&:hover": { color: "#fff" } }}
          onClick={() => history.push("/admin/showtimes/create")}
        >
          Thêm lịch chiếu
        </Button>
      </Stack>

      <Card>
        <NameListToolbar
          numSelected={selected.length}
          searchLabelName={"Tìm lịch chiếu..."}
          onFilterName={handleFilterByName}
        />

        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <NameListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={showtimesList?.result}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredMovies
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { _id, idMovie, ticketPrice, idTheater, dateShow } =
                    row;
                  var formatDateShow = moment(dateShow)
                    .add(0, "hours")
                    .format("DD-MM-YYYY, hh:mm A");
                  const isItemSelected = selected.indexOf(_id) !== -1;

                  return (
                    <TableRow
                      hover
                      key={_id}
                      tabIndex={-1}
                      _id="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell component="th" scope="row">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {idMovie?.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip
                          TransitionComponent={Zoom}
                          title={
                            idTheater?.idTheaterCluster.idTheaterSystem.name
                          }
                        >
                          <img
                            className="max-w-xl h-14 rounded"
                            src={
                              idTheater?.idTheaterCluster.idTheaterSystem.logo
                            }
                            alt="logo"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left">
                        {idTheater?.idTheaterCluster.name}
                      </TableCell>
                      <TableCell align="left">
                        {idTheater?.idTheaterCluster.address}
                      </TableCell>

                      <TableCell align="left" className="whitespace-nowrap">
                        {idTheater?.name}
                      </TableCell>
                      <TableCell align="left" className="whitespace-nowrap">
                        {formatDateShow}
                      </TableCell>
                      <TableCell align="left">
                        {ticketPrice.toLocaleString("vi-VI")}
                      </TableCell>
                      <TableCell align="right">
                        <NameMoreMenu
                          id={_id}
                          loadingDelete={loadingCreateShowtime}
                          actionName={deleteShowTimes}
                          editURL={"/admin/showtimes/edit/"}
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
                  <TableCell
                    align="center"
                    colSpan={6}
                    sx={{ py: 3 }}
                  ></TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={showtimesList?.result || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
