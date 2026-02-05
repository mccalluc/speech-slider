(() => {
  const synth = window.speechSynthesis;
  const timeline = document.querySelector("#timeline");
  const source = document.querySelector("#source");
  const sink = document.querySelector("#sink");

  var playing = false;

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
    return source.value.split(RegExp("\\s+"));
  }

  function speakFrom() {
    const words = getWords()
    speak(words[parseInt(timeline.value)], () => {
      timeline.value = parseInt(timeline.value) + 1;
      if (playing) {
        if (parseInt(timeline.value) < parseInt(timeline.max)) {
          speakFrom();
        } else {
          playing = false;
        }
      } 
    });
  }

  timeline.onmousedown = (event) => {
    console.log("down");
    playing = false;
  }

  timeline.onmouseup = (event) => {
    console.log("up");
    playing = true;
    speakFrom();
  }

  function updateTimeline() {
    timeline.max = getWords().length;
    timeline.value = 0;
  }

  source.onchange = updateTimeline;
  updateTimeline();
  sink.value = "";
})()