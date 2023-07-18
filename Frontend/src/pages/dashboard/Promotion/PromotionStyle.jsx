import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  alert: {
    backgroundColor: '#e6f7ff  !important',
    border: '1px solid #91d5ff  !important',
  },
  formActionBar: {
    width: 'calc(100vw - 250px)',
    justifyContent: 'flex-end',
    padding: '12px 16px',
    position: 'fixed',
    bottom: ' 0px',
    left: ' 252px',
    background: 'white',
    zIndex: ' 99',
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
  alertMessage: {
    color: 'rgba(0,0,0,.85)',
    listStyleType: 'disc !important',
    listStylePosition: 'inside',
  },
  typographyInfo: {
    display: 'list-item',
  },
  couponPreviewContainer: {
    maxWidth: '366px',
    padding: ' 5px 12px',
    background: 'rgb(229, 229, 229)',
    margin: 'auto',
  },
  buttonSave: {
    position: 'absolute',
    bottom: '0px',
    right: '0px',
    padding: 'calc(2px * 0.855) calc(12px * 0.855)',
    borderRadius: '4px',
    backgroundColor: 'rgb(1, 127, 255)',
    fontSize: 'calc(15px * 0.855)',
    fontWeight: '500',
    lineHeight: 'calc(24px * 0.855)',
    color: 'white',
  },
  description: {
    listStyle: 'disc',
    padding: '0px 16px',
    margin: '-16px 0px 0px',
  },
  HiddenOverlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '8px',
    zIndex: '10',
    background: ' rgba(0, 0, 0, 0.65)',
    width: '100%',
    height: '85%',
    borderRadius: '0.3rem',
  },
  textValidation: {
    fontSize: '12.5px',
    color: ' rgb(89, 89, 89)',
    lineHeight: '40px',
  },
}));

export { useStyles };
