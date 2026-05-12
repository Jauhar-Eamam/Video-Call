import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);

  const [meetings, setMeetings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHistory();
  }, []);

  let formateDate = (dateString) => {
    let date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1 ).toString().padStart(2, "0");
    const year = date.getFullYear();

    return(`${day}/${month}/${year}`)
  }

  return (
    <div>
      <IconButton onClick={() => navigate("/home")}>
        <HomeIcon sx={{

    "&:hover": {
      color: "skyBlue",
    },
  }} />
      </IconButton>

      {meetings.length > 0 ? (
        <div>
          {" "}
          {meetings.map((meeting) => {
            return (
              <React.Fragment key={meeting._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      gutterBottom
                      sx={{ color: "text.secondary", fontSize: 14 }}
                    >
                      Meeting Code
                    </Typography>

                    <Typography sx={{ color: "text.primary", mb: 1.5, fontWeight: "bold" }}>
                      {meeting.meetingCode}
                    </Typography>

                    <Typography variant="body2">
                      User: {meeting.user_id}
                      <br />
                      Created: {formateDate(meeting.date)}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button size="small">Remove History</Button>
                  </CardActions>
                </Card>
              </React.Fragment>
            );
          })}{" "}
        </div>
      ) : (
        <div style={{ padding: "20px" }}>
          <Typography>No meetings in history</Typography>
        </div>
      )}
    </div>
  );
}
