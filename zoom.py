from flask import Flask, request, jsonify
import requests

app = Flask(__name__)
PORT = 3000


@app.route("/create-meeting", methods=["POST"])
def create_meeting():
    req_data = request.get_json()
    api_key = req_data["apiKey"]
    api_secret = req_data["apiSecret"]

    # Zoom API endpoint to obtain access token
    token_url = "https://zoom.us/oauth/token"

    # Request data to obtain the access token
    data = {
        "grant_type": "client_credentials",
        "client_id": api_key,
        "client_secret": api_secret,
    }

    # Make a POST request to obtain the access token
    response = requests.post(token_url, data=data)
    if response.status_code == 200:
        access_token = response.json()["access_token"]

        # Zoom API endpoint to create a meeting
        create_meeting_url = "https://api.zoom.us/v2/users/me/meetings"

        # Request data to create the meeting
        meeting_data = {
            "topic": "Test meeting 7756",
            "type": 2,
            "start_time": "2023-07-30T5:10:00",
            "duration": "45",
            "timezone": "Dhaka",
            "recurrence": {"type": 1, "repeat_interval": 1},
            "settings": {
                "host_video": False,
                "participant_video": False,
                "join_before_host": False,
                "mute_upon_entry": True,
                "watermark": True,
                "audio": "voip",
                "auto_recording": "cloud",
                "waiting_room": True,
            },
        }

        # Make a POST request to create the meeting
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.post(create_meeting_url, json=meeting_data, headers=headers)
        if response.status_code == 201:
            meeting_link = response.json()["join_url"]
            return jsonify({"meetingLink": meeting_link})
        else:
            return (
                jsonify({"error": "Failed to create Zoom meeting."}),
                response.status_code,
            )
    else:
        return (
            jsonify({"error": "Failed to obtain access token."}),
            response.status_code,
        )


if __name__ == "__main__":
    app.run(port=PORT)
