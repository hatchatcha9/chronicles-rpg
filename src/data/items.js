// Items, weapons, and loot

export const RARITIES = {
  common:    { label: 'Common',    color: '#888888', glow: 'none' },
  uncommon:  { label: 'Uncommon',  color: '#5aaa5a', glow: '0 0 8px #5aaa5a88' },
  rare:      { label: 'Rare',      color: '#6688cc', glow: '0 0 12px #6688cc88' },
  legendary: { label: 'Legendary', color: '#c8902a', glow: '0 0 20px #c8902a88' },
}

export const WEAPONS = [
  {
    id: 'rusty_sword',
    name: 'Eroded Blade of the Nameless',
    type: 'weapon',
    rarity: 'common',
    damage: '1d6',
    damageType: 'slashing',
    description: 'No maker\'s mark. No history. It has drawn blood before and remembers nothing.',
    flavor: 'The edge still holds. The past doesn\'t.',
    sprite: 'sword_basic',
  },
  {
    id: 'bone_dagger',
    name: 'Dagger of Flensed Bone',
    type: 'weapon',
    rarity: 'common',
    damage: '1d4+1',
    damageType: 'piercing',
    description: 'Carved from something\'s thighbone and polished to a killing edge.',
    flavor: 'Light. Quiet. Wrong in a way you can\'t name.',
    sprite: 'dagger_bone',
  },
  {
    id: 'warden_blade',
    name: "Warden's Shattered Blade",
    type: 'weapon',
    rarity: 'uncommon',
    damage: '1d8+2',
    damageType: 'slashing',
    description: 'Broken from the Hollow Warden\'s sword. Still resonates with cold purpose.',
    flavor: '"Even broken things remember what they were meant to do."',
    sprite: 'sword_broken',
    bonus: { ac: 1 },
  },
  {
    id: 'necrotic_staff',
    name: 'Staff of Desecration',
    type: 'weapon',
    rarity: 'rare',
    damage: '1d6+2',
    damageType: 'necrotic',
    description: 'Carved from a hanged man\'s gallows-wood. Spells cast through it deal +1d4 necrotic and leave black marks on stone.',
    flavor: '"It doesn\'t hunger. It has already eaten."',
    sprite: 'staff_dark',
    spellBonus: '1d4',
    bonus: { spellDC: 1 },
  },
  {
    id: 'ashen_bow',
    name: 'Bow of Ashwood and Crow Feather',
    type: 'weapon',
    rarity: 'uncommon',
    damage: '1d8+2',
    damageType: 'piercing',
    description: 'Cut from a tree in cursed Valdris, fletched with feathers from the ravens that circle the palace. Arrows fly true in darkness.',
    flavor: 'The kingdom gave this. The kingdom is dead.',
    sprite: 'bow_ashen',
    bonus: { attackRoll: 1 },
  },
  {
    id: 'thornblade',
    name: 'Thornblade',
    type: 'weapon',
    rarity: 'rare',
    damage: '1d8+3',
    damageType: 'piercing',
    description: 'Grown, not forged. The thorn still weeps green ichor.',
    flavor: 'The Mirewood does not forget what it gave you.',
    sprite: 'sword_thorn',
    onHit: { condition: 'poisoned', dc: 13 },
  },
  {
    id: 'verdant_staff',
    name: 'Staff of the Grove',
    type: 'weapon',
    rarity: 'rare',
    damage: '1d6+2',
    damageType: 'bludgeoning',
    description: 'Pulsing with natural magic. Grants +1 to spell attack rolls and DC.',
    flavor: '"The forest lent this. Return it when you\'re done."',
    sprite: 'staff_grove',
    bonus: { spellDC: 1, spellAttack: 1 },
  },
  {
    id: 'void_blade',
    name: 'Shard of the Fractured Spire',
    type: 'weapon',
    rarity: 'legendary',
    damage: '2d6+3',
    damageType: 'force',
    description: 'A sliver of solidified planar energy. Deals an extra 1d6 on a crit. Attacks can reach across short distances.',
    flavor: '"Reality cut itself. You kept the knife."',
    sprite: 'sword_void',
    onCrit: { bonus: '1d6' },
    bonus: { attackRoll: 2 },
  },
  {
    id: 'architects_wand',
    name: "Architect's Wand Fragment",
    type: 'weapon',
    rarity: 'legendary',
    damage: '1d4',
    damageType: 'force',
    description: 'A piece of the Architect\'s own instrument. +2 to all spell rolls, +1 spell slot of each level.',
    flavor: '"He made this to unmake. You made this yours."',
    sprite: 'wand_architect',
    bonus: { spellDC: 2, spellAttack: 2, extraSlots: { 1: 1, 2: 1 } },
  },
  {
    id: 'varethis_phylactery_shard',
    name: "Varethis's Phylactery Shard",
    type: 'offhand',
    rarity: 'legendary',
    description: 'A fragment of the lich\'s shattered phylactery. Grants immunity to frightened and advantage on death saves.',
    flavor: '"You hold a piece of his immortality. What will you do with yours?"',
    sprite: 'orb_phylactery',
    bonus: { conditionImmune: ['frightened'], deathSaveAdvantage: true },
  },
]

