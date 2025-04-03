/*const Assemblyai=require('assemblyai')
require('dotenv').config();
const client = new Assemblyai({
    apiKey: "ac415299e77141c288145bc5566c12ee",
  });
  
const audio='./voice/example.mp3';
const run = async () => {
    const transcript = await client.transcripts.transcribe(audio);
    console.log(transcript.text);
  };
  run()*/
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const API_KEY = "ac415299e77141c288145bc5566c12ee"
const API_URL = "https://api.assemblyai.com/v2";
const AUDIO_FILE_PATH = "./voice/example2.mp3";

const transcribeAudio = async () => {
    try {
        // Read and upload audio file
        const file = fs.readFileSync(AUDIO_FILE_PATH);
        const uploadResponse = await axios.post(`${API_URL}/upload`, file, {
            headers: { Authorization: API_KEY, "Content-Type": "application/octet-stream" },
        });

        // Submit for transcription
        const transcriptResponse = await axios.post(
            `${API_URL}/transcript`,
            { audio_url: uploadResponse.data.upload_url,
                language_code: "hi",
                translate_to: ["en"] 
             },
            { headers: { Authorization: API_KEY, "Content-Type": "application/json" } }
        );

        console.log("Transcription ID:", transcriptResponse.data.id);

        // Polling for completion
        let status = "queued";
        while (status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            const transcriptCheck = await axios.get(`${API_URL}/transcript/${transcriptResponse.data.id}`, {
                headers: { Authorization: API_KEY },
            });

            status = transcriptCheck.data.status;
            if (status === "completed") {
                console.log("Transcription:", transcriptCheck.data.text);
                return;
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

transcribeAudio();

