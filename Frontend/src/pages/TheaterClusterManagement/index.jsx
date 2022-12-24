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
  Tooltip,
  Zoom,
} from "@mui/material";
import { useSnackbar } from "notistack";

import { Link as RouterLink } from "react-router-dom";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
// import UserListToolbar from "../../components/user";
import { useDispatch, useSelector } from "react-redux";
import NameMoreMenu from "../../components/skeleton/NameMoreMenu";
import NameListHead from "../../components/skeleton/NameListHead";
import NameListToolbar from "../../components/skeleton/NameListToolbar";
import {
  deleteTheaterCluster,
  getTheaterClusterList,
  resetCreateTheaterCluster,
} from "../../redux/actions/TheaterCluster";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Tên cụm rạp", alignRight: false },
  { id: "photo", label: "Hình ảnh", alignRight: false },
  { id: "address", label: "Địa chỉ", alignRight: false },
  { id: "idTheaterSystem", label: "Hệ thống rạp", alignRight: false },
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
        _theater.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function TheaterClusterManagement() {
  const dispatch = useDispatch();
  const {
    theaterClusterList,
    loadingDeleteTheaterCluster,
    successDeleteTheaterCluster,
    successCreateTheaterCluster,
    errorDeleteTheaterCluster,
    successUpdateTheaterCluster,
  } = useSelector((state) => state.TheaterClusterReducer);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { enqueueSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // get list user lần đầu
    dispatch(getTheaterClusterList());
    // return () => dispatch(resetUserList());
  }, []);

  useEffect(() => {
    if (
      successCreateTheaterCluster ||
      successDeleteTheaterCluster ||
      successUpdateTheaterCluster
    ) {
      dispatch(getTheaterClusterList());
    }
    return () => dispatch(resetCreateTheaterCluster());
  }, [
    successCreateTheaterCluster,
    successDeleteTheaterCluster,
    successUpdateTheaterCluster,
  ]);

  useEffect(() => {
    if (successDeleteTheaterCluster) {
      enqueueSnackbar(successDeleteTheaterCluster, { variant: "success" });
      return;
    }
    if (errorDeleteTheaterCluster) {
      enqueueSnackbar(errorDeleteTheaterCluster, { variant: "error" });
    }
  }, [successDeleteTheaterCluster, errorDeleteTheaterCluster]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = theaterClusterList?.data.map((n) => n.fullName);
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
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - theaterClusterList?.result)
      : 0;

  const filteredTheater = applySortFilter(
    theaterClusterList?.data,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = theaterClusterList?.result === 0;

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
            Danh sách cụm rạp
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>

        <Button
          variant="contained"
          component={RouterLink}
          to="/admin/theater-cluster/create"
          sx={{ "&:hover": { color: "#fff" } }}
          startIcon={<Icon icon={plusFill} />}
        >
          Thêm Cụm Rạp
        </Button>
      </Stack>
      <Card>
        <NameListToolbar
          numSelected={selected.length}
          searchLabelName={"Tìm cum rạp..."}
          onFilterName={handleFilterByName}
        />

        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <NameListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={theaterClusterList?.result}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
              isExistsCheckBox={false}
            />
            <TableBody>
              {filteredTheater
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { _id, name, photo, address, idTheaterSystem } = row;
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
                          src={photo}
                          alt="logo"
                        />
                      </TableCell>
                      <TableCell align="left">{address}</TableCell>
                      <TableCell align="left">
                        <Tooltip
                          TransitionComponent={Zoom}
                          title={idTheaterSystem.name}
                        >
                          <img
                            className="max-w-xl h-14 rounded"
                            src={idTheaterSystem.logo}
                            alt="logo"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <NameMoreMenu
                          id={_id}
                          loadingDelete={loadingDeleteTheaterCluster}
                          actionName={deleteTheaterCluster}
                          editURL={"/admin/theater-cluster/edit/"}
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
          count={theaterClusterList?.result || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
