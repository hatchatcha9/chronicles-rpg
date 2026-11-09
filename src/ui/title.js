// Title screen

import { game } from '../game/engine.js'
import { gi, I } from '../icons.js'

export function mountTitle(container) {
  container.innerHTML = `
    <div id="title-screen" class="screen active">
      <canvas id="title-canvas"></canvas>
      <div class="title-content">
        <div class="title-sigil">${gi(I.SWORD, 36, 'c8a030')}</div>
        <h1 class="title-heading">CHRONICLES<br/><span class="title-sub">OF THE</span><br/>SHATTERED REALM</h1>
        <p class="title-tagline">Three campaigns. Fourteen classes. One fate.</p>
        <div class="title-buttons">
          ${game.hasSave() ? '<button class="btn-fantasy btn-primary" id="btn-continue">Continue Journey</button>' : ''}
          <button class="btn-fantasy btn-primary" id="btn-new">Begin Campaign</button>
          ${game.hasSave() ? '<button class="btn-fantasy btn-ghost" id="btn-new-reset">New Campaign</button>' : ''}
        </div>
        <div class="title-lore">
          <p>"The realm has known three great wounds: a kingdom swallowed by undeath,<br/>a forest that forgot what it was, and a tower that shattered time itself."</p>
        </div>
      </div>
    </div>
  `

  // Animated title canvas
  const canvas = document.getElementById('title-canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  let frame = 0
  let raf

  function drawTitle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const w = canvas.width, h = canvas.height

    // Deep dark gradient
    const bg = ctx.createLinearGradient(0, 0, 0, h)
    bg.addColorStop(0, '#0a0810')
    bg.addColorStop(0.5, '#050510')
    bg.addColorStop(1, '#080508')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // Stars
    for (let i = 0; i < 80; i++) {
      const sx = (i * 137.5) % w
      const sy = (i * 89.3) % h
      const sA = 0.2 + Math.sin(frame * 0.03 + i * 0.5) * 0.15
      ctx.globalAlpha = sA
      ctx.fillStyle = i % 7 === 0 ? '#9988cc' : '#ffffff'
      ctx.fillRect(sx, sy, i % 5 === 0 ? 2 : 1.5, i % 5 === 0 ? 2 : 1.5)
      ctx.globalAlpha = 1
    }

    // Three campaign color wisps (one per campaign)
    const wisps = [
      { cx: w * 0.2, cy: h * 0.6, col: '#4411aa', campaign: 'undead' },
      { cx: w * 0.5, cy: h * 0.7, col: '#224411', campaign: 'forest' },
      { cx: w * 0.8, cy: h * 0.5, col: '#113366', campaign: 'arcane' },
    ]
    wisps.forEach((wisp, i) => {
      const t = frame * 0.015 + i * 2
      const wobX = wisp.cx + Math.sin(t) * 40
      const wobY = wisp.cy + Math.cos(t * 0.7) * 20
      const g = ctx.createRadialGradient(wobX, wobY, 0, wobX, wobY, 120)
      g.addColorStop(0, wisp.col + '40')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(wobX, wobY, 120, 0, Math.PI * 2)
      ctx.fill()
    })

    // Ground mist
    const mist = ctx.createLinearGradient(0, h * 0.75, 0, h)
    mist.addColorStop(0, 'rgba(0,0,0,0)')
    mist.addColorStop(0.5, 'rgba(10,8,20,0.4)')
    mist.addColorStop(1, 'rgba(5,3,10,0.8)')
    ctx.fillStyle = mist
    ctx.fillRect(0, h * 0.75, w, h * 0.25)

    frame++
    raf = requestAnimationFrame(drawTitle)
  }
  drawTitle()

  // Resize handler
  function onResize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', onResize)

  // Buttons
  document.getElementById('btn-new')?.addEventListener('click', () => {
    cleanup()
    game.navigate('char-create')
  })
  document.getElementById('btn-continue')?.addEventListener('click', () => {
    cleanup()
    game.load()
    const s = game.state.screen
    if (s && s !== 'title') game.navigate(s)
    else game.navigate('char-create')
  })
  document.getElementById('btn-new-reset')?.addEventListener('click', () => {
    if (confirm('Start a new campaign? Your current progress will be lost.')) {
      game.reset()
      cleanup()
      game.navigate('char-create')
    }
  })

  function cleanup() {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
  }

  return cleanup
}
