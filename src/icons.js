// game-icons.net inline icon helper (CC BY 3.0)
// URL: https://game-icons.net/icons/{color}/transparent/1x1/{author}/{name}.svg

const BASE = 'https://game-icons.net/icons'

// White-on-black SVGs; CSS filter converts to gold, mix-blend-mode:screen erases the black bg
export function gi(path, size = 18, _color = 'c8a030') {
  return `<img src="${BASE}/ffffff/000000/1x1/${path}.svg" width="${size}" height="${size}" class="gi-icon" alt="" loading="lazy">`
}

// Icon path constants
export const I = {
  // Combat actions
  ATTACK:   'lorc/sword-wound',
  SPELL:    'lorc/magic-swirl',
  ABILITY:  'lorc/lightning-frequency',
  DODGE:    'lorc/dodging',
  POTION:   'lorc/potion-ball',
  // Stats
  HP:       'lorc/health-normal',
  MANA:     'lorc/drop',
  SHIELD:   'lorc/shield',
  XP:       'lorc/star-medal',
  GOLD:     'delapouite/gold-bar',
  PROF:     'lorc/crossed-swords',
  SLOTS:    'lorc/magic-swirl',
  HEAL:     'lorc/health-normal',
  // Classes
  fighter:     'lorc/barbute',
  paladin:     'lorc/crusader-helmet',
  rogue:       'delapouite/rogue',
  ranger:      'lorc/bow-arrow',
  wizard:      'delapouite/wizard-face',
  sorcerer:    'lorc/magic-swirl',
  druid:       'lorc/oak-leaf',
  cleric:      'lorc/holy-grail',
  monk:        'delapouite/monk-face',
  barbarian:   'delapouite/barbarian',
  bard:        'lorc/lyre',
  warlock:     'delapouite/warlock-hood',
  bloodhunter:    'lorc/dripping-blade',
  artificer:      'delapouite/cogsplosion',
  // Expanded classes
  necromancer:    'lorc/crowned-skull',
  hexblade:       'lorc/cursed-star',
  eldritch_knight:'lorc/rune-sword',
  chronomancer:   'delapouite/sand-clock',
  runesmith:      'lorc/rune-stone',
  shadow_dancer:  'lorc/shadow-follower',
  plague_doctor:  'sbed/poison',
  skald:          'lorc/war-axe',
  beastmaster:    'lorc/wolf-howl',
  warden:         'delapouite/watchtower',
  soul_weaver:    'lorc/soul-vessel',
  invoker:        'lorc/burning-eye',
  // Campaign meta
  DIFFICULTY:  'lorc/crossed-swords',
  LENGTH:      'delapouite/sand-clock',
  CLASSES_REC: 'lorc/star-medal',
  // Ability types
  BUFF:     'lorc/magic-swirl',
  FIRE:     'lorc/fire-ray',
  HOLY:     'lorc/holy-grail',
  DARK:     'lorc/death-note',
  // Loot
  CHEST:    'lorc/locked-chest',
  SWORD:    'lorc/crossed-swords',
  SCROLL:   'delapouite/scroll-unfurled',
}

export function getClassIcon(classId, size = 22, color = 'c8a030') {
  const path = I[classId] || 'lorc/barbute'
  return gi(path, size, color)
}
