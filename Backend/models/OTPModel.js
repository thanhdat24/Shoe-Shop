const mongoose = require('mongoose');
const schedule = require('node-schedule');

const OTPSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const OTP = mongoose.model('OTP', OTPSchema);

// Hàm xóa bản ghi hết hạn
const deleteExpiredOTP = async () => {
  const now = new Date();
  const tenSecondsAgo = new Date(now.getTime() - 30 * 1000); // 10 giây trước
  await OTP.deleteMany({ expiresAt: { $lt: tenSecondsAgo } });
};

// Lập lịch chạy hàm xóa vào mỗi giây
schedule.scheduleJob('* * * * * *', async () => {
  await deleteExpiredOTP();
});

module.exports = OTP;
