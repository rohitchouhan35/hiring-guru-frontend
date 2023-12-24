import Signal from "../apis/SignallingApi";

export async function joinMeeting(rohit, setAnswer, lastAnswerSDP, onSubscribe, onPublishMessage) {

  // --------------------    WEBSOCKET   ----------------------- //

  const handleSubscribe = () => {
    // Subscribe to a Stomp topic
    onSubscribe({
      topic: "/all/messages",
      onMessage: (message) => {
        // Handle incoming messages
        console.log("Printing websocket incoming message...")
        console.log(message);
      },
    });
  };

  const handleSendMessage = (message) => {
    // Publish a message to the Stomp destination
    onPublishMessage("/app/application", message);
    console.log("Published message...");
  };

  // --------------------    WEBSOCKET   ----------------------- //

  handleSubscribe();
  const inputSessionID = prompt("Enter meet ID: ");
  const sessionStorage = await Signal.getOffer(inputSessionID);

  console.log("Remote offer is: ", sessionStorage);
  const remoteOffer = JSON.parse(sessionStorage.data.offer);
  const sessionID = sessionStorage.data.sessionStorageId;
  console.log("session ID is: ", sessionID);

  // Set onicecandidate listener for debugging
  rohit.onicecandidate = (e) => {
    console.log(
      "New Ice Candidate! Reprinting SDP answer:",
      JSON.stringify(rohit.localDescription)
    );
  };

  rohit.ondatachannel = (e) => {
    rohit.dataChannel = e.channel;
    rohit.dataChannel.onmessage = (e) => {
      // Handle received message (e.data) here
      console.log("New message from client! ", e.data);
    };

    rohit.dataChannel.onopen = async (e) => {
      console.log("Data channel opened!");
      console.log("Message sender is ready...");

      async function sendMessage() {
        const messageToSend = prompt("Enter a message to send or type 'quit'");
        if (
          messageToSend !== "quit" &&
          rohit.dataChannel.readyState === "open"
        ) {
          rohit.dataChannel.send(messageToSend);
          await sendMessage();
        } else {
          console.log('Data channel is closed or "quit" command entered.');
        }
      }

      // Start the asynchronous loop
      await sendMessage();
    };
  };

  // Set remote description
  await rohit
    .setRemoteDescription(remoteOffer)
    .then(() => console.log("Offer set successfully!"))
    .catch((error) =>
      console.error("Error setting remote description:", error)
    );

  // Create and set local description (answer)
  await rohit
    .createAnswer()
    .then((o) => rohit.setLocalDescription(o))
    .then(() => {
      console.log(
        "Set local description (answer) successfully!",
        JSON.stringify(rohit.localDescription)
      );
      sessionStorage.data.answer = JSON.stringify(rohit.localDescription);
    })
    .then(() => {
      console.log("Saving answer with object: ", sessionStorage);
      Signal.saveAnswer(sessionStorage.data);
    })
    .then(() => console.log("Answer saved successfully."))
    .catch((error) =>
      console.error("Error creating or setting local description:", error)
    );

  // Process and add ice candidates
  // for (const candidate of sessionStorage.data.candidates) {
  const parsedCandidate = JSON.parse(sessionStorage.data.offer);
  await rohit
    .addIceCandidate(parsedCandidate)
    .then(() => console.log("Added ICE candidate:", parsedCandidate))
    .catch((error) => console.error("Error adding ICE candidate:", error));
  // }

  // Set connection state listener
  rohit.onconnectionstatechange = (event) => {
    if (event.target.connectionState === "connected") {
      console.log(
        "Connected! You can now exchange messages with the other peer."
      );
      // Start your message exchange logic here
    }
  };

  // Store answer for potential future use (e.g., sending to server)
  if (lastAnswerSDP && lastAnswerSDP !== rohit.localDescription.sdp) {
    setAnswer(rohit.localDescription.sdp);
  }
}
