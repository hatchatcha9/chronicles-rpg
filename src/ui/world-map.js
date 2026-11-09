// World Map — overworld navigation screen

import { game } from '../game/engine.js'
import { LOCATIONS, PATHS, REGIONS, isLocationUnlocked } from '../data/world.js'
import { getMainQuestStage } from '../data/quests.js'
import { gi, I } from '../icons.js'

let cleanupFn = null

export function mountWorldMap(container) {
  const state = game.state

  container.innerHTML = `
    <div id="world-map-screen" class="screen active wm-screen">
      <canvas id="wm-canvas"></canvas>
      <div class="wm-ui">

        <!-- Top bar -->
        <div class="wm-topbar">
          <div class="wm-title-block">
            <span class="wm-realm-title">The Broken Realm</span>
            <span class="wm-char-name">${gi(I.ABILITY, 12)} ${state.character?.name || 'Adventurer'} · Lv.${state.level || 1}</span>
          </div>
          <div class="wm-resources">
            <span class="wm-gold">${gi(I.ABILITY, 13)} ${state.gold || 0} gold</span>
            <span class="wm-hp">${gi(I.HP, 13)} ${state.character?.hp ?? '?'}/${state.character?.maxHp ?? '?'} HP</span>
          </div>
          <div class="wm-nav-btns">
            <button class="wm-btn" id="btn-skill-tree">⬡ Skills</button>
            <button class="wm-btn" id="btn-quest-log">${gi(I.ABILITY, 13)} Quests</button>
            <button class="wm-btn" id="btn-title">← Abandon</button>
          </div>
        </div>

        <!-- Main quest ticker -->
        <div class="wm-quest-banner" id="wm-quest-banner"></div>

        <!-- Location tooltip -->
        <div class="wm-tooltip hidden" id="wm-tooltip">
          <div class="wm-tt-name" id="wm-tt-name"></div>
          <div class="wm-tt-sub" id="wm-tt-sub"></div>
          <div class="wm-tt-desc" id="wm-tt-desc"></div>
          <button class="wm-tt-enter" id="wm-tt-enter">Enter →</button>
        </div>

        <!-- Legend -->
        <div class="wm-legend">
          <div class="wm-leg-item"><span class="wm-leg-dot wm-dot-town"></span> Town</div>
          <div class="wm-leg-item"><span class="wm-leg-dot wm-dot-dungeon"></span> Region</div>
          <div class="wm-leg-item"><span class="wm-leg-dot wm-dot-boss"></span> Stronghold</div>
          <div class="wm-leg-item"><span class="wm-leg-dot wm-dot-locked"></span> Locked</div>
        </div>
      </div>
    </div>
  `

  // Fill quest banner
  const mqStage = getMainQuestStage(state.mainQuestStage || 0)
  const banner = document.getElementById('wm-quest-banner')
  if (banner) {
    banner.innerHTML = `
      <span class="wm-quest-label">Main Quest</span>
      <span class="wm-quest-title">${mqStage.title}</span>
      <span class="wm-quest-obj">${mqStage.objective}</span>
    `
  }

  // Canvas setup
  const canvas = document.getElementById('wm-canvas')
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')

  let frame = 0
  let raf
  let panX = 0, panY = 0, targetPanX = 0, targetPanY = 0

  // Ash particles
  const ASH_COUNT = 60
  const ash = Array.from({ length: ASH_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 0.5 + Math.random() * 1.2,
    speed: 0.2 + Math.random() * 0.5,
    drift: (Math.random() - 0.5) * 0.3,
    alpha: 0.1 + Math.random() * 0.3,
  }))

  function toCanvasXY(locX, locY) {
    const margin = 0.1
    return [
      canvas.width  * (margin + locX / 100 * (1 - 2 * margin)),
      canvas.height * (margin + locY / 100 * (1 - 2 * margin)),
    ]
  }

  function drawMap() {
    const w = canvas.width, h = canvas.height
    panX += (targetPanX - panX) * 0.07
    panY += (targetPanY - panY) * 0.07
    ctx.clearRect(0, 0, w, h)

    // Deep void background
    const bgGrad = ctx.createRadialGradient(w*0.5, h*0.5, 0, w*0.5, h*0.5, Math.max(w,h)*0.75)
    bgGrad.addColorStop(0, '#080415')
    bgGrad.addColorStop(0.5, '#050210')
    bgGrad.addColorStop(1, '#03010a')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // Region atmospheric patches
    Object.values(REGIONS).forEach(region => {
      const regionLocs = Object.values(LOCATIONS).filter(l => l.region === region.id)
      if (!regionLocs.length) return
      let cx = 0, cy = 0
      regionLocs.forEach(l => { const [x,y] = toCanvasXY(l.x, l.y); cx += x; cy += y })
      cx /= regionLocs.length; cy /= regionLocs.length
      const radius = 180 + Math.sin(frame * 0.004) * 8
      const rGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
      rGrad.addColorStop(0, region.fogColor)
      rGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = rGrad
      ctx.fillRect(0, 0, w, h)
    })

    // Mist layer (slow drift)
    const mistOff = frame * 0.15
    for (let i = 0; i < 4; i++) {
      const mx = (Math.sin(mistOff * 0.007 + i * 1.5) * 0.3 + 0.5) * w
      const my = (Math.cos(mistOff * 0.005 + i * 2.1) * 0.25 + 0.5) * h
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 220)
      mg.addColorStop(0, 'rgba(10,6,20,0.12)')
      mg.addColorStop(1, 'transparent')
      ctx.fillStyle = mg
      ctx.fillRect(0, 0, w, h)
    }

    const completedLocations = state.completedLocations || []

    ctx.save()
    ctx.translate(panX, panY)

    // Draw paths
    PATHS.forEach(([fromId, toId]) => {
      const from = LOCATIONS[fromId]
      const to   = LOCATIONS[toId]
      if (!from || !to) return
      const [x1, y1] = toCanvasXY(from.x, from.y)
      const [x2, y2] = toCanvasXY(to.x, to.y)
      const unlocked = isLocationUnlocked(toId, completedLocations) && isLocationUnlocked(fromId, completedLocations)
      ctx.save()
      ctx.setLineDash([6, 8])
      ctx.lineWidth = 1.5
      ctx.strokeStyle = unlocked
        ? 'rgba(140,90,50,0.45)'
        : 'rgba(60,40,30,0.25)'
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.restore()
    })

    // Draw location nodes
    Object.values(LOCATIONS).forEach(loc => {
      const [cx, cy] = toCanvasXY(loc.x, loc.y)
      const unlocked = isLocationUnlocked(loc.id, completedLocations)
      const completed = completedLocations.includes(loc.id)
      const isCurrent = state.worldLocation === loc.id
      const pulse = Math.sin(frame * 0.04 + loc.x) * 0.4 + 0.6

      // Outer glow
      if (unlocked && !completed) {
        const glowR = isCurrent ? 40 : 28
        const gGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR * (0.9 + pulse * 0.1))
        gGrad.addColorStop(0, loc.glowColor.replace('0.6', (0.35 + pulse * 0.15).toFixed(2)))
        gGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = gGrad
        ctx.fillRect(cx - glowR, cy - glowR, glowR*2, glowR*2)
      }

      // Node circle
      const nodeR = loc.type === 'town' ? 10 : loc.type === 'final' ? 11 : 8
      ctx.beginPath()
      ctx.arc(cx, cy, nodeR, 0, Math.PI * 2)
      if (completed) {
        ctx.fillStyle = 'rgba(60,80,50,0.7)'
        ctx.strokeStyle = 'rgba(70,120,60,0.8)'
      } else if (!unlocked) {
        ctx.fillStyle = 'rgba(20,15,25,0.9)'
        ctx.strokeStyle = 'rgba(60,40,50,0.5)'
      } else {
        ctx.fillStyle = `rgba(10,6,18,0.9)`
        ctx.strokeStyle = isCurrent
          ? 'rgba(255,200,80,0.9)'
          : loc.color + 'cc'
      }
      ctx.lineWidth = isCurrent ? 2.5 : 1.5
      ctx.fill()
      ctx.stroke()

      // Inner dot
      ctx.beginPath()
      ctx.arc(cx, cy, nodeR * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = completed
        ? 'rgba(80,160,70,0.6)'
        : unlocked
          ? loc.color + 'dd'
          : 'rgba(50,35,55,0.6)'
      ctx.fill()

      // Label
      ctx.font = `bold 11px 'Cinzel', serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = completed
        ? 'rgba(100,160,90,0.7)'
        : unlocked
          ? '#d4c4a4'
          : 'rgba(90,70,80,0.6)'
      ctx.fillText(loc.label, cx, cy + nodeR + 14)
      if (loc.sublabel) {
        ctx.font = `9px 'Crimson Text', serif`
        ctx.fillStyle = completed
          ? 'rgba(80,120,70,0.5)'
          : 'rgba(140,120,100,0.4)'
        ctx.fillText(loc.sublabel, cx, cy + nodeR + 25)
      }
      ctx.textAlign = 'left'
    })

    ctx.restore()

    // Ash particles (not panned — they float above everything)
    ash.forEach(p => {
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = '#c0a890'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
      p.y += p.speed
      p.x += p.drift
      if (p.y > canvas.height + 4) { p.y = -4; p.x = Math.random() * canvas.width }
      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
    })
    ctx.globalAlpha = 1

    frame++
    raf = requestAnimationFrame(drawMap)
  }
  drawMap()

  // Mouse interaction — tooltip
  const tooltip = document.getElementById('wm-tooltip')
  let hoveredLocation = null

  canvas.addEventListener('mousemove', (e) => {
    // Parallax target
    targetPanX = (0.5 - e.clientX / canvas.width) * 60
    targetPanY = (0.5 - e.clientY / canvas.height) * 40

    const rect = canvas.getBoundingClientRect()
    // Subtract current pan so hit test matches drawn position
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width) - panX
    const my = (e.clientY - rect.top)  * (canvas.height / rect.height) - panY

    let found = null
    Object.values(LOCATIONS).forEach(loc => {
      const [cx, cy] = toCanvasXY(loc.x, loc.y)
      const dist = Math.hypot(mx - cx, my - cy)
      if (dist < 22) found = loc
    })

    if (found !== hoveredLocation) {
      hoveredLocation = found
      if (found) {
        if (hideTimer) clearTimeout(hideTimer)
        activeLocation = found
        const unlocked = isLocationUnlocked(found.id, state.completedLocations || [])
        document.getElementById('wm-tt-name').textContent = found.label
        document.getElementById('wm-tt-sub').textContent = found.sublabel
        document.getElementById('wm-tt-desc').textContent = unlocked ? found.description : '???'
        const enterBtn = document.getElementById('wm-tt-enter')
        if (unlocked) {
          enterBtn.textContent = found.type === 'town' ? 'Enter Town →' : 'Enter Region →'
          enterBtn.disabled = false
          enterBtn.style.opacity = '1'
        } else {
          enterBtn.textContent = 'Locked'
          enterBtn.disabled = true
          enterBtn.style.opacity = '0.4'
        }
        tooltip.classList.remove('hidden')
        tooltip.style.left = (e.clientX + 18) + 'px'
        tooltip.style.top  = Math.max(10, e.clientY - 60) + 'px'
      } else {
        // Use timer so mouse can reach the tooltip button before it hides
        scheduleHide()
      }
    } else if (found) {
      tooltip.style.left = (e.clientX + 18) + 'px'
      tooltip.style.top  = Math.max(10, e.clientY - 60) + 'px'
    }
  })

  let hideTimer = null
  let activeLocation = null

  function scheduleHide() {
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      tooltip.classList.add('hidden')
      hoveredLocation = null
      activeLocation = null
    }, 400)
  }

  canvas.addEventListener('mouseleave', () => { targetPanX = 0; targetPanY = 0; scheduleHide() })
  tooltip.addEventListener('mouseenter', () => { if (hideTimer) clearTimeout(hideTimer) })
  tooltip.addEventListener('mouseleave', scheduleHide)

  // Enter location
  document.getElementById('wm-tt-enter')?.addEventListener('click', () => {
    const loc = activeLocation || hoveredLocation
    if (!loc) return
    game.update({ worldLocation: loc.id })

    if (loc.type === 'town') {
      game.navigate('hub')
    } else if (loc.campaign) {
      // Enter campaign from the start
      game.update({ campaign: loc.campaign, sceneId: 'start' })
      game.navigate('narrative')
    } else {
      // Boss location — if campaign already finished, treat as boss only
      game.navigate('hub') // fallback
    }
  })

  // Skill tree button
  document.getElementById('btn-skill-tree')?.addEventListener('click', () => {
    if (cleanupFn) cleanupFn()
    game.update({ skillTreeReturn: 'world-map' })
    game.navigate('skill-tree')
  })

  // Quest log button
  document.getElementById('btn-quest-log')?.addEventListener('click', () => {
    if (cleanupFn) cleanupFn()
    game.navigate('quest-log')
  })

  // Abandon
  document.getElementById('btn-title')?.addEventListener('click', () => {
    if (cleanupFn) cleanupFn()
    game.navigate('title')
  })

  const cleanup = () => { cancelAnimationFrame(raf) }
  cleanupFn = cleanup
  return cleanup
}
