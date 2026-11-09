// Skill Tree Screen — canvas-based, cursor-driven parallax pan
// Shows the full skill tree for the character's class. Accessible from hub + world-map.

import { game } from '../game/engine.js'
import { getSkillTree } from '../data/skill-trees.js'
import { getFullSkillTree } from '../data/skill-tree-combos.js'
import { gi, I } from '../icons.js'

const TIER_COLORS = ['#c8962a', '#8b4a9a', '#c84040']
const TIER_NAMES  = ['Foundation', 'Mastery', 'Legend']

const NODE_W = 220
const NODE_H = 90
const COL_GAP = 270
const ROW_GAP = 55
const TIER_HEADER_H = 30

export function mountSkillTree(container) {
  const state  = game.state

  // Resolve class ID from multiple possible sources
  const classId = state.character?.classId
    || state.character?.class?.id
    || state.character?.class
    || (state.character?.className || '').toLowerCase().replace(/\s+/g, '_')

  const raceId = state.character?.raceId || null
  const rawTree = getFullSkillTree(classId, raceId)
  const returnTo = state.skillTreeReturn || state.prevScreen || 'hub'

  // Transform flat-node format { nodes[], paths[], pathColors[] } → { tiers[] } for renderer
  let tree = null
  if (rawTree && rawTree.nodes) {
    const tierCount = 3
    const tiers = Array.from({ length: tierCount }, (_, i) => ({
      name: rawTree.paths?.[i] || `Tier ${i + 1}`,
      nodes: rawTree.nodes
        .filter(n => n.tier === i + 1)
        .map(n => ({
          ...n,
          requires: n.prereq ? [n.prereq] : [],
          pathColor: rawTree.pathColors?.[n.path] || TIER_COLORS[i],
        })),
    }))
    tree = { ...rawTree, tiers }
  } else if (rawTree) {
    tree = rawTree
  }

  const unlockedNodes = new Set(state.unlockedNodes || [])
  const skillPoints   = state.skillPoints ?? state.character?.skillPoints ?? 0

  container.innerHTML = `
    <div id="skill-tree-screen" class="screen active st-screen">
      <canvas id="st-canvas"></canvas>
      <div class="st-ui">
        <div class="st-topbar">
          <button class="st-back-btn" id="st-back">← Back</button>
          <div class="st-title">
            <span class="st-class-name">${tree?.name || 'Unknown'} — Skill Tree</span>
            <span class="st-char-name">${state.character?.name || 'Adventurer'}</span>
          </div>
          <div class="st-points">
            <span class="st-pts-label">Skill Points</span>
            <span class="st-pts-value" id="st-pts">${skillPoints}</span>
          </div>
        </div>
        <div class="st-hint">Move cursor to pan. Click a node to unlock it.</div>
      </div>

      <!-- Node tooltip -->
      <div class="st-tooltip hidden" id="st-tooltip">
        <div class="st-tt-tier" id="st-tt-tier"></div>
        <div class="st-tt-name" id="st-tt-name"></div>
        <div class="st-tt-desc" id="st-tt-desc"></div>
        <div class="st-tt-status" id="st-tt-status"></div>
      </div>
    </div>
  `

  const canvas = document.getElementById('st-canvas')
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  let frame = 0, raf

  // Build node layout
  const nodeData = []
  if (tree) {
    tree.tiers.forEach((tier, tierIdx) => {
      tier.nodes.forEach((node, nodeIdx) => {
        const col = nodeIdx
        const row = tierIdx
        nodeData.push({
          ...node,
          tierIdx,
          col,
          layoutX: col * COL_GAP,
          layoutY: row * (NODE_H + ROW_GAP) + TIER_HEADER_H,
        })
      })
    })
  }

  // Canvas pan driven by cursor
  let targetOffX = 0, targetOffY = 0
  let currentOffX = 0, currentOffY = 0
  const MAX_X = 60, MAX_Y = 40

  document.addEventListener('mousemove', onMouseMove)
  function onMouseMove(e) {
    const cx = e.clientX / window.innerWidth  - 0.5
    const cy = e.clientY / window.innerHeight - 0.5
    targetOffX = -cx * MAX_X * 2
    targetOffY = -cy * MAX_Y * 2
  }

  // Center the tree on canvas
  function centerOffset() {
    const treeW = (Math.max(...nodeData.map(n => n.col)) + 1) * COL_GAP
    const treeH = (tree?.tiers?.length ?? 1) * (NODE_H + ROW_GAP)
    return {
      x: (canvas.width  - treeW) / 2 + NODE_W / 2,
      y: (canvas.height - treeH) / 2 + 60,
    }
  }

  function getNodeScreenPos(node) {
    const { x, y } = centerOffset()
    return {
      x: node.layoutX + x + currentOffX,
      y: node.layoutY + y + currentOffY,
    }
  }

  // Hover tracking
  let hoveredNode = null
  const tooltip = document.getElementById('st-tooltip')

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    let found = null

    nodeData.forEach(node => {
      const { x, y } = getNodeScreenPos(node)
      if (mx >= x && mx <= x + NODE_W && my >= y && my <= y + NODE_H) {
        found = node
      }
    })

    if (found !== hoveredNode) {
      hoveredNode = found
      if (found) {
        const tierColor = TIER_COLORS[found.tierIdx]
        document.getElementById('st-tt-tier').textContent = TIER_NAMES[found.tierIdx]
        document.getElementById('st-tt-tier').style.color = tierColor
        document.getElementById('st-tt-name').textContent = found.name
        document.getElementById('st-tt-desc').textContent = found.description
        const isUnlocked = unlockedNodes.has(found.id)
        const canUnlock  = !isUnlocked && skillPoints > 0 && meetsRequirements(found, unlockedNodes)
        document.getElementById('st-tt-status').textContent = isUnlocked
          ? '✓ Unlocked'
          : canUnlock
            ? `Click to unlock (${skillPoints} point${skillPoints !== 1 ? 's' : ''} remaining)`
            : isUnlocked
              ? ''
              : (skillPoints <= 0 ? 'No skill points' : 'Requires prerequisites')
        document.getElementById('st-tt-status').style.color = isUnlocked ? '#5aaa5a' : canUnlock ? '#c8962a' : '#7a6a5a'
        tooltip.classList.remove('hidden')
      } else {
        tooltip.classList.add('hidden')
      }
    }

    if (found) {
      tooltip.style.left = Math.min(e.clientX + 20, window.innerWidth  - 280) + 'px'
      tooltip.style.top  = Math.max(e.clientY - 80, 10) + 'px'
    }
  })

  canvas.addEventListener('mouseleave', () => {
    hoveredNode = null
    tooltip.classList.add('hidden')
  })

  // Click to unlock
  canvas.addEventListener('click', (e) => {
    if (!hoveredNode) return
    const node = hoveredNode
    if (unlockedNodes.has(node.id)) return
    if (skillPoints <= 0) return
    if (!meetsRequirements(node, unlockedNodes)) return

    unlockedNodes.add(node.id)
    const newPoints = skillPoints - 1
    game.update({ unlockedNodes: [...unlockedNodes], skillPoints: newPoints })
    document.getElementById('st-pts').textContent = newPoints

    // Update tooltip status
    if (hoveredNode?.id === node.id) {
      document.getElementById('st-tt-status').textContent = '✓ Unlocked'
      document.getElementById('st-tt-status').style.color = '#5aaa5a'
    }
  })

  // Back button
  document.getElementById('st-back')?.addEventListener('click', () => {
    cleanup()
    game.navigate(returnTo)
  })

  // Draw loop
  function drawLoop() {
    const w = canvas.width, h = canvas.height

    // Smooth lerp
    currentOffX += (targetOffX - currentOffX) * 0.06
    currentOffY += (targetOffY - currentOffY) * 0.06

    ctx.clearRect(0, 0, w, h)

    // Deep gothic background
    const bg = ctx.createRadialGradient(w*0.5, h*0.5, 0, w*0.5, h*0.5, Math.max(w, h))
    bg.addColorStop(0, '#0c0618')
    bg.addColorStop(0.6, '#070412')
    bg.addColorStop(1, '#040209')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // Rune-grid overlay
    ctx.strokeStyle = 'rgba(80,50,120,0.04)'
    ctx.lineWidth = 1
    const gridSize = 60
    for (let gx = 0; gx < w; gx += gridSize) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke()
    }
    for (let gy = 0; gy < h; gy += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke()
    }

    if (!tree) {
      ctx.font = '20px Cinzel'
      ctx.fillStyle = '#7a6a5a'
      ctx.textAlign = 'center'
      ctx.fillText('No skill tree for this class', w / 2, h / 2)
      ctx.textAlign = 'left'
      frame++
      raf = requestAnimationFrame(drawLoop)
      return
    }

    // Draw tier banners
    tree.tiers.forEach((tier, tierIdx) => {
      const { x, y } = centerOffset()
      const bannerY = tierIdx * (NODE_H + ROW_GAP) + y + currentOffY - 10
      const totalW  = tier.nodes.length * COL_GAP - (COL_GAP - NODE_W)

      ctx.save()
      ctx.globalAlpha = 0.18
      ctx.fillStyle = TIER_COLORS[tierIdx]
      ctx.fillRect(x + currentOffX - 20, bannerY, totalW + 40, TIER_HEADER_H - 4)
      ctx.restore()

      ctx.font = `bold 11px 'Cinzel', serif`
      ctx.fillStyle = TIER_COLORS[tierIdx]
      ctx.textAlign = 'left'
      ctx.globalAlpha = 0.7
      ctx.fillText(TIER_NAMES[tierIdx].toUpperCase(), x + currentOffX, bannerY + 24)
      ctx.globalAlpha = 1
    })

    // Draw connection lines between tier nodes (simple prerequisite lines)
    nodeData.forEach(node => {
      if (!node.requires) return
      node.requires.forEach(reqId => {
        const from = nodeData.find(n => n.id === reqId)
        if (!from) return
        const { x: fx, y: fy } = getNodeScreenPos(from)
        const { x: tx, y: ty } = getNodeScreenPos(node)
        const fromX = fx + NODE_W / 2
        const fromY = fy + NODE_H
        const toX   = tx + NODE_W / 2
        const toY   = ty

        const lit = unlockedNodes.has(reqId) && unlockedNodes.has(node.id)
        const half = unlockedNodes.has(reqId)

        ctx.save()
        ctx.strokeStyle = lit ? '#c8962a' : half ? 'rgba(180,120,30,0.4)' : 'rgba(80,60,100,0.3)'
        ctx.lineWidth   = lit ? 2 : 1
        ctx.setLineDash(lit ? [] : [6, 6])
        ctx.beginPath()
        ctx.moveTo(fromX, fromY)
        ctx.bezierCurveTo(fromX, fromY + 40, toX, toY - 40, toX, toY)
        ctx.stroke()
        ctx.restore()
      })
    })

    // Draw nodes
    nodeData.forEach(node => {
      const { x, y } = getNodeScreenPos(node)
      const isUnlocked = unlockedNodes.has(node.id)
      const isHovered  = hoveredNode?.id === node.id
      const tierColor  = TIER_COLORS[node.tierIdx]
      const canUnlock  = !isUnlocked && skillPoints > 0 && meetsRequirements(node, unlockedNodes)

      const pulse = Math.sin(frame * 0.04 + node.layoutX * 0.01) * 0.5 + 0.5

      // Outer glow
      if (isUnlocked || isHovered) {
        const glowColor = isUnlocked ? tierColor : '#ffffff'
        const glowAlpha = isUnlocked ? 0.25 + pulse * 0.1 : 0.15
        ctx.save()
        ctx.globalAlpha = glowAlpha
        const gr = ctx.createRadialGradient(x + NODE_W/2, y + NODE_H/2, 0, x + NODE_W/2, y + NODE_H/2, NODE_W * 0.8)
        gr.addColorStop(0, glowColor)
        gr.addColorStop(1, 'transparent')
        ctx.fillStyle = gr
        ctx.fillRect(x - 30, y - 20, NODE_W + 60, NODE_H + 40)
        ctx.restore()
      }

      // Node background
      ctx.save()
      const bgAlpha = isUnlocked ? 0.95 : isHovered ? 0.85 : canUnlock ? 0.75 : 0.55
      ctx.globalAlpha = bgAlpha
      ctx.fillStyle = isUnlocked
        ? `${tierColor}22`
        : canUnlock
          ? '#1a1428'
          : '#0e0a1a'
      ctx.strokeStyle = isUnlocked
        ? tierColor
        : isHovered
          ? '#ffffff44'
          : canUnlock
            ? `${tierColor}88`
            : '#302040'
      ctx.lineWidth = isUnlocked ? 2 : isHovered ? 1.5 : 1

      // Rounded rect
      roundRect(ctx, x, y, NODE_W, NODE_H, 6)
      ctx.fill()
      ctx.stroke()
      ctx.restore()

      // Tier indicator strip on left
      ctx.save()
      ctx.globalAlpha = isUnlocked ? 0.9 : 0.4
      ctx.fillStyle = tierColor
      roundRect(ctx, x, y, 4, NODE_H, [6, 0, 0, 6])
      ctx.fill()
      ctx.restore()

      // Lock/unlock icon in corner
      if (isUnlocked) {
        ctx.save()
        ctx.globalAlpha = 0.8
        ctx.font = '10px sans-serif'
        ctx.fillStyle = tierColor
        ctx.fillText('✓', x + NODE_W - 18, y + 16)
        ctx.restore()
      } else if (canUnlock) {
        ctx.save()
        ctx.globalAlpha = 0.6 + pulse * 0.3
        ctx.font = '10px sans-serif'
        ctx.fillStyle = '#c8962a'
        ctx.fillText('○', x + NODE_W - 18, y + 16)
        ctx.restore()
      }

      // Node name
      ctx.save()
      ctx.font = `bold 12px 'Cinzel', serif`
      ctx.fillStyle = isUnlocked ? tierColor : isHovered ? '#e8e0d0' : canUnlock ? '#c0a080' : '#5a4a60'
      ctx.globalAlpha = isUnlocked ? 1 : isHovered ? 0.9 : canUnlock ? 0.85 : 0.55
      ctx.fillText(node.name, x + 14, y + 24)
      ctx.restore()

      // Tier label
      ctx.save()
      ctx.font = `9px 'Crimson Text', serif`
      ctx.fillStyle = isUnlocked ? tierColor : '#5a4a60'
      ctx.globalAlpha = 0.5
      ctx.fillText(TIER_NAMES[node.tierIdx], x + 14, y + 36)
      ctx.restore()

      // Description (wrap)
      ctx.save()
      ctx.font = `11px 'Crimson Text', serif`
      ctx.fillStyle = isUnlocked ? '#d0c8b8' : '#7a6a7a'
      ctx.globalAlpha = isUnlocked ? 0.85 : isHovered ? 0.6 : 0.4
      wrapText(ctx, node.description, x + 14, y + 52, NODE_W - 20, 16)
      ctx.restore()
    })

    frame++
    raf = requestAnimationFrame(drawLoop)
  }
  drawLoop()

  function cleanup() {
    cancelAnimationFrame(raf)
    document.removeEventListener('mousemove', onMouseMove)
  }

  return cleanup
}

function meetsRequirements(node, unlockedNodes) {
  if (!node.requires || node.requires.length === 0) return true
  return node.requires.every(r => unlockedNodes.has(r))
}

function roundRect(ctx, x, y, w, h, r) {
  if (typeof r === 'number') r = [r, r, r, r]
  const [tl, tr, br, bl] = r
  ctx.beginPath()
  ctx.moveTo(x + tl, y)
  ctx.lineTo(x + w - tr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr)
  ctx.lineTo(x + w, y + h - br)
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h)
  ctx.lineTo(x + bl, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl)
  ctx.lineTo(x, y + tl)
  ctx.quadraticCurveTo(x, y, x + tl, y)
  ctx.closePath()
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(' ')
  let line = ''
  let ly = y
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' '
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), x, ly)
      line = words[i] + ' '
      ly += lineH
      if (ly > y + lineH * 3) { ctx.fillText('...', x, ly); return }
    } else {
      line = test
    }
  }
  ctx.fillText(line.trim(), x, ly)
}
