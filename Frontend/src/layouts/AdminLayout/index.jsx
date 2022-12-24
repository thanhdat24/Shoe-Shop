import React, { Fragment, useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import sidebarConfig from "../Dashboard/SidebarConfig";

import { styled, useTheme } from "@mui/material/styles";
import { Avatar, Link, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AccountPopover from "./AccountPopover";
import NavSection from "../../components/NavSection";
import NotificationsPopover from "./NotificationsPopover";
import { getAllTicket } from "../../redux/actions/BookTicket";

const drawerWidth = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "rgba(255, 255, 255, 0.72) !important",
    boxShadow: "none !important",
    marginLeft: "0px !important",
    position: "absolute !important",
  },
  toolBar: {
    color: "#00ab55 !important",
    backdropFilter: " blur(6px) !important",
  },
  paper: {
    width: "150px !important",
  },
}));
const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));
const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200],
}));
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),

  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(11)} + 1px)`,
    height: "100%",
    flexDirection: "column",
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    width: `calc(112.3% - ${drawerWidth}px)`,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function AdminLayout(props) {
  const {
    ticketList: { data },
  } = useSelector((state) => state.BookTicketReducer);
  const dispatch = useDispatch();
  
  useEffect(() => {
    // get list user lần đầu
    if (!data) {
      dispatch(getAllTicket());
    }
  }, [data]);
  const classes = useStyles();

  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = useState(true);

  const { currentUser } = useSelector((state) => state.AuthReducer);

  if (currentUser?.user.role !== "admin") {
    // nếu không phải tài khoản quản trị thì ẩn đi giao diện AdminLayout, vẫn truyền vào children để hiện thông báo trong children
    return <>{props.children}</>;
  }

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar open={openDrawer} className={classes.root}>
          <ToolbarStyle sx={{ minHeight: "64px !important", mt: 1 }}>
            <Box sx={{ flexGrow: 1 }} />
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 0.5, sm: 1.5 }}
            >
              <NotificationsPopover />
              <AccountPopover />
            </Stack>
          </ToolbarStyle>
        </AppBar>

        <Drawer
          variant="permanent"
          open={openDrawer}
          sx={{
            width: "226px",
            "& .MuiPaper-root": {
              width: "250px",
              flex: " 0 0 250px",
              maxWidth: "250px",
              minWidth: "250px",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              ...(!openDrawer && {
                alignItems: "center",
              }),
            }}
          >
            <DrawerHeader
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className={classes.DrawerBox}
            >
              <Box sx={{ px: 2, py: 3 }}>
                <Box
                  component={RouterLink}
                  to="/admin/dashboard"
                  sx={{ display: "inline-flex" }}
                >
                  <Box
                    component="img"
                    src="/img/logo.svg"
                    sx={{ width: 40, height: 40 }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  ...(!openDrawer && { display: "none" }),
                }}
              >
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </Box>
            </DrawerHeader>
            <Box sx={{ mb: 5, mx: 2.5 }}>
              <Link underline="none" component={RouterLink} to="#">
                <AccountStyle
                  sx={{
                    ...(!openDrawer && {
                      backgroundColor: "transparent",
                      alignItems: "center",
                    }),
                  }}
                >
                  <Avatar src={currentUser.user.photo} alt="photoURL" />
                  <Box
                    sx={{
                      ml: 2,
                      ...(!openDrawer && {
                        display: "none",
                      }),
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "text.primary" }}
                    >
                      {currentUser.user.fullName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {currentUser.user.role}
                    </Typography>
                  </Box>
                </AccountStyle>
              </Link>
            </Box>
          </Box>

          <NavSection openDrawer={openDrawer} navConfig={sidebarConfig} />
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {props.children}
        </Box>
      </Box>
    </SnackbarProvider>
  );
}
