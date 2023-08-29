const User = require('./models/user');
const Notification = require('./models/notification');
const Appointment = require('./models/appointment');
let usersIo = [];

module.exports = function (io) {
  io.on('connection', (socket) => {
    socket.on('userLogin', async (userId) => {
        const oneUser = await User.findById(userId).lean().exec();
        if (oneUser) {
          usersIo[userId] = socket;
          console.log(`Socket: User with id ${userId} connected`);
          if(!oneUser.first){
            const welcome = await Notification.create({
              user_id: oneUser._id,
              name: 'Welcome to the PHM System!',
              content: 'Welcome to the PHM System!',
              type: 'MESSAGE',
              read: false
          })
            usersIo[userId]?.emit("first_message", welcome)

          }
        } else {
          console.log(`Socket: No user with id ${userId}`);
        }
    });

    socket.on("appointment_cancel", async (app, userId, doc) => {
      const user = await User.findById(userId)
      if(user && doc === 'DOCTOR'){
        
          const appointmentCanceledEvent = await Notification.create({
            user_id: user._id,
            name: 'Appointment cancelled!',
            content: `Your appointment on ${app.app_date} with Dr. ${app.doctor_name} (${app.doctor_spec}) has been canceled.`,
            type: 'ALERT',
            read: false
          })
  
          usersIo[user._id]?.emit("appointment_canceled", appointmentCanceledEvent)
        
        }
      })

    socket.on('disconnect', (userId) => {
      console.log(`User with id ${userId} disconnected from socket`);
      usersIo[userId] = null;
    });
  });
};

/*
     const welcome = await Notification.create({
                        user_id: userId,
                        content: `${oneUser.first ? 'Welcome back!' : 'Welcome to the PHM System!'}`,
                        type: 'MESSAGE',
                        read: false
                    })
                    usersIo[userId].emit("welcomeMessage", "Welcome to the PHM system!")
               
                    */