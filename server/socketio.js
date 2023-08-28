const User = require('./models/user');
const Notification = require('./models/notification');
let usersIo = [];

module.exports = function (io) {
  io.on('connection', (socket) => {
    socket.on('userLogin', async (userId) => {
      if (userId) {
        const oneUser = await User.findById(userId).lean().exec();
        if (oneUser) {
            usersIo[userId] = socket;
            socket.emit("welcomeMessage", "Hello")
            console.log(`Socket: User with id ${userId} connected`);
        } else {
          console.log(`Socket: No user with id ${userId}`);
        }
      }
    });

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