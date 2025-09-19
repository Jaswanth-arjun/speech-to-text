const resultElement = document.getElementById("result");
let recognition;

function startConverting() {
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    setupRecognition(recognition);
    recognition.start();
  } else {
    alert("Speech Recognition not supported in this browser.");
  }
}

function setupRecognition(recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = function (event) {
    const { finalTranscript, interimTranscript } = processResult(event.results);

    // ✅ Better alignment and readability
    resultElement.innerHTML =
      `<div style="text-align:left; line-height:1.6; white-space:pre-wrap; word-wrap:break-word;">
        ${finalTranscript}<br><i style="color:gray;">${interimTranscript}</i>
      </div>`;
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = function () {
    console.log("Speech recognition stopped.");
  };
}

function processResult(results) {
  let finalTranscript = "";
  let interimTranscript = "";

  for (let i = 0; i < results.length; i++) {
    let transcript = results[i][0].transcript;
    transcript = transcript.replace(/\n/g, "<br>");
    if (results[i].isFinal) {
      finalTranscript += transcript + " "; // space between sentences
    } else {
      interimTranscript += transcript;
    }
  }

  return { finalTranscript, interimTranscript };
}

function stopConverting() {
  if (recognition) {
    recognition.stop();
  }
}
