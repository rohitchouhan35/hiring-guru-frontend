import Signal from "../apis/SignallingApi";

export async function joinMeeting(rohit, setAnswer, lastAnswerSDP) {
  const inputSessionID = prompt("Enter meet ID: ");
  const sessionStorage = await Signal.getOffer(inputSessionID);

  console.log("Remote offer is: ", sessionStorage);
  const remoteOffer = JSON.parse(sessionStorage.data.offer);
  const sessionID = sessionStorage.data.sessionStorageId;
  console.log("session ID is: ", sessionID);

  // Set onicecandidate listener for debugging
  rohit.onicecandidate = (e) => console.log("New Ice Candidate! Reprinting SDP answer:", JSON.stringify(rohit.localDescription));

  rohit.ondatachannel = (e) => {
    rohit.dataChannel = e.channel;
    rohit.dataChannel.onmessage = (e) => {
      // Handle received message (e.data) here
      console.log("New message from client! ", e.data);
    };
  };

  // Set remote description
  await rohit.setRemoteDescription(remoteOffer)
    .then(() => console.log("Offer set successfully!"))
    .catch((error) => console.error("Error setting remote description:", error));

  // Create and set local description (answer)
  await rohit.createAnswer()
    .then((o) => rohit.setLocalDescription(o))
    .then(() => console.log("Set local description (answer) successfully!"))
    .catch((error) => console.error("Error creating or setting local description:", error));

  // Process and add ice candidates
  // for (const candidate of sessionStorage.data.candidates) {
    const parsedCandidate = JSON.parse(sessionStorage.data.offer);
    await rohit.addIceCandidate(parsedCandidate)
      .then(() => console.log("Added ICE candidate:", parsedCandidate))
      .catch((error) => console.error("Error adding ICE candidate:", error));
  // }

  // Set connection state listener
  rohit.onconnectionstatechange = (event) => {
    if (event.target.connectionState === "connected") {
      console.log("Connected! You can now exchange messages with the other peer.");
      // Start your message exchange logic here
      prompt("pausing")
    }
  };

  // Store answer for potential future use (e.g., sending to server)
  if (lastAnswerSDP && lastAnswerSDP !== rohit.localDescription.sdp) {
    setAnswer(rohit.localDescription.sdp);
  }
}
