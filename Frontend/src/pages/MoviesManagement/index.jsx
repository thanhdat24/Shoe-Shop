import React, { useEffect } from "react";
import {
  Card,
  Table,
  Stack,
  Button,
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
  Tooltip,
  styled,
  tooltipClasses,
} from "@mui/material";
import { useSnackbar } from "notistack";

import { Link as RouterLink, useHistory } from "react-router-dom";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { useState } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { useDispatch, useSelector } from "react-redux";
import Label from "../../components/Label";
import {
  deleteMovie,
  getMovieList,
  resetMoviesManagement,
} from "../../redux/actions/Movie";
import ThumbnailYoutube from "./ThumbnailYoutube";
import formatDate from "../../utils/formatDate";
import NameListHead from "../../components/skeleton/NameListHead";
import NameListToolbar from "../../components/skeleton/NameListToolbar";
import NameMoreMenu from "../../components/skeleton/NameMoreMenu";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Tên phim", alignRight: false },
  { id: "trailer", label: "Trailer", alignRight: false },
  { id: "photo", label: "Hình ảnh", alignRight: false },
  { id: "description", label: "Mô tả", alignRight: false },
  { id: "duration", label: "Thời lượng", alignRight: false },

  { id: "releaseDate", label: "Ngày khởi chiếu", alignRight: false },
  { id: "nowShowing", label: "Đang chiếu", alignRight: false },
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

function applySortFilter(array, comparator, queryName, queryStatus) {
  console.log("queryStatus", queryStatus);
  console.log("array", array);
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (queryName) {
    return filter(array, (movie) => movie.name.indexOf(queryName) !== -1);
  }
  if (queryStatus !== "all") {
    return filter(array, (movie) => movie.nowShowing === queryStatus);
  }
  console.log("array", array);

  return stabilizedThis?.map((el) => el[0]);
}

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));
export default function MoviesManagement() {
  const dispatch = useDispatch();
  const {
    successDeleteMovie,
    errorDeleteMovie,
    successUpdateMovie,
    loadingDeleteMovie,
  } = useSelector((state) => state.MovieReducer);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { movieList } = useSelector((state) => state.MovieReducer);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterNameMovie, setFilterNameMovie] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { successAddMovie } = useSelector((state) => state.MovieReducer);
  useEffect(() => {
    // get list user lần đầu
    if (!movieList.result) {
      dispatch(getMovieList());
    }
    return () => dispatch(resetMoviesManagement());
  }, []);
  useEffect(() => {
    if (successDeleteMovie || successAddMovie || successUpdateMovie) {
      dispatch(getMovieList());
    }
  }, [successDeleteMovie, successAddMovie, successUpdateMovie]);

  useEffect(() => {
    if (successDeleteMovie) {
      enqueueSnackbar(successDeleteMovie, { variant: "success" });
      return;
    }
    if (errorDeleteMovie) {
      enqueueSnackbar(errorDeleteMovie, { variant: "error" });
    }
  }, [successDeleteMovie, errorDeleteMovie]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = movieList?.data.map((n) => n.name);
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

  const handleFilterByStatus = (event) => {
    setFilterStatus(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - movieList?.result) : 0;

  const filteredMovies = applySortFilter(
    movieList?.data,
    getComparator(order, orderBy),
    filterNameMovie,
    filterStatus
  );
  const isUserNotFound = movieList?.result === 0;
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="text.primary"
      href="/admin/dashboard"
      onClick={handleClick}
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
            Danh sách phim
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
          onClick={() => history.push("/admin/movies/create")}
          sx={{ "&:hover": { color: "#fff" } }}
        >
          Thêm Phim
        </Button>
      </Stack>

      <Card>
        <NameListToolbar
          numSelected={selected.length}
          cusTomSearch={true}
          searchLabelName={"Tìm phim..."}
          filterLabelName={"Trạng thái"}
          onFilterName={handleFilterByName}
          valueFilterStatus={filterStatus}
          onChangeFilterStatus={handleFilterByStatus}
          labelFilterStatus={"Trạng thái"}
          filterList={[
            { name: "Đang chiếu", value: true },
            { name: "Sắp chiếu", value: false },
          ]}
        />

        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <NameListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={movieList?.result}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
              isExistsCheckBox={false}
            />
            <TableBody>
              {filteredMovies
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const {
                    _id,
                    name,
                    trailer,
                    photo,
                    duration,
                    description,
                    releaseDate,
                    nowShowing,
                  } = row;
                  const isItemSelected = selected.indexOf(name) !== -1;

                  return (
                    <TableRow
                      hover
                      key={_id}
                      tabIndex={-1}
                      name="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell component="th" scope="row" padding="none">
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          ml={2}
                        >
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        {" "}
                        <ThumbnailYoutube urlYoutube={trailer} />
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip
                          placement="right"
                          id="test"
                          title={<img src={photo} width={170} alt="" />}
                        >
                          <Box
                            sx={{
                              display: "inline-block",
                              width: 64,
                              height: 64,
                              objectFit: "cover",
                              position: "relative",
                              "&:hover > div": {
                                opacity: 1,
                              },
                              "& > div > img": {
                                verticalAlign: "top",
                              },
                            }}
                          >
                            <img
                              className="w-full h-full rounded"
                              src={photo}
                              alt="poster movie"
                              aria-label="test"
                            />
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left">
                        <CustomTooltip
                          title={
                            <React.Fragment>
                              <Typography variant="body2">
                                {description}
                              </Typography>
                            </React.Fragment>
                          }
                          placement="right"
                        >
                          <Box
                            sx={{
                              maxWidth: 200, // percentage also works
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {description}
                          </Box>
                        </CustomTooltip>
                      </TableCell>
                      <TableCell align="left">{duration} phút</TableCell>
                      <TableCell align="left">
                        {formatDate(releaseDate?.slice(0, 10)).dDMmYy}
                      </TableCell>
                      <TableCell align="left">
                        <Label
                          variant="ghost"
                          color={nowShowing ? "success" : "info"}
                        >
                          {nowShowing ? "Đang chiếu" : "Sắp chiếu"}
                        </Label>
                        {/* {nowShowing ? "Đang chiếu" : "Sắp chiếu"} */}
                      </TableCell>
                      <TableCell align="right">
                        <NameMoreMenu
                          id={_id}
                          loadingDelete={loadingDeleteMovie}
                          actionName={deleteMovie}
                          editURL={"/admin/movies/edit/"}
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
          count={movieList?.result}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
