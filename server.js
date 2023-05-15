const WebSocket = require('ws');

const server = new WebSocket.Server({port:7071});

const clients = new Map();

server.on("connection", (socket)=>{
    const id = uuidv4();
    const color = Math.floor(Math.random()*360);
    const metadata = {id:id, color:color};

    clients.set(socket, metadata);

    socket.on("message", (msg)=>{
        const message = JSON.parse(msg);
        const metadata = clients.get(socket);

        message.sender = metadata.id;
        message.color = metadata.color;

        const outbound = JSON.stringify(message);
        [...clients.keys()].forEach((client)=>{
            client.send(outbound);
        });
    });

    socket.on("close", ()=>{
        clients.delete(socket);
    });
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
