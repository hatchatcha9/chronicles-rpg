// Interactive preview — runs while the full game engine builds
// Shows all game screens with real interactivity

import './shell.css'
import { burst, addAmbient, clearAmbient } from './fx/particles.js'
import SFX from './fx/audio.js'
import { typewrite, floatDamage, delay } from './fx/typewriter.js'

// ─────────────────────────────────────────
// LEVELING & TECH TREE DATA
// ─────────────────────────────────────────
const XP_PER_LEVEL = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000]

// Generic 3-branch talent tree — branches adapt label/flavor per class
// Each branch: Offense / Defense / Utility
const TREE_TEMPLATES = {
  Martial: {
    branches: [
      { name:'Aggression', icon:'⚔', color:'#c0392b', nodes:[
        { id:'a1', name:'Power Strike',    cost:1, desc:'+15% weapon damage on attacks.',        req:null },
        { id:'a2', name:'Cleave',          cost:1, desc:'Attacks hit all enemies in a row.',      req:'a1' },
        { id:'a3', name:'Devastating Blow',cost:2, desc:'Once per combat: deal 3× damage.',       req:'a2' },
      ]},
      { name:'Endurance', icon:'🛡', color:'#2980b9', nodes:[
        { id:'b1', name:'Iron Skin',       cost:1, desc:'+10 max HP.',                           req:null },
        { id:'b2', name:'Battle Hardened', cost:1, desc:'Reduce all incoming damage by 2.',      req:'b1' },
        { id:'b3', name:'Last Stand',      cost:2, desc:'At 25% HP, gain +5 AC and resist DMG.', req:'b2' },
      ]},
      { name:'Tactics',   icon:'🎯', color:'#f39c12', nodes:[
        { id:'c1', name:'Opportunist',     cost:1, desc:'Attacks against dodging enemies deal +1d6.',req:null },
        { id:'c2', name:'Flanking',        cost:1, desc:'Adjacent ally gives you advantage.',    req:'c1' },
        { id:'c3', name:'War Master',      cost:2, desc:'Take an extra bonus action each turn.', req:'c2' },
      ]},
    ],
  },
  Arcane: {
    branches: [
      { name:'Destruction', icon:'🔥', color:'#8e44ad', nodes:[
        { id:'a1', name:'Spell Power',     cost:1, desc:'+20% spell damage.',                    req:null },
        { id:'a2', name:'Overload',        cost:1, desc:'10% chance to cast a spell for free.',  req:'a1' },
        { id:'a3', name:'Arcane Surge',    cost:2, desc:'Next spell costs 0 MP and crits.',      req:'a2' },
      ]},
      { name:'Mastery',     icon:'📜', color:'#2980b9', nodes:[
        { id:'b1', name:'Extra Slot',      cost:1, desc:'+2 spell slots.',                       req:null },
        { id:'b2', name:'Quick Cast',      cost:1, desc:'One spell per turn costs a bonus action.',req:'b1' },
        { id:'b3', name:'Spell Echo',      cost:2, desc:'30% chance a spell fires twice.',       req:'b2' },
      ]},
      { name:'Arcana',      icon:'✨', color:'#16a085', nodes:[
        { id:'c1', name:'Mana Shield',     cost:1, desc:'10 MP absorbed before HP takes damage.',req:null },
        { id:'c2', name:'Arcane Affinity', cost:1, desc:'-2 MP cost on all spells.',             req:'c1' },
        { id:'c3', name:'Singularity',     cost:2, desc:'Summon a mana vortex that deals AoE.',  req:'c2' },
      ]},
    ],
  },
  Stealth: {
    branches: [
      { name:'Lethality',  icon:'🗡', color:'#2c3e50', nodes:[
        { id:'a1', name:'Serrated Blade',  cost:1, desc:'+1d4 bleed damage on hit.',             req:null },
        { id:'a2', name:'Vital Strike',    cost:1, desc:'Crits on 18-20 instead of 20.',        req:'a1' },
        { id:'a3', name:'Death Mark',      cost:2, desc:'Mark a target — your next hit is auto-crit.',req:'a2' },
      ]},
      { name:'Evasion',    icon:'💨', color:'#27ae60', nodes:[
        { id:'b1', name:'Light Footed',    cost:1, desc:'+2 AC while not wearing heavy armor.',  req:null },
        { id:'b2', name:'Shadow Step',     cost:1, desc:'Teleport 15ft as a bonus action.',      req:'b1' },
        { id:'b3', name:'Untouchable',     cost:2, desc:'Once per turn avoid an attack entirely.',req:'b2' },
      ]},
      { name:'Cunning',    icon:'👁', color:'#f39c12', nodes:[
        { id:'c1', name:'Trap Mastery',    cost:1, desc:'Plant a trap that stuns for 1 turn.',   req:null },
        { id:'c2', name:'Smoke Bomb',      cost:1, desc:'Impose disadvantage on 2 boss attacks.',req:'c1' },
        { id:'c3', name:'Assassinate',     cost:2, desc:'Deal 5× damage when attacking from stealth.',req:'c2' },
      ]},
    ],
  },
  Divine: {
    branches: [
      { name:'Wrath',      icon:'⚡', color:'#f39c12', nodes:[
        { id:'a1', name:'Holy Smite',      cost:1, desc:'+1d8 radiant on melee hits.',           req:null },
        { id:'a2', name:'Divine Judgment', cost:1, desc:'Smites deal double vs undead/fiends.',  req:'a1' },
        { id:'a3', name:'Wrath of God',    cost:2, desc:'Channel divinity to deal 8d8 to all.',  req:'a2' },
      ]},
      { name:'Protection', icon:'🛡', color:'#2980b9', nodes:[
        { id:'b1', name:'Sacred Aura',     cost:1, desc:'Allies gain +2 AC.',                    req:null },
        { id:'b2', name:'Ward of Faith',   cost:1, desc:'Absorb up to 15 damage per turn.',      req:'b1' },
        { id:'b3', name:'Sanctuary',       cost:2, desc:'Ally cannot be targeted for 2 turns.',  req:'b2' },
      ]},
      { name:'Mercy',      icon:'💚', color:'#27ae60', nodes:[
        { id:'c1', name:'Empowered Heal',  cost:1, desc:'Healing spells restore 30% more HP.',   req:null },
        { id:'c2', name:'Revive',          cost:1, desc:'Once per combat: revive from 0 HP (1 HP).',req:'c1' },
        { id:'c3', name:'Mass Blessing',   cost:2, desc:'Grant all allies advantage for 3 turns.',req:'c2' },
      ]},
    ],
  },
  Nature: {
    branches: [
      { name:'Primal',     icon:'🐺', color:'#27ae60', nodes:[
        { id:'a1', name:'Savage Shape',    cost:1, desc:'Wild Shape deals +1d6 natural damage.',  req:null },
        { id:'a2', name:'Pack Tactics',    cost:1, desc:'Summon a wolf companion in combat.',     req:'a1' },
        { id:'a3', name:'Apex Predator',   cost:2, desc:'Wild Shape gains +4 STR and +20 HP.',   req:'a2' },
      ]},
      { name:'Growth',     icon:'🌿', color:'#16a085', nodes:[
        { id:'b1', name:'Bark Skin',       cost:1, desc:'+3 AC while not in armor.',              req:null },
        { id:'b2', name:'Regen Spores',    cost:1, desc:'Regain 3 HP at start of each turn.',     req:'b1' },
        { id:'b3', name:'Living Fortress', cost:2, desc:'Sprout thorns — 5 DMG on melee hits vs you.',req:'b2' },
      ]},
      { name:'Storm',      icon:'⛈', color:'#8e44ad', nodes:[
        { id:'c1', name:'Call Lightning',  cost:1, desc:'1d10 lightning to one target per turn.', req:null },
        { id:'c2', name:'Gale Force',      cost:1, desc:'Push all enemies back, imposing disadv.',req:'c1' },
        { id:'c3', name:'Storm Surge',     cost:2, desc:'Summon a storm — 2d8 to all each round.',req:'c2' },
      ]},
    ],
  },
  Support: {
    branches: [
      { name:'Inspiration', icon:'🎵', color:'#9b59b6', nodes:[
        { id:'a1', name:'Battle Hymn',     cost:1, desc:'Inspiration die improves to d8.',        req:null },
        { id:'a2', name:'War Chant',       cost:1, desc:'Inspire grants +2 AC as well.',          req:'a1' },
        { id:'a3', name:'Legend',          cost:2, desc:'Inspiration now has no usage limit.',    req:'a2' },
      ]},
      { name:'Lore',        icon:'📚', color:'#2980b9', nodes:[
        { id:'b1', name:'Cutting Words',   cost:1, desc:'Use reaction to impose -1d6 on enemy roll.',req:null },
        { id:'b2', name:'Counterspell',    cost:1, desc:'Cancel one enemy spell per combat.',     req:'b1' },
        { id:'b3', name:'Forbidden Lore',  cost:2, desc:'Learn any spell from any class list.',   req:'b2' },
      ]},
      { name:'Glamour',     icon:'✨', color:'#c0392b', nodes:[
        { id:'c1', name:'Enthrall',        cost:1, desc:'One enemy skips their action.',           req:null },
        { id:'c2', name:'Hypnotic Pattern',cost:1, desc:'2 enemies lose their turn.',              req:'c1' },
        { id:'c3', name:'Mass Suggestion', cost:2, desc:'All enemies fight each other for 2 turns.',req:'c2' },
      ]},
    ],
  },
  Pact: {
    branches: [
      { name:'Eldritch',   icon:'👁', color:'#6c3483', nodes:[
        { id:'a1', name:'Agonizing Blast', cost:1, desc:'+CHA mod to Eldritch Blast damage.',     req:null },
        { id:'a2', name:'Repelling Blast', cost:1, desc:'Blast pushes enemy back 10ft.',          req:'a1' },
        { id:'a3', name:'Eldritch Barrage',cost:2, desc:'Fire 4 blasts per action instead of 2.',req:'a2' },
      ]},
      { name:'Pact',       icon:'📜', color:'#2980b9', nodes:[
        { id:'b1', name:'Pact of the Tome',cost:1, desc:'Learn 3 cantrips from any class.',       req:null },
        { id:'b2', name:'Book of Shadows', cost:1, desc:'+2 spell slots from your patron.',       req:'b1' },
        { id:'b3', name:'Eldritch Master', cost:2, desc:'Recover all spell slots on short rest.', req:'b2' },
      ]},
      { name:'Patron',     icon:'🔮', color:'#8e44ad', nodes:[
        { id:'c1', name:'Dark One\'s Blessing',cost:1, desc:'Gain THP equal to CHA mod on kill.', req:null },
        { id:'c2', name:'Hurl Through Hell', cost:1, desc:'Banish and return target: 10d10 psychic.',req:'c1' },
        { id:'c3', name:'Dark Apotheosis',cost:2, desc:'Transform: +4 all stats, fly, resist all.',req:'c2' },
      ]},
    ],
  },
  Specialist: {
    branches: [
      { name:'Power',      icon:'🩸', color:'#922b21', nodes:[
        { id:'a1', name:'Crimson Surge',   cost:1, desc:'Rite damage increases to d6.',           req:null },
        { id:'a2', name:'Blood Price',     cost:1, desc:'Pay 5 HP to deal +3d6 on a hit.',        req:'a1' },
        { id:'a3', name:'Sanguine Fury',   cost:2, desc:'Sacrifice 15 HP for +50% all damage.',   req:'a2' },
      ]},
      { name:'Craft',      icon:'⚙', color:'#1a5276', nodes:[
        { id:'b1', name:'Infuse Weapon',   cost:1, desc:'+1d4 elemental damage on your weapon.',  req:null },
        { id:'b2', name:'Arcane Armament', cost:1, desc:'Weapon counts as +1 magical.',           req:'b1' },
        { id:'b3', name:'Iron Golem Fist', cost:2, desc:'Summon a mechanical construct to fight.',req:'b2' },
      ]},
      { name:'Chi',        icon:'👊', color:'#e67e22', nodes:[
        { id:'c1', name:'Stunning Strike',  cost:1, desc:'Spend 1 Ki: stun on hit (CON save).',   req:null },
        { id:'c2', name:'Empty Body',       cost:1, desc:'Spend 4 Ki: become invisible.',         req:'c1' },
        { id:'c3', name:'Perfect Self',     cost:2, desc:'Regain 4 Ki at start of combat.',       req:'c2' },
      ]},
    ],
  },
}

