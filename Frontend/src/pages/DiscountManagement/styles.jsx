import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => {
  return {
    labelNowShowing: {
      background: "rgba(84, 214, 44, 0.16) !important",
      color: " rgb(34, 154, 22) !important",
      border: " 0px  !important",
      fontWeight: "700 !important",
    },
    labelComingSoon: {
      background: "rgba(255, 193, 7, 0.16)  !important",
      color: "rgb(183, 129, 3)  !important",
      border: " 0px  !important",
      fontWeight: "700 !important",
    },
    labelEnd: {
      background: " rgba(255, 72, 66, 0.16) !important",
      color: "rgb(183, 33, 54) !important",
      border: " 0px  !important",
      fontWeight: "700 !important",
    },
  };
});

export { useStyles };
