let stream = null,
	uploadStream=null,
	audio = null,
	mixedStream = null,
	chunks = [],
	recorder = null
startBtn = null,
	stopBtn = null,
	downloadBtn = null,
	recordedVideo = null;
	uploadBtn = null;

async function setupStream() {
	try {
		stream = await navigator.mediaDevices.getDisplayMedia({
			video: true,
			systemAudio: "include"
		});

		audio = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				sampleRate: 44100,
			},
		});

		setupVideoFeedback();
	} catch (err) {
		console.error(err)
	}
}

function setupVideoFeedback() {
	if (stream) {
		const video = document.querySelector('.video-feedback');
		video.srcObject = stream;
		video.play();
	} else {
		console.warn('No stream available');
	}
}

async function startRecording() {
	await setupStream();

	if (stream && audio) {
		mixedStream = new MediaStream([...stream.getTracks(), ...audio.getTracks()]);
		recorder = new MediaRecorder(mixedStream);
		recorder.ondataavailable = handleDataAvailable;
		recorder.onstop = handleStop;
		recorder.start(1000);

		startBtn.disabled = true;
		stopBtn.disabled = false;

		console.log('Recording started');
	} else {
		console.warn('No stream available.');
	}
}

function stopRecording() {
	recorder.stop();

	startBtn.disabled = false;
	stopBtn.disabled = true;
}

function handleDataAvailable(e) {
	chunks.push(e.data);
}

function handleStop(e) {
	uploadStream=e.target.stream;
	// const blob = new Blob(chunks, { 'type': 'video/mp4' });
	// chunks = [];

	// // downloadBtn.href = URL.createObjectURL(blob);

	// // downloadBtn.download = 'video.mp4';
	// // downloadBtn.disabled = false;

	// recordedVideo.src = URL.createObjectURL(blob);
	// recordedVideo.load();
	// recordedVideo.onloadeddata = function () {
	// 	rc.classList.remove("hidden");
	// 	const rc = document.querySelector(".recorded-video-wrap");
	// 	rc.scrollIntoView({ behavior: "smooth", block: "start" });
	// // 	recordedVideo.play();
	// }

	stream.getTracks().forEach((track) => track.stop());
	audio.getTracks().forEach((track) => track.stop());
	upload();
	console.log('Recording stopped');
}

window.addEventListener('load', () => {
	startBtn = document.querySelector('.start-recording');
	stopBtn = document.querySelector('.stop-recording');
	downloadBtn = document.querySelector('.download-video');
	recordedVideo = document.querySelector('.recorded-video');

	uploadVideo = document.querySelector('.upload-video');

	startBtn.addEventListener('click', startRecording);
	stopBtn.addEventListener('click', stopRecording);
})

var input = document.querySelector('input[type="file"]')

const upload=()=>{
	const fileName=prompt("Enter file name");
	const token=document.cookie.split(';').find(x=>x.includes('token'));
	console.log(token)
	fetch('/', {
		method: 'POST',
		body: {upStream: uploadStream, fileName:fileName,token:token}
	  }).then((res)=>{
		console.log(res)
	  }).catch((err)=>console.log(err))
	  alert("You file we be available soon in the notes section")
}