const CLASS_TREE_MAP = {
  Fighter:'Martial', Paladin:'Divine', Rogue:'Stealth', Ranger:'Stealth',
  Wizard:'Arcane', Sorcerer:'Arcane', Druid:'Nature', Cleric:'Divine',
  Monk:'Specialist', Barbarian:'Martial', Bard:'Support', Warlock:'Pact',
  'Blood Hunter':'Specialist', Artificer:'Specialist',
}

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────
const CAMPAIGNS = [
  {
    id: 'ashen',
    title: 'The Ashen Throne',
    subtitle: 'An undead kingdom awaits its reckoning.',
    tags: ['Undead','Lich Boss','3 Phases','Dark'],
    difficulty: 4,
    color: '#8b1a1a',
    accent: '#c0392b',
    glow: 'rgba(139,26,26,0.5)',
    boss: 'Varethis the Undying',
    bossColor: '#6a0dad',
    spriteKey: 'lich',
  },
  {
    id: 'verdant',
    title: 'The Verdant Labyrinth',
    subtitle: 'The forest remembers. It does not forgive.',
    tags: ['Nature Horror','Corrupted','Splits','Cosmic'],
    difficulty: 3,
    color: '#1a4a2a',
    accent: '#27ae60',
    glow: 'rgba(26,74,42,0.5)',
    boss: 'Sylvanax the Unbound',
    bossColor: '#27ae60',
    spriteKey: 'treant',
  },
  {
    id: 'spire',
    title: 'The Shattered Spire',
    subtitle: 'Reality fractures. So do you.',
    tags: ['Planar','Time Loops','Mirror Boss','Arcane'],
    difficulty: 5,
    color: '#1a1a4a',
    accent: '#7c6dfa',
    glow: 'rgba(26,26,74,0.5)',
    boss: 'The Architect',
    bossColor: '#7c6dfa',
    spriteKey: 'mage',
  },
]

