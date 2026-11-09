// Core game state and navigation engine

import { modifier } from './dice.js'

const SAVE_KEY = 'dnd_campaign_save'

const _listeners = {}

export function on(event, cb) {
  if (!_listeners[event]) _listeners[event] = []
  _listeners[event].push(cb)
  return () => { _listeners[event] = _listeners[event].filter(f => f !== cb) }
}

export function emit(event, data) {
  if (_listeners[event]) _listeners[event].forEach(cb => cb(data))
}

const defaultState = () => ({
  screen: 'title',
  campaign: null,
  sceneId: null,
  character: null,
  inventory: [],
  gold: 50,             // starting gold
  xp: 0,
  level: 1,
  combatState: null,
  choices: {},
  flags: {},
  deaths: 0,
  // Open world state
  worldLocation: 'grimhaven',
  mainQuestStage: 0,
  activeQuests: [],
  completedQuests: [],
  completedLocations: [],
})

let _state = defaultState()

export const game = {
  get state() { return _state },

  navigate(screen, data = {}) {
    _state.screen = screen
    Object.assign(_state, data)
    emit('navigate', { screen, state: _state })
    game.save()
  },

  update(partial) {
    Object.assign(_state, partial)
    emit('stateUpdate', _state)
    game.save()
  },

  setFlag(key, val) {
    _state.flags[key] = val
    game.save()
  },

  getFlag(key) {
    return _state.flags[key]
  },

  recordChoice(sceneId, choiceId) {
    _state.choices[sceneId] = choiceId
    game.save()
  },

  addItem(item) {
    _state.inventory.push({ ...item, uid: Date.now() + Math.random() })
    emit('inventoryUpdate', _state.inventory)
    game.save()
  },

  addGold(amount) {
    _state.gold = (_state.gold || 0) + amount
    emit('goldUpdate', _state.gold)
    game.save()
  },

  spendGold(amount) {
    if ((_state.gold || 0) < amount) return false
    _state.gold -= amount
    emit('goldUpdate', _state.gold)
    game.save()
    return true
  },

  completeLocation(locationId) {
    if (!_state.completedLocations.includes(locationId)) {
      _state.completedLocations.push(locationId)
    }
    game.save()
  },

  startQuest(questId) {
    if (!_state.activeQuests.includes(questId)) {
      _state.activeQuests.push(questId)
    }
    game.save()
  },

  completeQuest(questId) {
    _state.activeQuests = _state.activeQuests.filter(q => q !== questId)
    if (!_state.completedQuests.includes(questId)) {
      _state.completedQuests.push(questId)
    }
    game.save()
  },

  advanceMainQuest() {
    _state.mainQuestStage = (_state.mainQuestStage || 0) + 1
    emit('mainQuestAdvance', _state.mainQuestStage)
    game.save()
  },

  addXP(amount) {
    _state.xp += amount
    const newLevel = xpToLevel(_state.xp)
    if (newLevel > _state.level) {
      _state.level = newLevel
      emit('levelUp', newLevel)
    }
    game.save()
  },

  save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(_state)) } catch {}
  },

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) { _state = { ...defaultState(), ...JSON.parse(raw) }; return true }
    } catch {}
    return false
  },

  reset() {
    _state = defaultState()
    try { localStorage.removeItem(SAVE_KEY) } catch {}
  },

  hasSave() {
    try { return !!localStorage.getItem(SAVE_KEY) } catch { return false }
  },

  // Build a full character sheet from class + rolled stats
  buildCharacter(cls, stats, name) {
    const con = modifier(stats.con)
    const hp = cls.hitDie + con
    const char = {
      name: name || cls.name + ' Adventurer',
      class: cls.id,
      className: cls.name,
      level: 1,
      stats: { ...stats },
      maxHp: hp,
      hp: hp,
      ac: cls.startingAC + modifier(stats.dex),
      profBonus: 2,
      conditions: [],
      spellSlots: { ...cls.spellSlots },
      maxSpellSlots: { ...cls.spellSlots },
      abilities: cls.abilities.map(a => ({ ...a, usesLeft: a.uses ?? Infinity })),
      attackStat: cls.attackStat,
      weaponDamage: cls.weaponDamage,
      spells: cls.spells ? [...cls.spells] : [],
      kiPoints: cls.id === 'monk' ? 1 : 0,
      maxKiPoints: cls.id === 'monk' ? 1 : 0,
      ragePowerLeft: cls.id === 'barbarian' ? 2 : 0,
      layOnHandsPool: cls.id === 'paladin' ? 5 : 0,
      sorceryPoints: cls.id === 'sorcerer' ? 1 : 0,
      bardicInspirationLeft: cls.id === 'bard' ? Math.max(1, modifier(stats.cha)) : 0,
      isRaging: false,
      hunterMarkTarget: false,
      crimsonRiteActive: false,
    }
    return char
  },
}

function xpToLevel(xp) {
  const thresholds = [0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000]
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) return Math.min(i + 1, 20)
  }
  return 1
}
