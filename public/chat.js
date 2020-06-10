$(function () {
  var socket = io.connect("http://localhost:8090");
  var username = $("#username");
  var change = $("#change");
  var message = $("#message");
  var msg_btn = $("#msg_btn");
  var chat_sect = $("#chat_section");
  change.click(function () {
    console.log(username.val());
    socket.emit("change_username", { username: username.val() });
  });
  msg_btn.click(function () {
    socket.emit("new_message", {
      username: username.val(),
      message: message.val(),
      id: socket.id,
    });
  });
  socket.on("new_message", ({ username, message }) =>
    chat_sect.append("<p>" + username + ":" + message + "</p>")
  );
  socket.on("new_user", ({ info }) => {
    for (const [user, id] of Object.entries(info)) {
      chat_sect.append("<h1>" + user + ":" + id + " is availbale</h1>");
    }
  });
});
