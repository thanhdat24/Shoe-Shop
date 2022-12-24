import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { updateActiveReview } from "../../redux/actions/Review";
export default function ActiveReview({ active, id }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { commentList } = useSelector((state) => state.ReviewReducer);

  const handleClickActive = () => {
    setOpen(true);
  };

  const handleActive = () => {
    const commentUserLiked = commentList.find((item) => item._id === id);
    if (commentUserLiked) {
      commentUserLiked.active = true;
    }
    dispatch(updateActiveReview(commentUserLiked, id));
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      {active ? (
        <Button variant="outlined">Đã duyệt</Button>
      ) : (
        <Button variant="outlined" color="error" onClick={handleClickActive}>
          Chưa duyệt
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogContent sx={{ width: 350, textAlign: "center" }}>
          <DialogContentText sx={{ fontSize: 20 }}>
            <CheckCircleOutlineIcon
              className="text-green-500"
              sx={{ fontSize: 30 }}
            />{" "}
            Xác nhận duyệt bình luận
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
            onClick={handleClose}
          >
            Quay lại
          </Button>
          <Button size="medium" variant="contained" onClick={handleActive}>
            Xác nhận duyệt
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
