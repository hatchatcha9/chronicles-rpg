// Procedural canvas-based boss sprite drawing functions
// All draw functions: (ctx, x, y, scale, frame, phase) where frame = animation tick

// Color palettes
const C = {
  // Varethis / undead
  boneDark:   '#2a1e1e',
  bone:       '#c8b89a',
  boneLight:  '#e8dcc8',
  lichRobe:   '#1a0a2e',
  lichGlow:   '#8833ff',
  lichGlow2:  '#cc66ff',
  necrotic:   '#44ff44',
  // Forest / nature
  barkDark:   '#1a1208',
  bark:       '#3d2b1a',
  barkLight:  '#6b4c2a',
  corrupt:    '#8b1c1c',
  green:      '#2d5c1e',
  greenLight: '#4a8c34',
  leafGold:   '#c8a820',
  // Void / arcane
  voidBlack:  '#050510',
  voidBlue:   '#0a0a3a',
  arcane:     '#4444cc',
  arcaneGlow: '#6688ff',
  voidPurp:   '#330066',
  // Generic
  shadow:     '#0a0a0f',
  silver:     '#a0a8b8',
  gold:       '#c8a840',
  bloodRed:   '#8b0000',
  crimson:    '#cc2222',
  white:      '#f0ece8',
}

function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(Math.round(x), Math.round(y), r, 0, Math.PI * 2)
  ctx.fill()
}

function glow(ctx, x, y, r, color, alpha = 0.3) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, color.replace(')', `,${alpha})`).replace('rgb', 'rgba'))
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

