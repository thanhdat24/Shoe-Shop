import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "transparent !important",
    color: "black  !important",
    boxShadow: "none  !important",
    justifyContent: "center",
    alignItem: "center",
    marginBottom: 30,
  },
  tabBar: {
    alignItem: "center",
    height: 50,
    margin: "0 auto",
    textTransform: "none !important",
    display: "block !important",
  },
  flexContainer: {
    display: "block!important ",
  },
  indicator: {
    backgroundColor: "transparent !important",
    transition: "none !important",
  },
  tabButton: {
    opacity: 1,
    lineHeight: "24px !important",
    height: "24px !important",
    boxShadow: "none !important",
    justifyContent: "center !important",
    alignItem: "center !important",
    transition: "all 0.2s !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    fontFamily: '"Arial", "Helvetica", "sans-serif"',
    padding: "0 35px !important",
    "&:hover": {
      fontSize: "26px !important",
    },
  },
  tabDangChieu: {
    color: (props) => (props.notDelay ? "#000" : "#fa5238 !important"),
    fontSize: (props) =>
      props.notDelay ? "20px !important" : "24px !important",
  },
  tabSapChieu: {
    color: (props) => (props.notDelay ? "#fa5238 !important" : "#000"),
    fontSize: (props) =>
      props.notDelay ? "24px !important" : "22px !important",
  },

  Arrow: {
    position: "absolute",
    top: "48%",
    transform: "translateY(-50%)",

    zIndex: 2,
    width: "50px  !important",
    height: "100px  !important",
    color: "#d8d8d8 !important",
    cursor: "pointer",
    transition: "all .2s",
    "&:hover": { color: "#fb4226 !important" },
  },

  listMovie: {
    opacity: (props) => (props.fade ? 1 : 0),
    transition: "opacity .1s linear",
  },
}));

export { useStyles };
