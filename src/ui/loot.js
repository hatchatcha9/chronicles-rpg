// Loot screen — interactive chest that opens on click, items reveal staggered

import { game } from '../game/engine.js'
import { rollLoot, RARITIES } from '../data/items.js'
import { drawWeaponSprite } from '../sprites/weapon-sprites.js'
import { roll } from '../game/dice.js'
import { gi, I } from '../icons.js'

export function mountLoot(container) {
  const lootTable = game.state.lootTable || 'encounter_common'

  const numItems = lootTable === 'encounter_boss' ? 3 :
                   lootTable === 'encounter_miniboss' ? 2 : 1
  const items = []
  for (let i = 0; i < numItems; i++) {
    const item = rollLoot(lootTable)
    if (item && !items.find(it => it.id === item.id)) items.push(item)
  }

  const gold = lootTable === 'encounter_boss' ? roll(20) + 20 :
               lootTable === 'encounter_miniboss' ? roll(10) + 8 : roll(6) + 2

  container.innerHTML = `
    <div id="loot-screen" class="screen active">
      <div class="loot-chest-container">
        <h2 class="loot-title">Victory</h2>
        <p class="loot-subtitle">The enemy has fallen. Search the remains.</p>

        <div class="chest-wrapper" id="chest-wrapper">
          <canvas id="chest-canvas" width="160" height="140"></canvas>
          <p class="chest-prompt" id="chest-prompt">Open Chest</p>
        </div>

        <div class="loot-items-reveal" id="loot-items" style="display:none"></div>
        <div class="loot-gold-row" id="loot-gold" style="display:none">
          ${gi(I.GOLD, 20, 'd4a830')}
          <span class="gold-amount">${gold} Gold</span>
        </div>
        <div class="loot-actions" id="loot-actions" style="display:none">
          <button class="btn-fantasy btn-ghost" id="loot-skip">Leave</button>
          <button class="btn-fantasy btn-primary" id="loot-continue">Continue</button>
        </div>
      </div>

      <div class="inventory-sidebar">
        <h4 class="inv-title">Inventory</h4>
        <div class="inv-list" id="inv-list">
          ${renderInventory()}
        </div>
      </div>
    </div>
  `

  // Draw the chest
  const canvas = document.getElementById('chest-canvas')
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  let openFraction = 0
  let isOpening = false
  let isOpen = false
  let animRaf

  drawChest(ctx, openFraction)

  // Click to open
  document.getElementById('chest-wrapper').addEventListener('click', () => {
    if (isOpening || isOpen) return
    isOpening = true
    document.getElementById('chest-prompt').style.animation = 'none'
    document.getElementById('chest-prompt').style.opacity = '0'
    animateChestOpen()
  })

  function animateChestOpen() {
    openFraction = Math.min(1, openFraction + 0.04)
    drawChest(ctx, openFraction)

    if (openFraction < 1) {
      animRaf = requestAnimationFrame(animateChestOpen)
    } else {
      isOpen = true
      isOpening = false
      onChestOpened()
    }
  }

  function onChestOpened() {
    // Replace prompt with label
    const prompt = document.getElementById('chest-prompt')
    prompt.className = 'chest-opened-label'
    prompt.textContent = 'Chest Opened'

    // Add gold to game state
    game.update({ gold: (game.state.gold || 0) + gold })

    // Reveal loot items staggered
    const lootEl = document.getElementById('loot-items')
    const goldEl = document.getElementById('loot-gold')
    const actionsEl = document.getElementById('loot-actions')

    lootEl.style.display = 'flex'

    lootEl.innerHTML = items.map((item, i) => {
      const rarity = RARITIES[item.rarity] || RARITIES.common
      return `
      <div class="loot-card" data-idx="${i}" style="border-color:${rarity.color}30; animation-delay:${i * 0.18}s">
        <canvas class="loot-sprite" id="loot-canvas-${i}" width="80" height="80"></canvas>
        <div class="loot-info">
          <span class="loot-rarity" style="color:${rarity.color}">${rarity.label}</span>
          <h3 class="loot-name">${item.name}</h3>
          <p class="loot-desc">${item.description}</p>
          ${item.flavor ? `<p class="loot-flavor">"${item.flavor}"</p>` : ''}
          ${item.damage ? `<div class="loot-stat">${gi(I.ATTACK, 13)} ${item.damage} ${item.damageType}</div>` : ''}
          ${item.acBonus ? `<div class="loot-stat">${gi(I.SHIELD, 13)} +${item.acBonus} AC</div>` : ''}
          ${item.heal ? `<div class="loot-stat">${gi(I.HEAL, 13)} Heals ${item.heal}</div>` : ''}
        </div>
        <button class="btn-fantasy btn-primary loot-take" data-idx="${i}" style="white-space:nowrap;padding:8px 14px">Take</button>
      </div>
      `
    }).join('')

    // Trigger CSS reveal animations
    requestAnimationFrame(() => {
      lootEl.querySelectorAll('.loot-card').forEach(card => card.classList.add('revealed'))
    })

    // Draw weapon sprites
    items.forEach((item, i) => {
      const c = document.getElementById(`loot-canvas-${i}`)
      if (!c) return
      const cx = c.getContext('2d')
      cx.imageSmoothingEnabled = false
      cx.fillStyle = '#0e0c14'
      cx.fillRect(0, 0, 80, 80)
      drawWeaponSprite(cx, item.sprite || 'sword_basic', 40, 40, 5)
    })

    // Show gold and actions after a delay
    setTimeout(() => {
      goldEl.style.display = 'flex'
      actionsEl.style.display = 'flex'
    }, items.length * 180 + 300)

    // Take item handlers
    lootEl.querySelectorAll('.loot-take').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx)
        const item = items[idx]
        if (!item) return
        game.addItem(item)
        btn.textContent = 'Taken'
        btn.disabled = true
        btn.style.background = 'rgba(60,100,60,0.4)'
        btn.style.borderColor = 'rgba(80,160,80,0.3)'
        btn.style.color = '#88cc88'
        applyItemToChar(item, game.state.character)
        document.getElementById('inv-list').innerHTML = renderInventory()
      })
    })
  }

  document.getElementById('loot-skip')?.addEventListener('click', continueAfterLoot)
  document.getElementById('loot-continue')?.addEventListener('click', continueAfterLoot)
}

