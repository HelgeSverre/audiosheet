interface AudioNodes {
  oscillator: OscillatorNode;
  gainNode: GainNode;
}

let audioContext: AudioContext;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    // noinspection TypeScriptUnresolvedReference
    // @ts-ignore
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

export function createOscillator(frequency: number, type: OscillatorType = "sine"): AudioNodes {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, ctx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();

  return { oscillator, gainNode };
}

export function playNote(frequency: number, duration: number = 0.1): void {
  const { oscillator, gainNode } = createOscillator(frequency);
  const ctx = getAudioContext();

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  setTimeout(() => {
    oscillator.stop();
    oscillator.disconnect();
    gainNode.disconnect();
  }, duration * 1000);
}