const CLASSES = [
  { name:'Fighter',    icon:'⚔️',  color:'#c0392b', role:'Martial',   tag:'Action Surge' },
  { name:'Paladin',    icon:'🛡️',  color:'#f39c12', role:'Divine',    tag:'Divine Smite' },
  { name:'Rogue',      icon:'🗡️',  color:'#2c3e50', role:'Stealth',   tag:'Sneak Attack' },
  { name:'Ranger',     icon:'🏹',  color:'#27ae60', role:'Hunter',    tag:"Hunter's Mark" },
  { name:'Wizard',     icon:'📜',  color:'#2980b9', role:'Arcane',    tag:'Spellbook' },
  { name:'Sorcerer',   icon:'🔮',  color:'#8e44ad', role:'Arcane',    tag:'Metamagic' },
  { name:'Druid',      icon:'🌿',  color:'#16a085', role:'Nature',    tag:'Wild Shape' },
  { name:'Cleric',     icon:'✝️',  color:'#f1c40f', role:'Divine',    tag:'Channel Divinity' },
  { name:'Monk',       icon:'👊',  color:'#e67e22', role:'Martial',   tag:'Ki Points' },
  { name:'Barbarian',  icon:'🪓',  color:'#e74c3c', role:'Martial',   tag:'Rage' },
  { name:'Bard',       icon:'🎵',  color:'#9b59b6', role:'Support',   tag:'Bardic Inspiration' },
  { name:'Warlock',    icon:'👁️',  color:'#6c3483', role:'Pact',      tag:'Eldritch Blast' },
  { name:'Blood Hunter',icon:'🩸', color:'#922b21', role:'Specialist',tag:'Crimson Rite' },
  { name:'Artificer',  icon:'⚙️',  color:'#1a5276', role:'Specialist',tag:'Infusions' },
]

// ─────────────────────────────────────────
// PIXEL ART BOSS SPRITES (canvas, 16×20 px scaled 5x)
// ─────────────────────────────────────────
const _ = ''
// Lich color palette — defined as JS constants so frames can reference them directly
const B = '#1a0030'
const b = '#3d0070'
const P = '#6a0dad'
const p = '#b97fff'
const W = '#e8e0f0'
const G = '#888888'
const g = '#555555'
const Y = '#ffe066'

const SPRITES = {
  lich: {
    frames: [
      // frame 0 — arms at sides
      [
        [_,_,_,_,_,_,B,B,B,B,_,_,_,_,_,_],
        [_,_,_,_,_,B,P,P,P,P,B,_,_,_,_,_],
        [_,_,_,_,B,P,W,W,W,W,P,B,_,_,_,_],
        [_,_,_,_,B,P,W,Y,Y,W,P,B,_,_,_,_],
        [_,_,_,_,_,B,W,G,G,W,B,_,_,_,_,_],
        [_,_,_,_,_,B,p,W,W,p,B,_,_,_,_,_],
        [_,_,_,B,B,B,B,B,B,B,B,B,B,_,_,_],
        [_,_,B,b,b,P,P,P,P,P,P,b,b,B,_,_],
        [_,B,b,B,P,P,P,P,P,P,P,P,B,b,B,_],
        [_,B,b,B,P,P,P,P,P,P,P,P,B,b,B,_],
        [_,B,b,B,P,P,P,P,P,P,P,P,B,b,B,_],
        [_,_,B,b,b,P,P,P,P,P,P,b,b,B,_,_],
        [_,_,_,B,B,P,P,P,P,P,P,B,B,_,_,_],
        [_,_,_,_,B,p,B,_,_,B,p,B,_,_,_,_],
        [_,_,_,_,B,p,B,_,_,B,p,B,_,_,_,_],
        [_,_,_,_,B,p,B,_,_,B,p,B,_,_,_,_],
        [_,_,_,B,B,p,B,B,B,B,p,B,B,_,_,_],
        [_,_,B,B,G,G,B,_,_,B,G,G,B,B,_,_],
        [_,_,B,G,G,_,_,_,_,_,_,G,G,B,_,_],
        [_,_,_,G,_,_,_,_,_,_,_,_,G,_,_,_],
      ],
      // frame 1 — arms raised
      [
        [_,_,_,_,_,_,B,B,B,B,_,_,_,_,_,_],
        [_,_,_,_,_,B,P,P,P,P,B,_,_,_,_,_],
        [_,_,_,_,B,P,W,W,W,W,P,B,_,_,_,_],
        [_,_,_,_,B,P,W,Y,Y,W,P,B,_,_,_,_],
        [_,_,_,_,_,B,W,G,G,W,B,_,_,_,_,_],
        [_,_,_,_,_,B,p,W,W,p,B,_,_,_,_,_],
        [_,B,B,B,B,B,B,B,B,B,B,B,B,B,B,_],
        [B,b,b,P,P,P,P,P,P,P,P,P,P,b,b,B],
        [B,b,B,P,P,P,P,P,P,P,P,P,P,B,b,B],
        [_,B,B,P,P,P,P,P,P,P,P,P,P,B,B,_],
        [_,_,B,b,P,P,P,P,P,P,P,P,b,B,_,_],
        [_,_,_,B,b,P,P,P,P,P,P,b,B,_,_,_],
        [_,_,_,B,B,P,P,P,P,P,P,B,B,_,_,_],
        [_,_,_,_,B,p,B,_,_,B,p,B,_,_,_,_],
        [_,_,_,_,B,p,B,_,_,B,p,B,_,_,_,_],
        [_,_,_,_,B,p,B,_,_,B,p,B,_,_,_,_],
        [_,_,_,B,B,p,B,B,B,B,p,B,B,_,_,_],
        [_,_,B,B,G,G,B,_,_,B,G,G,B,B,_,_],
        [_,_,B,G,G,_,_,_,_,_,_,G,G,B,_,_],
        [_,_,_,G,_,_,_,_,_,_,_,_,G,_,_,_],
      ],
    ],
  },
}

