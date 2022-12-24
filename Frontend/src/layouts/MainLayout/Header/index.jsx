import React, { useState, useEffect } from "react";

import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import { useHistory, useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import { useTheme } from "@mui/styles";
import { styled, alpha } from "@mui/material/styles";
import {
  Avatar,
  Button,
  Drawer,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import useStyles from "./style";
import { LOGOUT } from "../../../redux/constants/Auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getMovieList } from "../../../redux/actions/Movie";
import { getTheaterList } from "../../../redux/actions/Theater";
import { LOADING_BACKTO_HOME } from "../../../redux/constants/Lazy";
import { Icon } from "@iconify/react";
import moviesApi from "../../../api/moviesApi";
import Label from "../../../components/Label";

const headMenu = [
  { nameLink: "Lịch chiếu", id: "lichchieu" },
  { nameLink: "Cụm rạp", id: "cumrap" },
];

export default function Header() {
  const { currentUser } = useSelector((state) => state.AuthReducer);
  const { isLoadingBackToHome } = useSelector((state) => state.LazyReducer);
  console.log("currentUser", currentUser);
  const dispatch = useDispatch();
  let location = useLocation();
  const history = useHistory();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchNameMovie, setSearchNameMovie] = useState("");
  const [arraySearchMovie, setArraySearchMovie] = useState([]);
  const classes = useStyles({ isDesktop, openDrawer });
  const { movieList } = useSelector((state) => state.MovieReducer);

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "18ch",
        "&:focus": {
          width: "23ch",
        },
      },
    },
  }));
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
    boxShadow: "0 1px 4px 0px rgb(0 0 0 / 25%)",
  }));

  const handleChangeSearchName = (e) => {
    setSearchNameMovie(e.target.value);
    console.log("e.target.value ", e.target.value);
    if (e.target.value !== "") {
      moviesApi.searchMovie({ search: e.target.value }).then((result) => {
        setArraySearchMovie(result.data.data);
      });
    }
  };
  console.log("arraySearchMovie", arraySearchMovie);
  useEffect(() => {
    // clicklink > push to home > scrollTo after loading
    if (!isLoadingBackToHome) {
      setTimeout(() => {
        scroller.scrollTo(location.state, {
          duration: 800,
          smooth: "easeInOutQuart",
        });
      }, 200);
    }
  }, [isLoadingBackToHome]);

  const handleClickLink = (id) => {
    setOpenDrawer(false);
    if (location.pathname === "/") {
      scroller.scrollTo(id, {
        duration: 800,
        smooth: "easeInOutQuart",
      });
    } else {
      dispatch({ type: LOADING_BACKTO_HOME });
      setTimeout(() => {
        history.push("/", id);
      }, 50);
    }
  };

  const handleLogout = () => {
    setOpenDrawer(false);
    dispatch({ type: LOGOUT });
  };

  const handleLogin = () => {
    history.push("/login", location.pathname); // truyền kèm location.pathname để đăng nhập xong quay lại
  };
  const handleRegister = () => {
    history.push("/register", location.pathname);
  };
  const handleClickLogo = () => {
    if (location.pathname === "/") {
      dispatch(getMovieList());
      dispatch(getTheaterList());
      return;
    }
    dispatch({ type: LOADING_BACKTO_HOME });
    setTimeout(() => {
      history.push("/", "");
    }, 50);
  };

  const handleUser = () => {
    history.push("/profile");
    setOpenDrawer(false);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  const handleBtnMuaVe = (id) => {
    history.push(`/movie/${id}`);
    setSearchNameMovie("");
  };
  return (
    <div className={classes.root}>
      {/* START HEADER */}
      <div
        className="bg-white p-2 shadow border-b border-transparent z-20 top-0 fixed w-screen"
        position="fixed"
        color="default"
      >
        <Toolbar className="relative max-w-full md:max-w-screen-xl mx-auto flex justify-between items-center">
          {/* logo */}
          <div className="flex space-x-4 flex-shrink-0 items-center">
            <span className={classes.logo} onClick={handleClickLogo}>
              <img
                src="/img/favicon.png"
                alt="logo"
                className="h-11 w-11 cursor-pointer"
              />
            </span>
            {/* <Paper
              className="bg-gray-100 "
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                // width: 300,
                "&:focus": {
                  border: "5px solid red",
                },
              }}
            >
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Tìm tên phim"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Paper> */}
            <form class="relative md:inline-block hidden">
              <input
                type="search"
                className="bg-gray-100 dark:bg-dark-third dark:text-white rounded-full outline-none pl-14 pr-3 py-2.5 focus:ring-2 ring-pink-600 ring-opacity-50 transition-base select-none"
                placeholder="Tìm tên phim"
                value={searchNameMovie}
                onChange={handleChangeSearchName}
              />
              <Icon
                icon="bx:search"
                className="absolute text-xl top-1/2 left-3 transform text-gray-400 -translate-y-1/2 cursor-pointer"
              />
              <i class="bx bx-search absolute text-xl top-1/2 left-3 transform text-gray-400 -translate-y-1/2 cursor-pointer"></i>
            </form>
            {searchNameMovie && (
              <div class="animate-fadeIn transition-base absolute top-full transform translate-y-1 left-16 border border-gray-200 bg-white w-96 rounded-lg shadow-lg overflow-hidden p-1 mt-2 select-none z-30">
                <div>
                  {arraySearchMovie.length > 0 ? (
                    arraySearchMovie.map((item) => (
                      <div className="w-full p-2 flex justify-start items-center space-x-2 rounded-lg cursor-pointer select-none transition-base hover:bg-gray-100">
                        <img
                          className="h-20 w-14 select-none bg-white rounded-sm object-cover flex-shrink-0 "
                          src={item.photo}
                          alt={item.name}
                        />
                        <div className="w-full max-w-md flex flex-col justify-center items-start">
                          <div
                            className="w-full font-semibold"
                            style={{
                              fontSize: "0.9rem",
                            }}
                          >
                            {item.name}
                          </div>
                          <div className="flex items-center">
                            <div className="text-sm text-gray-500 mt-1 mr-1">
                              2022
                            </div>
                            <Label
                              sx={{ transform: "translateY(2px)" }}
                              variant="ghost"
                              color={item.nowShowing ? "success" : "warning"}
                            >
                              {item.nowShowing ? "Đang chiếu" : "Sắp chiếu"}
                            </Label>
                          </div>
                        </div>
                        {item.nowShowing ? (
                          <Button
                            className="py-1 ml-0 px-3 whitespace-nowrap rounded inline-block w-1/3 font-semibold "
                            sx={{
                              fontSize: "0.7rem",
                              backgroundColor: "rgb(190 24 93/1)",
                              borderColor: "rgb(190 24 93/1)",
                              color: "rgb(255 255 255/0.95) !important",
                              borderWidth: "1px",
                              "&:hover": {
                                backgroundColor: "rgb(157 23 77/1) !important",
                              },
                            }}
                            onClick={(e) => handleBtnMuaVe(item.id)}
                          >
                            Đặt vé
                          </Button>
                        ) : (
                          <Button
                            className="py-1 ml-0  px-3  flex-nowrap whitespace-nowrap items-center  rounded  border font-semibold  cursor-pointer border-gray-300 text-gray-800 hover:bg-gray-50 inline-block w-1/3"
                            sx={{
                              fontSize: "0.7rem",
                              color: "rgba(31, 41, 55,1)!important",
                              "&:hover": {
                                backgroundColor:
                                  "rgb(250 250 250/1) !important",
                              },
                            }}
                            onClick={(e) => handleBtnMuaVe(item.id)}
                          >
                            Thông tin
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center">
                      <Button
                        className="w-12 h-12 flex items-center justify-center mt-1"
                        sx={{
                          backgroundColor: "rgba(248, 250, 252, 1)",
                          borderRadius: "100% !important",
                          minWidth: "0px !important",
                        }}
                      >
                        <img
                          className="w-6 h-6"
                          src="./img/search.svg"
                          alt="search"
                        />
                      </Button>
                      <span class="font-bold mt-3">
                        Úi, Không tìm thấy từ khoá này rùi
                      </span>
                      <p class="text-sm text-gray-500 text-center mb-2 mt-1">
                        Bạn thử lại với từ khoá khác nha
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className={classes.linkTobody}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              {headMenu.map((link) => (
                <span
                  key={link.id}
                  className={classes.link}
                  onClick={() => handleClickLink(link.id)}
                >
                  {link.nameLink}
                </span>
              ))}
            </Grid>
          </div>

          {/* user account */}
          <div className={classes.user}>
            {currentUser ? (
              <List disablePadding className={classes.auth}>
                <ListItem
                  button
                  classes={{ root: clsx(classes.itemAuth, classes.divide) }}
                  onClick={handleUser}
                >
                  <ListItemIcon classes={{ root: classes.icon }}>
                    <Avatar
                      alt="avatar"
                      className={classes.avatar}
                      src={currentUser?.user.photo}
                    />
                  </ListItemIcon>
                  <ListItemText primary={currentUser?.user.fullName} />
                </ListItem>
                <ListItem
                  button
                  classes={{ root: classes.itemAuth }}
                  onClick={handleLogout}
                >
                  <ListItemText primary="Đăng xuất" />
                </ListItem>
              </List>
            ) : (
              <List disablePadding className={classes.auth}>
                <ListItem
                  button
                  classes={{ root: clsx(classes.itemAuth, classes.divide) }}
                  onClick={handleLogin}
                >
                  <ListItemIcon classes={{ root: classes.icon }}>
                    <AccountCircleIcon fontSize="large" />
                  </ListItemIcon>
                  <ListItemText primary="Đăng nhập" />
                </ListItem>
                <ListItem
                  button
                  classes={{ root: classes.itemAuth }}
                  onClick={handleRegister}
                >
                  <ListItemText primary="Đăng ký" />
                </ListItem>
              </List>
            )}
          </div>

          {/* menuIcon  */}
          <div className={classes.menuIcon}>
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerOpen}
              classes={{ root: classes.listItem }}
            >
              {/* <MenuIcon /> */}
            </IconButton>
          </div>
        </Toolbar>
      </div>

      {/* content open menu*/}
      <Drawer
        className={classes.drawer}
        anchor="right"
        onClose={handleDrawerClose}
        open={openDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        transitionDuration={300}
      >
        <div className={classes.drawerHeader}>
          {currentUser ? (
            <ListItem
              button
              classes={{
                root: clsx(classes.itemAuth, classes.divide, classes.hover),
              }}
              onClick={handleUser}
            >
              <ListItemIcon classes={{ root: classes.icon }}>
                {/* <Avatar alt="avatar" className={classes.avatar} src={FAKE_AVATAR} /> */}
              </ListItemIcon>
              <ListItemText
                className={classes.username}
                primary={currentUser?.hoTen}
              />
            </ListItem>
          ) : (
            <ListItem
              button
              classes={{ root: classes.listItem }}
              onClick={handleLogin}
            >
              <ListItemIcon classes={{ root: classes.icon }}>
                <AccountCircleIcon fontSize="large" />
              </ListItemIcon>
              <span className={classes.link} style={{ fontWeight: 500 }}>
                Đăng Nhập
              </span>
            </ListItem>
          )}
          <IconButton
            classes={{ root: classes.listItem }}
            onClick={handleDrawerClose}
          >
            {/* <ChevronRightIcon /> */}
          </IconButton>
        </div>
        <List>
          {headMenu.map((link) => (
            <span
              key={link.id}
              className={classes.itemMenu}
              onClick={() => handleClickLink(link.id)}
            >
              {link.nameLink}
            </span>
          ))}

          {currentUser ? (
            <span className={classes.itemMenu} onClick={handleLogout}>
              Đăng Xuất
            </span>
          ) : (
            <span className={classes.itemMenu} onClick={handleRegister}>
              Đăng Ký
            </span>
          )}
        </List>
      </Drawer>
    </div>
  );
}
