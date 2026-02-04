const synth = window.speechSynthesis;

function speak(word, onend) {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.pitch = 1;
  utterance.rate = 0.8;

  utterance.onend = onend

  utterance.onerror = function (event) {
    console.error("SpeechSynthesisUtterance.onerror");
  };

  synth.speak(utterance);

}

const inputForm = document.querySelector("form");
inputForm.onsubmit = function (event) {
  event.preventDefault();

  speak("This",
    () => speak("is",
      () => speak("a",
        () => speak("test")
      )
    )
  );
};