function drawSprite(canvas, spriteKey, frame = 0) {
  const sp = SPRITES[spriteKey]
  if (!sp) return
  const grid = sp.frames[frame % sp.frames.length]
  const pw = 5
  const cols = grid[0].length, rows = grid.length
  canvas.width  = cols * pw
  canvas.height = rows * pw
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const color = grid[y][x]  // values are already hex strings from the const palette
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x * pw, y * pw, pw, pw)
    }
  }
}

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────
const state = {
  screen: 'title',
  campaign: null,
  playerClass: null,
  combatPhase: 1,
  bossHP: 300,
  bossMaxHP: 300,
  playerHP: 80,
  playerMaxHP: 80,
  playerMana: 40,
  playerMaxMana: 40,
  combatLog: [],
  turn: 'player',
  animating: false,
  bossFrame: 0,
  bossFlash: false,
  playerFlash: false,
  // Leveling
  xp: 0,
  level: 1,
  talentPoints: 0,
  unlockedTalents: new Set(),
  pendingLevelUp: false,
}

// ─────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────
const app = document.getElementById('app')

function go(screen, data = {}) {
  Object.assign(state, data, { screen })
  render()
  SFX.menuOpen()
}

function render() {
  const screens = {
    title:     renderTitle,
    campaigns: renderCampaigns,
    classes:   renderClasses,
    combat:    renderCombat,
    narrative: renderNarrative,
    techtree:  renderTechTree,
  }
  const fn = screens[state.screen] || renderTitle

  app.style.opacity = '0'
  app.style.transform = 'translateY(8px)'
  clearAmbient()

  setTimeout(() => {
    app.innerHTML = fn()
    app.style.opacity = '1'
    app.style.transform = 'none'
    afterRender()
  }, 180)
}

function afterRender() {
  bindNav()
  const s = state.screen
  if (s === 'title')     setupTitle()
  if (s === 'campaigns') setupCampaigns()
  if (s === 'classes')   setupClasses()
  if (s === 'combat')    setupCombat()
  if (s === 'narrative') setupNarrative()
  if (s === 'techtree')  setupTechTree()
}

// ─────────────────────────────────────────
// TITLE
// ─────────────────────────────────────────
function renderTitle() {
  return `
  <div class="screen screen-title">
    <div class="title-bg"></div>
    <div class="title-vignette"></div>
    <nav class="game-nav">
      <span class="game-nav-logo">⚔ Chronicles</span>
      <div class="game-nav-links">
        <button class="nav-btn" data-go="campaigns">Campaigns</button>
        <button class="nav-btn" data-go="classes">Classes</button>
      </div>
    </nav>
    <div class="title-center">
      <div class="title-rune">✦</div>
      <h1 class="title-main"><span class="title-grad">Chronicles of</span><br/>The Broken Realm</h1>
      <p class="title-sub">Three campaigns. Fourteen classes. One fate.</p>
      <div class="title-btns">
        <button class="game-btn game-btn-primary" id="btn-start">Begin Your Journey</button>
        <button class="game-btn game-btn-ghost" data-go="classes">Browse Classes</button>
      </div>
    </div>
    <div class="title-footer">
      <span class="title-footer-tag">D&D 5e · Turn-Based · Pixel Art Bosses</span>
    </div>
    <div id="torch-l" class="torch-anchor" style="left:8%;bottom:28%"></div>
    <div id="torch-r" class="torch-anchor" style="right:8%;bottom:28%"></div>
  </div>`
}

function setupTitle() {
  document.getElementById('btn-start')?.addEventListener('click', () => {
    SFX.menuOpen()
    go('campaigns')
  })
  // torch embers
  const tl = document.getElementById('torch-l')
  const tr = document.getElementById('torch-r')
  if (tl) {
    const r = tl.getBoundingClientRect()
    addAmbient(r.left + r.width/2, r.top, 'ember', 0.25)
  }
  if (tr) {
    const r = tr.getBoundingClientRect()
    addAmbient(r.left + r.width/2, r.top, 'ember', 0.25)
  }
}

