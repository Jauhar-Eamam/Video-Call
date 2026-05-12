import withAuth from "../utils/withAuth";
import styles from "../styles/VideoMeet.module.css";
import meetingRoomImg from "../assets/homeImg.png";
import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { io } from "socket.io-client";
import IconButton from "@mui/material/IconButton";
import HistoryIcon from "@mui/icons-material/History";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function HomePage() {
  const navigate = useNavigate();

  const { addToUserHistory } = useContext(AuthContext);

  const [meetingCode, setMeetingCode] = useState("");

  const handleVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <div className={styles.lobbyContainer}>
      <div className={styles.navDiv}>
        <nav className={styles.navBar}>
          <div>
            <h1 onClick={() => navigate("/")}>Apna Video Call</h1>
          </div>
          <div className={styles.historycomponent}>
            <p>
              <HistoryIcon onClick={() => navigate("/history")} />
              History{" "}
              <span
                style={{ color: "#01c0c0" }}
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
              >
                LOGOUT
              </span>{" "}
            </p>
          </div>
        </nav>
      </div>

      <div>
        <div>
          <h1 className={styles.textContent}>
            Providing Quality Video Call By{" "}
            <span style={{ color: "orange" }}>Eamam</span>
          </h1>
          <h2 className={styles.lobbyTitle}>Enter into Lobby</h2>
          <TextField
            className={styles.usernameInput}
            id="outlined-basic"
            label="Meeting Code"
            variant="outlined"
            // value={username}
            onChange={(e) => setMeetingCode(e.target.value)}
          />
          <Button
            className={styles.connectButton}
            variant="contained"
            onClick={handleVideoCall}
          >
            Connect
          </Button>
        </div>

        <div className={styles.hero1Img}>
          <img src={meetingRoomImg} alt="" />
        </div>
      </div>
    </div>
  );
}

export default withAuth(HomePage);
