const factory = require('../controllers/handlerFactory');
const Chat = require('../models/chatModel');
const catchAsync = require('../utils/catchAsync');
const { capitalCase } = require('change-case');
const fullTextSearch = require('fulltextsearch');
const fullTextSearchVi = fullTextSearch.vi;

exports.getDetailChat = factory.getOne();
exports.updateChat = factory.updateOne(Chat);
exports.deleteChat = factory.deleteOne(Chat);
exports.getAllChat = factory.getAll(Chat);

exports.getCurrentChat = catchAsync(async (req, res, next) => {
  const chats = await Chat.findOne({
    participants: {
      $all: [req.user.id, '63b9a199b3610ba178b14557'],
    },
  });
  if (chats !== null) {
    res.status(201).json({
      status: 'success',
      length: chats.length,
      data: chats,
    });
  } else {
    res.status(201).json({
      status: 'success',
      length: 0,
      data: {},
    });
  }
});

exports.createChat = catchAsync(async (req, res, next) => {
  const chats = await Chat.findOne({
    participants: {
      $all: [req.user.id, '63b9a199b3610ba178b14557'],
    },
  });
  if (chats !== null) {
    res.status(201).json({
      message: 'contact exists',
      length: chats.length,
      data: chats,
    });
  } else {
    const newChat = new Chat({
      participants: [req.user.id, '63b9a199b3610ba178b14557'],
      participantType: ['User', 'Admin'],
      messages: [
        {
          body: 'Bạn có muốn ADMIN hỗ trợ gì không?',
          contentType: 'text',
          senderId: '63b9a199b3610ba178b14557',
          senderEmail: 'admin@gmail.com',
          senderFullName: 'Lê Thành Đạt',
        },
      ],
    });

    await newChat.save();
    res.status(201).json({
      status: 'success',
      result: newChat.length,
      data: newChat,
    });
  }
});
exports.sendChat = catchAsync(async (req, res, next) => {
  const id = req.params.chatId;
  let doc = await Chat.findById(id);

  // Lấy ra thuộc tính messages
  const messages = doc.messages;
  // Thêm message mới vào mảng messages
  messages.push(req.body);
  // Lưu lại dữ liệu vào CSDL
  await doc.save();
  res.status(200).json({
    message: 'Send message successfully!',
    data: doc,
    statusCode: 201,
  });
});

exports.getDetailConversation = factory.getOneByName(Chat);

const formatName = (name) => {
  const formattedName = name
    .split('.') // Tách chuỗi theo dấu "."
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Viết hoa chữ cái đầu và thêm phần còn lại
    .join(' '); // Ghép các từ lại với nhau, cách nhau bởi khoảng trắng
  return formattedName;
};

exports.getDetailConversation = catchAsync(async (req, res, next) => {
  const { conversationKey } = req.query;
  var filter = {};
  if (conversationKey !== '') {
    filter.displayName = new RegExp(fullTextSearchVi(conversationKey), 'i');
  }
  const chat = await Chat.find();

  const conversation = chat.find((obj) => {
    return obj.participants.some((participant) => {
      if (!isNaN(conversationKey)) {
        // Nếu conversationKey là một số, so sánh phoneNumber trực tiếp
        return participant.phoneNumber == conversationKey;
      } else {
        // Nếu conversationKey không phải là số, thực hiện chuyển đổi lowercase
        return (
          participant.displayName?.toLowerCase() ===
          formatName(conversationKey)?.toLowerCase()
        );
      }
    });
  });

  if (conversation) {
    res.status(201).json({
      message: 'success',
      length: 1,
      data: conversation,
    });
  } else {
    res.status(404).json({
      message: 'fail',
      length: 0,
      data: {},
    });
  }
});

exports.getParticipants = catchAsync(async (req, res, next) => {
  const { conversationKey } = req.query;

  var filter = {};
  if (conversationKey !== '') {
    filter.displayName = new RegExp(fullTextSearchVi(conversationKey), 'i');
  }
  const chat = await Chat.find();
  const conversation = chat.find((obj) => {
    return obj.participants.some((participant) => {
      if (!isNaN(conversationKey)) {
        // Nếu conversationKey là một số, so sánh phoneNumber trực tiếp
        return participant.phoneNumber == conversationKey;
      } else {
        // Nếu conversationKey không phải là số, thực hiện chuyển đổi lowercase
        return (
          participant.displayName?.toLowerCase() ===
          formatName(conversationKey).toLowerCase()
        );
      }
    });
  });

  if (conversation) {
    const displayParticipants = conversation.participants.filter(
      (item) => item.email !== 'admin@gmail.com'
    );
    res.status(201).json({
      message: 'success',
      length: 1,
      data: displayParticipants,
    });
  } else {
    res.status(404).json({
      message: 'fail',
      length: 0,
      data: {},
    });
  }
});

exports.searchParticipants = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  const chat = await Chat.find();
  const filteredChat = chat.flatMap((obj) =>
    obj.participants.filter(
      (participant) =>
        participant.displayName.toLowerCase().includes(query) &&
        participant.email !== 'admin@gmail.com'
    )
  );

  res.status(200).json({
    status: 'success',
    length: filteredChat.length,
    data: filteredChat,
  });
});
