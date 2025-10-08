const socket = new WebSocket("ws://localhost:3000");
const stun = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
}

let local = null;
let localStream;
let localVideo = document.getElementById("user-1");
let remoteVideo = document.getElementById("user-2");
let notify = document.getElementById("notify");
let room = null;
let user;



socket.onmessage = async (message) => {
  let data = JSON.parse(message.data);


  if(data.type === "welcome") {
    console.log("Welcome, Your Id : ", data.id);
    return;  
  }


  if(data.type === "offer") {
    await createPeerConnection();
    await local.setRemoteDescription(new RTCSessionDescription(data.payload));
    
    let answer = await local.createAnswer();
    await local.setLocalDescription(answer);

    send("answer", answer);
  }


  if(data.type === "answer") {
    await local.setRemoteDescription(new RTCSessionDescription(data.payload));
  }  

  if(data.type === "ice-candidate") {
    if(data.payload) {
      await local.addIceCandidate(new RTCIceCandidate(data.payload))
    }
  }

  
  if(data.type === "left") {
    remoteVideo.srcObject = null;
    notify.innerHTML = `${data.payload} left the call`;
    setTimeout(() => notify.innerHTML = "", 4000);
  }

}



const send = (type, payload) => {
  socket.send(JSON.stringify({ type, room, payload}))
}


const join = async () => {
  user = document.getElementById("name").value.trim();
  room = document.getElementById("room").value.trim();
  if(!room) return alert("Please enter a room name");

  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  localVideo.srcObject = localStream;
  
  await createPeerConnection();
  send("join", user);

  let offer = await local.createOffer();
  await local.setLocalDescription(offer);
  send("offer", offer);

}

const createPeerConnection = async () => {
  if(local) return;

  local = new RTCPeerConnection(stun);

  local.onicecandidate = (event) => {
    if(event.candidate) {
      send("ice-candidate", event.candidate);
    }    
  }
  local.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  }

  localStream.getTracks().forEach(track => local.addTrack(track, localStream));
}