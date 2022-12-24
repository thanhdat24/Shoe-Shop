import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import trash2Fill from "@iconify/icons-eva/trash-2-outline";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
// material
import { useState } from "react";

import { styled } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
} from "@mui/material";

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: "100%",
  // transition: theme.transitions.create(["box-shadow", "width"], {
  //   easing: theme.transitions.easing.easeInOut,
  //   duration: theme.transitions.duration.shorter,
  // }),
  // "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
  // "& fieldset": {
  //   borderWidth: `1px !important`,
  //   borderColor: `${theme.palette.grey[500_32]} !important`,
  // },
}));

// ----------------------------------------------------------------------

FilterDiscount.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filterDiscount: PropTypes.string,
  onFilterDiscount: PropTypes.func,
};

export default function FilterDiscount({
  filterName,
  onFilterName,
  filterDiscount,
  onFilterDiscount,
}) {
  return (
    <RootStyle
      sx={{
        "&.MuiToolbar-root": { padding: "10px !important" },
      }}
    >
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="select-active">Trạng thái</InputLabel>
            <Select
              labelId="select-active"
              id="select-active"
              value={filterDiscount}
              onChange={onFilterDiscount}
              label="Trạng thái"
            >
              <MenuItem value={`Tất cả`}>Tất cả</MenuItem>
              <MenuItem value={`Sắp diễn ra`}>Sắp diễn ra</MenuItem>
              <MenuItem value={`Đang diễn ra`}>Đang diễn ra</MenuItem>
              <MenuItem value={`Kết thúc`}>Kết thúc</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder="Nhập mã giảm giá"
            label="    "
            startAdornment={
              <InputAdornment position="start">
                <Box
                  component={Icon}
                  icon={searchFill}
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            }
          />
        </Grid>
      </Grid>
    </RootStyle>
  );
}
