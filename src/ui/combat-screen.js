// Combat screen — boss arena, D&D 5e combat UI

import { game } from '../game/engine.js'
import { CombatEngine, CONDITIONS } from '../game/combat.js'
import { getBoss } from '../data/bosses.js'
import { drawArenaBackground } from '../sprites/terrain.js'
import { getBossDrawFn } from '../sprites/boss-sprites.js'
import { delay, modifier } from '../game/dice.js'
import { gi, getClassIcon, I } from '../icons.js'

let cleanupFn = null
let engine = null

export function mountCombat(container) {
  const bossId = game.state.combatBossId
  const boss = getBoss(bossId)
  if (!boss) { game.navigate('narrative'); return }

  const char = game.state.character
  if (!char) { game.navigate('title'); return }

  // Init engine
  const logLines = []
  engine = new CombatEngine(char, boss, (msg) => {
    logLines.push(msg)
    updateLog(logLines)
  })

  container.innerHTML = buildCombatHTML(char, boss)

  // Setup canvases
  const bossCanvas  = document.getElementById('boss-canvas')
  const bgCanvas    = document.getElementById('bg-canvas')
  bgCanvas.width  = bossCanvas.width  = 600
  bgCanvas.height = bossCanvas.height = 380

  const bgCtx   = bgCanvas.getContext('2d')
  const bossCtx = bossCanvas.getContext('2d')
  bossCtx.imageSmoothingEnabled = false

  const drawBoss = getBossDrawFn(bossId)

  let frame = 0, raf
  let hitFlash = 0, bossHitFlash = 0
  let shakeOffset = { x: 0, y: 0 }
  let phaseFlash = 0

  function renderLoop() {
    const w = bgCanvas.width, h = bgCanvas.height

    // Background
    drawArenaBackground(bgCtx, w, h, boss.arenaTheme || 'crypt', frame)

    // Boss
    bossCtx.clearRect(0, 0, w, h)
    const bossScale = 1.8
    if (drawBoss) {
      // Phase flash
      if (phaseFlash > 0) {
        bossCtx.globalAlpha = phaseFlash / 20
        bossCtx.fillStyle = '#ffffff'
        bossCtx.fillRect(0, 0, w, h)
        bossCtx.globalAlpha = 1
        phaseFlash--
      }
      // Hit flash (boss)
      if (bossHitFlash > 0) {
        bossCtx.globalAlpha = bossHitFlash / 8
        bossCtx.fillStyle = '#ff0000'
        bossCtx.fillRect(0, 0, w, h)
        bossCtx.globalAlpha = 1
        bossHitFlash--
      }

      drawBoss(bossCtx, w / 2, h * 0.55, bossScale, frame, engine.currentPhase)
    }

    // Player hit flash overlay
    if (hitFlash > 0) {
      bossCtx.globalAlpha = hitFlash / 12
      bossCtx.fillStyle = '#880000'
      bossCtx.fillRect(0, 0, w, h)
      bossCtx.globalAlpha = 1
      hitFlash--
    }

    // Boss HP bar on canvas
    const phase = engine.getPhase()
    const hpPct = Math.max(0, engine.bossHp / engine.bossMaxHp)
    const barY = h * 0.06
    const barW = w * 0.7
    const barX = w * 0.15
    // Background bar
    bossCtx.fillStyle = '#1a0808'
    bossCtx.fillRect(barX, barY, barW, 14)
    // HP fill — color shifts by health
    const hpColor = hpPct > 0.5 ? '#cc2222' : hpPct > 0.25 ? '#cc4400' : '#ff0000'
    bossCtx.fillStyle = hpColor
    bossCtx.fillRect(barX, barY, barW * hpPct, 14)
    // Segments
    bossCtx.strokeStyle = '#0a0808'
    bossCtx.lineWidth = 1
    for (let seg = 1; seg < 10; seg++) {
      const sx = barX + barW * (seg / 10)
      bossCtx.beginPath(); bossCtx.moveTo(sx, barY); bossCtx.lineTo(sx, barY + 14); bossCtx.stroke()
    }
    bossCtx.strokeStyle = '#330808'
    bossCtx.lineWidth = 1.5
    bossCtx.strokeRect(barX, barY, barW, 14)

    // Boss name and phase above bar
    bossCtx.fillStyle = '#c8b898'
    bossCtx.font = `bold ${Math.round(13 * bossScale * 0.5)}px 'Cinzel', serif`
    bossCtx.textAlign = 'center'
    bossCtx.fillText(`${engine.getBossName()} — ${phase.phaseName}`, w / 2, barY - 6)
    bossCtx.fillStyle = '#886644'
    bossCtx.font = `${Math.round(10 * bossScale * 0.5)}px monospace`
    bossCtx.fillText(`${Math.max(0, engine.bossHp)} / ${engine.bossMaxHp} HP`, w / 2, barY + 26)
    bossCtx.textAlign = 'left'

    // Boss conditions
    if (engine.bossConditions.length > 0) {
      engine.bossConditions.forEach((cond, i) => {
        const condData = CONDITIONS[cond]
        if (!condData) return
        bossCtx.globalAlpha = 0.85
        bossCtx.fillStyle = condData.color
        bossCtx.font = '11px sans-serif'
        bossCtx.fillText(`${condData.icon} ${condData.name}`, barX + i * 90, barY + 36)
        bossCtx.globalAlpha = 1
      })
    }

    frame++
    raf = requestAnimationFrame(renderLoop)
  }
  renderLoop()

  // Update player UI
  updatePlayerUI(char)

  // Action buttons
  setupActions(char, engine, { bossHitFlash: (v) => { bossHitFlash = v }, hitFlash: (v) => { hitFlash = v }, phaseFlash: (v) => { phaseFlash = v }, updatePlayerUI, logLines })

  const cleanup = () => { cancelAnimationFrame(raf); engine = null }
  cleanupFn = cleanup
  return cleanup
}

