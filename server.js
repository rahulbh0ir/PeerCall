const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 3000});
console.log("Server Online");

let clients = new Map();
let rooms = new Map();

wss.on("connection", (ws) => {

  const id = Math.random().toString(36).substring(2, 9).trim();
  clients.set(id, ws)
  console.log("New Client: ", id)

  ws.on("message", (message) =>{
    
    let data;

    try{
      data = JSON.parse(message)
    }catch(e){
      console.log("Invalid JSON")
      return;
    }

    // console.log("Received: ", data)

    const {type, room, payload} = data
    



  })

  
})

