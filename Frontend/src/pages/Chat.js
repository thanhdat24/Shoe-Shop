import { useEffect } from 'react';
// @mui
import { Card, Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../redux/store';
import { getConversations, getContact } from '../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { ChatSidebar, ChatWindowClient } from '../sections/@dashboard/chat';

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();
  const { sendChatSuccess } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getContact());
  }, [dispatch, sendChatSuccess]);

  return (
    <div className="fixed right-2 md:right-10 bottom-24 flex space-x-2 z-20 ">
      <Card sx={{ height: '72vh', width: '48vh', display: 'flex' }}>
        {/* <ChatSidebar /> */}
        <ChatWindowClient />
      </Card>
    </div>
  );
}