function buildCombatHTML(char, boss) {
  const spellSlotRows = char.spellSlots && Object.keys(char.spellSlots).length > 0
    ? Object.entries(char.spellSlots).map(([lvl, count]) =>
        `<span class="slot-pip-group">${'◆'.repeat(count)}${' ◇'.repeat(Math.max(0, (char.maxSpellSlots[lvl] || 0) - count))}</span>`
      ).join('')
    : ''

  return `
  <div id="combat-screen" class="screen active">
    <div class="combat-layout">
      <!-- Arena -->
      <div class="arena-wrap">
        <canvas id="bg-canvas" class="arena-bg"></canvas>
        <canvas id="boss-canvas" class="arena-boss"></canvas>

        <!-- Boss intro banner (shown briefly) -->
        <div class="boss-intro-banner" id="boss-intro">
          <div class="boss-intro-title">${boss.name}</div>
          <div class="boss-intro-sub">${boss.title}</div>
        </div>
      </div>

      <!-- Combat bottom panel -->
      <div class="combat-bottom">
        <!-- Player status -->
        <div class="player-status">
          <div class="player-header">
            <span class="player-class-icon">${getClassIcon(char.class, 24)}</span>
            <span class="player-name">${char.name || 'Adventurer'}</span>
          </div>
          <div class="player-hp-wrap">
            <div class="player-hp-bar">
              <div class="player-hp-fill" id="hp-fill"></div>
            </div>
            <span class="player-hp-text" id="hp-text">${char.hp}/${char.maxHp}</span>
          </div>
          <div class="player-ac">${gi(I.SHIELD, 14)} AC ${char.ac}</div>
          <div class="player-conditions" id="player-conditions"></div>
          ${spellSlotRows ? `<div class="spell-slots">${gi(I.SPELL, 14)} ${spellSlotRows}</div>` : ''}
        </div>

        <!-- Combat log -->
        <div class="combat-log" id="combat-log">
          <div class="log-entry log-intro">${boss.intro}</div>
        </div>

        <!-- Actions -->
        <div class="action-panel" id="action-panel">
          <div class="action-header">Your Turn — Choose an Action</div>
          <div class="action-row" id="main-actions">
            <button class="act-btn" id="act-attack">${gi(I.ATTACK, 16)} Attack</button>
            ${char.spells && char.spells.length > 0 ? `<button class="act-btn" id="act-spell">${gi(I.SPELL, 16)} Cast Spell</button>` : ''}
            ${char.abilities && char.abilities.length > 0 ? `<button class="act-btn" id="act-ability">${gi(I.ABILITY, 16)} Use Ability</button>` : ''}
            <button class="act-btn" id="act-dodge">${gi(I.DODGE, 16)} Dodge</button>
            <button class="act-btn" id="act-item">${gi(I.POTION, 16)} Use Item</button>
          </div>
          <div class="sub-actions hidden" id="sub-actions"></div>
          <div class="round-display">Round <span id="round-num">1</span> — Initiative order active</div>
        </div>
      </div>
    </div>
  </div>
  `
}

