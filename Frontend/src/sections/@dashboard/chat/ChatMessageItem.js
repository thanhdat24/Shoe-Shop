import PropTypes from 'prop-types';
import { useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
// components
import Image from '../../../components/Image';
import { formatDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.5),
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

ChatMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  conversation: PropTypes.object.isRequired,
  onOpenLightbox: PropTypes.func,
};

export default function ChatMessageItem({ message, conversation, onOpenLightbox }) {
  const sender = conversation.participants.find((participant) => participant.email === message.senderEmail);
  let senderDetails = {};
  if (conversation.support === 'Admin') {
    if (message.senderEmail === 'admin@gmail.com') {
      senderDetails = { type: 'me' };
    } else {
      senderDetails = { photoURL: sender?.photoURL, name: sender?.fullName };
    }
  } else if (conversation.support !== 'Admin') {
    if (message.senderEmail !== 'admin@gmail.com') {
      senderDetails = { type: 'me' };
    } else {
      senderDetails = { photoURL: sender?.photoURL, name: sender?.fullName };
    }
  }

  const isMe = senderDetails.type === 'me';
  const isImage = message.contentType === 'image';
  const firstName = 'Admin';
  const [showInfo, setShowInfo] = useState(false);
  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto',
          }),
        }}
      >
        {senderDetails.type !== 'me' && (
          <Avatar alt={senderDetails.name} src={senderDetails.photoURL} sx={{ width: 32, height: 32, mr: 2 }} />
        )}

        <div className={isMe ? 'flex flex-col items-end w-full flex-shrink-0' : 'flex flex-col w-full items-start'}>
          {showInfo && (
            <InfoStyle
              variant="caption"
              sx={{
                ...(isMe && { justifyContent: 'flex-end' }),
              }}
            >
              {/* {!isMe && `${firstName},`}&nbsp; */}
              {/* {formatDistanceToNowStrict(new Date(message.createdAt), {
                addSuffix: true,
              })} */}
              {formatDate(message.createdAt)}
            </InfoStyle>
          )}

          <Box
            onClick={() => setShowInfo(!showInfo)}
            className={
              isMe
                ? 'text-white !rounded-3xl !px-3 !py-2 !break-word !rounded-br-none cursor-pointer !overflow-x-auto !max-w-3/4 text-sm bg-gradient-to-br from-green-400 to-green-600 shadow-md'
                : '!rounded-3xl !px-3 !py-2 !break-word !rounded-bl-none shadow-sm cursor-pointer !overflow-x-auto !max-w-3/4 text-sm  bg-gradient-to-br from-gray-100 to-gray-300  '
            }
            sx={{
              ...isMe,
              ...(isImage && { p: 0 }),
            }}
          >
            {isImage ? (
              <Image
                alt="attachment"
                src={message.body}
                onClick={() => onOpenLightbox(message.body)}
                sx={{ borderRadius: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              />
            ) : (
              <Typography variant="span">{message.body}</Typography>
            )}
          </Box>
        </div>
      </Box>
    </RootStyle>
  );
}
