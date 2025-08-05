
let App_ID = "ff28096ad7cd4e6b9fdfe6f11787013d";

let token = null
let uid = String(Math.floor(Math.random() * 10000));

let client;
let channel;

let localStream;
let remoteStream;
let peerConnection;

const servers = {
    iceServer : [
      {
          urls : [ "stun:stun1.l.google.com:19302" , "stun:stun2.l.google.com:19302"]
      }
    ]
}



let main = async () => {

  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  document.getElementById("user-1").srcObject = localStream  

  createOffer()
}



let createOffer = async () => {
  peerConnection = new RTCPeerConnection(servers);
  
  remoteStream = new MediaStream()
  document.getElementById("user-2").srcObject = remoteStream  


  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream)
  })

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track)
    })
  }

  peerConnection.onicecandidate = (event) => {
    if(event.candidate) {
      console.log("New ICE candidate : ", event.candidate);
    }
  }




  let offer = await peerConnection.createOffer();
  console.log("Offer created: ", offer);

  await peerConnection.setLocalDescription(offer)


}


main()