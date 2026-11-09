// Arena background drawing functions

export function drawArenaBackground(ctx, w, h, theme, frame) {
  ctx.clearRect(0, 0, w, h)

  switch (theme) {
    case 'crypt':     drawCrypt(ctx, w, h, frame); break
    case 'throne':    drawThrone(ctx, w, h, frame); break
    case 'forest':    drawForest(ctx, w, h, frame); break
    case 'heartroot': drawHeartroot(ctx, w, h, frame); break
    case 'fractured': drawFractured(ctx, w, h, frame); break
    case 'void':      drawVoid(ctx, w, h, frame); break
    default:          drawCrypt(ctx, w, h, frame)
  }
}

// ─── Helpers ────────────────────────────────

function px(ctx, x, y, w, h, col) {
  ctx.fillStyle = col
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

function gradRect(ctx, x, y, w, h, col1, col2, vertical = true) {
  const g = vertical
    ? ctx.createLinearGradient(x, y, x, y+h)
    : ctx.createLinearGradient(x, y, x+w, y)
  g.addColorStop(0, col1)
  g.addColorStop(1, col2)
  ctx.fillStyle = g
  ctx.fillRect(x, y, w, h)
}

function hex(ctx, cx, cy, r, col, alpha = 1) {
  ctx.globalAlpha = alpha
  ctx.fillStyle = col
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (i/6)*Math.PI*2 - Math.PI/6
    i === 0 ? ctx.moveTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r)
             : ctx.lineTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r)
  }
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
}

// ─── Crypt ──────────────────────────────────

function drawCrypt(ctx, w, h, frame) {
  // Dark stone bg
  gradRect(ctx, 0, 0, w, h, '#0e0a08', '#1a1210')

  // Stone floor tiles
  const tileW = w / 8, tileH = h * 0.25
  const floorY = h * 0.72
  ctx.strokeStyle = '#2a2018'
  ctx.lineWidth = 1
  for (let col = 0; col <= 8; col++) {
    ctx.beginPath(); ctx.moveTo(col * tileW, floorY); ctx.lineTo(col * tileW, h); ctx.stroke()
  }
  for (let row = 0; row <= 3; row++) {
    ctx.beginPath(); ctx.moveTo(0, floorY + row * tileH / 3); ctx.lineTo(w, floorY + row * tileH / 3); ctx.stroke()
  }
  gradRect(ctx, 0, floorY, w, h - floorY, '#1a1410', '#0a0805')

  // Pillars
  const pillarW = w * 0.06
  const pillarH = h * 0.55
  const pillarTop = h * 0.17
  const pillarCol = '#1c1814'
  const shadow = '#0a0805'
  ;[0.08, 0.25, 0.75, 0.92].forEach(xf => {
    const px2 = xf * w - pillarW / 2
    px(ctx, px2, pillarTop, pillarW, pillarH, pillarCol)
    px(ctx, px2 + pillarW - 2, pillarTop, 2, pillarH, shadow)
    // Capital
    px(ctx, px2 - 3, pillarTop - 8, pillarW + 6, 8, '#222018')
    // Base
    px(ctx, px2 - 3, pillarTop + pillarH, pillarW + 6, 8, '#222018')
  })

  // Arch
  ctx.strokeStyle = '#2a2018'
  ctx.lineWidth = w * 0.025
  ctx.beginPath()
  ctx.arc(w/2, h * 0.15, w * 0.32, Math.PI, 0, false)
  ctx.stroke()

  // Candles (flickering)
  ;[0.15, 0.85].forEach(xf => {
    const cx = xf * w
    const cy = h * 0.65
    const flicker = 0.7 + Math.sin(frame * 0.18 + xf * 10) * 0.3
    // Candle
    px(ctx, cx - 3, cy, 6, 16, '#e8dcc8')
    // Flame
    ctx.globalAlpha = flicker
    ctx.fillStyle = '#ff8822'
    ctx.beginPath()
    ctx.moveTo(cx, cy - 14)
    ctx.lineTo(cx - 4, cy)
    ctx.lineTo(cx + 4, cy)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#ffcc44'
    ctx.beginPath()
    ctx.moveTo(cx, cy - 10)
    ctx.lineTo(cx - 2, cy)
    ctx.lineTo(cx + 2, cy)
    ctx.closePath()
    ctx.fill()
    // Glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40)
    grd.addColorStop(0, 'rgba(255,160,50,0.25)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grd
    ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI*2); ctx.fill()
    ctx.globalAlpha = 1
  })

  // Dust particles
  for (let i = 0; i < 8; i++) {
    const px2 = ((i * 137 + frame * 0.3) % w)
    const py2 = ((i * 89 + frame * 0.5) % (h * 0.7))
    ctx.globalAlpha = 0.15
    ctx.fillStyle = '#998877'
    ctx.fillRect(px2, py2, 1.5, 1.5)
    ctx.globalAlpha = 1
  }
}

