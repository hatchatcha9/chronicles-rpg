// Character creation screen

import { game } from '../game/engine.js'
import { CLASSES } from '../data/classes.js'
import { RACES, applyRacialBonuses } from '../data/races.js'
import { rollStats, modifier } from '../game/dice.js'
import { drawWeaponSprite } from '../sprites/weapon-sprites.js'
import { gi, getClassIcon, I } from '../icons.js'

const SKILL_POINTS = 2

let selectedClass = null
let selectedRace  = null
let rolledStats   = null
let allocatedAbilities = new Set()
let activeTab = 'race'

export function mountCharCreate(container) {
  selectedClass = null
  selectedRace  = null
  rolledStats   = null
  allocatedAbilities = new Set()
  activeTab = 'race'

  container.innerHTML = `
    <div id="char-create" class="screen active">
      <div class="cc-layout">
        <!-- Left: tabbed sidebar -->
        <div class="cc-sidebar">
          <button class="btn-back" id="back-campaign">← Back</button>
          <div class="cc-tabs">
            <button class="cc-tab active" data-tab="race">Race</button>
            <button class="cc-tab" data-tab="class">Class</button>
          </div>
          <div class="cc-tab-panel" id="cc-tab-race">
            <h3 class="cc-sidebar-title">Choose Race</h3>
            <div class="cc-class-list" id="race-list">
              ${RACES.map(r => `
                <div class="class-entry race-entry" data-id="${r.id}">
                  <span class="class-icon" style="color:${r.color}">${r.name[0]}</span>
                  <span class="class-name">${r.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="cc-tab-panel hidden" id="cc-tab-class">
            <h3 class="cc-sidebar-title">Choose Class</h3>
            <div class="cc-class-list" id="class-list">
              ${CLASSES.map(c => `
                <div class="class-entry" data-id="${c.id}">
                  <span class="class-icon">${getClassIcon(c.id, 20)}</span>
                  <span class="class-name">${c.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Center: detail -->
        <div class="cc-main" id="cc-main">
          <div class="cc-placeholder">
            <div class="cc-placeholder-icon">${gi(I.SWORD, 42, '4a3020')}</div>
            <p>Select a race to begin</p>
          </div>
        </div>

        <!-- Right: stats panel -->
        <div class="cc-stats-panel" id="cc-stats">
          <div class="cc-stats-placeholder">
            <p>Choose a race and class first</p>
          </div>
        </div>
      </div>
    </div>
  `

  // Tab switching
  document.querySelectorAll('.cc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cc-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      activeTab = tab.dataset.tab
      document.getElementById('cc-tab-race').classList.toggle('hidden', activeTab !== 'race')
      document.getElementById('cc-tab-class').classList.toggle('hidden', activeTab !== 'class')
      if (activeTab === 'race' && selectedRace) renderRaceDetail(selectedRace)
      if (activeTab === 'class' && selectedClass) renderClassDetail(selectedClass)
      if (activeTab === 'class' && !selectedClass) {
        document.getElementById('cc-main').innerHTML = `<div class="cc-placeholder"><p>Select a class</p></div>`
      }
    })
  })

  // Race selection
  document.querySelectorAll('.race-entry').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.race-entry').forEach(e => e.classList.remove('selected'))
      el.classList.add('selected')
      selectedRace = RACES.find(r => r.id === el.dataset.id)
      renderRaceDetail(selectedRace)
      if (rolledStats && selectedClass) renderStatsPanel(selectedClass, rolledStats)
    })
  })

  // Class selection
  document.querySelectorAll('.class-entry:not(.race-entry)').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.class-entry:not(.race-entry)').forEach(e => e.classList.remove('selected'))
      el.classList.add('selected')
      selectedClass = CLASSES.find(c => c.id === el.dataset.id)
      allocatedAbilities = new Set()
      renderClassDetail(selectedClass)
      if (!rolledStats) rollNewStats()
      else renderStatsPanel(selectedClass, rolledStats)
    })
  })

  document.getElementById('back-campaign')?.addEventListener('click', () => {
    game.navigate('title')
  })
}

