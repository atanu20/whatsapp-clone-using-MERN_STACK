const PORT = process.env.PORT || 9000
const Nexmo = require('nexmo');

const vonage = new Nexmo({
  apiKey: "**",
  apiSecret: "**"
})

const io = require("socket.io")(PORT, {
  cors: {
    origin: "*",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");
  //   console.log(user)
  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId,sendername,senderstatus, receiverId, receiverphone, text, imgtext }) => {
    const user = getUser(receiverId);
    // console.log(senderstatus)

    if (user) {

      io.to(user.socketId).emit("getMe", {
        senderId,
        text,
        imgtext,
      });
    } else {
      if(senderstatus){
        if (receiverphone) {
          // console.log(receiverphone)
          const from = "Small Talk"
          const to = "***"
          const text = "you got a new message from "+ sendername +" | Small Talk"
          vonage.message.sendSms(from, to, text, (err, responseData) => {
            if (err) {
              console.log(err);
            } else {
              if (responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
              } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
              }
            }
          })
        }

      }
      
    }
  });


  socket.on("sendgpMessage", ({ senderId, gpId, text, imgtext }) => {

    io.emit("getGpMsg", {
      senderId,
      gpId,
      text,
      imgtext,
    });

  });







  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});


 