export const ARMOR = [
  {
    id: 'tattered_leather',
    name: 'Tattered Leather Armor',
    type: 'armor',
    rarity: 'common',
    acBonus: 0,
    description: 'Better than nothing. Barely.',
    sprite: 'armor_leather',
  },
  {
    id: 'warden_shield',
    name: "Hollow Warden's Shield",
    type: 'armor',
    rarity: 'uncommon',
    acBonus: 2,
    description: 'Still radiates faint protective magic. Dented where it shattered, but the enchantment holds.',
    flavor: 'Some defenses outlast the ones who raised them.',
    sprite: 'shield_hollow',
  },
  {
    id: 'bark_armor',
    name: 'Heartwood Bark Armor',
    type: 'armor',
    rarity: 'rare',
    acBonus: 2,
    description: 'Shed from Sylvanax during her transition. Incredibly light, incredibly hard.',
    flavor: 'The forest gives what it can to those who helped it.',
    sprite: 'armor_bark',
    bonus: { poisonResist: true },
  },
  {
    id: 'echo_cloak',
    name: "The Echo's Cloak",
    type: 'armor',
    rarity: 'rare',
    acBonus: 1,
    description: 'Woven from shadow and silence. Adds DEX mod to AC, reduces detection.',
    flavor: 'It looks like you. It acts like you. It is not you.',
    sprite: 'cloak_echo',
  },
]

export const CONSUMABLES = [
  {
    id: 'health_potion',
    name: 'Crimson Draught',
    type: 'consumable',
    rarity: 'common',
    heal: '2d4+2',
    description: 'A sealed phial of coagulated blood-wort extract. Heals 2d4+2 HP. Tastes of iron and old copper.',
    flavor: 'The alchemist makes no promises about what\'s in it.',
    sprite: 'potion_red',
  },
  {
    id: 'greater_health_potion',
    name: 'Greater Crimson Draught',
    type: 'consumable',
    rarity: 'uncommon',
    heal: '4d4+4',
    description: 'Double-distilled, with marrow extract. Heals 4d4+4 HP. The warmth spreads into places that hurt.',
    flavor: 'You will be whole. For a time.',
    sprite: 'potion_red_greater',
  },
  {
    id: 'antitoxin',
    name: 'Purgative Draught',
    type: 'consumable',
    rarity: 'common',
    removeCondition: 'poisoned',
    description: 'Foul-tasting ash-and-salt emetic. Removes the poisoned condition. Administered at your own peril.',
    flavor: 'The cure and the poison are rarely far apart.',
    sprite: 'potion_green',
  },
  {
    id: 'holy_water',
    name: 'Consecrated Vial',
    type: 'consumable',
    rarity: 'uncommon',
    throwDamage: '2d6',
    damageType: 'radiant',
    description: 'Water blessed at a crumbling shrine. When shattered against undead, deals 2d6 radiant damage.',
    flavor: 'The god who blessed this may no longer be listening.',
    sprite: 'flask_holy',
  },
  {
    id: 'elixir_courage',
    name: 'Draught of the Undaunted',
    type: 'consumable',
    rarity: 'uncommon',
    addBuff: 'blessed',
    removeCondition: 'frightened',
    description: 'A tincture that burns away fear and steadies the hand. Grants blessed condition and removes frightened.',
    flavor: 'Courage that comes from a bottle is still courage.',
    sprite: 'potion_gold',
  },
  {
    id: 'black_draught',
    name: 'Black Draught',
    type: 'consumable',
    rarity: 'uncommon',
    addBuff: 'strengthened',
    description: 'Alchemical concentrate brewed from void-touched ore. Grants +2 to attack rolls for 1 round. Stains the teeth.',
    flavor: 'The marches run on this. And fear.',
    sprite: 'potion_dark',
  },
  {
    id: 'mourning_ash',
    name: 'Mourning Ash',
    type: 'consumable',
    rarity: 'common',
    removeCondition: 'cursed',
    description: 'Ground ash from a funeral pyre, sealed in wax cloth. Removes the cursed condition when rubbed on skin.',
    flavor: 'Death has a use for everything.',
    sprite: 'flask_ash',
  },
]

