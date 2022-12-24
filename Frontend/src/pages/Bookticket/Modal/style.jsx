import { makeStyles } from "@mui/styles";
import { underLine } from "../../../styles/materialUi";

const useStyles = makeStyles({
  modal: {
    textAlign: "center !important",
    fontSize: 17,
    width: "fit-content !important",
    borderRadius: "20px !important",
    alignItems: "center !important",
    overflowX: "hidden !important",
    maxHeight: "calc(100% - 20px) !important",
  },
  padding: {
    padding: 40,
  },

  over10: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: 10,
    maxWidth: (props) => (props.isMobile ? "auto" : "480px"),
    alignItems: "center",
  },
  notification: {
    width: 80,
    marginLeft: 29,
    marginTop: 10,
  },
  textOver: {
    padding: "10px 20px",
    width: "100%",
    ...underLine,
  },
  btnOver: {
    color: "#fb4226 !important",
    border: "1.2px solid #fb4226 !important",
    borderRadius: "20px !important",
    marginTop: 10,
    "&:hover": {
      color: "#fff !important",
      backgroundColor: "#fb4226 !important",
    },
  },

  spaceEvenly: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    paddingBottom: 30,
  },
  btnResult: {
    color: "#fff !important",
    padding: "6px 17px !important",
    borderRadius: "20px !important",
    backgroundImage:
      "linear-gradient(223deg,#b4ec51 0,#429321 100%) !important",
    "&:hover": {
      color: "#fff !important",
      backgroundImage:
        "linear-gradient(223deg,#5d9004 0,#1f5f04 100%) !important",
    },
  },

  txtClick: {
    color: "#f79320",
    cursor: "pointer",
    "&:hover": {
      color: "#0056b3",
      textDecoration: "initial",
    },
  },
});
export default useStyles;
