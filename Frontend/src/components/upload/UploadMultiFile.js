import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
//
import BlockContent from './BlockContent';
import RejectionFiles from './RejectionFiles';
import MultiFilePreview from './MultiFilePreview';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ----------------------------------------------------------------------

UploadMultiFile.propTypes = {
  error: PropTypes.bool,
  showPreview: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  helperText: PropTypes.node,
  sx: PropTypes.object,
};

export default function UploadMultiFile({
  error,
  showPreview = false,
  files,
  onRemove,
  onRemoveAll,
  helperText,
  sx,
  isExistUploadRating,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    ...other,
  });
  return (
    <Box sx={{ width: '100%', ...sx }}>
      {isExistUploadRating ? (
        <Button
          variant="outlined"
          component="label"
          sx={{
            margin: '10px 0 20px 0',
            padding: '7px 0px',
            width: '24%',
            textTransform: 'none !important',
          }}
          {...getRootProps()}
        >
          <CameraAltIcon fontSize="small" /> <span className="ml-2 text-xs">Thêm hình ảnh</span>
          {/* <input {...getInputProps()} /> */}
        </Button>
      ) : (
        <DropZoneStyle
          {...getRootProps()}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
            ...((isDragReject || error) && {
              color: 'error.main',
              borderColor: 'error.light',
              bgcolor: 'error.lighter',
            }),
          }}
        >
          <input {...getInputProps()} />

          <BlockContent />
        </DropZoneStyle>
      )}

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      <MultiFilePreview files={files} showPreview={showPreview} onRemove={onRemove} onRemoveAll={onRemoveAll} />

      {helperText && helperText}
    </Box>
  );
}
