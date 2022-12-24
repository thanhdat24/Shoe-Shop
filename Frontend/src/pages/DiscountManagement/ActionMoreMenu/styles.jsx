import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => {
  return {
    ButtonGroup: {
      display: "grid",
      gridTemplateColumns: "minmax(0px, 1fr)",
      rowGap: " 4px",
    },
    ButtonAction: {
      padding: "2px 10px !important",
      fontWeight: "700 !important",
      lineHeight: "1.71429 !important",
      fontSize: "0.8rem !important",
      textTransform: "none !important",
      height: "34px !important",
      width: "90% !important",
    },
    ButtonNotify: {
      padding: "2px 10px !important",
      fontWeight: "700 !important",
      lineHeight: "1.71429 !important",
      fontSize: "0.8rem !important",
      textTransform: "none !important",
      height: "34px !important",
    },
  };
});

export { useStyles };
