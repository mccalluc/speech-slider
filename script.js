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
    sink.innerHTML += word + " ";
  }

  function getWords() {
    // Split on 1 or more non-word characters.
    return source.textContent.split(RegExp("\\W+"));
  }

  function speakFrom() {
    const words = getWords();
    const word = words[parseInt(timeline.value)];
    if (word) {
      speak(words[parseInt(timeline.value)], () => {
        if (playing) {
          timeline.value = parseInt(timeline.value) + 1;
          if (parseInt(timeline.value) < parseInt(timeline.max)) {
            speakFrom();
          } else {
            playing = false;
          }
        } 
      });
    }
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
    timeline.max = getWords().length - 1;
    timeline.value = 0;
  }

  source.onblur = updateTimeline;
  updateTimeline();
  sink.value = "";
})()