// Draw pixel art style chest on canvas
function drawChest(ctx, openFraction) {
  const W = 160, H = 140
  ctx.clearRect(0, 0, W, H)

  // Background glow when opening
  if (openFraction > 0) {
    const glow = ctx.createRadialGradient(80, 80, 0, 80, 80, 80)
    glow.addColorStop(0, `rgba(220,170,40,${openFraction * 0.35})`)
    glow.addColorStop(1, 'rgba(220,170,40,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)
  }

  const S = 4       // pixel scale
  const BW = 28     // chest body width in px
  const BH = 14     // chest body height
  const LH = 10     // lid height
  const BX = (W / S - BW) / 2  // body x in px units
  const BY = (H / S - BH) / 2 + 3 // body y

  function px(x, y, w, h, color) {
    ctx.fillStyle = color
    ctx.fillRect(x * S, y * S, w * S, h * S)
  }

  // === CHEST BODY ===
  // Wood fill
  px(BX, BY, BW, BH, '#6b3a12')
  // Wood grain lines
  for (let g = 0; g < 3; g++) {
    px(BX + 1, BY + 3 + g * 4, BW - 2, 1, '#4a2808')
  }
  // Metal band top
  px(BX, BY, BW, 2, '#888')
  // Metal band bottom
  px(BX, BY + BH - 2, BW, 2, '#888')
  // Metal corners
  px(BX, BY, 2, BH, '#777')
  px(BX + BW - 2, BY, 2, BH, '#777')
  // Lock hasp plate
  px(BX + BW/2 - 3, BY - 1, 6, 4, '#c8a020')
  px(BX + BW/2 - 2, BY + 3, 4, 3, '#a07010')

  // === CHEST LID (animates up) ===
  const lidLift = openFraction * LH * 1.2
  const LY = BY - LH - Math.round(lidLift)

  // Lid wood
  px(BX, LY, BW, LH, '#7a4418')
  // Lid grain
  for (let g = 0; g < 2; g++) {
    px(BX + 1, LY + 2 + g * 4, BW - 2, 1, '#5a3010')
  }
  // Lid metal band bottom
  px(BX, LY + LH - 2, BW, 2, '#888')
  // Lid metal corners
  px(BX, LY, 2, LH, '#777')
  px(BX + BW - 2, LY, 2, LH, '#777')
  // Lid arc highlight
  px(BX + 2, LY, BW - 4, 1, '#9a5820')

  // Lock slot on body when open
  if (openFraction > 0.5) {
    const alpha = (openFraction - 0.5) * 2
    ctx.globalAlpha = alpha
    // glow from inside
    const innerGlow = ctx.createLinearGradient(BX * S, (BY) * S, BX * S, (BY + BH) * S)
    innerGlow.addColorStop(0, 'rgba(255,200,60,0.5)')
    innerGlow.addColorStop(1, 'rgba(200,130,20,0.1)')
    ctx.fillStyle = innerGlow
    ctx.fillRect(BX * S + 2, BY * S, (BW - 1) * S, BH * S)
    ctx.globalAlpha = 1
  }
}

function applyItemToChar(item, char) {
  if (!char) return
  if (item.bonus?.ac) char.ac += item.bonus.ac
  if (item.acBonus) char.ac += item.acBonus
  if (item.bonus?.extraSlots) {
    Object.entries(item.bonus.extraSlots).forEach(([lvl, count]) => {
      char.spellSlots[lvl] = (char.spellSlots[lvl] || 0) + count
      char.maxSpellSlots[lvl] = (char.maxSpellSlots[lvl] || 0) + count
    })
  }
}

function renderInventory() {
  const inv = game.state.inventory || []
  if (inv.length === 0) return '<p class="inv-empty">Empty</p>'
  return inv.map(item => {
    const rarity = RARITIES[item.rarity] || RARITIES.common
    return `
      <div class="inv-item">
        <span class="inv-dot" style="color:${rarity.color}">◆</span>
        <span class="inv-name">${item.name}</span>
      </div>
    `
  }).join('')
}

function continueAfterLoot() {
  const nextScene = game.state.afterLootScene
  if (nextScene) {
    game.update({ sceneId: nextScene, lootTable: null, afterLootScene: null })
    game.navigate('narrative')
  } else {
    game.navigate('campaign-select')
  }
}
