import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, IconButton, Tooltip } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { useDispatch } from "react-redux";
import { deleteReview } from "../../redux/actions/Review";
export default function DeleteReview({ id }) {
  const dispatch = useDispatch();
  const handleDeleteReview = () => {
    dispatch(deleteReview(id));
  };
  return (
    <Tooltip TransitionComponent={Zoom} title="Xoá" arrow>
      <IconButton
        onClick={handleDeleteReview}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(255, 72, 66, 0.08)",
            padding: "8px",
            borderRadius: "50%",
          },
        }}
      >
        <DeleteForeverIcon
          className="text-red-500"
          sx={{
            fontSize: 32,
          }}
        />
      </IconButton>
    </Tooltip>
  );
}