function renderRaceDetail(race) {
  const main = document.getElementById('cc-main')
  main.innerHTML = `
    <div class="cc-detail">
      <div class="cc-detail-header" style="--class-color:${race.color}">
        <span class="cc-detail-icon" style="font-size:28px;color:${race.color}">${race.name[0]}</span>
        <div>
          <h2 class="cc-detail-name">${race.name}</h2>
          <div class="cc-detail-meta">
            <span>Size: ${race.size}</span>
            <span>Speed: ${race.speed}ft</span>
          </div>
        </div>
      </div>
      <p class="cc-detail-flavor">${race.flavor}</p>
      <p class="cc-detail-desc">${race.description}</p>
      <div class="cc-detail-lore">${race.lore}</div>

      <div class="cc-section">
        <h4>Stat Bonuses</h4>
        <div class="race-stat-bonuses">
          ${Object.entries(race.statBonuses).map(([s, b]) => `
            <span class="race-stat-chip">${s.toUpperCase()} +${b}</span>
          `).join('')}
        </div>
      </div>

      <div class="cc-section">
        <h4>Racial Traits</h4>
        ${race.traits.map(t => `
          <div class="race-trait">
            <span class="race-trait-name">${t.name}</span>
            <span class="race-trait-desc">${t.description}</span>
          </div>
        `).join('')}
      </div>

      <div class="cc-section">
        <button class="btn-fantasy btn-primary" id="race-next-btn">Choose Class →</button>
      </div>
    </div>
  `

  document.getElementById('race-next-btn')?.addEventListener('click', () => {
    // Switch to class tab
    document.querySelectorAll('.cc-tab').forEach(t => t.classList.remove('active'))
    document.querySelector('[data-tab="class"]')?.classList.add('active')
    activeTab = 'class'
    document.getElementById('cc-tab-race').classList.add('hidden')
    document.getElementById('cc-tab-class').classList.remove('hidden')
    if (selectedClass) renderClassDetail(selectedClass)
    else document.getElementById('cc-main').innerHTML = `<div class="cc-placeholder"><p>Select a class</p></div>`
  })
}