// ─── Throne Room ────────────────────────────

function drawThrone(ctx, w, h, frame) {
  gradRect(ctx, 0, 0, w, h, '#0a0820', '#150a20')

  // Dark stone with violet cracks
  const floorY = h * 0.7
  gradRect(ctx, 0, floorY, w, h - floorY, '#0d0818', '#080510')
  ctx.strokeStyle = '#1a0a2e'
  ctx.lineWidth = 1
  for (let col = 0; col <= 10; col++) {
    ctx.beginPath(); ctx.moveTo(col * w/10, floorY); ctx.lineTo(col * w/10, h); ctx.stroke()
  }
  for (let row = 0; row <= 3; row++) {
    ctx.beginPath(); ctx.moveTo(0, floorY + row * 20); ctx.lineTo(w, floorY + row * 20); ctx.stroke()
  }

  // Violet cracks in floor
  ctx.strokeStyle = `rgba(80,0,160,${0.2 + Math.sin(frame*0.05)*0.1})`
  ctx.lineWidth = 1.5
  ;[[0.3,0.75, 0.5,0.85],[0.6,0.72, 0.8,0.9],[0.1,0.8, 0.3,0.92]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1*w, y1*h); ctx.lineTo(x2*w, y2*h); ctx.stroke()
  })

  // Tall stained windows
  ;[0.12, 0.88].forEach(xf => {
    const wx = xf * w - w * 0.04
    const wy = h * 0.05
    const ww = w * 0.08
    const wh = h * 0.55
    px(ctx, wx, wy, ww, wh, '#0a0818')
    // Gothic arch top
    ctx.fillStyle = '#0a0818'
    ctx.beginPath()
    ctx.arc(wx + ww/2, wy, ww/2, Math.PI, 0)
    ctx.fill()
    // Window glow
    const glowA = 0.03 + Math.sin(frame * 0.04 + xf) * 0.01
    ctx.strokeStyle = `rgba(80,30,180,${glowA})`
    ctx.lineWidth = 2
    ctx.strokeRect(wx, wy, ww, wh)
  })

  // Violet ambient glow at back
  const bgGlow = ctx.createRadialGradient(w/2, h*0.1, 0, w/2, h*0.1, w*0.5)
  bgGlow.addColorStop(0, `rgba(60,0,120,${0.12 + Math.sin(frame*0.04)*0.03})`)
  bgGlow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = bgGlow
  ctx.fillRect(0, 0, w, h)

  // Bone debris on floor
  ctx.fillStyle = '#2a2020'
  ;[0.2, 0.4, 0.6, 0.8].forEach(xf => {
    ctx.fillRect(xf * w - 8, h * 0.71, 16, 3)
    ctx.fillRect(xf * w - 4, h * 0.73, 8, 2)
  })
}

// ─── Forest ─────────────────────────────────

