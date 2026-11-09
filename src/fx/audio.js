// Web Audio API — zero external files, all generated tones
// Sounds: sword swing, spell cast, hit, boss roar, level up, die, menu click

let ctx = null
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function osc(type, freq, start, dur, gain = 0.3, fadeOut = true) {
  const ac = getCtx()
  const o = ac.createOscillator()
  const g = ac.createGain()
  o.connect(g); g.connect(ac.destination)
  o.type = type
  o.frequency.setValueAtTime(freq, ac.currentTime + start)
  g.gain.setValueAtTime(gain, ac.currentTime + start)
  if (fadeOut) g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur)
  o.start(ac.currentTime + start)
  o.stop(ac.currentTime + start + dur + 0.05)
}

function noise(dur, gain = 0.15) {
  const ac = getCtx()
  const bufSize = ac.sampleRate * dur
  const buf = ac.createBuffer(1, bufSize, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
  const src = ac.createBufferSource()
  src.buffer = buf
  const g = ac.createGain()
  src.connect(g); g.connect(ac.destination)
  g.gain.setValueAtTime(gain, ac.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur)
  src.start()
  src.stop(ac.currentTime + dur + 0.05)
}

export const SFX = {
  click() {
    osc('sine', 880, 0, 0.08, 0.12)
    osc('sine', 660, 0.02, 0.06, 0.06)
  },
  sword() {
    noise(0.12, 0.25)
    osc('sawtooth', 180, 0, 0.18, 0.1)
    osc('sawtooth', 90, 0.04, 0.14, 0.08)
  },
  hit() {
    noise(0.08, 0.3)
    osc('square', 120, 0, 0.12, 0.15)
  },
  spell() {
    osc('sine', 440, 0, 0.05, 0.1)
    osc('sine', 880, 0.04, 0.12, 0.15)
    osc('sine', 1320, 0.08, 0.2, 0.1)
    osc('triangle', 660, 0.1, 0.25, 0.08)
  },
  bossRoar() {
    osc('sawtooth', 60, 0, 0.4, 0.2)
    osc('sawtooth', 45, 0.05, 0.5, 0.25)
    noise(0.3, 0.15)
    osc('square', 30, 0.1, 0.6, 0.1)
  },
  levelUp() {
    const notes = [261.63, 329.63, 392, 523.25]
    notes.forEach((f, i) => osc('triangle', f, i * 0.1, 0.3, 0.18))
  },
  die() {
    osc('sawtooth', 200, 0, 0.1, 0.2)
    osc('sawtooth', 150, 0.08, 0.15, 0.18)
    osc('sawtooth', 80, 0.18, 0.4, 0.15)
    noise(0.4, 0.1)
  },
  victory() {
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]
    const times   = [0, 0.12, 0.24, 0.36, 0.54, 0.66]
    fanfare.forEach((f, i) => osc('triangle', f, times[i], 0.3, 0.2))
  },
  menuOpen() {
    osc('sine', 440, 0, 0.06, 0.1)
    osc('sine', 550, 0.05, 0.08, 0.08)
  },
  diceRoll() {
    for (let i = 0; i < 6; i++) {
      const t = i * 0.04 + Math.random() * 0.02
      noise(0.04, 0.12 - i * 0.015)
    }
  },
  critHit() {
    noise(0.06, 0.35)
    osc('square', 200, 0, 0.06, 0.2)
    osc('sine', 880, 0.04, 0.25, 0.18)
    osc('sine', 1320, 0.1, 0.2, 0.12)
  },
}

export default SFX
