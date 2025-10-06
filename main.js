const socket = new WebSocket("ws://localhost:3000");

const stun = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};


let local = null;
let localStream;

let localVideo = document.getElementById("user-1");
let remoteVideo = document.getElementById("user-2");
let room = null;


socket.onmessage = async (event) => {
  let data = JSON.parse(event.data)  
 
  if(data.type === "welcome") {
  console.log("Welcome, Your ID - ", data.id);
  }

  
}



function send(type, payload) {
  socket.send(JSON.stringify({type, room, payload}))
}


async function join() {  
  
  room = document.getElementById("room").value.trim();
  
  if(!room) {
    alert("Please enter a room name");
    return;
  }

  // document.querySelector("#video").style.display = "block";
  // document.querySelector("#info").style.display = "none";
  
  socket.send(JSON.stringify({type:"join", room}))

  localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
  localVideo.srcObject = localStream;
  
  await createPeerConnection();

  let offer = await local.createOffer()
  await local.setLocalDescription(offer)
  console.log(offer)
  // send("offer", local.setLocalDescription) 

}





async function createPeerConnection() {
  
  if(local) return;

  local = new RTCPeerConnection(stun); 
  
  local.onicecandidate = (event) => {
    if(event.candidate) {
      // send("ice-canditate", event.candidate)
    }
  }

  local.ontrack = (event) => {
    console.log("Track- ", event)
    remoteVideo.srcObject = event.streams[0];
  }


  localStream.getTracks().forEach(track => local.addTrack(track, localStream));

}
