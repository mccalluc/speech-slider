(() => {
  const synth = window.speechSynthesis;
  const timeline = document.querySelector("#timeline");
  const source = document.querySelector("#source");
  const sink = document.querySelector("#sink");

  var playing = false;

  // Helpers:

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
    sink.scroll({top: sink.scrollHeight});
  }

  function getWordSpans() {
    return document.getElementsByTagName("span");
  }

  function clearHighlights() {
    const highlights = document.getElementsByClassName("current");
    for (el of highlights) {
      el.className = "";
    }
  }

  function speakFrom() {
    const wordSpans = getWordSpans();
    const index = parseInt(timeline.value);
    const word = wordSpans[index].textContent;
    document.getElementById(index).className = "current";
    if (word) {
      speak(word, () => {
        clearHighlights();
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

  // Timeline event handlers:

  timeline.onmousedown = (event) => {
    playing = false;
    updateTimeline();
  }

  timeline.oninput = () => {
    // Just for updating display.
    clearHighlights();
    const index = parseInt(timeline.value);
    document.getElementById(index).className = "current";
  }

  timeline.onmouseup = (event) => {
    clearHighlights()
    playing = true;
    speakFrom();
  }

  timeline.ontouchstart = timeline.onmousedown;
  timeline.ontouchend = timeline.onmouseup;

  // Source text event handlers:

  function updateTimeline() {
    console.log('updateTimeline');
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
    timeline.max = index;
    timeline.value = 0;
  }

  // Startup:

  updateTimeline();
  sink.value = "";
})()