function drawForest(ctx, w, h, frame) {
  // Deep forest, wrong green
  gradRect(ctx, 0, 0, w, h, '#040a04', '#091408')

  // Background trees (silhouettes)
  ctx.fillStyle = '#060e06'
  for (let i = 0; i < 12; i++) {
    const tx = (i / 12) * w * 1.1 - w * 0.05
    const th = h * (0.5 + (i%3)*0.1)
    const tw = w * 0.08
    ctx.beginPath()
    ctx.moveTo(tx + tw/2, h * 0.05)
    ctx.lineTo(tx + tw, h - th + h * 0.45)
    ctx.lineTo(tx, h - th + h * 0.45)
    ctx.closePath()
    ctx.fill()
  }

  // Thick roots across floor
  const floorY = h * 0.72
  ctx.strokeStyle = '#1a1008'
  for (let i = 0; i < 6; i++) {
    ctx.lineWidth = (3 + i%3) * 1.5
    ctx.beginPath()
    const rx = (i/6) * w
    ctx.moveTo(rx, floorY + 10)
    ctx.quadraticCurveTo(rx + 20, floorY - 15, rx + 40, floorY + 5)
    ctx.stroke()
  }
  gradRect(ctx, 0, floorY, w, h - floorY, '#0d0a04', '#060402')

  // Corruption glow from center bottom
  const corGlow = ctx.createRadialGradient(w/2, h, 0, w/2, h, w*0.6)
  corGlow.addColorStop(0, `rgba(100,10,10,${0.15 + Math.sin(frame*0.07)*0.05})`)
  corGlow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = corGlow
  ctx.fillRect(0, 0, w, h)

  // Wisps / fireflies
  for (let i = 0; i < 10; i++) {
    const wt = (frame * 0.02 + i * 0.7) % 1
    const wx = ((i * 137 + frame * 0.2) % w)
    const wy = h * 0.3 + Math.sin(frame*0.04 + i) * h * 0.15
    const wA = Math.sin(wt * Math.PI)
    ctx.globalAlpha = wA * 0.35
    ctx.fillStyle = i % 3 === 0 ? '#cc4422' : '#44aa22'
    ctx.beginPath()
    ctx.arc(wx, wy, 2.5, 0, Math.PI*2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

// ─── Heartroot ──────────────────────────────

function drawHeartroot(ctx, w, h, frame) {
  gradRect(ctx, 0, 0, w, h, '#020804', '#041008')

  // Ancient arching trees
  ctx.strokeStyle = '#0a1805'
  for (let side = 0; side < 2; side++) {
    const sx = side === 0 ? 0 : w
    for (let i = 0; i < 4; i++) {
      ctx.lineWidth = (8 - i*1.5)
      ctx.beginPath()
      ctx.moveTo(sx, h * (0.4 + i * 0.15))
      ctx.quadraticCurveTo(
        w * 0.5 + (side===0?1:-1) * w * 0.1,
        h * (0.05 + i * 0.08),
        w * 0.5,
        h * (0.08 + i * 0.05)
      )
      ctx.stroke()
    }
  }

  // Silver pool glow
  const poolGlow = ctx.createRadialGradient(w/2, h*0.85, 0, w/2, h*0.85, w*0.4)
  const pA = 0.08 + Math.sin(frame * 0.06) * 0.03
  poolGlow.addColorStop(0, `rgba(140,200,140,${pA})`)
  poolGlow.addColorStop(0.4, `rgba(40,100,40,${pA*0.5})`)
  poolGlow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = poolGlow
  ctx.fillRect(0, 0, w, h)

  // Corruption dark spots
  for (let i = 0; i < 5; i++) {
    ctx.globalAlpha = 0.15
    ctx.fillStyle = '#200000'
    ctx.beginPath()
    ctx.arc(w*(0.2+i*0.15), h*(0.6+i%2*0.1), 20, 0, Math.PI*2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // Leaf particles
  for (let i = 0; i < 8; i++) {
    const lt = (frame * 0.01 + i * 0.25) % 1
    const lx = ((i*173 + frame*0.3) % w)
    const ly = h * lt
    ctx.globalAlpha = 0.2
    ctx.fillStyle = i%2===0 ? '#4a8830' : '#c8a820'
    ctx.save()
    ctx.translate(lx, ly)
    ctx.rotate(frame*0.05 + i)
    ctx.fillRect(-3, -5, 6, 10)
    ctx.restore()
    ctx.globalAlpha = 1
  }
}

// ─── Fractured ──────────────────────────────

function drawFractured(ctx, w, h, frame) {
  // Three overlapping realities
  const t = frame * 0.03

  // Reality 1: stone
  gradRect(ctx, 0, 0, w/3, h, '#0e0c14', '#181420')
  // Reality 2: library / warm
  gradRect(ctx, w/3, 0, w/3, h, '#140e08', '#1e1610')
  // Reality 3: void
  gradRect(ctx, 2*w/3, 0, w/3, h, '#080818', '#0a0a20')

  // Fracture lines between realities
  ctx.strokeStyle = `rgba(100,80,255,${0.4 + Math.sin(t)*0.2})`
  ctx.lineWidth = 2
  ctx.setLineDash([5, 3])
  ctx.beginPath(); ctx.moveTo(w/3, 0); ctx.lineTo(w/3, h); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(2*w/3, 0); ctx.lineTo(2*w/3, h); ctx.stroke()
  ctx.setLineDash([])

  // Floating shards / page fragments
  for (let i = 0; i < 12; i++) {
    const shardX = ((i*97 + frame*0.8) % w)
    const shardY = ((i*61 + frame*0.4) % (h * 0.8))
    const shardA = Math.sin(frame*0.05 + i) * 0.15 + 0.1
    ctx.globalAlpha = shardA
    ctx.fillStyle = i % 3 === 0 ? '#4444cc' : '#aaaacc'
    ctx.save()
    ctx.translate(shardX, shardY)
    ctx.rotate(i + frame * 0.02)
    ctx.fillRect(-8, -4, 16, 8)
    ctx.restore()
    ctx.globalAlpha = 1
  }

  // Arcane glow lines
  ctx.strokeStyle = `rgba(60,60,180,${0.1 + Math.sin(t*1.3)*0.04})`
  ctx.lineWidth = 1
  for (let i = 0; i < 6; i++) {
    const ly = (i/6) * h
    ctx.beginPath(); ctx.moveTo(0, ly + Math.sin(t+i)*5); ctx.lineTo(w, ly - Math.sin(t+i)*5); ctx.stroke()
  }
}

// ─── Void ───────────────────────────────────

function drawVoid(ctx, w, h, frame) {
  gradRect(ctx, 0, 0, w, h, '#020208', '#080820')

  // Star field
  for (let i = 0; i < 40; i++) {
    const sx = (i * 137) % w
    const sy = (i * 89) % h
    const sA = 0.3 + Math.sin(frame * 0.05 + i) * 0.2
    ctx.globalAlpha = sA
    ctx.fillStyle = i % 5 === 0 ? '#6666cc' : '#ffffff'
    ctx.fillRect(sx, sy, 1.5, 1.5)
    ctx.globalAlpha = 1
  }

  // Rotating geometric lines
  const t = frame * 0.015
  ctx.strokeStyle = `rgba(40,40,120,0.2)`
  ctx.lineWidth = 1
  for (let i = 0; i < 6; i++) {
    const angle = (i/6)*Math.PI*2 + t
    ctx.beginPath()
    ctx.moveTo(w/2, h/2)
    ctx.lineTo(w/2 + Math.cos(angle)*w*0.6, h/2 + Math.sin(angle)*h*0.6)
    ctx.stroke()
  }

  // Floor — barely visible
  const floorY = h * 0.75
  gradRect(ctx, 0, floorY, w, h - floorY, '#0a0820', '#040408')
  ctx.strokeStyle = 'rgba(30,30,80,0.4)'
  ctx.lineWidth = 1
  for (let col = 0; col <= 8; col++) {
    ctx.beginPath(); ctx.moveTo(col*w/8, floorY); ctx.lineTo(col*w/8, h); ctx.stroke()
  }

  // Void pulse from center
  const pulseR = (w * 0.3) + Math.sin(frame * 0.08) * w * 0.05
  const voidPulse = ctx.createRadialGradient(w/2, h*0.5, 0, w/2, h*0.5, pulseR)
  voidPulse.addColorStop(0, 'rgba(0,0,20,0.4)')
  voidPulse.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = voidPulse
  ctx.fillRect(0, 0, w, h)
}
