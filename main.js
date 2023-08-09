//inject rrweb script
const rrwebScript = document.createElement('SCRIPT');
rrwebScript.src =
  'https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb-all.min.js';
rrwebScript.type = 'text/javascript';
document.getElementsByTagName('HEAD')[0].appendChild(rrwebScript);

//inject socket.io script
const cronyScript = document.createElement('SCRIPT');
cronyScript.src = 'https://cdn.socket.io/4.4.1/socket.io.min.js';
cronyScript.type = 'text/javascript';
document.getElementsByTagName('HEAD')[0].appendChild(cronyScript);

//inject crony script to window
window.cronyWidget = function (customConfig) {
  const { token, apiServer } = customConfig;
  const socket = io(apiServer);
  const roomName = token;

  console.log('crony script initiated.....');

  socket.on('connect', () => {
    // instruct a room name to be joined by server
    socket.emit('new-user', roomName);

    rrweb.record({
      emit(event) {
        console.log(event);
        // sent to room for agent
        socket.emit('send-event', { event: event, room: roomName });
      },
    });

    // recevied from agent side
    socket.on('agent-event', (data) => {
      console.log(data);
    });
  });

  console.log('ROOM_NAME', roomName);
};

// initiate crony widget on page ready
// document.onreadystatechange = function () {
//   if (document.readyState === 'complete') {
//     window.cronyWidget({
//       apiServer: 'http://localhost:3000',
//       token: `SqFR5uoLEUX8Qzuo66xF686q${Math.floor(Math.random() * 500)}`,
//     });
//   }
// };