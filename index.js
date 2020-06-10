const express = require("express");
const app = express();
let ids = [];
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  return res.send("200");
});
app.get("/about", (req, res) => {
  return res.send("<h1>About</h1>");
});
app.get("/contact", (req, res) => {
  return res.send("<h1>Contact</h1>");
});

server = app.listen(8000, () => {
  console.log("Listening on port 8000");
});
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log(`New user connected- ${socket.id}`);
  socket.username = "Anonymous";
  socket.on("new_user", ({ name }) => {
    socket.username = name;
    console.log(name);
    ids.push({ id: socket.id, name: name });
    io.sockets.emit("all_users", { ids });
  });
  socket.on("new_message", ({ message, username }) => {
    io.sockets.emit("new_message", { message, username });
  });
  socket.on("disconnect", () => {
    let id1 = socket.id;
    let intro = "";

    ids.forEach((element, index, array) => {
      if (element.id == id1) {
        intro = element.name;
        ids.splice(index, 1);
      }
    });
    console.log(intro);
    socket.broadcast.emit("welcome", {
      name: intro,
    });
  });
});
