
let local;


let video = document.getElementById("video")
let info = document.getElementById("info")

let localVideo = document.getElementById("user-1")
let remoteVideo = document.getElementById("user-2")




async function join() {
  
  // video.style.display = "block"
  // info.style.display = "none"

  let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
  localVideo.srcObject = stream;
  
  



}