import React, { useState } from "react";
import "../styles/Meet.css";
import Signal from "../apis/SignallingApi";

const Meet = () => {
  const [offer, setOffer] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [meetID, setMeetID] = useState(null);
  let lastSDP = null;
  let lastAnswerSDP = null;

  async function startMeeting() {
    const sunflower = new RTCPeerConnection();
    const dataChannel = sunflower.createDataChannel("channel");

    dataChannel.onmessage = (e) => console.log("Just got a message: " + e.data);

    dataChannel.onopen = async (e) => {
      console.log("Data channel opened!");
      console.log("Message sender is ready...");

      // this prompt used below blocks onmessage fucntion

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
        console.log("New Ice Candidate! reprinting SDP" + newOffer);
        setOffer(newOffer);
        lastSDP = newOffer;

        console.log("Final SDP:", newOffer);
      } else {
        let currMeetID = null;
        if (lastSDP) {
          currMeetID = await sendFinalSDPOffer(lastSDP);
          console.log("Current Meet ID:", currMeetID);
        }

        const remoteAnswer = prompt("Enter remote answer: ");
        console.log("Remote answer is: ", remoteAnswer);

        await sunflower.setRemoteDescription(JSON.parse(remoteAnswer));
      }
    };

    await sunflower
      .createOffer()
      .then((o) => sunflower.setLocalDescription(o))
      .then((s) => console.log("Set successfully!"));
  }

  async function sendFinalSDPOffer(finalSDP) {
    if (offer) finalSDP = offer;

    console.log("Sending final SDP: ", finalSDP);
    const signalingMessage = await Signal.saveOffer(JSON.parse(finalSDP));

    const localSessionOffer = JSON.parse(signalingMessage.data.offer);
    const sessionID = signalingMessage.data.sessionStorageId;

    console.log("Saved and session storage id is: ", sessionID);
    console.log("Saved and session offer is: ", localSessionOffer);

    return sessionID;
  }

  async function joinMeeting() {
    const inputSessionID = prompt("Enter meet ID: ");
    const sessionStorage = await Signal.getOffer(inputSessionID);

    console.log("Remote offer is: ", sessionStorage);
    const remoteOffer = JSON.parse(sessionStorage.data.offer);
    const sessionID = sessionStorage.data.sessionStorageId;

    const rohit = new RTCPeerConnection();

    rohit.onicecandidate = async (e) => {
      if (e.candidate) {
        const localAnswer = JSON.stringify(rohit.localDescription);
        console.log("New Ice Candidate! Reprinting SDP" + localAnswer);
        setAnswer(localAnswer);
        lastAnswerSDP = localAnswer;

        console.log("Final answer SDP:", localAnswer);
      } else {
        if (lastAnswerSDP) await sendFinalSDPAnswer(lastAnswerSDP);
      }
    };

    await rohit
      .setRemoteDescription(remoteOffer)
      .then((a) => console.log("Offer set"));

    await rohit
      .createAnswer()
      .then((o) => rohit.setLocalDescription(o))
      .then((s) => console.log("Set successfully!"));
  }

  async function sendFinalSDPAnswer(lastAnswerSDP) {
    if (lastAnswerSDP) {
      console.log("Sending final answer SDP: ", lastAnswerSDP);
      const signalingMessage = await Signal.saveAnswer(
        JSON.parse(lastAnswerSDP)
      );

      const localSessionAnswer = JSON.parse(signalingMessage.data.answer);
      const sessionID = signalingMessage.data.sessionStorageId;
      setMeetID(sessionID);

      console.log("Saved and session storage id is: ", sessionID);
      console.log("Saved and session answer is: ", localSessionAnswer);
    }
  }

  return (
    <div className="meet-container">
      <div className="left-container">
        <div className="meeting-btn">
          <button className="blank-button" onClick={startMeeting}>
            <span className="plus-sign">+ </span>Start Meeting
          </button>
          <button className="filled-button" onClick={joinMeeting}>
            Join Meeting
          </button>
        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
};

export default Meet;