export const ALL_ITEMS = [...WEAPONS, ...ARMOR, ...CONSUMABLES]

// Loot tables per boss/encounter difficulty
export const LOOT_TABLES = {
  encounter_common: [
    { item: 'rusty_sword', weight: 3 },
    { item: 'health_potion', weight: 6 },
    { item: 'antitoxin', weight: 4 },
    { item: 'tattered_leather', weight: 2 },
    { item: 'bone_dagger', weight: 3 },
  ],
  encounter_miniboss: [
    { item: 'warden_blade', weight: 3 },
    { item: 'warden_shield', weight: 3 },
    { item: 'ashen_bow', weight: 2 },
    { item: 'greater_health_potion', weight: 4 },
    { item: 'holy_water', weight: 4 },
    { item: 'elixir_courage', weight: 3 },
  ],
  forest_miniboss: [
    { item: 'thornblade', weight: 3 },
    { item: 'bark_armor', weight: 3 },
    { item: 'greater_health_potion', weight: 5 },
    { item: 'antitoxin', weight: 5 },
    { item: 'verdant_staff', weight: 2 },
  ],
  encounter_boss: [
    { item: 'necrotic_staff', weight: 4 },
    { item: 'thornblade', weight: 4 },
    { item: 'verdant_staff', weight: 4 },
    { item: 'bark_armor', weight: 3 },
    { item: 'echo_cloak', weight: 3 },
    { item: 'void_blade', weight: 2 },
    { item: 'architects_wand', weight: 2 },
    { item: 'varethis_phylactery_shard', weight: 1 },
  ],
}

export function rollLoot(table) {
  const entries = LOOT_TABLES[table] || LOOT_TABLES.encounter_common
  const totalWeight = entries.reduce((a, e) => a + e.weight, 0)
  let r = Math.random() * totalWeight
  for (const entry of entries) {
    r -= entry.weight
    if (r <= 0) return ALL_ITEMS.find(i => i.id === entry.item)
  }
  return ALL_ITEMS.find(i => i.id === entries[0].item)
}

export function getItem(id) {
  return ALL_ITEMS.find(i => i.id === id)
}

export const SHOP_INVENTORIES = {
  blacksmith: {
    name: 'The Broken Forge',
    keeperLine: 'I don\'t ask where you\'ve been. I ask what broke.',
    items: [
      { item: ALL_ITEMS.find(i => i.id === 'rusty_sword'),     price: 15 },
      { item: ALL_ITEMS.find(i => i.id === 'bone_dagger'),     price: 12 },
      { item: ALL_ITEMS.find(i => i.id === 'ashen_bow'),       price: 55 },
      { item: ALL_ITEMS.find(i => i.id === 'tattered_leather'),price: 10 },
      { item: ALL_ITEMS.find(i => i.id === 'warden_shield'),   price: 45 },
    ],
  },
  alchemist: {
    name: 'The Venom & Cure',
    keeperLine: 'Everything is poison. It\'s only a matter of dose.',
    items: [
      { item: ALL_ITEMS.find(i => i.id === 'health_potion'),   price: 20 },
      { item: ALL_ITEMS.find(i => i.id === 'antitoxin'),       price: 15 },
      { item: ALL_ITEMS.find(i => i.id === 'greater_health_potion'), price: 40 },
      { item: ALL_ITEMS.find(i => i.id === 'elixir_courage'),  price: 30 },
      { item: ALL_ITEMS.find(i => i.id === 'black_draught'),   price: 25 },
      { item: ALL_ITEMS.find(i => i.id === 'mourning_ash'),    price: 20 },
    ],
  },
}