function setupActions(char, eng, flashers, extra) {
  const { bossHitFlash, hitFlash, phaseFlash, updatePlayerUI, logLines } = flashers

  let actionLocked = false

  async function doPlayerAction(actionFn) {
    if (actionLocked || eng.isOver) return
    actionLocked = true
    setActionsEnabled(false)

    // Player action
    const result = await actionFn()

    // Check boss death / phase
    const newPhase = eng.checkPhaseTransition()
    if (newPhase) {
      phaseFlash(20)
      await delay(800)
    }

    if (eng.isBossDead()) {
      eng.isOver = true
      eng.result = 'victory'
      await delay(600)
      finishCombat('victory')
      return
    }

    updatePlayerUI(eng.char)

    // Legendary actions (fire after player turn, before main boss turn)
    const phase = eng.getPhase()
    if (phase.legendaryActions > 0) {
      eng.log(`\n— Legendary Actions —`)
      await delay(300)
      await eng.fireLegendaryActions()
      bossHitFlash(4)
      updatePlayerUI(eng.char)

      if (eng.isPlayerDead()) {
        eng.isOver = true; eng.result = 'defeat'
        await delay(600); finishCombat('defeat'); return
      }
    }

    // Boss turn
    eng.log(`\n— Boss Turn —`)
    const actionHeader = document.querySelector('.action-header')
    if (actionHeader) actionHeader.textContent = 'Enemy Acting...'
    document.getElementById('round-num').textContent = eng.round

    await delay(400)
    await eng.bossTurn()
    eng.round++
    bossHitFlash(6)

    updatePlayerUI(eng.char)

    if (eng.isPlayerDead()) {
      eng.isOver = true
      eng.result = 'defeat'
      await delay(600)
      finishCombat('defeat')
      return
    }

    actionLocked = false
    setActionsEnabled(true)
    if (actionHeader) actionHeader.textContent = 'Your Turn — Choose an Action'
  }

  // Attack
  document.getElementById('act-attack')?.addEventListener('click', () => {
    doPlayerAction(async () => {
      const weapon = getEquippedWeapon()
      const res = await eng.playerAttack(weapon)
      if (res.hit) bossHitFlash(8)
      return res
    })
  })

  // Spell submenu
  document.getElementById('act-spell')?.addEventListener('click', () => {
    if (actionLocked) return
    showSubActions(char.spells.map(s => ({
      label: `${s.name} (L${s.level}) ${char.spellSlots[s.level] > 0 ? '' : '[NO SLOTS]'}`,
      fn: async () => {
        const res = await eng.playerSpell(s)
        if (res.success && res.damage) bossHitFlash(7)
        return res
      }
    })))
  })

  // Ability submenu
  document.getElementById('act-ability')?.addEventListener('click', () => {
    if (actionLocked) return
    showSubActions(char.abilities.map(a => ({
      label: `${a.name} (${a.usesLeft === Infinity ? '∞' : a.usesLeft})`,
      fn: async () => {
        const res = await eng.useAbility(a)
        if (res.damage) bossHitFlash(7)
        return res
      }
    })))
  })

  // Dodge
  document.getElementById('act-dodge')?.addEventListener('click', () => {
    doPlayerAction(() => eng.playerDodge())
  })

  // Item submenu
  document.getElementById('act-item')?.addEventListener('click', () => {
    if (actionLocked) return
    const consumables = (game.state.inventory || []).filter(i => i.type === 'consumable')
    if (consumables.length === 0) {
      eng.log('No consumables in inventory.')
      return
    }
    showSubActions(consumables.map(item => ({
      label: `${item.name}`,
      fn: async () => {
        // Remove from inventory
        game.state.inventory = game.state.inventory.filter(i => i.uid !== item.uid)
        if (item.heal) {
          const { rollDamage } = await import('../game/dice.js')
          const h = rollDamage(item.heal)
          char.hp = Math.min(char.maxHp, char.hp + h)
          eng.log(`[HEAL] Used ${item.name}: healed ${h}! (${char.hp}/${char.maxHp})`)
        }
        if (item.removeCondition) {
          char.conditions = char.conditions.filter(c => c !== item.removeCondition)
          eng.log(`[CURE] ${item.removeCondition} removed!`)
        }
        if (item.addBuff && !char.conditions.includes(item.addBuff)) {
          char.conditions.push(item.addBuff)
          eng.log(`[BUFF] ${char.name} is now ${item.addBuff}!`)
        }
        return { success: true }
      }
    })))
  })

  function showSubActions(options) {
    const mainRow = document.getElementById('main-actions')
    const subRow = document.getElementById('sub-actions')
    mainRow.classList.add('hidden')
    subRow.classList.remove('hidden')
    subRow.innerHTML = `
      <button class="act-btn act-back" id="sub-back">← Back</button>
      ${options.map((opt, i) => `<button class="act-btn sub-btn" data-idx="${i}">${opt.label}</button>`).join('')}
    `
    document.getElementById('sub-back')?.addEventListener('click', () => {
      mainRow.classList.remove('hidden')
      subRow.classList.add('hidden')
    })
    subRow.querySelectorAll('.sub-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        mainRow.classList.remove('hidden')
        subRow.classList.add('hidden')
        const idx = parseInt(btn.dataset.idx)
        doPlayerAction(options[idx].fn)
      })
    })
  }

  function setActionsEnabled(enabled) {
    document.querySelectorAll('.act-btn').forEach(b => {
      b.disabled = !enabled
      b.style.opacity = enabled ? '1' : '0.5'
    })
    const header = document.querySelector('.action-header')
    if (header) header.textContent = enabled ? 'Your Turn — Choose an Action' : '[ Resolving... ]'
  }

  // Boss intro banner fade
  setTimeout(() => {
    const banner = document.getElementById('boss-intro')
    if (banner) { banner.style.opacity = '0'; setTimeout(() => banner.remove(), 600) }
  }, 3000)
}

