import React, { useState, useEffect } from "react";
import "../styles/Meet.css";
import { startMeeting, sendFinalSDPOffer } from "./MeetActions";
import { joinMeeting } from "./JoinActions";
import StompProvider from "../components/StompProvider";

const Meet = () => {
  const [offer, setOffer] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [meetID, setMeetID] = useState(null);
  let lastSDP = null;
  let lastAnswerSDP = null;

  async function handleStartMeeting() {
    await startMeeting(
      new RTCPeerConnection(),
      offer,
      setOffer,
      lastSDP,
      sendFinalSDPOffer
    );
  }

  async function handleJoinMeeting() {
    const rohit = new RTCPeerConnection();
    await joinMeeting(rohit, setAnswer, lastAnswerSDP);
  }

  return (
    <div className="meet-container">
    <StompProvider />
      <div className="left-container">
        <div className="meeting-btn">
          <button className="blank-button" onClick={handleStartMeeting}>
            <span className="plus-sign">+ </span>Start Meeting
          </button>
          <button className="filled-button" onClick={handleJoinMeeting}>
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Meet;
