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
        // you should use console.log in this way to avoid errors.
        // const defaultLog = console.log['__rrweb_original__']
        //   ? console.log['__rrweb_original__']
        //   : console.log;
        // defaultLog(event);
        // sent to room for agent
        socket.emit('send-event', { event: event, room: roomName });
      },
      // recordCanvas: true,
      collectFonts: true,
      inlineImages: true,
      recordAfter: 'DOMContentLoaded',
      // plugins: [
      //   rrweb.getRecordConsolePlugin({
      //     level: ['info', 'log', 'warn', 'error'],
      //     lengthThreshold: 100,
      //     stringifyOptions: {
      //       stringLengthLimit: 100,
      //       numOfKeysLimit: 100,
      //       depthOfLimit: 1,
      //     },
      //     logger: window.console,
      //   }),
      // ],
    });

    // recevied from agent side
    socket.on('agent-event', (data) => {
      console.log('agent-event', data);
    });
  });

  console.log('ROOM_NAME', roomName);
};

// initiate crony widget on page ready
// document.onreadystatechange = function () {
//   if (document.readyState === 'complete') {
//     window.cronyWidget({
//       apiServer: 'https://b9669a9e2774.ngrok.app',
//       token: `SqFR5uoLEUX8Qzuo66xF686q81`,
//       // token: `SqFR5uoLEUX8Qzuo66xF686q${Math.floor(
//       //   Math.random() * 500
//       // ).toString()}`,
//     });
//   }
// };
