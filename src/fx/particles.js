// Particle system — embers, magic sparks, blood drops, arcane runes
// Call ParticleSystem.init() once, then spawn particles anywhere

const canvas = document.createElement('canvas')
canvas.id = 'fx-canvas'
Object.assign(canvas.style, {
  position: 'fixed', inset: '0', width: '100%', height: '100%',
  pointerEvents: 'none', zIndex: '500'
})
document.body.appendChild(canvas)

const ctx = canvas.getContext('2d')
let W, H, particles = [], raf

function resize() {
  W = canvas.width  = window.innerWidth
  H = canvas.height = window.innerHeight
}
window.addEventListener('resize', resize)
resize()

const PRESETS = {
  ember: { r: [1,2], life: [60,120], vx: [-0.4,0.4], vy: [-1.5,-0.3], fade: true,
    colors: ['#ff6a00','#ff9500','#ffb347','#ff4500'] },
  magic: { r: [1.5,3], life: [40,80], vx: [-1.2,1.2], vy: [-1.8,0.2], fade: true,
    colors: ['#b97fff','#7c6dfa','#43e8c3','#fff5a0'] },
  blood: { r: [1.5,3], life: [30,60], vx: [-0.6,0.6], vy: [-2,-0.5], fade: true,
    colors: ['#8b0000','#c0392b','#e74c3c'] },
  rune:  { r: [2,4], life: [80,160], vx: [-0.2,0.2], vy: [-0.6,-0.1], fade: true,
    colors: ['#7c6dfa','#43e8c3','#fff'] },
  gold:  { r: [1,2.5], life: [50,100], vx: [-0.8,0.8], vy: [-2,-0.4], fade: true,
    colors: ['#ffd700','#ffb347','#fff5a0','#f7b731'] },
}

function rand(a, b) { return a + Math.random() * (b - a) }
function pick(arr)   { return arr[Math.floor(Math.random() * arr.length)] }

export function burst(x, y, preset = 'magic', count = 18) {
  const p = PRESETS[preset] || PRESETS.magic
  for (let i = 0; i < count; i++) {
    particles.push({
      x, y,
      vx: rand(...p.vx),
      vy: rand(...p.vy),
      r:  rand(...p.r),
      life: rand(...p.life),
      maxLife: 0,
      color: pick(p.colors),
      fade: p.fade,
      gravity: preset === 'blood' ? 0.08 : preset === 'ember' ? -0.02 : 0,
    })
    particles[particles.length - 1].maxLife = particles[particles.length - 1].life
  }
}

// Continuous ambient embers from a point
const ambientSources = []
export function addAmbient(x, y, preset = 'ember', rate = 0.3) {
  ambientSources.push({ x, y, preset, rate })
}
export function clearAmbient() { ambientSources.length = 0 }

function tick() {
  ctx.clearRect(0, 0, W, H)

  // spawn ambient
  for (const s of ambientSources) {
    if (Math.random() < s.rate) burst(s.x + rand(-8, 8), s.y + rand(-4, 4), s.preset, 1)
  }

  particles = particles.filter(p => p.life > 0)
  for (const p of particles) {
    p.x  += p.vx
    p.y  += p.vy
    p.vy += p.gravity || 0
    p.life--

    const alpha = p.fade ? p.life / p.maxLife : 1
    ctx.globalAlpha = alpha
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  raf = requestAnimationFrame(tick)
}
tick()

export default { burst, addAmbient, clearAmbient }
