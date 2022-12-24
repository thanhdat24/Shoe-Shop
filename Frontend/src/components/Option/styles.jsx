import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => {
  return {
    alert: {
      backgroundColor: "#e6f7ff  !important",
      border: "1px solid #91d5ff  !important",
    },
    formActionBar: {
      justifyContent: "flex-end",
      padding: "12px 16px",
      position: "fixed",
      bottom: " 0px",
      left: "273px",
      right: "47px",
      background: "white",
      zIndex: " 99",
      borderTop: "1px solid rgb(229, 229, 229)",
      transition: "all 0.5s ease 0s",
      display: "flex",
      boxShadow: "0 1px 4px 0 rgb(0 0 0 / 50%)",
    },

    ActionWrapper: {
      display: "flex",
      marginRight: "28px",
      columnGap: "12px",
    },

    buttonCreate: {
      padding: "6px 13px !important",
      fontWeight: "700 !important",
      lineHeight: "1.71429 !important",
      fontSize: "0.8rem !important",
      textTransform: "none !important",
      height: "38px !important",
    },
  };
});

export { useStyles };
