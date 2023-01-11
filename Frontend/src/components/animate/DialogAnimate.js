import PropTypes from 'prop-types';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { Dialog, Box, Paper, DialogTitle, DialogActions, Button } from '@mui/material';

import { varFade } from './variants';

// ----------------------------------------------------------------------

DialogAnimate.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onClickSubmit: PropTypes.func,
  open: PropTypes.bool.isRequired,
  sx: PropTypes.object,
  variants: PropTypes.object,
  title: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  isInvoice: PropTypes.string,
};

export default function DialogAnimate({
  open = false,
  variants,
  onClose,
  children,
  sx,
  title,
  onClickSubmit,
  isEdit,
  isInvoice,
  ...other
}) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={open}
          onClose={onClose}
          PaperComponent={(props) => (
            <Box
              component={m.div}
              {...(variants ||
                varFade({
                  distance: 120,
                  durationIn: 0.32,
                  durationOut: 0.24,
                  easeIn: 'easeInOut',
                }).inUp)}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box onClick={onClose} sx={{ width: '100%', height: '100%', position: 'fixed' }} />
              <Paper sx={sx} {...props}>
                <DialogTitle
                  id="alert-dialog-title"
                  sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '10px' }}
                >
                  {title}
                </DialogTitle>
                {props.children}
                {!isInvoice === 'yes' && (
                  <DialogActions>
                    <Button onClick={onClose} variant="contained" color="error">
                      Hủy{' '}
                    </Button>
                    <Button type="submit" onClick={onClickSubmit} variant="outlined">
                      {isEdit}
                    </Button>
                  </DialogActions>
                )}
              </Paper>
            </Box>
          )}
          {...other}
        >
          {children}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
