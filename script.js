const synth = window.speechSynthesis;

function speak(word, onend) {
  console.log('speak:', word);
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.pitch = 1;
  utterance.rate = 0.8;

  utterance.onend = onend;

  utterance.onerror = function (event) {
    console.error("SpeechSynthesisUtterance.onerror");
  };

  synth.speak(utterance);
}

function speakAll(words) {
  speak(words[0], () => {
    const remaining = words.slice(1);
    if (remaining.length) {
      speakAll(remaining);
    }
  })
}

const inputForm = document.querySelector("form");
inputForm.onsubmit = function (event) {
  event.preventDefault();

  const words = document.querySelector("#source").value.split(" ");
  
  speakAll(words);
};
