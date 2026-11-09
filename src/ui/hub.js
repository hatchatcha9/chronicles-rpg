// Grimhaven hub town screen

import { game } from '../game/engine.js'
import { getMainQuestStage, getAvailableSideQuests } from '../data/quests.js'
import { gi, I } from '../icons.js'
import { drawArenaBackground } from '../sprites/terrain.js'

export function mountHub(container) {
  const state = game.state
  const mqStage = getMainQuestStage(state.mainQuestStage || 0)
  const availQuests = getAvailableSideQuests(state.flags || {}, state.completedQuests || [])

  container.innerHTML = `
    <div id="hub-screen" class="screen active hub-screen">
      <canvas id="hub-canvas"></canvas>
      <div class="hub-ui">

        <div class="hub-header">
          <button class="btn-back hub-back" id="btn-world-map">← World Map</button>
          <div class="hub-title-block">
            <h2 class="hub-town-name">Grimhaven</h2>
            <span class="hub-town-sub">Last Free Settlement of the Broken Marches</span>
          </div>
          <div class="hub-gold-display">${gi(I.ABILITY, 14)} ${state.gold || 0} <span class="hub-gold-label">gold</span></div>
          <button class="btn-fantasy btn-ghost hub-skill-btn" id="btn-skill-tree">⟁ Skill Tree</button>
        </div>

        <div class="hub-content">

          <!-- Character status -->
          <div class="hub-char-panel gothic-panel">
            <div class="hub-char-name">${state.character?.name || 'Adventurer'} <span class="hub-char-class">${state.character?.className || ''}</span></div>
            <div class="hub-char-hp">
              <div class="hub-hp-bar"><div class="hub-hp-fill" style="width:${hpPct(state)}%"></div></div>
              <span class="hub-hp-text">${state.character?.hp ?? '?'}/${state.character?.maxHp ?? '?'} HP</span>
            </div>
            <button class="btn-fantasy btn-ghost hub-rest-btn" id="btn-rest">Rest at the Inn (Free)</button>
          </div>

          <!-- Services grid -->
          <div class="hub-services">
            <div class="hub-service-card gothic-panel" id="svc-blacksmith">
              <div class="hub-svc-icon">${gi(I.ATTACK, 28)}</div>
              <div class="hub-svc-name">The Broken Forge</div>
              <div class="hub-svc-sub">Blacksmith</div>
              <div class="hub-svc-desc">Weapons and armor, salvaged and re-edged. Nothing glamorous. Everything functional.</div>
              <button class="btn-fantasy btn-primary hub-enter-btn">Enter →</button>
            </div>

            <div class="hub-service-card gothic-panel" id="svc-alchemist">
              <div class="hub-svc-icon">${gi(I.POTION, 28)}</div>
              <div class="hub-svc-name">The Venom & Cure</div>
              <div class="hub-svc-sub">Alchemist</div>
              <div class="hub-svc-desc">Draughts, phials, purgatives. The alchemist doesn't ask what you need them for.</div>
              <button class="btn-fantasy btn-primary hub-enter-btn">Enter →</button>
            </div>

            <div class="hub-service-card gothic-panel" id="svc-lorekeeper">
              <div class="hub-svc-icon">${gi(I.ABILITY, 28)}</div>
              <div class="hub-svc-name">The Lorekeeper</div>
              <div class="hub-svc-sub">Scholar & Questgiver</div>
              <div class="hub-svc-desc">An old man who has read too much and forgotten how to sleep. He knows what the fractures mean.</div>
              <button class="btn-fantasy btn-primary hub-enter-btn">Enter →</button>
            </div>

            <div class="hub-service-card gothic-panel" id="svc-noticeboard">
              <div class="hub-svc-icon">${gi(I.PROF, 28)}</div>
              <div class="hub-svc-name">Notice Board</div>
              <div class="hub-svc-sub">${availQuests.length} Quest${availQuests.length !== 1 ? 's' : ''} Available</div>
              <div class="hub-svc-desc">${availQuests.length > 0 ? availQuests.map(q => `· ${q.title}`).join('<br>') : 'No bounties posted.'}</div>
              <button class="btn-fantasy btn-primary hub-enter-btn">View →</button>
            </div>
          </div>

            <!-- Skill tree button -->
          <button class="hub-skill-tree-btn gothic-panel" id="btn-skill-tree-panel">
            <span class="hub-skt-icon">⬡</span>
            <span>Skill Tree</span>
          </button>

        <!-- Main quest reminder -->
          <div class="hub-mq-panel gothic-panel">
            <div class="hub-mq-label">Main Quest</div>
            <div class="hub-mq-title">${mqStage.title}</div>
            <div class="hub-mq-obj">${mqStage.objective}</div>
            ${mqStage.hint ? `<div class="hub-mq-hint">${mqStage.hint}</div>` : ''}
          </div>

        </div>
      </div>
    </div>
  `

  // Canvas background
  const canvas = document.getElementById('hub-canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  let frame = 0, raf
  function draw() {
    drawArenaBackground(ctx, canvas.width, canvas.height, 'crypt', frame++)
    raf = requestAnimationFrame(draw)
  }
  draw()

  // Nav
  document.getElementById('btn-world-map')?.addEventListener('click', () => {
    cancelAnimationFrame(raf)
    game.navigate('world-map')
  })

  // Rest
  document.getElementById('btn-rest')?.addEventListener('click', () => {
    const char = game.state.character
    if (!char) return
    const wasHp = char.hp
    char.hp = char.maxHp
    game.update({ character: char })
    const fillEl = document.querySelector('.hub-hp-fill')
    if (fillEl) fillEl.style.width = '100%'
    const textEl = document.querySelector('.hub-hp-text')
    if (textEl) textEl.textContent = `${char.maxHp}/${char.maxHp} HP`
    const btn = document.getElementById('btn-rest')
    if (btn) { btn.textContent = 'Rested — HP Restored'; btn.disabled = true; btn.style.opacity = '0.5' }
  })

  // Service cards
  document.getElementById('svc-blacksmith')?.querySelector('.hub-enter-btn')?.addEventListener('click', () => {
    cancelAnimationFrame(raf)
    game.update({ shopId: 'blacksmith' })
    game.navigate('shop')
  })

  document.getElementById('svc-alchemist')?.querySelector('.hub-enter-btn')?.addEventListener('click', () => {
    cancelAnimationFrame(raf)
    game.update({ shopId: 'alchemist' })
    game.navigate('shop')
  })

  document.getElementById('svc-lorekeeper')?.querySelector('.hub-enter-btn')?.addEventListener('click', () => {
    cancelAnimationFrame(raf)
    game.navigate('quest-log')
  })

  document.getElementById('svc-noticeboard')?.querySelector('.hub-enter-btn')?.addEventListener('click', () => {
    cancelAnimationFrame(raf)
    game.navigate('quest-log')
  })

  const goSkillTree = () => {
    cancelAnimationFrame(raf)
    game.update({ skillTreeReturn: 'hub' })
    game.navigate('skill-tree')
  }
  document.getElementById('btn-skill-tree')?.addEventListener('click', goSkillTree)
  document.getElementById('btn-skill-tree-panel')?.addEventListener('click', goSkillTree)

}

function hpPct(state) {
  const char = state.character
  if (!char) return 100
  return Math.max(0, Math.round((char.hp / char.maxHp) * 100))
}
