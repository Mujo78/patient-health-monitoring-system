const User = require("./models/user");
const Notification = require("./models/notification");
const Appointment = require("./models/appointment");
let usersIo = [];

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("userLogin", async (userId) => {
      const oneUser = await User.findById(userId).lean().exec();
      if (oneUser) {
        usersIo[userId] = socket;
        console.log(`Socket: User with id ${userId} connected`);
        if (oneUser.first === false) {
          const welcome = await Notification.create({
            user_id: oneUser._id,
            name: "Welcome to the PHM System!",
            content: "Welcome to the PHM System!",
            type: "MESSAGE",
            read: false,
          });
          usersIo[userId]?.emit("first_message", welcome);
        }
      } else {
        console.log(`Socket: No user with id ${userId}`);
      }
    });

    socket.on("appointment_cancel", async (app, userId, doc) => {
      const user = await User.findById(userId);
      if (user && doc === "DOCTOR") {
        const message = `Dear, \nWe regret to inform you that your appointment scheduled for ${app.app_date} with Dr. ${app.doctor_name} (${app.doctor_spec}) has been canceled.\nWe apologize for any inconvenience this may have caused. If you have any questions or need to reschedule, please don't hesitate to contact us.\nSincerely`;

        const appointmentCanceledEvent = await Notification.create({
          user_id: user._id,
          name: "Appointment cancelled!",
          content: message,
          type: "ALERT",
          read: false,
        });

        usersIo[user._id]?.emit(
          "appointment_canceled",
          appointmentCanceledEvent
        );
      }
    });

    socket.on("appointment_finished", async (app, userId, doc) => {
      const user = await User.findById(userId);
      if (user && doc === "DOCTOR") {
        const message = `Dear, \nWe are pleased to inform you that the results for your appointment scheduled for ${app.app_date} with Dr. ${app.doctor_name} (${app.doctor_spec}) are now available.\nIf you have any questions about the results or need further clarification, please don't hesitate to contact us.\nThank you for choosing our services.\nSincerely`;

        const appointmentFinishedEvent = await Notification.create({
          user_id: user._id,
          name: "Appointment's Results Available!",
          content: message,
          type: "INFO",
          link: `/my-appointments/${app._id}`,
          read: false,
        });

        usersIo[user._id]?.emit(
          "appointment_finished",
          appointmentFinishedEvent
        );
      }
    });

    socket.on("disconnect", (userId) => {
      console.log(`User with id ${userId} disconnected from socket`);
      usersIo[userId] = null;
    });
  });
};
