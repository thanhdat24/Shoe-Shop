import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
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
  Box,
} from "@mui/material";
import moment from "moment";
import { useSnackbar } from "notistack";
// import EditRole from "../Profile/EditRole";
import AddIcon from "@mui/icons-material/Add";

import { filter } from "lodash";
import { getAllTicket } from "../../redux/actions/BookTicket";
import TicketListHead from "../../components/Ticket/TicketListHead";
import TicketListToolbar from "../../components/Ticket/TicketToolbar";

const TABLE_HEAD = [
  { id: "id", label: "Mã vé", alignRight: false },
  { id: "idMovie", label: "Tên phim", alignRight: false },
  { id: "idTheaterCluster", label: "Rạp", alignRight: false },
  { id: "idTheater", label: "Phòng chiếu", alignRight: false },
  { id: "idSeat", label: "Tên ghế", alignRight: false },
  { id: "createAt", label: "Ngày đặt", alignRight: false },
  { id: "userID", label: "Người đặt", alignRight: false },
  { id: "totalPrice", label: "Tổng tiền", alignRight: false },
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
      (_ticket) => _ticket._id.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function TicketManagement() {
  const {
    ticketList: { data },
    ticketList,
  } = useSelector((state) => state.BookTicketReducer);
  const getIdSeat = (danhSachGhe) => {
    return danhSachGhe
      .reduce((listSeat, seat) => {
        return [...listSeat, seat.name];
      }, [])
      .join(", ");
  };

  const history = useHistory();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterNameMovie, setFilterNameMovie] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { enqueueSnackbar } = useSnackbar();
  //   console.log("movieList", movieList);
  const dispatch = useDispatch();

  useEffect(() => {
     // get list user lần đầu
    if (!data) {
      dispatch(getAllTicket());
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      dispatch(getAllTicket());
    }
  }, [data]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //   const handleSelectAllClick = (event) => {
  //     if (event.target.checked) {
  //       const newSelecteds = ticketList?.showtime.map((n) => n.fullName);
  //       setSelected(newSelecteds);
  //       return;
  //     }
  //     setSelected([]);
  //   };

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ticketList?.result) : 0;

  const filteredMovies = applySortFilter(
    data,
    getComparator(order, orderBy),
    filterNameMovie
  );

  console.log("filteredMovies", filteredMovies);
  const isUserNotFound = ticketList?.result === 0;

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
    <>
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
              Danh sách vé
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Stack>
        </Stack>
        <Card>
          <TicketListToolbar
            numSelected={selected.length}
            filterNameMovie={filterNameMovie}
            onFilterName={handleFilterByName}
          />
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TicketListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={ticketList?.result}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                // onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredMovies
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const {
                      _id,
                      idShowtime,
                      totalPrice,
                      seatList,
                      userId,
                      createdAt,
                    } = row;
                    const isItemSelected = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        name="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell align="left">{_id}</TableCell>
                        <TableCell align="left">
                          {idShowtime.idMovie.name}
                        </TableCell>
                        <TableCell align="left">
                          {idShowtime.idTheaterCluster.name}
                        </TableCell>
                        <TableCell align="left">
                          {idShowtime.idTheater.name}
                        </TableCell>
                        <TableCell align="left">
                          {getIdSeat(seatList)}
                        </TableCell>
                        <TableCell align="left">
                          {new Date(createdAt).toLocaleDateString()},{" "}
                          {new Date(createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell align="left">{userId.fullName}</TableCell>
                        <TableCell align="left">
                          {totalPrice.toLocaleString("vi-VI")} vnđ
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
            count={ticketList?.result}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