// ─────────────────────────────────────────
// CAMPAIGNS
// ─────────────────────────────────────────
function renderCampaigns() {
  return `
  <div class="screen screen-campaigns">
    <nav class="game-nav">
      <button class="nav-back" data-go="title">← Back</button>
      <span class="game-nav-logo">Choose Your Campaign</span>
      <div></div>
    </nav>
    <div class="campaigns-grid">
      ${CAMPAIGNS.map(c => `
        <div class="campaign-card" data-campaign="${c.id}" style="--ccolor:${c.color};--caccent:${c.accent};--cglow:${c.glow}">
          <div class="campaign-card-bg"></div>
          <div class="campaign-card-inner">
            <div class="campaign-diff">
              ${'◆'.repeat(c.difficulty)}${'◇'.repeat(5 - c.difficulty)}
              <span class="campaign-diff-label">Difficulty</span>
            </div>
            <h2 class="campaign-title">${c.title}</h2>
            <p class="campaign-sub">${c.subtitle}</p>
            <div class="campaign-tags">
              ${c.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <div class="campaign-boss-row">
              <span class="campaign-boss-label">Final Boss</span>
              <span class="campaign-boss-name" style="color:${c.accent}">${c.boss}</span>
            </div>
            <button class="game-btn game-btn-primary campaign-btn" data-campaign="${c.id}">
              Enter Campaign →
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  </div>`
}

function setupCampaigns() {
  document.querySelectorAll('.campaign-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.currentTarget.dataset.campaign
      const camp = CAMPAIGNS.find(c => c.id === id)
      SFX.menuOpen()
      go('classes', { campaign: camp })
    })
  })
  document.querySelectorAll('.campaign-card').forEach(card => {
    card.addEventListener('mouseenter', () => SFX.click())
  })
}

// ─────────────────────────────────────────
// CLASSES
// ─────────────────────────────────────────
function renderClasses() {
  return `
  <div class="screen screen-classes">
    <nav class="game-nav">
      <button class="nav-back" data-go="${state.campaign ? 'campaigns' : 'title'}">← Back</button>
      <span class="game-nav-logo">${state.campaign ? 'Choose Your Class' : 'Class Codex'}</span>
      <div></div>
    </nav>
    <div class="classes-grid">
      ${CLASSES.map(c => `
        <div class="class-card" data-class="${c.name}" style="--cc:${c.color}">
          <div class="class-icon">${c.icon}</div>
          <div class="class-info">
            <div class="class-name">${c.name}</div>
            <div class="class-role">${c.role}</div>
            <div class="class-tag">${c.tag}</div>
          </div>
        </div>
      `).join('')}
    </div>
    ${state.campaign ? `<div class="classes-footer">
      <p id="class-hint">Hover a class to preview · Click to select</p>
    </div>` : ''}
  </div>`
}

function setupClasses() {
  document.querySelectorAll('.class-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      SFX.click()
      burst(
        card.getBoundingClientRect().left + card.offsetWidth / 2,
        card.getBoundingClientRect().top + card.offsetHeight / 2,
        'magic', 8
      )
    })
    if (state.campaign) {
      card.addEventListener('click', e => {
        const name = e.currentTarget.dataset.class
        const cls  = CLASSES.find(c => c.name === name)
        SFX.spell()
        go('narrative', { playerClass: cls })
      })
    }
  })
}

// ─────────────────────────────────────────
// NARRATIVE
// ─────────────────────────────────────────
const NARRATIVES = {
  ashen: [
    "The kingdom of Valdris has been silent for three centuries. No birds. No wind. Only the creak of bones.",
    "You were hired to retrieve a relic from the royal vault. You did not expect the vault to breathe.",
    "A surviving knight — Sir Aldric — stops you at the gate. His armor is cracked. His eyes are haunted.",
    '"They are all still here," he says. "The king. The court. The soldiers. They never left."',
  ],
  verdant: [
    "The Mirewood smells of rain and something older. The trees lean toward you as you pass.",
    "Twelve villagers vanished in a week. The search parties stopped returning after three days.",
    "You find the first one on the fifth hour. She is alive — rooted in place, growing bark.",
    '"It is not malice," a voice says from everywhere and nowhere. "It is just hunger."',
  ],
  spire: [
    "The Spire of Ivelion exploded twelve years ago. Or it will explode twelve years from now. Both are true.",
    "You step through the doorway. You are immediately standing in three places at once.",
    "In one timeline, you never entered. In another, you never left. In this one, you have both memories.",
    '"Fascinating," says a voice behind you. It is your own voice. "You got further than I expected."',
  ],
}

function renderNarrative() {
  const lines = NARRATIVES[state.campaign?.id] || NARRATIVES.ashen
  return `
  <div class="screen screen-narrative">
    <nav class="game-nav">
      <button class="nav-back" data-go="classes">← Back</button>
      <span class="game-nav-logo">${state.campaign?.title || 'The Chronicles'}</span>
      <div></div>
    </nav>
    <div class="narrative-frame">
      <div class="narrative-scroll">
        <div class="narrative-class-tag">
          ${state.playerClass ? `${state.playerClass.icon} ${state.playerClass.name}` : ''}
        </div>
        <div class="narrative-text" id="narr-text"></div>
        <button class="narrative-skip" id="narr-skip">[ Click to continue ]</button>
      </div>
      <div class="narrative-choices hidden" id="narr-choices">
        <p class="choices-label">What do you do?</p>
        <button class="choice-btn" id="choice-fight">
          <span class="choice-icon">⚔</span>
          <span>Press forward — face whatever waits in the dark</span>
        </button>
        <button class="choice-btn" id="choice-wait">
          <span class="choice-icon">👁</span>
          <span>Observe first — let the shadows reveal themselves</span>
        </button>
      </div>
    </div>
  </div>`
}

async function setupNarrative() {
  const lines = NARRATIVES[state.campaign?.id] || NARRATIVES.ashen
  const el    = document.getElementById('narr-text')
  const skip  = document.getElementById('narr-skip')
  const choices = document.getElementById('narr-choices')
  if (!el) return

  for (let i = 0; i < lines.length; i++) {
    await typewrite(el, lines[i], { speed: 22, skipEl: skip })
    if (i < lines.length - 1) {
      await delay(800)
      el.textContent = ''
    }
  }

  skip.style.display = 'none'
  choices.classList.remove('hidden')
  SFX.menuOpen()

  document.getElementById('choice-fight')?.addEventListener('click', () => {
    SFX.sword()
    burst(window.innerWidth / 2, window.innerHeight / 2, 'ember', 30)
    go('combat')
  })
  document.getElementById('choice-wait')?.addEventListener('click', () => {
    SFX.spell()
    burst(window.innerWidth / 2, window.innerHeight / 2, 'magic', 25)
    go('combat')
  })
}

// ─────────────────────────────────────────
// COMBAT
// ─────────────────────────────────────────
const BOSS_ABILITIES = {
  ashen: [
    { name:'Necrotic Bolt',  dmg:[12,22], type:'magic',  color:'#6a0dad', msg:'Varethis channels death energy into a bolt of pure necrotic force!' },
    { name:'Raise Dead',     dmg:[0,0],   type:'heal',   color:'#8b1a1a', msg:'Varethis raises a skeletal minion, healing himself in the process!', heal:18 },
    { name:'Soul Rend',      dmg:[18,32], type:'magic',  color:'#3d0070', msg:'Varethis tears at your very soul — a devastating blow!' },
    { name:'Bone Spear',     dmg:[8,16],  type:'phys',   color:'#c0c0c0', msg:'A sharpened bone launches from the floor beneath you!' },
  ],
}

function bossAbilities() { return BOSS_ABILITIES[state.campaign?.id] || BOSS_ABILITIES.ashen }

function renderCombat() {
  const camp = state.campaign || CAMPAIGNS[0]
  const abilities = [
    { label:'⚔ Attack', key:'attack', color:'#c0392b' },
    { label:'✨ Spell',  key:'spell',  color:'#7c6dfa' },
    { label:'🛡 Dodge',  key:'dodge',  color:'#2980b9' },
    { label:'🧪 Potion', key:'potion', color:'#27ae60' },
  ]
  return `
  <div class="screen screen-combat" style="--caccent:${camp.accent}">
    <nav class="game-nav">
      <button class="nav-back" data-go="narrative">← Retreat</button>
      <span class="game-nav-logo">${camp.title}</span>
      <div style="display:flex;gap:10px;align-items:center">
        <button class="nav-btn" data-go="techtree">🌿 Skill Tree</button>
        <div class="phase-badge">Phase ${state.combatPhase}</div>
      </div>
    </nav>

    <div class="combat-arena">
      <!-- Boss side -->
      <div class="boss-panel">
        <div class="boss-name-row">
          <span class="boss-name" style="color:${camp.accent}">${camp.boss}</span>
          <span class="boss-phase-tag">Phase ${state.combatPhase}/3</span>
        </div>
        <div class="hp-bar-wrap">
          <div class="hp-bar boss-hp-bar" id="boss-hp-bar">
            <div class="hp-fill boss-hp-fill" id="boss-hp-fill" style="width:${(state.bossHP/state.bossMaxHP)*100}%;background:${camp.accent}"></div>
          </div>
          <span class="hp-text" id="boss-hp-text">${state.bossHP} / ${state.bossMaxHP}</span>
        </div>

        <div class="boss-canvas-wrap" id="boss-canvas-wrap">
          <canvas id="boss-canvas" class="boss-canvas${state.bossFlash?' boss-flash':''}"></canvas>
          <div class="boss-shadow"></div>
          ${state.combatPhase === 2 ? '<div class="phase-aura phase-aura-2"></div>' : ''}
          ${state.combatPhase === 3 ? '<div class="phase-aura phase-aura-3"></div>' : ''}
        </div>

        <div class="boss-conditions" id="boss-conditions"></div>
      </div>

      <!-- VS divider -->
      <div class="vs-col">
        <div class="vs-icon">VS</div>
        <div class="turn-indicator" id="turn-indicator">
          ${state.turn === 'player' ? '⚔ Your Turn' : '💀 Boss Turn'}
        </div>
      </div>

      <!-- Player side -->
      <div class="player-panel">
        <div class="player-class-row">
          <span class="player-class-icon">${state.playerClass?.icon || '⚔️'}</span>
          <span class="player-class-name">${state.playerClass?.name || 'Fighter'}</span>
        </div>
        <div class="hp-bar-wrap">
          <div class="hp-bar player-hp-bar" id="player-hp-bar">
            <div class="hp-fill player-hp-fill" id="player-hp-fill" style="width:${(state.playerHP/state.playerMaxHP)*100}%"></div>
          </div>
          <span class="hp-text" id="player-hp-text">${state.playerHP} / ${state.playerMaxHP}</span>
        </div>
        <div class="mana-bar-wrap">
          <div class="hp-bar mana-bar">
            <div class="hp-fill mana-fill" style="width:${(state.playerMana/state.playerMaxMana)*100}%"></div>
          </div>
          <span class="hp-text mana-text">${state.playerMana} MP</span>
        </div>
        <div class="xp-row">
          <div class="hp-bar xp-bar">
            <div class="hp-fill xp-fill" style="width:${Math.min(100,Math.round(((state.xp-(XP_PER_LEVEL[state.level-1]||0))/((XP_PER_LEVEL[state.level]||300)-(XP_PER_LEVEL[state.level-1]||0)))*100))}%"></div>
          </div>
          <span class="hp-text" style="color:#f5d87a;min-width:60px">Lv ${state.level}</span>
        </div>
        <div class="action-row">
          ${abilities.map(a => `
            <button class="action-btn" data-action="${a.key}" style="--acolor:${a.color}" ${state.turn !== 'player' || state.animating ? 'disabled' : ''}>
              ${a.label}
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Combat log -->
    <div class="combat-log" id="combat-log">
      ${state.combatLog.slice(-6).map(l => `<div class="log-line">${l}</div>`).join('')}
    </div>
  </div>`
}

let spriteInterval = null

function setupCombat() {
  // Draw animated boss sprite
  const canvas = document.getElementById('boss-canvas')
  if (canvas) {
    const key = state.campaign?.spriteKey || 'lich'
    drawSprite(canvas, key, state.bossFrame)
    clearInterval(spriteInterval)
    spriteInterval = setInterval(() => {
      state.bossFrame = (state.bossFrame + 1) % (SPRITES[key]?.frames?.length || 1)
      drawSprite(canvas, key, state.bossFrame)
    }, 220)
  }

  // Ambient ember from boss
  const wrap = document.getElementById('boss-canvas-wrap')
  if (wrap) {
    const r = wrap.getBoundingClientRect()
    addAmbient(r.left + r.width / 2, r.top + r.height * 0.3, 'magic', 0.12)
  }

  // Action buttons
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      if (state.animating || state.turn !== 'player') return
      const action = e.currentTarget.dataset.action
      handlePlayerAction(action)
    })
  })
}

