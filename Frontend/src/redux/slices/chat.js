import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

const initialState = {
  isLoading: false,
  error: null,
  conversationCurrent: {},
  contacts: { byId: {}, allIds: [] },
  conversations: null,
  conversationDetail: null,
  activeConversationId: null,
  participants: [],
  recipients: [],
  sendChatSuccess: null,
  contactSuccess: null,
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CONVERSATIONS CURRENT SUCCESS
    getConversationCurrentSuccess(state, action) {
      state.conversationCurrent = action.payload;

      state.activeConversationId = state.conversationCurrent._id;
    },
    createContactSuccess(state, action) {
      state.contactSuccess = action.payload;
    },
    // GET CONVERSATIONS
    getConversationsSuccess(state, action) {
      state.conversations = action.payload;
    },

    // GET CONVERSATION
    getConversationSuccess(state, action) {
      const conversation = action.payload;

      if (conversation) {
        state.conversationDetail = conversation;
        state.activeConversationId = conversation._id;
      } else {
        state.activeConversationId = null;
      }
    },

    // ON SEND MESSAGE

    sendChatSuccess(state, action) {
      state.isLoading = false;
      state.sendChatSuccess = action.payload;
    },

    // onSendMessage(state, action) {
    //   const conversation = action.payload;
    //   const { conversationId, messageId, message, contentType, attachments, createdAt, senderId } = conversation;

    //   const newMessage = {
    //     id: messageId,
    //     body: message,
    //     contentType,
    //     attachments,
    //     createdAt,
    //     senderId,
    //   };

    //   state.conversations.byId[conversationId].messages.push(newMessage);
    // },

    markConversationAsReadSuccess(state, action) {
      const { conversationId } = action.payload;
      const conversation = state.conversations.byId[conversationId];
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },

    // GET PARTICIPANTS
    getParticipantsSuccess(state, action) {
      const participants = action.payload;
      state.participants = participants;
    },

    // RESET ACTIVE CONVERSATION
    resetActiveConversation(state) {
      state.activeConversationId = null;
    },

    addRecipients(state, action) {
      const recipients = action.payload;
      state.recipients = recipients;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { addRecipients, onSendMessage, resetActiveConversation } = slice.actions;

// ----------------------------------------------------------------------

export function getConversationCurrent() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/chats/current');
      dispatch(slice.actions.getConversationCurrentSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getContacts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/contact');
      dispatch(slice.actions.getContactSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversations() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/chats');
      dispatch(slice.actions.getConversationsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversation(conversationKey) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/chats/conversation', {
        params: { conversationKey },
      });
      dispatch(slice.actions.getConversationSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function markConversationAsRead(conversationId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.get('/api/chat/conversation/mark-as-seen', {
        params: { conversationId },
      });
      dispatch(slice.actions.markConversationAsReadSuccess({ conversationId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function sendChat(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/chats/${data.chatId}/send`, data);
      dispatch(slice.actions.sendChatSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createContact() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/chats/contact');
      dispatch(slice.actions.createContactSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getParticipants(conversationKey) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/chats/participants', {
        params: { conversationKey },
      });
      dispatch(slice.actions.getParticipantsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
