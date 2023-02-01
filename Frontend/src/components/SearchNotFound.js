import PropTypes from 'prop-types';
import { Box, Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return searchQuery ? (
    <Box {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Không tìm thấy
      </Typography>
      <Typography variant="body2" align="center">
        Không tìm thấy kết quả cho &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Hãy thử kiểm tra lỗi chính tả hoặc sử dụng các từ hoàn chỉnh.
      </Typography>
    </Box>
  ) : (
    <Typography variant="body2"> Vui lòng nhập từ khóa</Typography>
  );
}
