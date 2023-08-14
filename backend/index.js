require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const user_id = process.env.SPOTIFY_USER_ID;
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// This is the rest api sending data to the frontend js
app.get("/data", async (req, res) => {
  try {
    // Example: Fetching playlists from Spotify API
    const tracks = await getPlayListTracks(req.query.type);
    // console.log(tracks);

    return res.json(tracks);
  } catch (error) {
    console.error("Error fetching data from the server:", error.message);
    res.status(500).json({ error: "Failed to fetch data from Spotify API" });
  }
});

const getToken = async () => {
  try {
    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      { grant_type: "client_credentials" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      }
    );
    return res?.data?.access_token;
  } catch (error) {
    return null;
  }
};

const getPlayLists = async () => {
  try {
    const token = await getToken();
    // console.log(`This is the token: ${token}`);

    const result = await axios(
      `https://api.spotify.com/v1/users/${user_id}/playlists`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("result.data.items ", result.data.items);

    return result.data.items;
  } catch (error) {
    return [];
  }
};

// ENSURE THAT type MATCHES WHAT YOU HAVE IN YOUR OBJECT
// WHEN YOUR SELECTS A CATEGORY PASS THE TYPE DOWN TO YOUR FUNCTION e.g getPlayListTracks("AFRO");
const getPlayListTracks = async (type) => {
  try {
    const token = await getToken();

    // CREATE AN OBJECT OF ALL THE ID
    const PLAY_LIST = {
      afro: "6JbyZoEh1UNSxXnBk7Vv8A",
      chill: "3ZCIou20italOXx8k7sgss",
      bars: "6RNVby9QMsZgoNatLQZ7Rh",
      soothing: "4KkoCy5gh0QgQ2e2RURXbW",
    };

    const playlists = await axios(
      `https://api.spotify.com/v1/playlists/${PLAY_LIST[type]}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const filteredList = playlists.data.tracks.items.filter((data) => {
      return data.track.preview_url !== null;
    });
    console.log("filteredList:", filteredList);
    const rand = Math.floor(Math.random() * filteredList.length);
    return filteredList[rand];

    // console.log("playlists ", playlists.data.tracks.items);
  } catch (error) {
    console.log(error);
    return error?.response?.data;
  }
};

// app.post("/track", async (req, res) => {
//   try {
//     // Example: Fetching playlists from Spotify API
//     const token = await getToken();
//     console.log(req.body);

//     const result = await axios(req.body.url, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log("track ", result.data);

//     return res.json(result.data);
//   } catch (error) {
//     console.error("Error fetching data from the server:", error.message);
//     res.status(500).json({ error: "Failed to fetch data from Spotify API" });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
