const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");
const message = document.getElementById("preview-message");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording.webm";
    document.body.appendChild(a);
    a.click();
};

const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop();
};

const handleStart = () => {
    try {
        startBtn.innerText = "Stop Recording";
        startBtn.removeEventListener("click", handleStart);
        startBtn.addEventListener("click", handleStop);
        recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        recorder.ondataavailable = (event) => {
            videoFile = URL.createObjectURL(event.data);
            video.srcObject = null;
            video.src = videoFile;
            video.loop = true;
            video.play();
        };
        recorder.start();
    } catch (error) {
        console.log(error)
    }
};

const init = async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true,
        });
        video.srcObject = stream;
        video.play();
    } catch (error) {
        if (error.name === 'NotFoundError') {
            startBtn.style.display = 'none';
            message.innerText = 'No Recorder Founded';
        }
    }
};

init();

startBtn.addEventListener("click", handleStart);