function finishCombat(result) {
  const nextScene = result === 'victory'
    ? game.state.combatNextVictory
    : game.state.combatNextDefeat

  if (result === 'victory') {
    const boss = getBoss(game.state.combatBossId)
    game.addXP(boss?.xp || 1000)

    // Go to loot then next scene
    game.update({
      lootTable: boss?.lootTable || 'encounter_common',
      afterLootScene: nextScene,
      sceneId: nextScene
    })
    if (cleanupFn) cleanupFn()
    game.navigate('loot')
  } else {
    game.update({ sceneId: nextScene || 'death_screen' })
    if (cleanupFn) cleanupFn()
    game.navigate('narrative')
  }
}

function updatePlayerUI(char) {
  const hpFill = document.getElementById('hp-fill')
  const hpText = document.getElementById('hp-text')
  const condDiv = document.getElementById('player-conditions')

  if (hpFill) hpFill.style.width = `${Math.max(0, (char.hp / char.maxHp) * 100)}%`
  if (hpText) hpText.textContent = `${Math.max(0, char.hp)}/${char.maxHp}`

  if (condDiv) {
    condDiv.innerHTML = char.conditions.map(c => {
      const cData = CONDITIONS[c]
      return cData ? `<span class="cond-tag" style="color:${cData.color}" title="${cData.effect}">${cData.icon} ${cData.name}</span>` : ''
    }).join('')
  }

  // Update spell slots display
  const slotsDiv = document.querySelector('.spell-slots')
  if (slotsDiv && char.spellSlots) {
    const rows = Object.entries(char.spellSlots).map(([lvl, count]) =>
      `<span class="slot-pip-group">${'◆'.repeat(Math.max(0,count))}${'◇'.repeat(Math.max(0,(char.maxSpellSlots[lvl]||0) - count))}</span>`
    ).join('')
    slotsDiv.innerHTML = `${gi(I.SPELL, 14)} ${rows}`
  }
}

function updateLog(lines) {
  const logEl = document.getElementById('combat-log')
  if (!logEl) return
  const last20 = lines.slice(-25)
  logEl.innerHTML = last20.map(l => {
    if (l.includes('**')) {
      l = l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    }
    let cls = 'log-entry'
    if (l.includes('💢') || l.includes('damage')) cls += ' log-damage'
    if (l.includes('💚') || l.includes('healed')) cls += ' log-heal'
    if (l.includes('❌') || l.includes('miss')) cls += ' log-miss'
    if (l.includes('⚡⚡') || l.includes('PHASE') || l.includes('enters')) cls += ' log-phase'
    return `<div class="${cls}">${l}</div>`
  }).join('')
  logEl.scrollTop = logEl.scrollHeight
}

function getEquippedWeapon() {
  const inv = game.state.inventory || []
  return inv.find(i => i.type === 'weapon') || null
}
