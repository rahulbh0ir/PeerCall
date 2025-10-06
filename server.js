const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 3000});
console.log("Server Online");

let clients = new Map();
let rooms = new Map();


function broadcast(room, senderId, message) {
   const members = rooms.get(room) || new Set();
   
   members.forEach(id => {
    if(id !== senderId && clients.has(id)) {
      clients.get(id).send(JSON.stringify({...message, from: senderId}))
    }   
   })
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
    

    if(["offer", "answer", "ice-candidate"].includes(type) && joinedRoom) {
      broadcast(joinedRoom, id, {type, payload})
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
    
    console.log("Rooms: ", rooms)

  })


  ws.send(JSON.stringify({ type: "welcome", id }))
  
})

