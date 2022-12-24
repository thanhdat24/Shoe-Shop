import { makeStyles } from "@mui/styles";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  logo: {
    cursor: "pointer",
  },
  linkTobody: {
    display: (props) => (props.isDesktop ? "block" : "none"),
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    [theme.breakpoints.down(899)]: {
      left: "42%",
    },
    [theme.breakpoints.down(773)]: {
      left: "39%",
    },
  },
  link: {
    cursor: "pointer",
    textDecoration: "none",
    color: "#000",
    paddingLeft: 10,
    paddingRight: 10,
    width: "auto",
    "&:hover": {
      textDecoration: "none",
      backgroundColor: "transparent",
      color: "#fb4226",
      transition: "all .2s",
    },
  },
  user: {
    display: (props) => (props.isDesktop ? "block" : "none"),
  },
  auth: {
    display: "flex",
    color: (props) => (props.isDesktop ? "#9b9b9b" : "#000"),
  },
  itemAuth: {
    paddingLeft: 10,
    paddingRight: 10,
    minWidth: "fit-content",
    "&:hover": {
      backgroundColor: "#fff !important",
      "& .MuiTypography-root": {
        color: "#fb4226",
      },
      "& .MuiListItemIcon-root": {
        color: "#fb4226",
      },
    },
    "& .MuiTypography-root": {
      transition: "all .2s",
    },
    "& .MuiListItemIcon-root": {
      transition: "all .2s",
    },
  },
  hover: {
    "&:hover": {
      color: "#fb4226",
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  divide: {
    fontWeight: 500,
    "&::after": {
      content: "''",
      position: "absolute",
      right: "0",
      height: "30px",
      top: "50%",
      transform: "translateY(-50%)",
      borderRight: (props) => (props.isDesktop ? "1px solid #e9e9e9" : "none"),
    },
  },
  icon: {
    minWidth: 41,
    color: "#9b9b9b",
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  listItem: {
    "&:hover > a": {
      color: "#fb4226",
    },
    "&:hover > div": {
      color: "#fb4226",
    },
    "&:hover > span": {
      color: "#fb4226",
    },
  },
  menuIcon: {
    display: (props) =>
      props.isDesktop || props.openDrawer ? "none" : "block",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
  },
  itemMenu: {
    display: "block",
    padding: 20,
    fontWeight: 500,
    width: "100%",
    cursor: "pointer",
    fontSize: 18,
    "&:hover": {
      color: "#fb4226",
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  username: {
    "& > span": {
      fontWeight: 500,
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      // backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
export default useStyles;
