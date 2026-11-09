// Main quest and side quests

export const MAIN_QUEST_STAGES = [
  {
    stage: 0,
    title: 'The Fracture Sovereign',
    summary: 'Rumors reach Grimhaven of cracks appearing in the sky — places where the air itself tears open and something looks through.',
    objective: 'Speak to the Lorekeeper in Grimhaven.',
    hint: 'The notice board in Grimhaven may have more information.',
  },
  {
    stage: 1,
    title: 'Echoes of Undeath',
    summary: 'The Lorekeeper believes the fractures first appeared above Ashenveil, three centuries ago — the same day a lich named Varethis cast the curse that killed a kingdom.',
    objective: 'Investigate Valdris Gate in Ashenveil.',
    hint: 'What happened in Valdris may hold the key to what is happening now.',
  },
  {
    stage: 2,
    title: 'The Poison Covenant',
    summary: 'You found evidence in the Ashen Palace: Varethis didn\'t create the fracture — he was trying to close one. The source lies deeper, in the Mirewood.',
    objective: 'Find the Heartwood Sanctum in the Mirewood.',
    hint: 'Sylvanax may know what entered through the fracture.',
  },
  {
    stage: 3,
    title: 'The Architect\'s Error',
    summary: 'Sylvanax confirmed it: the Fracture Sovereign is an entity of pure void, and it entered through an experiment at the Shattered Spire. The Architect made it possible.',
    objective: 'Ascend the Shattered Spire and confront the Architect.',
    hint: 'The Architect may not be the enemy. Or he may be worse.',
  },
  {
    stage: 4,
    title: 'The Fracture Closes',
    summary: 'You have faced the Architect. What remains is the choice: seal the fracture forever, or use it.',
    objective: 'The realm awaits your decision.',
    hint: null,
  },
]

export const SIDE_QUESTS = [
  {
    id: 'wandering_dead',
    title: 'The Wandering Dead',
    giver: 'Notice Board',
    region: 'ashenveil',
    summary: 'Dead soldiers from the Valdris garrison have begun drifting south into the Marches. They must be turned back or put to rest.',
    stages: [
      { objective: 'Find the source of the wandering dead near Valdris Gate.' },
      { objective: 'Decide: destroy the anchor or redirect it.' },
    ],
    reward: { gold: 80, xp: 500 },
    unlockCondition: null,
  },
  {
    id: 'poison_trail',
    title: 'The Poison Trail',
    giver: 'Grimhaven Alchemist',
    region: 'mirewood',
    summary: 'The corruption in the Mirewood is seeping into the groundwater. The alchemist needs samples from the forest heart to develop a remedy.',
    stages: [
      { objective: 'Collect corrupted bark samples from the Mirewood Edge.' },
      { objective: 'Return samples to the alchemist in Grimhaven.' },
    ],
    reward: { gold: 60, xp: 400, item: 'bark_armor' },
    unlockCondition: null,
  },
  {
    id: 'the_lost_knight',
    title: 'The Last Stand of Sir Aldric',
    giver: 'Lorekeeper',
    region: 'ashenveil',
    summary: 'The Hollow Warden was once Sir Aldric, the greatest knight of Valdris. The lorekeeper believes his identity can be restored — if you find his family sigil.',
    stages: [
      { objective: 'Find the Aldric family crypt in Ashenveil.' },
      { objective: 'Retrieve the sigil and use it before the final battle.' },
    ],
    reward: { gold: 0, xp: 800, flag: 'aldric_honored' },
    unlockCondition: 'met_saria',
  },
  {
    id: 'architects_notes',
    title: 'The Lost Volumes',
    giver: 'Lorekeeper',
    region: 'spire',
    summary: 'The Architect\'s research volumes were scattered when the Spire first fractured. Recovering them may explain what he was trying to do — and what went wrong.',
    stages: [
      { objective: 'Find three research volumes in the Spire Foothills.' },
      { objective: 'Bring them to the Lorekeeper for analysis.' },
    ],
    reward: { gold: 100, xp: 700, item: 'architects_wand' },
    unlockCondition: null,
  },
]

export function getMainQuestStage(stage) {
  return MAIN_QUEST_STAGES[stage] || MAIN_QUEST_STAGES[0]
}

export function getSideQuest(id) {
  return SIDE_QUESTS.find(q => q.id === id) || null
}

export function getAvailableSideQuests(flags = {}, completedQuests = []) {
  return SIDE_QUESTS.filter(q => {
    if (completedQuests.includes(q.id)) return false
    if (q.unlockCondition && !flags[q.unlockCondition]) return false
    return true
  })
}
