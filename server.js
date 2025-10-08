const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 3000});
console.log("Server is online");

let clients = new Map();
let rooms = new Map();


const boardcast = (room, senderId, message) => {
  const peers = rooms.get(room) || new Set();
  
  peers.forEach(peer => {
    if(peer !== senderId && clients.has(peer)) {
      clients.get(peer).send(JSON.stringify( {...message, from: senderId} ))
    }
  })
}



wss.on("connection", (ws) => {
  let roomName;
  let userName;
  const id = Math.random().toString(36).substring(2, 9);
  clients.set(id, ws);

  console.log("New Client connected: ", id);

  ws.on("message", (message) => {
    let data;
    try{
      data = JSON.parse(message);
    }
    catch(e){
      console.log("Invalid JSON", e);
    }

    const {type, room, payload} = data;
    
    if(type === "join") {
      roomName = room;
      userName = payload;
      if(!rooms.has(room)) rooms.set(room, new Set());
      rooms.get(room).add(id);
      console.log(type, room, payload);
    }

    if(["offer", "answer", "ice-candidate"].includes(type)) {
      boardcast( roomName, id, { type, payload } )
    }
  })
  
  
  
  
  ws.on("close", () => {
    console.log("Client Disconnected ", id);
    boardcast(roomName, id, {type: "left", payload: userName})
    clients.delete(id);

    if(roomName && rooms.has(roomName)) {
      rooms.get(roomName).delete(id);
      if(rooms.get(roomName).size === 0) {
        rooms.delete(roomName)
      }
    }
  })


  ws.send(JSON.stringify({ type:"welcome", id}))

})