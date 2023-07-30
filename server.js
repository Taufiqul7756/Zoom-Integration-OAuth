const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Endpoint to handle Zoom meeting creation
app.post("/create-meeting", (req, res) => {
  const { apiKey, apiSecret } = req.body;

  // Zoom API endpoint to obtain access token
  const tokenUrl = "https://zoom.us/oauth/token";

  // Request data to obtain the access token
  const data = new URLSearchParams();
  data.append("grant_type", "client_credentials");
  data.append("client_id", apiKey);
  data.append("client_secret", apiSecret);

  // Make a POST request to obtain the access token
  axios
    .post(tokenUrl, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then((response) => {
      const accessToken = response.data.access_token;

      // Zoom API endpoint to create a meeting
      const createMeetingUrl = "https://api.zoom.us/v2/users/me/meetings";

      // Request data to create the meeting
      const meetingData = {
        topic: "Zoom Meeting",
        type: 2,
        topic: "Test meeting 7756",
        start_time: "2023-07-30T5:10:00",
        duration: "45",
        timezone: "Dhaka",
        type: 2,
        recurrence: { type: 1, repeat_interval: 1 },
        settings: {
          host_video: "False",
          participant_video: "False",
          join_before_host: "False",
          mute_upon_entry: "true",
          watermark: "true",
          audio: "voip",
          auto_recording: "cloud",
          waiting_room: "true",
        },
      };

      // Make a POST request to create the meeting
      axios
        .post(createMeetingUrl, meetingData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const meetingLink = response.data.join_url;
          res.json({ meetingLink });
        })
        .catch((error) => {
          console.error("Error creating Zoom meeting:", error);
          res.json({ error: "Failed to create Zoom meeting." });
        });
    })
    .catch((error) => {
      console.error("Error obtaining access token:", error);
      res.json({ error: "Failed to obtain access token." });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const express = require("express");
// const axios = require("axios");
// const app = express();
// const PORT = 3000;

// app.use(express.json());
// app.use(express.static("public"));

// app.post("/create-meeting", async (req, res) => {
//   const { apiKey, apiSecret } = req.body;

//   // Implement your OAuth logic here to get the access token
//   // Replace 'YOUR_OAUTH_ACCESS_TOKEN' with the actual access token
//   const accessToken = "https://zoom.us/oauth/token";
//   const accessAuth = "https://zoom.us/oauth/authorize";

//   try {
//     const meetingDetails = {
//       topic: "Final Test Meeting",
//       type: 2,
//       start_time: "2023-07-30T1:20:00",
//       timezone: "Dhaka",
//       duration: "45",
//       settings: {
//         host_video: false,
//         participant_video: false,
//         join_before_host: true,
//         mute_upon_entry: true,
//         watermarks: true,
//         audio: "voip",
//         audio_recording: "cloud",
//         waiting_room: true,
//       },
//     };

//     const response = await axios.post(
//       "https://api.zoom.us/v2/users/me/meetings",
//       meetingDetails,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken} ${accessAuth}  `,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Meeting details:", response.data);
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error creating meeting:", error.response.data);
//     res.status(error.response.status).json(error.response.data);
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