function renderClassDetail(cls) {
  const main = document.getElementById('cc-main')
  main.innerHTML = `
    <div class="cc-detail">
      <div class="cc-detail-header" style="--class-color:${cls.color}">
        <span class="cc-detail-icon">${getClassIcon(cls.id, 34)}</span>
        <div>
          <h2 class="cc-detail-name">${cls.name}</h2>
          <div class="cc-detail-meta">
            <span>HD d${cls.hitDie}</span>
            <span>Saves: ${cls.savingThrows.join(', ').toUpperCase()}</span>
            <span>Attack: ${cls.attackStat.toUpperCase()}</span>
          </div>
        </div>
      </div>
      <p class="cc-detail-flavor">${cls.flavor}</p>
      <p class="cc-detail-desc">${cls.description}</p>
      <div class="cc-detail-lore">${cls.lore}</div>

      <div class="cc-section">
        <div class="cc-abilities-header">
          <h4>Class Abilities</h4>
          <div class="tree-points-counter">
            <span class="pts-label">Skill Points</span>
            <span class="pts-pips" id="pts-pips">
              ${Array.from({ length: SKILL_POINTS }, (_, i) => `<span class="pts-pip ${i < (SKILL_POINTS - allocatedAbilities.size) ? 'available' : 'spent'}" data-pip="${i}"></span>`).join('')}
            </span>
            <span class="pts-text"><span id="points-left">${SKILL_POINTS - allocatedAbilities.size}</span> / ${SKILL_POINTS} left</span>
          </div>
        </div>
        <div class="ability-tree">
          <svg class="tree-svg" id="tree-svg"></svg>
          <div class="tree-nodes" id="tree-nodes">
            ${cls.abilities.map((a, i) => `
              <div class="tree-node ${allocatedAbilities.has(i) ? 'unlocked' : ''}" data-index="${i}" title="${allocatedAbilities.has(i) ? 'Click to remove' : 'Click to unlock'}">
                <div class="node-ring">
                  <div class="node-core">${gi(I.ABILITY, 18)}</div>
                </div>
                <div class="node-label">
                  <div class="node-name">${a.name}</div>
                  <div class="node-desc">${a.description}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <p class="tree-hint">Click abilities to invest skill points. Unlocked abilities are yours at the start.</p>
      </div>

      ${cls.spells ? `
        <div class="cc-section">
          <h4>Starting Spells</h4>
          <div class="spell-list">
            ${cls.spells.map(s => `
              <div class="spell-chip">
                <span>${gi(I.SPELL, 14)}</span>
                <span>${s.name} <small>(Lv.${s.level})</small></span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="cc-section">
        <canvas id="weapon-preview" width="120" height="120"></canvas>
        <p class="cc-weapon-label">${weaponName(cls.weaponDamage)} — ${cls.weaponDamage} damage</p>
      </div>
    </div>
  `

  // Draw weapon sprite
  const canvas = document.getElementById('weapon-preview')
  if (canvas) {
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = '#0a0a10'
    ctx.fillRect(0, 0, 120, 120)
    const spriteId = classToWeaponSprite(cls.id)
    drawWeaponSprite(ctx, spriteId, 60, 60, 8)
  }

  requestAnimationFrame(() => initAbilityTree())
}

function initAbilityTree() {
  const container = document.querySelector('.ability-tree')
  const svg = document.getElementById('tree-svg')
  const nodesEl = document.querySelectorAll('.tree-node')
  if (!container || !svg || !nodesEl.length) return

  const nodes = [...nodesEl]
  const connectors = []

  const cr = container.getBoundingClientRect()
  svg.setAttribute('viewBox', `0 0 ${cr.width} ${cr.height}`)
  svg.setAttribute('width', cr.width)
  svg.setAttribute('height', cr.height)

  function updatePointsUI() {
    const left = SKILL_POINTS - allocatedAbilities.size
    const leftEl = document.getElementById('points-left')
    if (leftEl) leftEl.textContent = left
    const pips = document.querySelectorAll('.pts-pip')
    pips.forEach((pip, i) => {
      pip.className = 'pts-pip ' + (i < left ? 'available' : 'spent')
    })
  }

  function updateConnectorLighting() {
    connectors.forEach(c => {
      const bothUnlocked = allocatedAbilities.has(c.from) && allocatedAbilities.has(c.to)
      c.line.classList.toggle('lit', bothUnlocked)
    })
  }

  setTimeout(() => {
    const containerRect = container.getBoundingClientRect()
    const rects = nodes.map(n => n.getBoundingClientRect())

    rects.forEach((a, i) => {
      if (i >= rects.length - 1) return
      const b = rects[i + 1]
      const x1 = a.right - containerRect.left
      const y1 = a.top + a.height / 2 - containerRect.top
      const x2 = b.left - containerRect.left
      const y2 = b.top + b.height / 2 - containerRect.top

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', x1); line.setAttribute('y1', y1)
      line.setAttribute('x2', x2); line.setAttribute('y2', y2)
      line.classList.add('tree-connector')
      svg.appendChild(line)
      connectors.push({ line, from: i, to: i + 1 })
    })

    // Initial connector state
    updateConnectorLighting()

    // Click to allocate / unallocate
    nodes.forEach((node, i) => {
      node.style.cursor = 'pointer'
      node.addEventListener('click', () => {
        if (allocatedAbilities.has(i)) {
          allocatedAbilities.delete(i)
          node.classList.remove('unlocked')
          node.title = 'Click to unlock'
        } else if ((SKILL_POINTS - allocatedAbilities.size) > 0) {
          allocatedAbilities.add(i)
          node.classList.add('unlocked')
          node.title = 'Click to remove'
          if (!node._bouncing) {
            node._bouncing = true
            node.classList.add('bouncing')
            setTimeout(() => { node.classList.remove('bouncing'); node._bouncing = false }, 650)
          }
        }
        updatePointsUI()
        updateConnectorLighting()
      })
    })

    container.addEventListener('mousemove', (e) => {
      const cr2 = container.getBoundingClientRect()
      const mx = e.clientX - cr2.left
      const my = e.clientY - cr2.top
      const liveRects = nodes.map(n => n.getBoundingClientRect())

      nodes.forEach((node, i) => {
        const nr = liveRects[i]
        const cx = nr.left + nr.width / 2 - cr2.left
        const cy = nr.top + nr.height / 2 - cr2.top
        const dist = Math.hypot(mx - cx, my - cy)

        if (dist < 80) {
          node.classList.add('near')
          if (!node._bouncing) {
            node._bouncing = true
            node.classList.add('bouncing')
            setTimeout(() => { node.classList.remove('bouncing'); node._bouncing = false }, 650)
          }
          connectors.forEach(c => {
            if ((c.from === i || c.to === i) && !c.line.classList.contains('lit')) {
              c.line.style.opacity = '0.5'
            }
          })
        } else {
          node.classList.remove('near')
          connectors.forEach(c => {
            if (c.from === i || c.to === i) c.line.style.opacity = ''
          })
        }
      })
    })
  }, 80)
}

function classToWeaponSprite(clsId) {
  const map = {
    fighter: 'sword_basic', paladin: 'sword_basic', rogue: 'dagger_bone',
    ranger: 'bow_ashen', wizard: 'staff_dark', sorcerer: 'wand_architect',
    druid: 'staff_grove', cleric: 'sword_basic', monk: 'dagger_bone',
    barbarian: 'sword_basic', bard: 'sword_basic', warlock: 'staff_dark',
    bloodhunter: 'sword_broken', artificer: 'wand_architect',
  }
  return map[clsId] || 'sword_basic'
}

function weaponName(dmgDice) {
  if (!dmgDice) return 'Unarmed'
  if (dmgDice.includes('12')) return 'Greataxe'
  if (dmgDice.includes('10')) return 'Halberd'
  if (dmgDice.includes('8'))  return 'Longsword'
  if (dmgDice.includes('6'))  return 'Shortsword'
  if (dmgDice.includes('4'))  return 'Dagger'
  return 'Weapon'
}

function rollNewStats() {
  rolledStats = rollStats()
  if (selectedClass) renderStatsPanel(selectedClass, rolledStats)
}

function renderStatsPanel(cls, stats) {
  const panel = document.getElementById('cc-stats')
  if (!panel) return

  const finalStats = selectedRace ? applyRacialBonuses(stats, selectedRace.id) : stats
  const conMod = modifier(finalStats.con)
  const dexMod = modifier(finalStats.dex)
  const maxHp = cls.hitDie + conMod
  const ac = cls.startingAC + dexMod

  panel.innerHTML = `
    <div class="stats-panel">
      <h3 class="stats-title">Ability Scores</h3>
      ${selectedRace ? `<div class="stats-race-badge" style="border-color:${selectedRace.color}40;color:${selectedRace.color}">◈ ${selectedRace.name}</div>` : ''}
      <div class="stat-rows">
        ${['str','dex','con','int','wis','cha'].map(s => {
          const base = stats[s]
          const bonus = selectedRace?.statBonuses[s] || 0
          const val = finalStats[s]
          const mod = modifier(val)
          const isPrimary = cls.attackStat === s
          return `
            <div class="stat-row ${isPrimary ? 'primary-stat' : ''}">
              <span class="stat-abbr">${s.toUpperCase()}</span>
              <div class="stat-bar-wrap">
                <div class="stat-bar" style="width:${Math.round((val/20)*100)}%"></div>
              </div>
              <span class="stat-val">${val}${bonus > 0 ? `<span class="stat-racial-bonus">+${bonus}</span>` : ''}</span>
              <span class="stat-mod ${mod >= 0 ? 'pos' : 'neg'}">${mod >= 0 ? '+' : ''}${mod}</span>
            </div>
          `
        }).join('')}
      </div>

      <div class="derived-stats">
        <div class="derived-stat"><span>${gi(I.HP, 14)} Max HP</span><strong>${maxHp}</strong></div>
        <div class="derived-stat"><span>${gi(I.SHIELD, 14)} Starting AC</span><strong>${ac}</strong></div>
        <div class="derived-stat"><span>${gi(I.PROF, 14)} Prof Bonus</span><strong>+2</strong></div>
        ${cls.spellSlots && Object.keys(cls.spellSlots).length > 0 ? `
          <div class="derived-stat"><span>${gi(I.SLOTS, 14)} Spell Slots</span><strong>${Object.entries(cls.spellSlots).map(([k,v])=>`${v}×L${k}`).join(', ')}</strong></div>
        ` : ''}
      </div>

      <div class="stats-actions">
        <button class="btn-fantasy btn-ghost" id="reroll-btn">Roll Again</button>
        <input class="name-input" id="char-name" type="text" placeholder="Enter name..." maxlength="20"/>
        <button class="btn-fantasy btn-primary" id="begin-btn">Begin →</button>
      </div>
      ${!selectedRace ? `<p class="stats-warning">← Choose a Race first</p>` : ''}
    </div>
  `

  document.getElementById('reroll-btn')?.addEventListener('click', rollNewStats)
  document.getElementById('begin-btn')?.addEventListener('click', () => {
    if (!selectedClass) return
    const name = document.getElementById('char-name')?.value.trim() || ''
    const char = game.buildCharacter(selectedClass, finalStats, name)
    if (allocatedAbilities.size > 0) {
      char.abilities = char.abilities.filter((_, i) => allocatedAbilities.has(i))
    }
    char.raceId   = selectedRace?.id   || 'human'
    char.raceName = selectedRace?.name || 'Human'
    char.classId  = selectedClass.id
    char.skillPoints = 3
    game.update({
      character: char, level: 1, xp: 0,
      inventory: [], sceneId: 'start', choices: {}, flags: {},
      gold: 100, worldLocation: 'grimhaven',
      unlockedNodes: [], skillPoints: 3,
    })
    game.navigate('hub')
  })
}