async function handlePlayerAction(action) {
  if (state.animating) return
  state.animating = true
  state.turn = 'boss'
  refreshActionBtns()

  const d20 = () => Math.floor(Math.random() * 20) + 1
  const dmg = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  let roll, damage, msg, color, logClass

  SFX.diceRoll()
  roll = d20()
  await delay(300)

  if (action === 'attack') {
    damage = roll >= 8 ? dmg(8, 18) : 0
    msg = roll >= 8
      ? `🎲 d20 → ${roll} | ⚔ Hit! You deal ${damage} damage.`
      : `🎲 d20 → ${roll} | ⚔ Miss! Your strike glances off.`
    color = '#c0392b'
    if (damage > 0) {
      SFX.sword(); await delay(100); SFX.hit()
      const bossEl = document.getElementById('boss-canvas')
      if (bossEl) { bossEl.classList.add('boss-flash'); setTimeout(()=>bossEl.classList.remove('boss-flash'),300) }
      burst(bossEl?.getBoundingClientRect().left + 40, bossEl?.getBoundingClientRect().top + 40, 'blood', 14)
      floatDamage(bossEl?.getBoundingClientRect().left + 40, bossEl?.getBoundingClientRect().top, `-${damage}`, '#ff4444')
    }
  } else if (action === 'spell') {
    if (state.playerMana < 10) {
      msg = `✨ Not enough mana! (${state.playerMana} MP remaining)`
      color = '#888'
    } else {
      damage = roll >= 6 ? dmg(14, 26) : dmg(4, 10)
      state.playerMana = Math.max(0, state.playerMana - 10)
      msg = `🎲 d20 → ${roll} | ✨ Spell fires! You deal ${damage} arcane damage.`
      color = '#7c6dfa'
      SFX.spell()
      const bossEl = document.getElementById('boss-canvas')
      burst(bossEl?.getBoundingClientRect().left + 40, bossEl?.getBoundingClientRect().top + 40, 'magic', 20)
      floatDamage(bossEl?.getBoundingClientRect().left + 40, bossEl?.getBoundingClientRect().top, `-${damage}`, '#b97fff')
    }
  } else if (action === 'dodge') {
    damage = 0
    msg = `🛡 You enter a defensive stance. Next attack against you has disadvantage.`
    color = '#2980b9'
    SFX.click()
  } else if (action === 'potion') {
    const heal = dmg(15, 25)
    state.playerHP = Math.min(state.playerMaxHP, state.playerHP + heal)
    damage = 0
    msg = `🧪 You drink a healing potion and recover ${heal} HP.`
    color = '#27ae60'
    SFX.levelUp()
    floatDamage(window.innerWidth / 2, window.innerHeight / 2, `+${heal} HP`, '#27ae60')
  }

  if (damage > 0) {
    state.bossHP = Math.max(0, state.bossHP - damage)
    gainXP(damage * 3)
  }
  addLog(msg, color)
  updateBars()

  // Phase transition
  const pct = state.bossHP / state.bossMaxHP
  const newPhase = pct > 0.6 ? 1 : pct > 0.25 ? 2 : 3
  if (newPhase !== state.combatPhase) {
    state.combatPhase = newPhase
    addLog(`⚡ PHASE ${newPhase} — ${state.campaign?.boss || 'The Boss'} transforms!`, '#ff9500')
    SFX.bossRoar()
    burst(window.innerWidth / 2, window.innerHeight * 0.35, 'magic', 50)
  }

  if (state.bossHP <= 0) {
    await delay(400)
    addLog(`💀 ${state.campaign?.boss || 'The Boss'} has been defeated! VICTORY!`, '#ffd700')
    SFX.victory()
    burst(window.innerWidth / 2, window.innerHeight / 2, 'gold', 80)
    state.animating = false
    return
  }

  // Boss turn
  await delay(700)
  await doBossTurn()
}

