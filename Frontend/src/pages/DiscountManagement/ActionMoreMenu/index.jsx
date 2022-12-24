import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useStyles } from "./styles";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { deleteDiscount, updateDiscount } from "../../../redux/actions/Discount";
import { LoadingButton } from "@mui/lab";
export default function ActionMoreMenu({ id, activeCode }) {
  const {
    discountList: { data: discountList },
    loadingUpdateDiscount,
  } = useSelector((state) => state.DiscountReducer);
  const dispatch = useDispatch();

  const [openNotify, setOpenNotify] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const handleEditDetail = () => {
    history.push(`/admin/discount/edit/${id}`);
  };
  const handleClickButtonEnd = () => {
    setOpenNotify(true);
  };
  const handleCloseNotify = () => {
    setOpenNotify(false);
  };
  const handleDeleteDiscount = () => {
    dispatch(deleteDiscount(id));
  };
  const handleActiveCode = () => {
    const discountChangeActiveCode = discountList.find(
      (item) => item._id === id
    );
    if (discountChangeActiveCode) {
      discountChangeActiveCode.activeCode = "Kết thúc";
    }

    dispatch(updateDiscount(discountChangeActiveCode, id));

    setOpenNotify(false);
  };

  return activeCode !== "Kết thúc" ? (
    <div className={classes.ButtonGroup}>
      <Button
        className={classes.ButtonAction}
        variant="outlined"
        onClick={(e) => handleEditDetail()}
      >
        Chỉnh sửa
      </Button>
      <Button
        sx={{
          color: "gray",
          borderColor: "gray ",
          "&:hover": { color: "primary.main" },
        }}
        variant="outlined"
        className={classes.ButtonAction}
        onClick={handleClickButtonEnd}
      >
        Kết thúc
      </Button>

      <Dialog open={openNotify} onClose={handleCloseNotify}>
        <DialogContent sx={{ width: 350, textAlign: "center" }}>
          <DialogContentText sx={{ fontSize: 16, fontWeight: "bold" }}>
            <InfoOutlinedIcon sx={{ fontSize: 28, color: "#faad14" }} />{" "}
            <span> Bạn có thực sự muốn kết thúc chương trình này?</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              color: "gray",
              borderColor: "gray ",
              "&:hover": { color: "primary.main" },
            }}
            size="medium"
            variant="outlined"
            className={classes.ButtonNotify}
            onClick={handleCloseNotify}
          >
            Huỷ
          </Button>
          <LoadingButton
            className={classes.ButtonNotify}
            size="medium"
            variant="contained"
            onClick={handleActiveCode}
            loading={loadingUpdateDiscount}
          >
            Kết thúc
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  ) : (
    <div className={classes.ButtonGroup}>
      <Button
        color="error"
        className={classes.ButtonAction}
        variant="outlined"
        onClick={handleDeleteDiscount}
      >
        Xoá
      </Button>
    </div>
  );
}
