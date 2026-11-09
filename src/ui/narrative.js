// Narrative / story screen with choices

import { game } from '../game/engine.js'
import { getCampaign, getScene } from '../data/campaigns.js'
import { drawArenaBackground } from '../sprites/terrain.js'
import { gi, getClassIcon, I } from '../icons.js'

let cleanupFn = null
let typewriterTimer = null

export function mountNarrative(container) {
  const campaign = getCampaign(game.state.campaign)
  if (!campaign) { game.navigate('campaign-select'); return }

  const sceneId = game.state.sceneId || 'start'
  const scene = getScene(campaign, sceneId)

  if (!scene) { game.navigate('title'); return }

  // Handle special scene types
  if (scene.type === 'combat') {
    game.update({ combatBossId: scene.bossId, combatNextVictory: scene.next_victory, combatNextDefeat: scene.next_defeat })
    game.navigate('combat')
    return
  }
  if (scene.type === 'death') {
    showDeathScreen(container, scene, campaign)
    return
  }
  if (scene.type === 'ending') {
    showEndingScreen(container, scene, campaign)
    return
  }

  // Narrative scene
  container.innerHTML = `
    <div id="narrative-screen" class="screen active">
      <canvas id="narrative-canvas"></canvas>
      <div class="narrative-ui">
        <!-- HUD -->
        <div class="narrative-hud">
          <div class="hud-char">
            <span class="hud-icon">${getClassIcon(game.state.character?.class, 20)}</span>
            <span class="hud-name">${game.state.character?.name || 'Adventurer'}</span>
            <div class="hud-hp-bar">
              <div class="hud-hp-fill" style="width:${hpPercent()}%"></div>
            </div>
            <span class="hud-hp-text">${game.state.character?.hp ?? '?'}/${game.state.character?.maxHp ?? '?'} HP</span>
          </div>
          <div class="hud-campaign">
            <span>${campaign.subtitle}</span>
          </div>
        </div>

        <!-- Story panel -->
        <div class="story-panel" id="story-panel">
          <div class="story-location">
            <span class="location-icon">${gi('lorc/position-marker', 14)}</span>
            <span>${scene.title || 'Unknown Location'}</span>
          </div>
          <div class="story-text" id="story-text"></div>
          <div class="story-choices" id="story-choices" style="opacity:0;pointer-events:none">
            ${renderChoices(scene, campaign)}
            ${sceneId === 'start' ? `<div class="story-hint">Your choices drive the story — there is no wrong path, only different costs.</div>` : ''}
          </div>
        </div>

        <!-- Inventory quick bar -->
        ${(inv => inv ? `<div class="quick-bar">${inv}</div>` : '')(getInventoryBar())}
      </div>
    </div>
  `

  // Background canvas
  const canvas = document.getElementById('narrative-canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  let frame = 0
  let raf

  function drawBg() {
    drawArenaBackground(ctx, canvas.width, canvas.height, scene.atmosphere || 'crypt', frame)
    frame++
    raf = requestAnimationFrame(drawBg)
  }
  drawBg()

  // Typewriter text
  typewriterText(resolveSceneText(scene), 'story-text', () => {
    const choices = document.getElementById('story-choices')
    if (choices) {
      choices.style.opacity = '1'
      choices.style.pointerEvents = 'auto'
      choices.style.transition = 'opacity 0.4s ease'
    }
  })

  // Choice handlers
  bindChoices(scene, campaign)

  const cleanup = () => {
    cancelAnimationFrame(raf)
    clearTimeout(typewriterTimer)
  }
  cleanupFn = cleanup
  return cleanup
}

function renderChoices(scene, campaign) {
  if (!scene.choices || scene.choices.length === 0) return ''
  return scene.choices.map((ch, i) => `
    <button class="choice-btn" data-choice="${ch.id}" data-next="${ch.next || ''}" data-combat="${ch.combatId || ''}">
      <span class="choice-num">${String.fromCharCode(65 + i)}</span>
      <span class="choice-text">${ch.text}</span>
    </button>
  `).join('')
}

function bindChoices(scene, campaign) {
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const choiceId = btn.dataset.choice
      const nextId = btn.dataset.next

      // Record choice
      game.recordChoice(scene.id, choiceId)

      // Apply flags
      const choice = scene.choices?.find(c => c.id === choiceId)
      if (choice?.flag) {
        choice.flag.forEach(f => game.setFlag(f, true))
      }

      // Apply rest heal
      if (choice?.heal) {
        const char = game.state.character
        if (char) {
          const amount = Math.ceil(char.maxHp * choice.heal)
          char.hp = Math.min(char.maxHp, char.hp + amount)
        }
      }

      if (cleanupFn) cleanupFn()

      // Navigate to next scene
      if (nextId) {
        game.update({ sceneId: nextId })
        game.navigate('narrative')
      }
    })
  })
}

