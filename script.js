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
    const index = parseInt(timeline.value);
    const word = words[index];
    const span = document.getElementById(index);
    span.className = "current";
    if (word) {
      speak(word, () => {
        span.className = "";
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
    playing = false;
  }

  timeline.onmouseup = (event) => {
    playing = true;
    speakFrom();
  }

  function updateTimeline() {
    const sourceText = source.textContent;
    source.innerHTML = "";
    var index = 0;
    for (match of sourceText.matchAll(RegExp("(\\w+)(\\W+|$)", "g")).toArray()) {
      const span = document.createElement("span");
      span.textContent = match[1];
      span.id = index.toString();
      const text = document.createTextNode(match[2]);
      source.appendChild(span);
      source.appendChild(text);
      index++;
    }
    timeline.max = getWords().length - 1;
    timeline.value = 0;
  }

  source.onblur = updateTimeline;
  updateTimeline();
  sink.value = "";
})()