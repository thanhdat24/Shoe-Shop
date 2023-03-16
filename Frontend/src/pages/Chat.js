import { useEffect, useState } from 'react';
// @mui
import { Box, Card, Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../redux/store';
import { getConversations, getConversationCurrent, createContact } from '../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { ChatSidebar, ChatWindowClient } from '../sections/@dashboard/chat';
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();
  const { sendChatSuccess, contactSuccess } = useSelector((state) => state.chat);
  const { user } = useAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getConversationCurrent());
  }, [dispatch, sendChatSuccess, contactSuccess]);

  const [isActive, setIsActive] = useState(false);
  const toggleActiveClass = async () => {
    await dispatch(createContact());

    setIsActive(!isActive);
  };

  return user?.googleId ? (
    <Box>
      <Box className={`fixed right-2 md:right-10 bottom-24 flex space-x-2 z-20 ${isActive ? 'block' : 'hidden'}`}>
        <Card sx={{ height: '72vh', width: '48vh', display: 'flex' }}>
          {/* <ChatSidebar /> */}
          <ChatWindowClient handleCloseChat={toggleActiveClass} />
        </Card>
      </Box>

      <Box className="fixed right-2 bottom-0 flex space-x-2 z-20 ">
        <button className={`chat flex relative ${isActive ? 'active' : ''}`} onClick={toggleActiveClass}>
          <Box
            className="background bg-blue-600 h-20 absolute w-20"
            sx={{
              borderRadius: ' 50%',
              boxShadow:
                '0 2.1px 1.3px rgba(0, 0, 0, 0.044), 0 5.9px 4.2px rgba(0, 0, 0, 0.054), 0 12.6px 9.5px rgba(0, 0, 0, 0.061), 0 25px 20px rgba(0, 0, 0, 0.1)',
              left: '10px',
              top: '10px',
            }}
          >
            {' '}
          </Box>
          <svg className="chat-bubble cursor-pointer relative" width="100" height="100" viewBox="0 0 100 100">
            <g
              className="bubble"
              style={{
                transformOrigin: '50%',
                transition: 'transform 500ms cubic-bezier(0.17, 0.61, 0.54, 0.9)',
                transform: isActive ? 'translateX(24px) translateY(4px) rotate(45deg)' : 'none',
              }}
            >
              <path
                className="line line1"
                style={{
                  fill: 'none',
                  stroke: ' #ffffff',
                  strokeWidth: '2.75',
                  strokeLinecap: 'round',
                  transition: 'stroke-dashoffset 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                  strokeDasharray: '60 90',
                  strokeDashoffset: isActive ? '21' : '-20',
                }}
                d="M 30.7873,85.113394 30.7873,46.556405 C 30.7873,41.101961
          36.826342,35.342 40.898074,35.342 H 59.113981 C 63.73287,35.342
          69.29995,40.103201 69.29995,46.784744"
              />
              <path
                style={{
                  fill: 'none',
                  stroke: ' #ffffff',
                  strokeWidth: '2.75',
                  strokeLinecap: 'round',
                  transition: 'stroke-dashoffset 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                  strokeDasharray: '67 87',
                  strokeDashoffset: isActive ? '30' : '-18',
                }}
                className="line line2"
                d="M 13.461999,65.039335 H 58.028684 C
            63.483128,65.039335
            69.243089,59.000293 69.243089,54.928561 V 45.605853 C
            69.243089,40.986964 65.02087,35.419884 58.339327,35.419884"
              />
            </g>
            <circle
              className="circle circle1"
              style={{
                fill: '#ffffff',
                stroke: 'none',
                transformOrigin: '50%',
                transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isActive ? 'scale(0)' : 'none',
              }}
              r="1.9"
              cy="50.7"
              cx="42.5"
            />
            <circle
              className="circle circle2"
              style={{
                fill: '#ffffff',
                stroke: 'none',
                transformOrigin: '50%',
                transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isActive ? 'scale(0)' : 'none',
              }}
              cx="49.9"
              cy="50.7"
              r="1.9"
            />
            <circle
              className="circle circle3"
              style={{
                fill: '#ffffff',
                stroke: 'none',
                transformOrigin: '50%',
                transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isActive ? 'scale(0)' : 'none',
              }}
              r="1.9"
              cy="50.7"
              cx="57.3"
            />
          </svg>
        </button>
      </Box>
    </Box>
  ) : (
    ''
  );
}
