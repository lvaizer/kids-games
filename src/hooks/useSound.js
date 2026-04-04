export function playSuccess() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Quick two-note "ding ding" for correct answer
  [660, 880].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.25);
  });
}

export function playCheer() {
  // Play a cheerful fanfare
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.15);
    osc.stop(ctx.currentTime + i * 0.15 + 0.4);
  });

  // Say "Hooray!" with a high-pitched child-like voice
  if ('speechSynthesis' in window) {
    const sayHooray = () => {
      const utter = new SpeechSynthesisUtterance('Hooray! Hooray!');
      utter.rate = 1.3;
      utter.pitch = 2;
      utter.volume = 1;

      // Try to pick a child/female voice for a kid-like sound
      const voices = speechSynthesis.getVoices();
      const childVoice = voices.find(
        (v) => /kid|child/i.test(v.name)
      ) || voices.find(
        (v) => /female|samantha|karen|tessa/i.test(v.name)
      );
      if (childVoice) {
        utter.voice = childVoice;
      }

      speechSynthesis.speak(utter);
    };

    // Voices may not be loaded yet
    if (speechSynthesis.getVoices().length > 0) {
      sayHooray();
    } else {
      speechSynthesis.onvoiceschanged = sayHooray;
    }
  }
}
