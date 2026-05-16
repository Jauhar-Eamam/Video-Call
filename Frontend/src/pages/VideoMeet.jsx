import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/VideoMeet.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { io } from "socket.io-client";
import IconButton from "@mui/material/IconButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import Badge from "@mui/material/Badge";
import ChatIcon from "@mui/icons-material/Chat";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import SendIcon from "@mui/icons-material/Send";
import meetingImg from "../assets/meetingImg2.png";
import HistoryIcon from "@mui/icons-material/History";
import { Navigate, useNavigate } from "react-router-dom";

import server from "../environment";

const server_url = server;

let connections = {};

const peerConfigconnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  let socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState();
  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModel, setShowModel] = useState(false);

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState();

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  const messagesEndRef = useRef(null);

  let navigate = useNavigate();

  // todo
  // if(isChrom == true){}

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  const getPermission = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });

        if (userMediaStream) {
          window.localStream = userMediaStream;

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.log(err);
    }

    window.localStream = stream;

    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id]
        .createOffer()
        .then((description) => {
          connections[id]
            .setLocalDescription(description)
            .then(() => {
              socketRef.current.emit(
                "signal",
                id,
                JSON.stringify({ sdp: connections[id].localDescription }),
              );
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();

            tracks.forEach((track) => track.stop());
          } catch (err) {
            console.log(err);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;
          for (let id in connections) {
            connections[id].addStream(window.localStream);
            connections[id]
              .createOffer()
              .then((description) => {
                connections[id]
                  .setLocalDescription(description)
                  .then(() => {
                    socketIdRef.current.emit(
                      "signal",
                      id,
                      JSON.stringify({ sdp: connections[id].localDescription }),
                    );
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          }
        }),
    );
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = "640px", height = "480px" }) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });

    canvas.getContext("2d").fillRect(0, 0, width, height);

    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  let gotMessageFromServer = (fromId, message) => {

    let signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
      }

      if (signal.ice) {
        if (connections[fromId].remoteDescription) {
          connections[fromId]
            .addIceCandidate(new RTCIceCandidate(signal.ice))
            .catch((err) => console.log(err));
        }
      }
    }
  };

  // TODO
  let addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessage) => [
      ...prevMessage,
      { sender: sender, data: data },
    ]);

    

      if (socketIdSender !== socketIdRef.current) {
        if(!showModel){
        setNewMessages((prevMsg) => prevMsg + 1);
    }}
    
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);

      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => {
          return videos.filter((video) => video.socketId !== id);
        });
      });

      socketRef.current.on("user-joined", (id, clints) => {

        clints.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigconnections,
          );

          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate !== null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            let videoExist = videoRef.current.find(
              (video) => video.socketId === socketListId,
            );

            if (videoExist) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) => {
                  return video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video;
                });

                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsInline: true,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (err) {
              console.log(err);
            }

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription }),
                  );
                })
                .catch((err) => console.log(err));
            });
          }
        }
      });
    });
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
    // let random = Math.random().toString(36).slice(2);
    // let url = `meet-${random}`;
    // navigate(`/${url}`);
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  let getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.log(err);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);
      connections[id]
        .createOffer()
        .then((description) => {
          connections[id]
            .setLocalDescription(description)
            .then(() => {
              socketRef.current.emit(
                "signal",
                id,
                JSON.stringify({ sdp: connections[id].localDescription }),
              );
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = async () => {
          setScreen(false);

          try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });

            window.localStream = cameraStream;

            localVideoRef.current.srcObject = cameraStream;

            for (let id in connections) {
              connections[id].addStream(cameraStream);

              connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description).then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({
                      sdp: connections[id].localDescription,
                    }),
                  );
                });
              });
            }
          } catch (err) {
            console.log(err);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        }),
    );
  };

  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          .then((stream) => {})
          .catch((err) => console.log(err));
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleShowModel = async () => {
    if(!showModel){
      setShowModel(!showModel);
      setNewMessages(0)
    }else {
      setShowModel(!showModel);
    }
    
  };

  let handleMessage = () => {
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  let handleEndCall = () => {
    try{

      let tracks = localVideoRef.current.srcObject.getTracks();

      tracks.forEach((track) => track.stop());

    }catch(err){console.log(err);
    }

    navigate("/home")

  }

  return (
    <div>
      {askForUsername === true ? (
        <div className={styles.lobbyContainer}>
          <div className={styles.navDiv}>
            <nav className={styles.navBar}>
              <div>
                <h1>Apna Video Call</h1>
              </div>
              <div className={styles.historycomponent}>
                <p>
                  <HistoryIcon onClick={() => navigate("/history")} />
                  History{" "}
                  <span
                    style={{ color: "#01c0c0" }}
                    onClick={() => {localStorage.removeItem("token") 
                    navigate("/")}}
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
                label="username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button
                className={styles.connectButton}
                variant="contained"
                onClick={connect}
              >
                Connect
              </Button>
            </div>

            <div className={styles.heroImg}>
              <img src={meetingImg} alt="" />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.meetVideoContainer}>
          {showModel ? (
            <div className={styles.chatRoom}>
              <h1 className={styles.chatText}>Chat</h1>

              {messages.length > 0 ? (
                <div className={styles.chattingDispaly}>
                  {messages.map((item, index) => {
                    return (
                      <div
                        key={index}
                        style={{ marginBottom: 10, marginLeft: 10 }}
                      >
                        <p style={{ fontWeight: "bold", fontSize: "10px", fontStyle: "initial" }}>{item.sender}</p>
                        <p>{item.data}</p>
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef}></div>
                </div>
              ) : (
                <></>
              )}

              <div className={styles.inputField}>
                <TextField
                  className={styles.chatInput}
                  id="outlined-basic"
                  variant="outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write here..."
                />
                <IconButton onClick={handleMessage} className={styles.sendMessageIcon}>
                  <SendIcon  />
                </IconButton>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className={styles.buttonContainer}>
            <IconButton onClick={handleVideo} style={{ color: "white" }}>
              {video === true ? <VideocamOffIcon /> : <VideocamIcon />}
            </IconButton>

            <IconButton onClick={handleEndCall} style={{ backgroundColor: "white", color: "red" }}>
              <CallEndIcon />
            </IconButton>

            <IconButton onClick={handleAudio} style={{ color: "white" }}>
              {audio === true ? <MicOffIcon /> : <MicIcon />}
            </IconButton>

            <IconButton onClick={handleScreen} style={{ color: "white" }}>
              {screen == true ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            </IconButton>

            <Badge
              className={styles.badgeIcon}
              badgeContent={newMessages}
              max={999}
              color="secondary"
              style={{ color: "orange", fontSize: "16px" }}
            >
              {!showModel ? (
                <ChatIcon
                  onClick={handleShowModel}
                  style={{ color: "white" }}
                />
              ) : (
                <SpeakerNotesOffIcon
                  onClick={handleShowModel}
                  style={{ color: "white" }}
                />
              )}
            </Badge>
          </div>

          <video
            className={styles.meetUserVideo}
            ref={localVideoRef}
            autoPlay
            muted
          ></video>

          <div className={styles.confrenceView}>
            {videos.map((video) => (
              <div key={video.socketId}>
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  
                ></video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
