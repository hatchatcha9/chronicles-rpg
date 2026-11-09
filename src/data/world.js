// Open world locations, regions, and main quest structure

export const REGIONS = {
  marches: {
    id: 'marches',
    name: 'The Broken Marches',
    color: '#3a2010',
    fogColor: 'rgba(40,25,10,0.4)',
    description: 'Once fertile land, now scarred by war and wandering dead.',
  },
  ashenveil: {
    id: 'ashenveil',
    name: 'Ashenveil',
    color: '#1a1c28',
    fogColor: 'rgba(20,22,40,0.5)',
    description: 'The kingdom of Valdris, three centuries under a lich\'s curse.',
  },
  mirewood: {
    id: 'mirewood',
    name: 'The Mirewood',
    color: '#0a1a0c',
    fogColor: 'rgba(10,25,8,0.5)',
    description: 'A forest that has forgotten what it was. Corruption grows from the roots.',
  },
  spire: {
    id: 'spire',
    name: 'The Shattered Spire',
    color: '#120a2a',
    fogColor: 'rgba(20,8,45,0.55)',
    description: 'Where reality is thinnest. The fracture began here.',
  },
}

// x/y are % of world map canvas (0-100)
export const LOCATIONS = {
  grimhaven: {
    id: 'grimhaven',
    label: 'Grimhaven',
    sublabel: 'Last Free Town',
    type: 'town',
    region: 'marches',
    x: 50, y: 62,
    color: '#c8902a',
    glowColor: 'rgba(200,144,42,0.6)',
    description: 'The last inhabited settlement before the cursed lands begin. Merchants, mercenaries, and the desperate.',
    connections: ['ashenveil_gate', 'mirewood_edge', 'spire_base'],
    locked: false,
  },
  ashenveil_gate: {
    id: 'ashenveil_gate',
    label: 'Valdris Gate',
    sublabel: 'Cursed Threshold',
    type: 'dungeon',
    region: 'ashenveil',
    x: 24, y: 42,
    color: '#6a7a9a',
    glowColor: 'rgba(80,100,160,0.5)',
    description: 'The entrance to the dead kingdom. The Hollow Warden stands eternal vigil.',
    connections: ['grimhaven', 'ashenveil_palace'],
    campaign: 'ashen_throne',
    locked: false,
  },
  ashenveil_palace: {
    id: 'ashenveil_palace',
    label: 'Ashen Palace',
    sublabel: 'Throne of the Lich',
    type: 'boss',
    region: 'ashenveil',
    x: 14, y: 26,
    color: '#8a7aaa',
    glowColor: 'rgba(120,100,180,0.5)',
    description: 'At the heart of Valdris, Varethis the Undying holds court over three centuries of silence.',
    connections: ['ashenveil_gate'],
    requiresCompletion: ['ashenveil_gate'],
    locked: true,
  },
  mirewood_edge: {
    id: 'mirewood_edge',
    label: 'Mirewood Edge',
    sublabel: 'The First Trees',
    type: 'dungeon',
    region: 'mirewood',
    x: 72, y: 42,
    color: '#4a7a3a',
    glowColor: 'rgba(60,120,50,0.5)',
    description: 'The forest begins here. Something watches from between the bark.',
    connections: ['grimhaven', 'heartwood_sanctum'],
    campaign: 'verdant_labyrinth',
    locked: false,
  },
  heartwood_sanctum: {
    id: 'heartwood_sanctum',
    label: 'Heartwood Sanctum',
    sublabel: 'The Ancient Will',
    type: 'boss',
    region: 'mirewood',
    x: 84, y: 25,
    color: '#3a9a4a',
    glowColor: 'rgba(50,160,70,0.5)',
    description: 'At the forest\'s heart, Sylvanax the Unbound remembers what beauty once was.',
    connections: ['mirewood_edge'],
    requiresCompletion: ['mirewood_edge'],
    locked: true,
  },
  spire_base: {
    id: 'spire_base',
    label: 'Spire Foothills',
    sublabel: 'Where Reality Bends',
    type: 'dungeon',
    region: 'spire',
    x: 50, y: 20,
    color: '#7a4aaa',
    glowColor: 'rgba(120,70,180,0.5)',
    description: 'The ground here does not behave. Stones float. Shadows move without sources.',
    connections: ['grimhaven', 'spire_apex'],
    campaign: 'shattered_spire',
    locked: false,
  },
  spire_apex: {
    id: 'spire_apex',
    label: 'The Apex',
    sublabel: 'The Fracture\'s Heart',
    type: 'final',
    region: 'spire',
    x: 50, y: 6,
    color: '#aa2a2a',
    glowColor: 'rgba(200,30,30,0.6)',
    description: 'The Architect waits at the top of the world, writing in a language that unmakes what it names.',
    connections: ['spire_base'],
    requiresCompletion: ['ashenveil_palace', 'heartwood_sanctum', 'spire_base'],
    locked: true,
    mainQuestStage: 3,
  },
}

// Map paths (pairs of location ids to draw paths between)
export const PATHS = [
  ['grimhaven', 'ashenveil_gate'],
  ['ashenveil_gate', 'ashenveil_palace'],
  ['grimhaven', 'mirewood_edge'],
  ['mirewood_edge', 'heartwood_sanctum'],
  ['grimhaven', 'spire_base'],
  ['spire_base', 'spire_apex'],
]

// Campaign id to location id mapping
export const CAMPAIGN_TO_LOCATION = {
  ashen_throne: 'ashenveil_gate',
  verdant_labyrinth: 'mirewood_edge',
  shattered_spire: 'spire_base',
}

export function getLocation(id) {
  return LOCATIONS[id] || null
}

export function isLocationUnlocked(id, completedLocations = []) {
  const loc = LOCATIONS[id]
  if (!loc) return false
  if (!loc.locked) return true
  if (!loc.requiresCompletion) return true
  return loc.requiresCompletion.every(req => completedLocations.includes(req))
}
