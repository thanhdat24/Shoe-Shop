import React from 'react';

Dialog.propTypes = {
  tag: PropTypes.node,
};
export default function Dialog() {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center', fontSize: '18px', marginBottom: '10px' }}>
        {'Tạo thương hiệu'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên thương hiệu"
          type="text"
          fullWidth
          name="name"
          inputRef={valueRef}
          id="outlined-basic"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="error">
          Hủy{' '}
        </Button>
        <Button type="submit" onClick={handleCreate} variant="outlined">
          Tạo{' '}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
