import { Icon } from "@iconify/react";
import {  useRef, useState } from "react";
import trash2Outline from "@iconify/icons-eva/trash-2-outline";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";


// ----------------------------------------------------------------------

export default function ReviewMoreMenu() {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // xóa một user
  // const handleDeleteOne = (_id) => {
  //   if (loadingDeleteMovie) {
  //     // nếu click xóa liên tục một user
  //     return;
  //   }
  //   dispatch(deleteMovie(_id));
  // };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          sx={{ color: "rgb(255, 72, 66);" }}
          // onClick={(e) => handleDeleteOne(idMovie)}
        >
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Xoá"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
