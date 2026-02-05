(() => {
  const synth = window.speechSynthesis;
  const timeline = document.querySelector("#timeline");
  const source = document.querySelector("#source");
  const sink = document.querySelector("#sink");
  const readButton = document.querySelector("#read");

  function speak(word, onend) {
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
    sink.value += word + " ";
  }

  function getWords() {
    return source.value.split(" ");
  }

  function speakFrom() {
    const words = getWords()
    const index = parseInt(timeline.value);
    speak(words[index], () => {
      timeline.value = index + 1;
      if (parseInt(timeline.value) < parseInt(timeline.max)) {
        speakFrom();
      }
    })
  }

  readButton.onclick = (event) => {
    event.preventDefault();
    speakFrom();
  };

  function updateTimeline() {
    timeline.max = getWords().length;
    timeline.value = 0;
  }
  source.onchange = updateTimeline;
  updateTimeline();
  sink.value = "";
})()