function typewriterText(text, elementId, onComplete) {
  const el = document.getElementById(elementId)
  if (!el) { if (onComplete) onComplete(); return }
  el.innerHTML = ''

  // Format text: double newlines = paragraph breaks
  const paragraphs = text.split('\n\n')
  const formatted = paragraphs.map(p => `<p class="story-para">${p.replace(/\n/g, '<br/>')}</p>`).join('')
  el.innerHTML = formatted

  // Animate paragraphs in
  const paras = el.querySelectorAll('.story-para')
  paras.forEach((para, i) => {
    para.style.opacity = '0'
    para.style.transform = 'translateY(8px)'
    typewriterTimer = setTimeout(() => {
      para.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
      para.style.opacity = '1'
      para.style.transform = 'none'
      if (i === paras.length - 1 && onComplete) {
        setTimeout(onComplete, 500)
      }
    }, i * 250)
  })
}

function hpPercent() {
  const char = game.state.character
  if (!char) return 100
  return Math.max(0, Math.round((char.hp / char.maxHp) * 100))
}


function resolveSceneText(scene) {
  if (!scene.flagText) return scene.text
  for (const [flag, variants] of Object.entries(scene.flagText)) {
    const has = game.getFlag(flag)
    if (has && variants.set) return variants.set
    if (!has && variants.missing) return variants.missing
  }
  return scene.text
}

function getInventoryBar() {
  const inv = game.state.inventory || []
  const consumables = inv.filter(i => i.type === 'consumable').slice(0, 4)
  if (consumables.length === 0) return ''
  return consumables.map(item => `
    <div class="qbar-item" title="${item.name}">
      <span>${gi(item.type === 'consumable' ? I.POTION : I.SWORD, 16)}</span>
      <span class="qbar-name">${item.name.slice(0,10)}</span>
    </div>
  `).join('')
}

function showDeathScreen(container, scene, campaign) {
  container.innerHTML = `
    <div id="death-screen" class="screen active">
      <canvas id="death-canvas"></canvas>
      <div class="death-ui">
        <div class="death-sigil">${gi('lorc/skull', 48, '8b1a1a')}</div>
        <h2 class="death-title">You Have Fallen</h2>
        <p class="death-text">${scene.text}</p>
        <div class="death-buttons">
          <button class="btn-fantasy btn-primary" id="retry-btn">Try Again</button>
          <button class="btn-fantasy btn-ghost" id="abandon-btn">Abandon Campaign</button>
        </div>
      </div>
    </div>
  `

  const canvas = document.getElementById('death-canvas')
  canvas.width = window.innerWidth; canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  let frame = 0
  let raf
  function draw() {
    drawArenaBackground(ctx, canvas.width, canvas.height, 'void', frame++)
    raf = requestAnimationFrame(draw)
  }
  draw()

  document.getElementById('retry-btn')?.addEventListener('click', () => {
    cancelAnimationFrame(raf)
    // Restore HP to half
    if (game.state.character) {
      game.state.character.hp = Math.ceil(game.state.character.maxHp / 2)
    }
    game.update({ deaths: (game.state.deaths || 0) + 1 })
    game.navigate('narrative')
  })
  document.getElementById('abandon-btn')?.addEventListener('click', () => {
    cancelAnimationFrame(raf)
    game.navigate('campaign-select')
  })
}

function showEndingScreen(container, scene, campaign) {
  if (scene.xp) game.addXP(scene.xp)

  container.innerHTML = `
    <div id="ending-screen" class="screen active">
      <canvas id="ending-canvas"></canvas>
      <div class="ending-ui">
        <div class="ending-sigil">${gi(I.SWORD, 48, 'd4a830')}</div>
        <h2 class="ending-title">${scene.title}</h2>
        <div class="ending-text">${scene.text.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
        ${scene.xp ? `<div class="ending-xp">✦ ${scene.xp} Experience Gained</div>` : ''}
        <div class="ending-buttons">
          <button class="btn-fantasy btn-primary" id="ending-loot">Collect Rewards</button>
          <button class="btn-fantasy btn-ghost" id="ending-home">Return to Campaigns</button>
        </div>
      </div>
    </div>
  `

  const canvas = document.getElementById('ending-canvas')
  canvas.width = window.innerWidth; canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  let frame = 0
  let raf
  function draw() {
    drawArenaBackground(ctx, canvas.width, canvas.height, 'throne', frame++)
    raf = requestAnimationFrame(draw)
  }
  draw()

  document.getElementById('ending-loot')?.addEventListener('click', () => {
    cancelAnimationFrame(raf)
    game.update({ lootTable: 'encounter_boss' })
    game.navigate('loot')
  })
  document.getElementById('ending-home')?.addEventListener('click', () => {
    cancelAnimationFrame(raf)
    game.navigate('campaign-select')
  })
}
