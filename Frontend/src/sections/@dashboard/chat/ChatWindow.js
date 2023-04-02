import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// @mui
import { Box, Divider, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import {
  addRecipients,
  onSendMessage,
  getConversation,
  getParticipants,
  markConversationAsRead,
  resetActiveConversation,
  sendChat,
} from '../../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import ChatRoom from './ChatRoom';
import ChatMessageList from './ChatMessageList';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';
import ChatHeaderCompose from './ChatHeaderCompose';
import ChatAccount from './ChatAccount';

// ----------------------------------------------------------------------

const conversationSelector = (state) => {
  const { conversationDetail, activeConversationId } = state.chat;
  const conversation = activeConversationId ? conversationDetail : null;
  if (conversation) {
    return conversation;
  }
  const initState = {
    id: '',
    messages: [],
    participants: [],
    unreadCount: 0,
    type: '',
  };
  return initState;
};

export default function ChatWindow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { conversationKey } = useParams();
  const { contacts, recipients, participants, activeConversationId, sendChatSuccess } = useSelector(
    (state) => state.chat
  );
  const conversation = useSelector((state) => conversationSelector(state));

  const mode = conversationKey ? 'DETAIL' : 'COMPOSE';

  useEffect(() => {
    const getDetails = async () => {
      dispatch(getParticipants(conversationKey));
      try {
        await dispatch(getConversation(conversationKey));
      } catch (error) {
        console.error(error);
        navigate(PATH_DASHBOARD.chat.new);
      }
    };
    if (conversationKey) {
      getDetails();
    } else if (activeConversationId) {
      dispatch(resetActiveConversation());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey, sendChatSuccess]);

  useEffect(() => {
    if (activeConversationId) {
      // dispatch(markConversationAsRead(activeConversationId));
    }
  }, [dispatch, activeConversationId]);

  const handleAddRecipients = (recipients) => {
    dispatch(addRecipients(recipients));
  };

  const handleSendMessage = async (value) => {
    try {
      dispatch(sendChat(value));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Stack sx={{ flexGrow: 1, minWidth: '1px' }}>
      {mode === 'DETAIL' ? (
        <ChatHeaderDetail participants={participants} />
      ) : (
        <ChatHeaderCompose
          recipients={recipients}
          contacts={Object.values(contacts.byId)}
          onAddRecipients={handleAddRecipients}
        />
      )}

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Stack sx={{ flexGrow: 1 }}>
          <ChatMessageList conversation={{ ...conversation, support: 'Admin' }} />

          <Divider />

          <ChatMessageInput
            conversationId={activeConversationId}
            onSend={handleSendMessage}
            disabled={pathname === PATH_DASHBOARD.chat.new}
          />
        </Stack>

        {mode === 'DETAIL' && <ChatRoom conversation={conversation} participants={participants} />}
      </Box>
    </Stack>
  );
}