async function doBossTurn() {
  const abilities = bossAbilities()
  const ab = abilities[Math.floor(Math.random() * abilities.length)]
  addLog(`💀 ${ab.msg}`, ab.color)
  SFX.diceRoll()
  await delay(500)

  if (ab.type === 'heal') {
    state.bossHP = Math.min(state.bossMaxHP, state.bossHP + (ab.heal || 15))
    addLog(`🩸 Boss heals for ${ab.heal} HP.`, ab.color)
    SFX.spell()
  } else {
    const roll = Math.floor(Math.random() * 20) + 1
    const hit = roll >= 7
    if (hit) {
      const dmg = Math.floor(Math.random() * (ab.dmg[1] - ab.dmg[0] + 1)) + ab.dmg[0]
      state.playerHP = Math.max(0, state.playerHP - dmg)
      addLog(`🎲 d20 → ${roll} | Hit! You take ${dmg} damage.`, '#ff4444')
      SFX.hit()
      burst(window.innerWidth / 2, window.innerHeight * 0.65, 'blood', 12)
      floatDamage(window.innerWidth / 2, window.innerHeight * 0.6, `-${dmg}`, '#ff4444')
    } else {
      addLog(`🎲 d20 → ${roll} | You dodge the attack!`, '#27ae60')
      SFX.click()
    }
  }

  updateBars()

  if (state.playerHP <= 0) {
    addLog(`☠ You have fallen. The darkness claims you.`, '#8b1a1a')
    SFX.die()
    state.animating = false
    return
  }

  state.turn = 'player'
  state.animating = false
  refreshActionBtns()
  document.getElementById('turn-indicator').textContent = '⚔ Your Turn'
}

function addLog(msg, color = '#ccc') {
  state.combatLog.push(`<span style="color:${color}">${msg}</span>`)
  const logEl = document.getElementById('combat-log')
  if (logEl) {
    logEl.innerHTML = state.combatLog.slice(-6).map(l => `<div class="log-line">${l}</div>`).join('')
    logEl.scrollTop = logEl.scrollHeight
  }
}

function updateBars() {
  const bFill = document.getElementById('boss-hp-fill')
  const bText = document.getElementById('boss-hp-text')
  const pFill = document.getElementById('player-hp-fill')
  const pText = document.getElementById('player-hp-text')
  if (bFill) bFill.style.width = `${Math.max(0, (state.bossHP / state.bossMaxHP) * 100)}%`
  if (bText) bText.textContent = `${Math.max(0, state.bossHP)} / ${state.bossMaxHP}`
  if (pFill) pFill.style.width = `${Math.max(0, (state.playerHP / state.playerMaxHP) * 100)}%`
  if (pText) pText.textContent = `${Math.max(0, state.playerHP)} / ${state.playerMaxHP}`
}

function refreshActionBtns() {
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.disabled = state.turn !== 'player' || state.animating
  })
  const ti = document.getElementById('turn-indicator')
  if (ti) ti.textContent = state.turn === 'player' ? '⚔ Your Turn' : '💀 Boss Turn'
}

