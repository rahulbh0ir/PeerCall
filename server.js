const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 3000});
console.log("Server Online");

let clients = new Map();
let rooms = new Map();


function broadcast() {

}


wss.on("connection", (ws) => {

  let joinedRoom = null;
  
  const id = Math.random().toString(36).substring(2, 9).trim();
  clients.set(id, ws)
  console.log("New Client: ", id)

  ws.on("message", (message) => {
    
    let data;

    try{
      data = JSON.parse(message)
    }
    catch(e){
      console.log("Invalid JSON")
      return;
    }

    const { type, room, payload } = data

    if(type === "join") {

      joinedRoom = room;
      if(!rooms.has(room)) rooms.set(room, new Set());

      rooms.get(room).add(id);

      console.log("Room List: ", rooms)
    }
    






  })


  ws.on("close", () => {
    console.log("Client Disconnected: ", id);
    clients.delete(id);
    
    if(joinedRoom && rooms.has(joinedRoom)) {
      rooms.get(joinedRoom).delete(id);
      if(rooms.get(joinedRoom).size === 0) {
        rooms.delete(joinedRoom);
      }
    }
    
    console.log("Room List: ", rooms)
  })


  ws.send(JSON.stringify({ type: "welcome", id }))
  
})

