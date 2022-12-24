import { makeStyles } from "@mui/styles";
import { customScrollbar } from "../../../styles/materialUi";

const useStyle = makeStyles({
  // search bar
  search: {
    display: (props) => (props.down992px ? "none" : "flex"),
    maxWidth: "940px !important",
    margin: "auto !important",
    height: "83px !important",
    position: "absolute !important",
    bottom: "0 !important",
    width: "100% !important",
    left: "50% !important",
    transform: "translate(-50%,50%) !important",

    backgroundColor: "#fff !important",
    borderRadius: "5px !important",
    boxShadow: "0 0 10px rgb(0 0 0 / 30%) !important",

    alignItems: "center !important",
  },
  itemFirst: {
    padding: "1% !important",
    flex: "30% !important",
    "&:after": {
      content: "''",
      position: "absolute !important",
      right: "0 !important",
      height: "62% !important",
      top: "50% !important",
      transform: "translateY(-50%) !important",
      borderRight: "1px solid !important",
      borderRightColor: "rgba(238,238,238,.88) !important",
    },
    "& > div": {
      width: "auto !important",
    },
  },
  textField: {
    "& > div": {
      marginTop: "0 !important",
      paddingBottom: "0px !important",
      "& > input": {
        padding: "18px 0px !important",
        paddingLeft: "20px !important",
        fontSize: "14px !important",
      },
      "&:before": {
        borderBottom: "none !important",
      },
      "&:after": {
        borderBottom: "none !important",
      },
      "& > div:hover:not(.Mui-disabled):before": {
        borderBottom: "none !important",
      },
    },
    "& > label": {
      color: "#000 !important",
      fontSize: 14,
      top: -3,
      left: 20,
      display: (props) => (props.openPhim ? "none" : "block"),
    },
    "& > label.Mui-focused": {
      display: "none !important",
    },
  },
  popupIndicator: {
    "& > span": {
      marginTop: 0,
      "& > svg": {
        color: "rgba(0, 0, 0, 0.3) !important",
        fontSize: "19px !important",
      },
    },
  },
  listbox: {
    ...customScrollbar,
    '& .MuiAutocomplete-option[aria-selected="true"]': {
      backgroundColor: "#fb422685 !important",
      color: "#fff !important",
    },
  },
  paper: {
    boxShadow:
      "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%) !important",
  },
  noOptions: {
    color: "#000 !important",
    fontSize: 14,
    padding: "9.5px 20px 9.5px 20px !important",
  },

  search__item: {
    color: "black !important",
    padding: "1% !important",
    "& > div:before": {
      borderBottom: "none !important",
    },
    // "& > div > div:focus": {
    //   border: "5px solid #fff !important",
    // },
    "& > div:hover:not(.Mui-disabled):before": {
      borderBottom: "none !important",
    },
    "& > div > div": {
      color: "black !important",
      fontSize: 15,
      // padding: "18px 0px !important",
      "&:focus": {
        backgroundColor: "transparent !important",
      },
      "& ~ svg": {
        fontSize: 19,
        color: "rgba(0, 0, 0, 0.3) !important",
        top: "33% !important",
      },
      "& ~ fieldset": {
        borderColor: "transparent !important",
      },
    },
    "&:after": {
      content: "''",
      position: "absolute !important",
      right: "0 !important",
      height: "62% !important",
      top: "50% !important",
      transform: "translateY(-50%) !important",
      borderRight: "1px solid !important",
      borderRightColor: "rgba(238,238,238,.88) !important",
    },
  },
  "search__item--first": {
    flex: "30% !important",
    paddingLeft: "2% !important",
  },
  "search__item--next": {
    flex: "calc(70% / 4) !important",
  },

  // popup menu
  menu: { maxHeight: 300, ...customScrollbar },
  menu__item: {
    width: "100% !important",
    minHeight: "auto !important",
    display: "block",
    padding: "3px 20px !important",
    fontSize: "14px !important",
    color: "#333 !important",
    backgroundColor: "transparent !important",
    "& li ~ li": {
      fontSize: 11,
      color: "#aaa !important",
    },
    // màu nền và chữ khi hover
    "&:hover": {
      backgroundColor: "#fb4226 !important",
      color: "#fff !important",
      "& li ~ li": {
        color: "#fff !important",
      },
    },
  },
  menu__item__li: {
    width: "100% !important",
    minHeight: "auto !important",
    display: "block !important",
    padding: "3px 20px !important",
    fontSize: "14px !important",
    color: "#333 !important",
    backgroundColor: "transparent !important",
    "& li ~ li": {
      fontSize: 11,
      color: "#aaa !important",
    },
    // màu nền và chữ khi hover
    "&:hover": {
      backgroundColor: "#fb4226 !important",
      color: "#fff !important",
      "& li ~ li": {
        color: "#fff !important",
      },
    },
  },
  "menu__item--selected": {
    backgroundColor: "#fb422685 !important",

    color: "#fff !important",
    "& li ~ li": {
      color: "#fff !important",
    },
  },
  // button
  btn: {
    // css áp dụng khi disabled = false
    backgroundColor: "#fb4226 !important",
    margin: "auto !important",
    "&:hover": {
      backgroundColor: "#d01414 !important",
    },
    "&:focus": {
      outline: "none !important",
    },
    "&$btn": {
      // css áp dụng khi disabled button
      color: "#fff !important",
      padding: "8px 23px !important",
    },
  },
  btnDisabled: {
    // css áp dụng khi disabled button
    backgroundColor: "#4a4a4a !important",
    border: "none !important",
    textTransform: "uppercase !important",
    borderRadius: "4px !important",
    padding: "8px 23px !important",
  },
});
export default useStyle;
