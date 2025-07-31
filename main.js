let localStream


let main = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  document.getElementById("user-1").srcObject = localStream  
}


main()