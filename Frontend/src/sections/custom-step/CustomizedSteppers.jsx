import Check from '@mui/icons-material/Check';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#2dc258',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#2dc258',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: '#2dc258',
    // boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    boxShadow: '0 2px 11px 0 rgba(0,0,0,.5)',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#2dc258',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;
  const icons = {
    1: <ReceiptIcon />,
    2: <LocalShippingIcon />,
    3: <DomainVerificationIcon />,
    4: <Check />,
    5: <StarBorderIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}
function ColorlibStepIconCancel(props) {
  const { active, completed, className } = props;
  const iconCancel = {
    1: <ReceiptIcon />,
    2: <ProductionQuantityLimitsIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {iconCancel[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

ColorlibStepIconCancel.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = ['Chờ xác nhận', 'Đang vận chuyển', 'Đã giao hàng', 'Đã nhận', 'Đánh giá'];
const stepsCancel = ['Chờ xác nhận', 'Đã hủy'];
export default function CustomizedSteppers({ orderDetail }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (orderDetail !== 'undefined' && orderDetail?.status === 'Đang xử lý') {
      setStep(0);
    } else if (
      orderDetail !== 'undefined' &&
      (orderDetail?.status === 'Đang vận chuyển' || orderDetail?.status === 'Đã hủy')
    ) {
      setStep(1);
    } else if (orderDetail !== 'undefined' && orderDetail?.status === 'Đã đánh giá') {
      setStep(4);
    } else if (orderDetail !== 'undefined' && orderDetail?.status === 'Đã giao hàng') {
      setStep(2);
    } else setStep(3);
  }, [step, orderDetail]);

  return (
    <div>
      {' '}
      <Stack sx={{ width: '100%', margin: '20px 0' }} spacing={4}>
        {orderDetail !== 'undefined' && orderDetail?.status !== 'Đã hủy' ? (
          <Stepper alternativeLabel activeStep={step} connector={<ColorlibConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        ) : (
          <Stepper alternativeLabel activeStep={step} connector={<ColorlibConnector />}>
            {stepsCancel.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIconCancel}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
      </Stack>
    </div>
  );
}
