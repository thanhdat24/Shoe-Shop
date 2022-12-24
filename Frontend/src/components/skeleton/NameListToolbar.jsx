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

const SearchStyle = styled(OutlinedInput)(({ cusTomSearch, theme }) => ({
  ...(cusTomSearch
    ? {
        width: "100%",
      }
    : {
        width: 240,
        transition: theme.transitions.create(["box-shadow", "width"], {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.shorter,
        }),
        "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
        "& fieldset": {
          borderWidth: `1px !important`,
          borderColor: `${theme.palette.grey[500_32]} !important`,
        },
      }),
}));

// ----------------------------------------------------------------------

NameListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  cusTomSearch: PropTypes.bool,
  onFilterName: PropTypes.func,
  filterLabelName: PropTypes.string,
  searchLabelName: PropTypes.string,
  filterList: PropTypes.string,
  valueFilterStatus: PropTypes.string,
  onChangeFilterStatus: PropTypes.func,
  labelFilterStatus: PropTypes.string,
};

export default function NameListToolbar({
  numSelected,
  filterName,
  onFilterName,
  valueFilterStatus,
  onChangeFilterStatus,
  filterLabelName,
  filterList,
  searchLabelName,
  cusTomSearch,
  labelFilterStatus,
}) {
  return (
    <RootStyle
      sx={{
        "&.MuiToolbar-root": { padding: "10px !important" },
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : cusTomSearch ? (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="select-role">{filterLabelName}</InputLabel>
              <Select
                labelId="select-role"
                id="select-role"
                value={valueFilterStatus}
                onChange={onChangeFilterStatus}
                label={labelFilterStatus}
              >
                <MenuItem value={`all`}>Tất cả</MenuItem>

                {filterList?.map((item) =>
                  item.name ? (
                    <MenuItem value={item.value}>{item.name}</MenuItem>
                  ) : (
                    ""
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={9}>
            <SearchStyle
              cusTomSearch={true}
              value={filterName}
              onChange={onFilterName}
              label="    "
              placeholder={searchLabelName}
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
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          label="    "
          placeholder={searchLabelName}
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
      )}

      {numSelected > 0 && (
        <Tooltip title="Xoá">
          <IconButton>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
