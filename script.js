const synth = window.speechSynthesis;
const timeline = document.querySelector("#timeline");
const source = document.querySelector("#source");

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
    timeline.value = timeline.max - remaining.length;
    if (remaining.length) {
      speakAll(remaining);
    }
  })
}

document.querySelector("form").onsubmit = (event) => {
  event.preventDefault();
  timeline.max = source.value.split(" ").length
  const words = source.value.split(" ");
  speakAll(words);
};
