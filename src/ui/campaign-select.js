// Campaign selection screen

import { game } from '../game/engine.js'
import { CAMPAIGNS } from '../data/campaigns.js'
import { gi, I } from '../icons.js'

const THEME_COLORS = {
  crypt:     { bg: '#1a0a0f', accent: '#7733aa', text: '#e8d0d0' },
  forest:    { bg: '#0a1408', accent: '#3a8a22', text: '#d0e8d0' },
  void:      { bg: '#080818', accent: '#3344cc', text: '#d0d0f0' },
  heartroot: { bg: '#0a1408', accent: '#3a8a22', text: '#d0e8d0' },
  fractured: { bg: '#080818', accent: '#3344cc', text: '#d0d0f0' },
  throne:    { bg: '#1a0a0f', accent: '#7733aa', text: '#e8d0d0' },
}

export function mountCampaignSelect(container) {
  container.innerHTML = `
    <div id="campaign-select" class="screen active">
      <div class="cs-header">
        <button class="btn-back" id="back-to-title">← Back</button>
        <h2 class="cs-title">Choose Your Campaign</h2>
        <p class="cs-subtitle">Three paths. Each leads somewhere different. None are safe.</p>
      </div>
      <div class="cs-grid">
        ${CAMPAIGNS.map(c => {
          const theme = THEME_COLORS[c.coverTheme] || THEME_COLORS.crypt
          return `
          <div class="campaign-card" data-id="${c.id}" style="--accent:${theme.accent};--card-bg:${theme.bg}">
            <canvas class="campaign-canvas" id="canvas-${c.id}" width="320" height="200"></canvas>
            <div class="campaign-info">
              <span class="campaign-label">${c.subtitle}</span>
              <h3 class="campaign-name">${c.title}</h3>
              <p class="campaign-tagline">"${c.tagline}"</p>
              <p class="campaign-desc">${c.description}</p>
              <div class="campaign-meta">
                <span class="meta-tag">${gi(I.DIFFICULTY, 14)} ${c.difficulty}</span>
                <span class="meta-tag">${gi(I.LENGTH, 14)} ${c.length}</span>
                <span class="meta-tag">${gi(I.CLASSES_REC, 14)} ${c.recommendedClasses.slice(0,3).join(', ')}</span>
              </div>
              <button class="btn-fantasy btn-primary campaign-select-btn" data-id="${c.id}">Enter Campaign</button>
            </div>
          </div>
          `}).join('')}
      </div>
    </div>
  `

  // Animate campaign cards canvases
  const animators = []
  CAMPAIGNS.forEach(c => {
    const canvas = document.getElementById(`canvas-${c.id}`)
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame = 0
    let raf

    function drawCard() {
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)

      switch (c.id) {
        case 'ashen_throne':   drawAshenCard(ctx, w, h, frame); break
        case 'verdant_labyrinth': drawVerdantCard(ctx, w, h, frame); break
        case 'shattered_spire':  drawSpireCard(ctx, w, h, frame); break
      }
      frame++
      raf = requestAnimationFrame(drawCard)
    }
    drawCard()
    animators.push(() => cancelAnimationFrame(raf))
  })

  // Select
  document.querySelectorAll('.campaign-select-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.dataset.id
      cleanup()
      game.update({ campaign: id })
      game.navigate('char-create')
    })
  })
  document.getElementById('back-to-title')?.addEventListener('click', () => {
    cleanup()
    game.navigate('title')
  })

  function cleanup() { animators.forEach(fn => fn()) }
  return cleanup
}

function drawAshenCard(ctx, w, h, frame) {
  // Ash / dark purple
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#0e0818')
  bg.addColorStop(1, '#1a0a10')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  // Ruined tower silhouette
  ctx.fillStyle = '#0a0510'
  ctx.fillRect(w*0.4, h*0.1, w*0.2, h*0.65)
  ctx.fillRect(w*0.37, h*0.1, w*0.26, h*0.08)
  // Violet glow
  const g = ctx.createRadialGradient(w*0.5, h*0.5, 0, w*0.5, h*0.5, w*0.5)
  g.addColorStop(0, `rgba(80,0,150,${0.12+Math.sin(frame*0.06)*0.04})`)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  // Flying ashes
  for (let i = 0; i < 12; i++) {
    const ax = ((i*97+frame*0.5)%w), ay = ((i*61+frame*0.3)%(h*0.7))
    ctx.globalAlpha = 0.15
    ctx.fillStyle = '#998877'
    ctx.fillRect(ax, ay, 2, 2)
    ctx.globalAlpha = 1
  }
  // Text overlay
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fillRect(0, h*0.7, w, h*0.3)
}

function drawVerdantCard(ctx, w, h, frame) {
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#040a04')
  bg.addColorStop(1, '#081408')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  // Tree trunks
  ctx.fillStyle = '#061006'
  ;[0.15,0.3,0.7,0.85].forEach(xf => {
    ctx.fillRect(xf*w-6, 0, 12, h*0.85)
    ctx.beginPath()
    ctx.moveTo(xf*w, 0)
    ctx.lineTo(xf*w-20, h*0.25)
    ctx.lineTo(xf*w+20, h*0.25)
    ctx.fill()
  })
  // Corruption glow
  const g = ctx.createRadialGradient(w*0.5, h*0.9, 0, w*0.5, h*0.9, w*0.5)
  g.addColorStop(0, `rgba(80,10,10,${0.15+Math.sin(frame*0.07)*0.05})`)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  // Fireflies
  for (let i = 0; i < 8; i++) {
    const fx = ((i*113+frame*0.4)%w), fy = h*0.3+Math.sin(frame*0.04+i)*h*0.2
    ctx.globalAlpha = 0.3+Math.sin(frame*0.1+i)*0.25
    ctx.fillStyle = i%2===0 ? '#cc4422' : '#44aa22'
    ctx.beginPath(); ctx.arc(fx, fy, 2.5, 0, Math.PI*2); ctx.fill()
    ctx.globalAlpha = 1
  }
}

function drawSpireCard(ctx, w, h, frame) {
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#040410')
  bg.addColorStop(1, '#080820')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  // Tower splitting into three
  const t = frame * 0.03
  ;[[-20,0],[0,0],[20,0]].forEach(([ox], i) => {
    const alpha = 0.3 + Math.sin(t + i) * 0.15
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#0a0830'
    ctx.fillRect(w*0.44+ox, h*0.05, w*0.12, h*0.75)
    ctx.fillRect(w*0.42+ox, h*0.05, w*0.16, h*0.06)
    ctx.globalAlpha = 1
  })
  // Arcane glow
  const g = ctx.createRadialGradient(w*0.5, h*0.4, 0, w*0.5, h*0.4, w*0.4)
  g.addColorStop(0, `rgba(40,40,160,${0.12+Math.sin(t)*0.04})`)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  // Fracture lines
  ctx.strokeStyle = `rgba(80,80,200,${0.2+Math.sin(t*1.5)*0.1})`
  ctx.lineWidth = 1; ctx.setLineDash([4,4])
  ctx.beginPath(); ctx.moveTo(w*0.5, 0); ctx.lineTo(w*0.5, h); ctx.stroke()
  ctx.setLineDash([])
  // Stars
  for (let i = 0; i < 20; i++) {
    const sx=(i*137.5)%w, sy=(i*89.3)%(h*0.6)
    ctx.globalAlpha = 0.15+Math.sin(t+i)*0.1
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(sx, sy, 1.5, 1.5)
    ctx.globalAlpha = 1
  }
}
