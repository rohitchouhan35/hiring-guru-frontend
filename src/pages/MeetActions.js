import Signal from "../apis/SignallingApi";
import CopyButtonText from "../components/CopyButtonText";

export async function startMeeting(
  sunflower,
  offer,
  setOffer,
  lastSDP,
  sendFinalSDPOffer
) {
  var dataChannel = sunflower.createDataChannel("channel");
  let currMeetID = null;

  dataChannel.onmessage = (e) => console.log("Just got a message: " + e.data);

  dataChannel.onopen = async (e) => {
    console.log("Data channel opened!");
    console.log("Message sender is ready...");

    async function sendMessage() {
      const messageToSend = prompt("Enter a message to send or type 'quit'");
      if (messageToSend !== "quit" && dataChannel.readyState === "open") {
        dataChannel.send(messageToSend);
        await sendMessage();
      } else {
        console.log('Data channel is closed or "quit" command entered.');
      }
    }

    // Start the asynchronous loop
    await sendMessage();
  };

  sunflower.onicecandidate = async (e) => {
    if (e.candidate) {
      const newOffer = JSON.stringify(sunflower.localDescription);
      console.log("New Ice Candidate! Reprinting SDP" + newOffer);
      setOffer(newOffer);
      lastSDP = newOffer;

      console.log("Final SDP:", newOffer);
    } else {
      if (lastSDP) {
        currMeetID = await sendFinalSDPOffer(lastSDP);
        console.log("Current Meet ID:", currMeetID);
        // apply logic to pop up a tect with copy button with this id
        const sharableLink = currMeetID;
        <div>
          {currMeetID && <CopyButtonText sharableLink={sharableLink} />}
        </div>;
      }

      // const sid = prompt("Enter remote answer: ");
      alert("Press OK to connect");

      const sessionStorage = await Signal.getAnswer(currMeetID);
      const remoteAnswer = JSON.parse(sessionStorage.data.answer);

      await sunflower.setRemoteDescription(remoteAnswer);
    }
  };

  await sunflower
    .createOffer()
    .then((o) => sunflower.setLocalDescription(o))
    .then((s) => console.log("Set successfully!"));
}

export async function sendFinalSDPOffer(finalSDP) {
  //   if (offer) finalSDP = offer;

  console.log("Sending final SDP: ", finalSDP);
  const signalingMessage = await Signal.saveOffer(JSON.parse(finalSDP));

  const localSessionOffer = JSON.parse(signalingMessage.data.offer);
  const sessionID = signalingMessage.data.sessionStorageId;

  console.log("Saved and session storage id is: ", sessionID);
  console.log("Saved and session offer is: ", localSessionOffer);

  return sessionID;
}