// ─────────────────────────────────────────
// TECH TREE
// ─────────────────────────────────────────
function renderTechTree() {
  const cls      = state.playerClass
  const treeKey  = cls ? CLASS_TREE_MAP[cls.name] || 'Martial' : 'Martial'
  const tree     = TREE_TEMPLATES[treeKey]
  const lvl      = state.level
  const xp       = state.xp
  const nextXP   = XP_PER_LEVEL[lvl] || 99999
  const prevXP   = XP_PER_LEVEL[lvl - 1] || 0
  const pct      = Math.min(100, Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100))
  const tp       = state.talentPoints

  return `
  <div class="screen screen-techtree">
    <nav class="game-nav">
      <button class="nav-back" data-go="${state.campaign ? 'combat' : 'title'}">← Back</button>
      <span class="game-nav-logo">${cls?.icon || '⚔'} ${cls?.name || 'Hero'} — Skill Tree</span>
      <div class="tp-badge" title="Talent Points available">✦ ${tp} Point${tp !== 1 ? 's' : ''}</div>
    </nav>

    <div class="tree-header">
      <div class="tree-level-block">
        <span class="tree-level-num">Lv ${lvl}</span>
        <div class="tree-xp-bar-wrap">
          <div class="tree-xp-bar">
            <div class="tree-xp-fill" style="width:${pct}%"></div>
          </div>
          <span class="tree-xp-label">${xp.toLocaleString()} / ${nextXP.toLocaleString()} XP</span>
        </div>
      </div>
      <div class="tree-stat-pills">
        <span class="stat-pill">❤ ${state.playerMaxHP} HP</span>
        <span class="stat-pill">💧 ${state.playerMaxMana} MP</span>
        <span class="stat-pill">⚔ Lv${lvl} Power</span>
        <span class="stat-pill">🔓 ${state.unlockedTalents.size} Talents</span>
      </div>
    </div>

    <div class="tree-branches">
      ${tree.branches.map(branch => `
        <div class="branch">
          <div class="branch-header" style="color:${branch.color}">
            <span class="branch-icon">${branch.icon}</span>
            <span class="branch-name">${branch.name}</span>
          </div>
          <div class="branch-nodes">
            ${branch.nodes.map((node, i) => {
              const unlocked  = state.unlockedTalents.has(node.id)
              const reqMet    = !node.req || state.unlockedTalents.has(node.req)
              const canAfford = tp >= node.cost
              const available = reqMet && !unlocked
              const buyable   = available && canAfford
              return `
              ${i > 0 ? `<div class="node-connector" style="border-color:${unlocked ? branch.color : 'rgba(255,255,255,0.1)'}"></div>` : ''}
              <div class="tree-node ${unlocked ? 'unlocked' : available ? (buyable ? 'available' : 'locked-cost') : 'locked'}"
                   data-node="${node.id}" data-branch-color="${branch.color}"
                   style="--nc:${branch.color}">
                <div class="node-name">${node.name}</div>
                <div class="node-desc">${node.desc}</div>
                <div class="node-cost">
                  ${unlocked
                    ? '<span class="node-unlocked-badge">✓ Learned</span>'
                    : available
                      ? `<button class="node-buy-btn" data-node="${node.id}" ${buyable ? '' : 'disabled'}>
                           ${buyable ? `Unlock (${node.cost}pt)` : `Need ${node.cost}pt`}
                         </button>`
                      : '<span class="node-req-badge">🔒 Requires previous</span>'
                  }
                </div>
              </div>`
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <div class="tree-footer">
      <p class="tree-hint">Earn XP in combat to level up · Each level grants 1 Talent Point</p>
      ${state.campaign ? `<button class="game-btn game-btn-primary" data-go="combat">Return to Battle</button>` : ''}
    </div>
  </div>`
}

function setupTechTree() {
  document.querySelectorAll('.node-buy-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const nodeId = btn.dataset.node
      if (state.talentPoints < 1) return
      // find node cost
      const treeKey = CLASS_TREE_MAP[state.playerClass?.name] || 'Martial'
      const tree = TREE_TEMPLATES[treeKey]
      let cost = 1
      for (const b of tree.branches)
        for (const n of b.nodes)
          if (n.id === nodeId) cost = n.cost
      if (state.talentPoints < cost) return
      state.talentPoints -= cost
      state.unlockedTalents.add(nodeId)
      SFX.levelUp()
      burst(
        btn.getBoundingClientRect().left + 30,
        btn.getBoundingClientRect().top,
        'gold', 20
      )
      // re-render the tree section only
      render()
    })
  })
}

// ─────────────────────────────────────────
// XP & LEVELING
// ─────────────────────────────────────────
function gainXP(amount) {
  state.xp += amount
  const newLevel = XP_PER_LEVEL.findIndex((v, i) => i > 0 && state.xp < v)
  const calcLevel = newLevel === -1 ? XP_PER_LEVEL.length - 1 : newLevel - 1 || 1
  if (calcLevel > state.level) {
    state.level = calcLevel
    state.talentPoints += 1
    state.playerMaxHP  += 8
    state.playerHP      = Math.min(state.playerHP + 8, state.playerMaxHP)
    state.playerMaxMana += 5
    showLevelUpBanner(calcLevel)
  }
}

function showLevelUpBanner(lvl) {
  const el = document.createElement('div')
  el.className = 'levelup-banner'
  el.innerHTML = `
    <div class="levelup-inner">
      <div class="levelup-title">LEVEL UP</div>
      <div class="levelup-num">Level ${lvl}</div>
      <div class="levelup-perks">+8 HP &nbsp;·&nbsp; +5 MP &nbsp;·&nbsp; +1 Talent Point</div>
      <button class="levelup-tree-btn" id="lvlup-tree">View Skill Tree →</button>
    </div>
  `
  document.body.appendChild(el)
  SFX.levelUp()
  burst(window.innerWidth / 2, window.innerHeight / 2, 'gold', 60)
  setTimeout(() => el.classList.add('visible'), 50)
  document.getElementById('lvlup-tree')?.addEventListener('click', () => {
    el.remove()
    go('techtree')
  })
  setTimeout(() => { el.classList.remove('visible'); setTimeout(() => el.remove(), 500) }, 5000)
}

// ─────────────────────────────────────────
// NAV BINDING
// ─────────────────────────────────────────
function bindNav() {
  document.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', () => {
      clearInterval(spriteInterval)
      SFX.menuOpen()
      go(el.dataset.go)
    })
  })
}

// ─────────────────────────────────────────
// CURSOR
// ─────────────────────────────────────────
const cursor = document.createElement('div')
cursor.id = 'g-cursor'
const cursorRing = document.createElement('div')
cursorRing.id = 'g-cursor-ring'
document.body.append(cursor, cursorRing)

let mx = 0, my = 0, rx = 0, ry = 0
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY })
;(function tick() {
  cursor.style.transform = `translate3d(${mx - 4}px,${my - 4}px,0)`
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1
  cursorRing.style.transform = `translate3d(${rx - 14}px,${ry - 14}px,0)`
  requestAnimationFrame(tick)
})()
document.addEventListener('mouseover', e => {
  if (e.target.closest('button,a,.campaign-card,.class-card,.action-btn')) document.body.classList.add('on-hover')
})
document.addEventListener('mouseout', e => {
  if (e.target.closest('button,a,.campaign-card,.class-card,.action-btn')) document.body.classList.remove('on-hover')
})

// ─────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────
Object.assign(app.style, {
  transition: 'opacity 0.18s ease, transform 0.18s ease',
  willChange: 'opacity, transform',
  minHeight: '100vh',
})

go('title')
