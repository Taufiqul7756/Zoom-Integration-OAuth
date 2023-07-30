document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submitButton");
  const apiKeyInput = document.getElementById("apiKey");
  const apiSecretInput = document.getElementById("apiSecret");
  console.log(apiKeyInput);
  console.log(apiSecretInput);

  submitButton.addEventListener("click", () => {
    const apiKey = apiKeyInput.value;
    const apiSecret = apiSecretInput.value;

    if (apiKey === "" || apiSecret === "") {
      alert("Please enter your API Key and API Secret.");
      return;
    }

    // Call the server to create a Zoom meeting
    createZoomMeeting(apiKey, apiSecret);
  });

  const createZoomMeeting = (apiKey, apiSecret) => {
    // Make a POST request to the server to create the Zoom meeting
    fetch("/create-meeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey, apiSecret }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        if (data.error) {
          alert(data.error);
        } else {
          alert(
            console.log(
              data.meetingLink
            )`Zoom meeting created successfully. Meeting link: ${data.meetingLink}`
          );
        }
      })
      .catch((error) => {
        alert("An error occurred while creating the Zoom meeting.");
        console.error(error);
      });
  };
});

// document
//   .getElementById("submitButton")
//   .addEventListener("click", createZoomMeeting);

// async function createZoomMeeting() {
//   try {
//     const response = await axios.post("/create-meeting", { apiKey, apiSecret });
//     console.log("Meeting created:", response.data);
//     alert("Meeting created successfully!");
//   } catch (error) {
//     console.error("Error creating meeting:", error);
//     alert(
//       "Failed to create meeting. Please check your API Key and API Secret."
//     );
//   }
// }
