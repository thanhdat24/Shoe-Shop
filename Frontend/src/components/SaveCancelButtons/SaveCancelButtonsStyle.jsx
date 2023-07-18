import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  alert: {
    backgroundColor: '#e6f7ff  !important',
    border: '1px solid #91d5ff  !important',
  },
  formActionBar: {
    width: 'calc(100vw - 250px)',
    justifyContent: 'space-between',
    padding: '12px 16px',
    position: 'fixed',
    top: ' 0px',
    left: ' 252px',
    background: 'white',
    zIndex: '100',
    borderTop: '1px solid rgb(229, 229, 229)',
    transition: 'all 0.5s ease 0s',
    display: 'flex',
  },
  ActionWrapper: {
    display: 'flex',
    marginRight: ' 100px',
    columnGap: '12px',
  },
  buttonCreate: {
    padding: '6px 13px !important',
    fontWeight: '700 !important',
    lineHeight: '1.71429 !important',
    fontSize: '0.8rem !important',
    textTransform: 'none !important',
    height: '38px !important',
  },
}));

export { useStyles };
