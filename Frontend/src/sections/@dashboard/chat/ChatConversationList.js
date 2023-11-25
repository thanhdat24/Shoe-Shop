import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { dotCase } from 'change-case';
// @mui
import { List } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { SkeletonConversationItem } from '../../../components/skeleton';
//
import ChatConversationItem from './ChatConversationItem';
// format
import { fName } from '../../../utils/formatName';

// ----------------------------------------------------------------------

ChatConversationList.propTypes = {
  conversations: PropTypes.object,
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string,
  sx: PropTypes.object,
};

export default function ChatConversationList({ conversations, isOpenSidebar, activeConversationId, sx, ...other }) {
  const navigate = useNavigate();
  const handleSelectConversation = (conversationId) => {
    let conversationKey = '';
    const conversation = conversations[conversationId];

    if (conversation.type === 'GROUP') {
      conversationKey = conversation.id;
    } else {
      const otherParticipant = conversation.participants.find((participant) => participant.email !== 'admin@gmail.com');
      if (otherParticipant?.googleId) {
        conversationKey = otherParticipant?.displayName;
      }
      if (otherParticipant?.phoneId) {
        conversationKey = Number(otherParticipant?.phoneNumber);
      }
    }
    if (typeof conversationKey === 'number') {
      navigate(PATH_DASHBOARD.chat.view(Number(conversationKey)));
    } else {
      navigate(PATH_DASHBOARD.chat.view(fName(conversationKey)));
    }
  };

  const loading = !conversations?.length;

  return (
    <List disablePadding sx={sx} {...other}>
      {(loading ? [...Array(12)] : conversations).map((conversationId, index) =>
        conversationId ? (
          <ChatConversationItem
            key={conversationId._id}
            isOpenSidebar={isOpenSidebar}
            conversation={conversationId}
            isSelected={activeConversationId === conversationId._id}
            onSelectConversation={() => handleSelectConversation(index)}
          />
        ) : (
          <SkeletonConversationItem key={index} />
        )
      )}
    </List>
  );
}