// Helper to make color with alpha
function rgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},${a})`
}

function bob(frame, amp = 3) {
  return Math.sin(frame * 0.15) * amp
}

// ─────────────────────────────────────────
// HOLLOW WARDEN — armored wight
// ─────────────────────────────────────────
export function drawHollowWarden(ctx, cx, cy, scale, frame, phase) {
  const s = scale
  const bob_y = Math.sin(frame * 0.08) * 2 * s
  const y = cy + bob_y
  const x = cx

  // Glow aura (phase 2 = berserk red)
  const auraColor = phase === 1 ? '#ff2200' : '#2244aa'
  ctx.globalAlpha = 0.15 + Math.sin(frame * 0.12) * 0.05
  circle(ctx, x, y, 60 * s, auraColor)
  ctx.globalAlpha = 1

  // Legs
  px(ctx, x - 14*s, y + 28*s, 10*s, 20*s, C.silver)
  px(ctx, x + 4*s,  y + 28*s, 10*s, 20*s, C.silver)
  // Boot detail
  px(ctx, x - 16*s, y + 44*s, 12*s, 4*s, '#888')
  px(ctx, x + 4*s,  y + 44*s, 12*s, 4*s, '#888')

  // Torso — heavy plate
  px(ctx, x - 18*s, y + 4*s, 36*s, 26*s, C.silver)
  // Chest detail
  px(ctx, x - 10*s, y + 8*s, 20*s, 4*s, '#778')
  px(ctx, x - 6*s,  y + 14*s, 12*s, 8*s, '#667')

  // Shield (phase 1 only)
  if (phase === 0) {
    px(ctx, x - 34*s, y - 4*s, 18*s, 30*s, '#556677')
    px(ctx, x - 32*s, y - 2*s, 14*s, 26*s, '#445566')
    // Shield boss
    circle(ctx, x - 25*s, y + 11*s, 5*s, C.gold)
    // Blue rune
    ctx.globalAlpha = 0.7
    circle(ctx, x - 25*s, y + 11*s, 3*s, '#4488ff')
    ctx.globalAlpha = 1
  }

  // Sword arm
  const swingOffset = Math.sin(frame * 0.2) * 4 * s * (phase === 1 ? 2 : 1)
  px(ctx, x + 18*s, y + 2*s, 10*s, 26*s, C.silver)
  // Sword
  px(ctx, x + 26*s + swingOffset, y - 20*s, 5*s, 50*s, '#99aacc')
  px(ctx, x + 22*s + swingOffset, y - 8*s, 12*s, 4*s, C.gold) // crossguard

  // Head — helm
  px(ctx, x - 12*s, y - 22*s, 24*s, 24*s, C.silver)
  // Visor slit
  px(ctx, x - 10*s, y - 12*s, 20*s, 6*s, '#111')
  // Eye fire
  const eyeColor = phase === 1 ? '#ff4400' : '#4488ff'
  const eyeFlicker = Math.sin(frame * 0.3) > 0
  if (eyeFlicker || phase === 1) {
    ctx.globalAlpha = 0.8
    px(ctx, x - 8*s, y - 10*s, 6*s, 4*s, eyeColor)
    px(ctx, x + 2*s,  y - 10*s, 6*s, 4*s, eyeColor)
    ctx.globalAlpha = 1
  }

  // Cracks in armor (phase 2)
  if (phase === 1) {
    ctx.strokeStyle = '#ff330088'
    ctx.lineWidth = 1.5 * s
    ctx.beginPath()
    ctx.moveTo(x - 5*s, y + 4*s)
    ctx.lineTo(x + 3*s, y + 14*s)
    ctx.moveTo(x + 2*s, y + 6*s)
    ctx.lineTo(x + 8*s, y + 18*s)
    ctx.stroke()
  }

  // Shoulders
  px(ctx, x - 22*s, y + 2*s, 8*s, 12*s, C.silver)
  px(ctx, x + 14*s, y + 2*s, 8*s, 12*s, C.silver)
}

// ─────────────────────────────────────────
// VARETHIS THE UNDYING — lich
// ─────────────────────────────────────────
export function drawVarethis(ctx, cx, cy, scale, frame, phase) {
  const s = scale
  const hov = Math.sin(frame * 0.1) * 3 * s
  const y = cy + hov
  const x = cx

  if (phase === 2) {
    // Phase 3: soul orb
    drawVarethisOrb(ctx, x, y, s, frame)
    return
  }

  // Aura
  const auraCol = phase === 1 ? '#442288' : '#220a44'
  ctx.globalAlpha = 0.12 + Math.sin(frame*0.08)*0.04
  circle(ctx, x, y + 10*s, 70*s, auraCol)
  ctx.globalAlpha = 1

  if (phase === 0) {
    // Robed form
    // Robe — wide base
    ctx.fillStyle = C.lichRobe
    ctx.beginPath()
    ctx.moveTo(x - 8*s, y - 20*s)
    ctx.lineTo(x - 22*s, y + 50*s)
    ctx.lineTo(x + 22*s, y + 50*s)
    ctx.lineTo(x + 8*s, y - 20*s)
    ctx.fill()

    // Robe details / trim
    px(ctx, x - 20*s, y + 30*s, 40*s, 3*s, rgba(C.lichGlow, 0.4))
    px(ctx, x - 18*s, y + 40*s, 36*s, 3*s, rgba(C.lichGlow, 0.3))

    // Arms
    px(ctx, x - 22*s, y - 5*s, 8*s, 20*s, C.lichRobe)
    px(ctx, x + 14*s, y - 5*s, 8*s, 20*s, C.lichRobe)

    // Staff
    const staffSway = Math.sin(frame * 0.1) * 2 * s
    px(ctx, x - 28*s + staffSway, y - 40*s, 4*s, 80*s, '#4a3a2a')
    // Staff orb
    circle(ctx, x - 26*s + staffSway, y - 42*s, 8*s, C.lichGlow)
    ctx.globalAlpha = 0.5
    circle(ctx, x - 26*s + staffSway, y - 42*s, 12*s, C.lichGlow)
    ctx.globalAlpha = 1

  } else {
    // Phase 2: skeletal form, floating
    // Spine
    px(ctx, x - 3*s, y - 30*s, 6*s, 60*s, C.bone)
    // Ribs
    for (let i = 0; i < 4; i++) {
      const ry = y - 18*s + i * 8*s
      ctx.strokeStyle = C.bone
      ctx.lineWidth = 2.5 * s
      ctx.beginPath()
      ctx.moveTo(x - 3*s, ry)
      ctx.quadraticCurveTo(x - 22*s, ry + 3*s, x - 18*s, ry + 8*s)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x + 3*s, ry)
      ctx.quadraticCurveTo(x + 22*s, ry + 3*s, x + 18*s, ry + 8*s)
      ctx.stroke()
    }
    // Arms bone
    px(ctx, x - 22*s, y - 8*s, 4*s, 22*s, C.bone)
    px(ctx, x + 18*s, y - 8*s, 4*s, 22*s, C.bone)
    // Hand claws
    for (let i = 0; i < 3; i++) {
      px(ctx, x - 24*s + i*3*s, y + 14*s, 2.5*s, 8*s, C.boneLight)
      px(ctx, x + 18*s + i*3*s, y + 14*s, 2.5*s, 8*s, C.boneLight)
    }

    // Violet energy tendrils
    ctx.strokeStyle = rgba(C.lichGlow, 0.6)
    ctx.lineWidth = 2 * s
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + frame * 0.05
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(angle) * 45*s, y + Math.sin(angle) * 30*s)
      ctx.stroke()
    }
  }

  // Skull (both phases)
  const skullY = phase === 0 ? y - 44*s : y - 46*s
  circle(ctx, x, skullY, 14*s, C.bone)
  // Dark eye sockets
  circle(ctx, x - 5*s, skullY - 2*s, 4*s, '#111')
  circle(ctx, x + 5*s, skullY - 2*s, 4*s, '#111')
  // Eye glow
  const eyeIntensity = 0.6 + Math.sin(frame * 0.2) * 0.3
  ctx.globalAlpha = eyeIntensity
  circle(ctx, x - 5*s, skullY - 2*s, 3*s, C.lichGlow)
  circle(ctx, x + 5*s, skullY - 2*s, 3*s, C.lichGlow)
  ctx.globalAlpha = 1
  // Jawbone
  px(ctx, x - 8*s, skullY + 8*s, 16*s, 5*s, C.boneDark)
  // Teeth
  for (let i = 0; i < 4; i++) {
    px(ctx, x - 6*s + i*3.5*s, skullY + 9*s, 2*s, 5*s, C.boneLight)
  }
}

function drawVarethisOrb(ctx, x, y, s, frame) {
  // Three orbiting phylactery shards
  const t = frame * 0.04
  for (let i = 0; i < 3; i++) {
    const angle = t + (i / 3) * Math.PI * 2
    const ox = x + Math.cos(angle) * 35*s
    const oy = y + Math.sin(angle) * 20*s
    // Shard
    ctx.fillStyle = C.gold
    ctx.beginPath()
    ctx.moveTo(ox, oy - 12*s)
    ctx.lineTo(ox + 6*s, oy)
    ctx.lineTo(ox, oy + 12*s)
    ctx.lineTo(ox - 6*s, oy)
    ctx.closePath()
    ctx.fill()
    // Shard glow
    ctx.globalAlpha = 0.3
    circle(ctx, ox, oy, 14*s, C.lichGlow)
    ctx.globalAlpha = 1
  }
  // Central orb
  const pulseR = 18*s + Math.sin(frame * 0.15) * 3*s
  circle(ctx, x, y, pulseR, C.lichGlow2)
  ctx.globalAlpha = 0.4
  circle(ctx, x, y, pulseR + 8*s, C.lichGlow)
  ctx.globalAlpha = 1
  // Core
  circle(ctx, x, y, 10*s, C.white)
  // Eye within
  circle(ctx, x, y, 6*s, '#330066')
  circle(ctx, x, y, 3*s, C.lichGlow)
  // Lightning tendrils
  ctx.strokeStyle = rgba(C.lichGlow, 0.5)
  ctx.lineWidth = 1.5 * s
  for (let i = 0; i < 8; i++) {
    const angle = (i/8)*Math.PI*2 + frame*0.07
    ctx.beginPath()
    ctx.moveTo(x + Math.cos(angle)*pulseR, y + Math.sin(angle)*pulseR)
    ctx.lineTo(x + Math.cos(angle)*(pulseR+20*s), y + Math.sin(angle)*(pulseR+15*s))
    ctx.stroke()
  }
}

// ─────────────────────────────────────────
// THORNWARDEN — corrupted treant
// ─────────────────────────────────────────
export function drawThornwarden(ctx, cx, cy, scale, frame, phase) {
  const s = scale
  const sway = Math.sin(frame * 0.06) * 4 * s
  const y = cy
  const x = cx

  if (phase === 1) {
    // Three split forms
    const offsets = [-50*s, 0, 50*s]
    offsets.forEach((ox, i) => {
      drawThornShard(ctx, x + ox, y + 15*s, s * 0.65, frame, i)
    })
    return
  }

  // Green-sick aura
  ctx.globalAlpha = 0.1
  circle(ctx, x, y, 75*s, C.corrupt)
  ctx.globalAlpha = 1

  // Roots / feet
  for (let i = 0; i < 4; i++) {
    const rx = x - 30*s + i * 20*s
    ctx.strokeStyle = C.barkDark
    ctx.lineWidth = 5 * s
    ctx.beginPath()
    ctx.moveTo(rx, y + 50*s)
    ctx.quadraticCurveTo(rx + sway, y + 65*s, rx + (i-1.5)*8*s, y + 75*s)
    ctx.stroke()
  }

  // Legs / lower trunk
  px(ctx, x - 22*s, y + 20*s, 44*s, 32*s, C.bark)
  px(ctx, x - 18*s, y + 22*s, 8*s,  28*s, C.barkDark)
  px(ctx, x + 10*s,  y + 22*s, 8*s,  28*s, C.barkDark)

  // Main trunk / torso
  px(ctx, x - 26*s, y - 24*s, 52*s, 46*s, C.bark)
  // Bark texture lines
  ctx.strokeStyle = C.barkDark
  ctx.lineWidth = 2 * s
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(x - 20*s + i*12*s, y - 22*s)
    ctx.lineTo(x - 18*s + i*10*s, y + 18*s)
    ctx.stroke()
  }

  // Corruption veins
  ctx.strokeStyle = rgba(C.corrupt, 0.7)
  ctx.lineWidth = 2.5 * s
  for (let i = 0; i < 5; i++) {
    const vy = y - 20*s + i * 8*s
    ctx.beginPath()
    ctx.moveTo(x - 20*s, vy)
    ctx.lineTo(x + 20*s, vy + 4*s)
    ctx.stroke()
  }

  // Branch arms
  const armBob = Math.sin(frame * 0.08) * 5 * s
  ctx.strokeStyle = C.bark
  ctx.lineWidth = 10 * s
  ctx.beginPath()
  ctx.moveTo(x - 26*s, y - 10*s)
  ctx.lineTo(x - 65*s, y - 30*s + armBob)
  ctx.lineTo(x - 55*s, y - 50*s + armBob)
  ctx.stroke()
  ctx.lineWidth = 10 * s
  ctx.beginPath()
  ctx.moveTo(x + 26*s, y - 10*s)
  ctx.lineTo(x + 65*s, y - 30*s - armBob)
  ctx.lineTo(x + 55*s, y - 50*s - armBob)
  ctx.stroke()

  // Thorns on arms
  ctx.fillStyle = C.barkDark
  for (let i = 0; i < 4; i++) {
    const tx1 = x - 40*s - i*5*s
    const ty1 = y - 20*s + i*(-4*s) + armBob
    ctx.beginPath()
    ctx.moveTo(tx1, ty1)
    ctx.lineTo(tx1 - 6*s, ty1 - 10*s)
    ctx.lineTo(tx1 + 4*s, ty1 - 4*s)
    ctx.fill()
  }

  // Head — gnarled wood face
  circle(ctx, x, y - 38*s, 22*s, C.bark)
  // Eye holes — glowing red
  circle(ctx, x - 8*s, y - 40*s, 5*s, '#111')
  circle(ctx, x + 8*s, y - 40*s, 5*s, '#111')
  const eyeFlare = 0.5 + Math.sin(frame * 0.2) * 0.4
  ctx.globalAlpha = eyeFlare
  circle(ctx, x - 8*s, y - 40*s, 4*s, C.corrupt)
  circle(ctx, x + 8*s, y - 40*s, 4*s, C.corrupt)
  ctx.globalAlpha = 1

  // Mouth
  ctx.strokeStyle = C.barkDark
  ctx.lineWidth = 3 * s
  ctx.beginPath()
  ctx.arc(x, y - 32*s, 10*s, 0.2, Math.PI - 0.2)
  ctx.stroke()
  // Corruption seeping from mouth
  ctx.strokeStyle = rgba(C.corrupt, 0.5)
  ctx.lineWidth = 1.5 * s
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(x - 6*s + i*6*s, y - 22*s)
    ctx.lineTo(x - 4*s + i*5*s, y - 10*s)
    ctx.stroke()
  }
}

function drawThornShard(ctx, x, y, s, frame, idx) {
  const bob = Math.sin(frame * 0.1 + idx * 2) * 3 * s
  // Small treant shard
  px(ctx, x - 8*s, y + 10*s, 16*s, 20*s, C.bark)
  px(ctx, x - 10*s, y - 10*s, 20*s, 22*s, C.bark)
  // Corruption veins
  ctx.strokeStyle = rgba(C.corrupt, 0.6)
  ctx.lineWidth = 1.5 * s
  ctx.beginPath()
  ctx.moveTo(x - 6*s, y - 8*s)
  ctx.lineTo(x + 6*s, y + 10*s)
  ctx.stroke()
  // Arms
  ctx.strokeStyle = C.bark
  ctx.lineWidth = 4 * s
  ctx.beginPath()
  ctx.moveTo(x - 10*s, y)
  ctx.lineTo(x - 25*s, y - 8*s + bob)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + 10*s, y)
  ctx.lineTo(x + 25*s, y - 8*s - bob)
  ctx.stroke()
  // Head
  circle(ctx, x, y - 18*s, 10*s, C.bark)
  ctx.globalAlpha = 0.7
  circle(ctx, x - 4*s, y - 20*s, 3*s, C.corrupt)
  circle(ctx, x + 4*s, y - 20*s, 3*s, C.corrupt)
  ctx.globalAlpha = 1
}

// ─────────────────────────────────────────
// SYLVANAX THE UNBOUND — dryad / titan / orb
// ─────────────────────────────────────────
export function drawSylvanax(ctx, cx, cy, scale, frame, phase) {
  const s = scale
  const x = cx
  const y = cy

  if (phase === 0) {
    drawSylvanaxDryad(ctx, x, y, s, frame)
  } else if (phase === 1) {
    drawSylvanaxTitan(ctx, x, y, s, frame)
  } else {
    drawSylvanaxEssence(ctx, x, y, s, frame)
  }
}

function drawSylvanaxDryad(ctx, x, y, s, frame) {
  const sway = Math.sin(frame * 0.07) * 3 * s
  // Leaf hair / crown — radiating outward
  for (let i = 0; i < 12; i++) {
    const angle = (i/12) * Math.PI * 2 + frame * 0.02
    const lr = 30*s + Math.sin(i + frame * 0.05) * 5*s
    ctx.fillStyle = i % 3 === 0 ? C.leafGold : C.greenLight
    ctx.beginPath()
    ctx.save()
    ctx.translate(x + Math.cos(angle) * 24*s, y - 50*s + Math.sin(angle) * 10*s)
    ctx.rotate(angle + Math.PI / 2)
    ctx.ellipse(0, 0, 4*s, 10*s, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Body — elvish, slender
  // Legs
  px(ctx, x - 8*s, y + 20*s, 7*s, 28*s, C.barkLight)
  px(ctx, x + 1*s,  y + 20*s, 7*s, 28*s, C.barkLight)
  // Torso
  px(ctx, x - 12*s, y - 12*s, 24*s, 34*s, C.barkLight)
  // Leaf overlay
  ctx.globalAlpha = 0.5
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = C.green
    ctx.beginPath()
    ctx.ellipse(x - 6*s + i*3*s, y - 4*s + i*4*s, 4*s, 8*s, i*0.4, 0, Math.PI*2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // Arms
  ctx.strokeStyle = C.barkLight
  ctx.lineWidth = 6 * s
  ctx.beginPath()
  ctx.moveTo(x - 12*s, y - 2*s)
  ctx.lineTo(x - 30*s + sway, y - 20*s)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + 12*s, y - 2*s)
  ctx.lineTo(x + 30*s - sway, y - 20*s)
  ctx.stroke()

  // Head
  circle(ctx, x, y - 28*s, 16*s, C.barkLight)
  // Eyes — moon-gray
  circle(ctx, x - 6*s, y - 30*s, 4*s, '#111')
  circle(ctx, x + 6*s,  y - 30*s, 4*s, '#111')
  ctx.globalAlpha = 0.9
  circle(ctx, x - 6*s, y - 30*s, 3.5*s, '#d0d8cc')
  circle(ctx, x + 6*s,  y - 30*s, 3.5*s, '#d0d8cc')
  ctx.globalAlpha = 1

  // Corruption showing through
  ctx.strokeStyle = rgba(C.corrupt, 0.3)
  ctx.lineWidth = 1.5 * s
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(x - 8*s + i*6*s, y - 10*s)
    ctx.lineTo(x - 10*s + i*7*s, y + 16*s)
    ctx.stroke()
  }
}

function drawSylvanaxTitan(ctx, x, y, s, frame) {
  const groundY = y + 20*s
  // Roots tearing from ground
  ctx.strokeStyle = C.bark
  for (let i = 0; i < 6; i++) {
    const rx = x - 50*s + i * 20*s
    ctx.lineWidth = (4 + i % 3) * s
    ctx.beginPath()
    ctx.moveTo(rx, groundY + 20*s)
    ctx.quadraticCurveTo(
      rx + Math.sin(frame*0.05+i)*12*s,
      groundY - 20*s,
      rx + Math.cos(i)*30*s,
      groundY - 60*s
    )
    ctx.stroke()
  }

  // Massive trunk body
  const trunkW = 60*s
  ctx.fillStyle = C.bark
  ctx.beginPath()
  ctx.moveTo(x - trunkW/2, groundY)
  ctx.quadraticCurveTo(x - trunkW*0.7, y - 30*s, x - 25*s, y - 80*s)
  ctx.lineTo(x + 25*s, y - 80*s)
  ctx.quadraticCurveTo(x + trunkW*0.7, y - 30*s, x + trunkW/2, groundY)
  ctx.closePath()
  ctx.fill()

  // Corruption veins — large
  ctx.strokeStyle = rgba(C.corrupt, 0.5)
  ctx.lineWidth = 3 * s
  for (let i = 0; i < 8; i++) {
    const vy = y - 60*s + i * 10*s
    ctx.beginPath()
    ctx.moveTo(x - 25*s + Math.sin(i)*5*s, vy)
    ctx.lineTo(x + 25*s - Math.sin(i)*5*s, vy + 6*s)
    ctx.stroke()
  }

  // Branch arms
  const armSway = Math.sin(frame * 0.05) * 8 * s
  ctx.strokeStyle = C.bark
  ctx.lineWidth = 14 * s
  ctx.beginPath()
  ctx.moveTo(x - 25*s, y - 40*s)
  ctx.lineTo(x - 80*s + armSway, y - 70*s)
  ctx.lineTo(x - 60*s, y - 100*s + armSway)
  ctx.stroke()
  ctx.lineWidth = 14 * s
  ctx.beginPath()
  ctx.moveTo(x + 25*s, y - 40*s)
  ctx.lineTo(x + 80*s - armSway, y - 70*s)
  ctx.lineTo(x + 60*s, y - 100*s - armSway)
  ctx.stroke()

  // Face — monstrous, flower-split
  circle(ctx, x, y - 90*s, 26*s, C.barkLight)
  // Eye glow
  ctx.globalAlpha = 0.8 + Math.sin(frame*0.15)*0.15
  circle(ctx, x - 9*s, y - 94*s, 6*s, '#d0d8cc')
  circle(ctx, x + 9*s,  y - 94*s, 6*s, '#d0d8cc')
  ctx.globalAlpha = 1
  // Flower-mouth
  for (let i = 0; i < 6; i++) {
    const angle = (i/6)*Math.PI*2
    ctx.fillStyle = i % 2 === 0 ? '#cc4488' : '#884422'
    ctx.beginPath()
    ctx.ellipse(
      x + Math.cos(angle) * 12*s,
      y - 80*s + Math.sin(angle) * 8*s,
      5*s, 8*s, angle, 0, Math.PI*2
    )
    ctx.fill()
  }
}

function drawSylvanaxEssence(ctx, x, y, s, frame) {
  const t = frame * 0.05
  // Orbiting leaves
  for (let i = 0; i < 8; i++) {
    const angle = (i/8)*Math.PI*2 + t
    const r = 45*s + Math.sin(i + t*2)*5*s
    const lx = x + Math.cos(angle)*r
    const ly = y + Math.sin(angle)*r*0.5
    ctx.fillStyle = i%3===0 ? C.leafGold : C.greenLight
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.save()
    ctx.translate(lx, ly)
    ctx.rotate(angle + Math.PI/2)
    ctx.ellipse(0, 0, 3*s, 9*s, 0, 0, Math.PI*2)
    ctx.fill()
    ctx.restore()
    ctx.globalAlpha = 1
  }
  // Core orb
  const r = 20*s + Math.sin(frame*0.12)*2*s
  circle(ctx, x, y, r, '#c0ffc0')
  ctx.globalAlpha = 0.3
  circle(ctx, x, y, r + 12*s, C.greenLight)
  ctx.globalAlpha = 1
  circle(ctx, x, y, 12*s, '#ffffff')
  circle(ctx, x, y, 7*s, C.green)
  // Phase-in effect — flicker
  if (Math.sin(frame * 0.3) > 0.7) {
    ctx.globalAlpha = 0.3
    circle(ctx, x, y, r + 25*s, '#ffffff')
    ctx.globalAlpha = 1
  }
}

// ─────────────────────────────────────────
// THE ECHO — shadow self
// ─────────────────────────────────────────
export function drawEcho(ctx, cx, cy, scale, frame, phase) {
  const s = scale
  const x = cx
  const y = cy

  // Shadow distortion
  ctx.globalAlpha = 0.15 + Math.sin(frame*0.1)*0.05
  circle(ctx, x, y, 55*s, '#220044')
  ctx.globalAlpha = 1

  // Draw adventurer silhouette — generic
  // Legs
  px(ctx, x - 8*s, y + 18*s, 8*s, 24*s, '#222244')
  px(ctx, x + 2*s,  y + 18*s, 8*s, 24*s, '#222244')
  // Torso
  px(ctx, x - 12*s, y - 6*s, 24*s, 26*s, '#111133')
  // Cape — rippling
  const capeSway = Math.sin(frame * 0.1) * 4 * s
  ctx.fillStyle = '#0a0020'
  ctx.beginPath()
  ctx.moveTo(x - 12*s, y - 6*s)
  ctx.lineTo(x - 22*s + capeSway, y + 40*s)
  ctx.lineTo(x + 22*s + capeSway, y + 40*s)
  ctx.lineTo(x + 12*s, y - 6*s)
  ctx.fill()

  // Arms
  px(ctx, x - 18*s, y - 2*s, 8*s, 18*s, '#111133')
  px(ctx, x + 10*s,  y - 2*s, 8*s, 18*s, '#111133')

  // Void sword
  const bladeSway = phase === 1 ? Math.sin(frame * 0.25) * 6 * s : 0
  px(ctx, x + 16*s + bladeSway, y - 24*s, 4*s, 44*s, '#0a0020')
  ctx.strokeStyle = rgba('#6600cc', 0.8)
  ctx.lineWidth = 1.5 * s
  ctx.strokeRect(x + 16*s + bladeSway, y - 24*s, 4*s, 44*s)
  ctx.globalAlpha = 0.4
  px(ctx, x + 14*s + bladeSway, y - 24*s, 8*s, 44*s, '#6600cc')
  ctx.globalAlpha = 1

  // Head
  circle(ctx, x, y - 22*s, 14*s, '#111133')
  // Empty eyes — voids within voids
  circle(ctx, x - 5*s, y - 24*s, 4*s, '#000000')
  circle(ctx, x + 5*s,  y - 24*s, 4*s, '#000000')
  // Void glow
  const vgA = 0.4 + Math.sin(frame * 0.18) * 0.35
  ctx.globalAlpha = vgA
  circle(ctx, x - 5*s, y - 24*s, 3.5*s, '#6600ff')
  circle(ctx, x + 5*s,  y - 24*s, 3.5*s, '#6600ff')
  ctx.globalAlpha = 1

  // Particle trail
  for (let i = 0; i < 6; i++) {
    const px2 = x + Math.sin(frame*0.1 + i)*20*s
    const py2 = y + 25*s + i*5*s
    ctx.globalAlpha = 0.15
    circle(ctx, px2, py2, (3 - i*0.3)*s, '#6600ff')
  }
  ctx.globalAlpha = 1
}

// ─────────────────────────────────────────
// THE ARCHITECT — void wizard
// ─────────────────────────────────────────
export function drawArchitect(ctx, cx, cy, scale, frame, phase) {
  const s = scale
  const x = cx
  const y = cy

  if (phase === 2) {
    drawArchitectConcept(ctx, x, y, s, frame)
    return
  }

  // Robe
  ctx.fillStyle = phase === 0 ? '#1a1530' : '#0a0820'
  ctx.beginPath()
  ctx.moveTo(x - 8*s, y - 20*s)
  ctx.lineTo(x - 20*s, y + 50*s)
  ctx.lineTo(x + 20*s, y + 50*s)
  ctx.lineTo(x + 8*s, y - 20*s)
  ctx.fill()

  // Robe patterns
  ctx.strokeStyle = rgba(C.arcane, 0.3)
  ctx.lineWidth = 1.5 * s
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.moveTo(x - 14*s + i*5*s, y)
    ctx.lineTo(x - 12*s + i*5*s, y + 40*s)
    ctx.stroke()
  }

  // Arms
  px(ctx, x - 20*s, y - 8*s, 8*s, 22*s, phase === 0 ? '#1a1530' : '#0a0820')
  px(ctx, x + 12*s, y - 8*s, 8*s, 22*s, phase === 0 ? '#1a1530' : '#0a0820')

  // Phase 2: void arm
  if (phase === 1) {
    ctx.strokeStyle = rgba('#000000', 0.9)
    ctx.lineWidth = 10 * s
    ctx.beginPath()
    ctx.moveTo(x - 20*s, y - 8*s)
    ctx.lineTo(x - 45*s, y + 8*s)
    ctx.stroke()
    // Void tendrils
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = rgba(C.arcane, 0.4)
      ctx.lineWidth = 2 * s
      ctx.beginPath()
      ctx.moveTo(x - 45*s, y + 8*s)
      ctx.lineTo(x - 50*s + i*4*s, y + 14*s + i*5*s)
      ctx.stroke()
    }
  }

  // Head
  circle(ctx, x, y - 36*s, 16*s, phase === 0 ? '#c8b898' : '#443355')

  // Normal eye
  circle(ctx, x + 5*s, y - 38*s, 3.5*s, '#4a3a2a')
  circle(ctx, x + 5*s, y - 38*s, 2*s, '#6a5040')

  // Void eye
  circle(ctx, x - 5*s, y - 38*s, 4*s, '#000000')
  const voidA = 0.5 + Math.sin(frame * 0.08) * 0.3
  ctx.globalAlpha = voidA
  circle(ctx, x - 5*s, y - 38*s, 3.5*s, C.arcane)
  ctx.globalAlpha = 0.2
  circle(ctx, x - 5*s, y - 38*s, 8*s, C.arcane)
  ctx.globalAlpha = 1

  // Beard (phase 1 only)
  if (phase === 0) {
    ctx.fillStyle = '#888'
    ctx.beginPath()
    ctx.moveTo(x - 5*s, y - 26*s)
    ctx.lineTo(x + 5*s, y - 26*s)
    ctx.lineTo(x + 3*s, y - 14*s)
    ctx.lineTo(x - 3*s, y - 14*s)
    ctx.fill()
  }

  // Staff
  const staffSway = Math.sin(frame * 0.07) * 2 * s
  px(ctx, x + 20*s + staffSway, y - 60*s, 4*s, 90*s, '#2a2040')
  // Staff crystal
  ctx.fillStyle = C.arcane
  ctx.beginPath()
  ctx.moveTo(x + 22*s + staffSway, y - 62*s)
  ctx.lineTo(x + 28*s + staffSway, y - 50*s)
  ctx.lineTo(x + 22*s + staffSway, y - 40*s)
  ctx.lineTo(x + 16*s + staffSway, y - 50*s)
  ctx.closePath()
  ctx.fill()

  // Void consumption (phase 2)
  if (phase === 1) {
    ctx.globalAlpha = 0.25 + Math.sin(frame * 0.12) * 0.1
    circle(ctx, x, y, 70*s, C.voidBlack)
    ctx.globalAlpha = 1
    // Void tendrils crawling up body
    ctx.strokeStyle = rgba(C.arcane, 0.3)
    ctx.lineWidth = 2 * s
    for (let i = 0; i < 5; i++) {
      const t = frame * 0.06 + i
      ctx.beginPath()
      ctx.moveTo(x, y + 50*s)
      ctx.quadraticCurveTo(
        x + Math.cos(t)*25*s,
        y + 20*s,
        x + Math.cos(t+1)*10*s,
        y - 30*s
      )
      ctx.stroke()
    }
  }
}

function drawArchitectConcept(ctx, x, y, s, frame) {
  const t = frame * 0.04

  // Geometric void shape — non-Euclidean
  const sides = 5
  ctx.strokeStyle = rgba(C.arcane, 0.7)
  ctx.lineWidth = 2 * s

  // Outer rotating pentagon
  ctx.beginPath()
  for (let i = 0; i <= sides; i++) {
    const angle = (i/sides)*Math.PI*2 + t
    const r = 45*s
    const px = x + Math.cos(angle)*r
    const py = y + Math.sin(angle)*r*0.7
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Inner rotating pentagon (opposite direction)
  ctx.beginPath()
  for (let i = 0; i <= sides; i++) {
    const angle = (i/sides)*Math.PI*2 - t*1.5
    const r = 28*s
    const px = x + Math.cos(angle)*r
    const py = y + Math.sin(angle)*r*0.7
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Connecting lines
  ctx.strokeStyle = rgba(C.arcane, 0.3)
  for (let i = 0; i < sides; i++) {
    const a1 = (i/sides)*Math.PI*2 + t
    const a2 = (i/sides)*Math.PI*2 - t*1.5
    ctx.beginPath()
    ctx.moveTo(x + Math.cos(a1)*45*s, y + Math.sin(a1)*45*s*0.7)
    ctx.lineTo(x + Math.cos(a2)*28*s, y + Math.sin(a2)*28*s*0.7)
    ctx.stroke()
  }

  // Core void
  circle(ctx, x, y, 16*s, C.voidBlack)
  ctx.globalAlpha = 0.6
  circle(ctx, x, y, 12*s, C.arcane)
  ctx.globalAlpha = 1
  // Stars within
  for (let i = 0; i < 5; i++) {
    const sa = (i/5)*Math.PI*2 + t*0.5
    ctx.globalAlpha = 0.4
    circle(ctx, x + Math.cos(sa)*6*s, y + Math.sin(sa)*6*s, 2*s, '#ffffff')
    ctx.globalAlpha = 1
  }

  // Pulsing outer glow
  const glowR = 55*s + Math.sin(frame*0.15)*5*s
  ctx.globalAlpha = 0.08
  circle(ctx, x, y, glowR, C.arcane)
  ctx.globalAlpha = 1
}

// ─────────────────────────────────────────
// DISPATCH — get draw function by boss id
// ─────────────────────────────────────────
export function getBossDrawFn(bossId) {
  const map = {
    hollow_warden: drawHollowWarden,
    varethis: drawVarethis,
    thornwarden: drawThornwarden,
    sylvanax: drawSylvanax,
    the_echo: drawEcho,
    the_architect: drawArchitect,
  }
  return map[bossId] || null
}
