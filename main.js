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

  let a = localStream.getTracks()

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer)

  console.log(a)
}


main()