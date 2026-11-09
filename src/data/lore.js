// Prophecies, rumors, cursed items, factions, mysteries — the living tissue of the realm

export const PROPHECIES = [
  {
    id: 'shattered_crown',
    title: 'The Shattered Crown',
    text: `When the third moon bleeds and the shepherd sleeps,
The crown of seven pieces shall be made whole.
He who refuses the gift shall keep
What he was, and lose what he would become.
He who accepts shall be neither.`,
    hint: 'The shepherd is a constellation, not a person. The crown is a bloodline, not a jewel.',
    type: 'cryptic',
    revealed: false,
  },
  {
    id: 'hollow_king',
    title: 'The Hollow King',
    text: `Do not wake the Hollow King lest the realm fall.
Do not let him slumber lest the realm fall.
The realm falls. This was written before you were born.
The question was never whether — only whose hands.`,
    hint: 'The realm will fall. The only choice is who holds the pieces.',
    type: 'self_fulfilling',
    revealed: false,
  },
  {
    id: 'mercy_undone',
    title: 'The Mercy Undone',
    text: `Three shall come to the door of the last shepherd.
One shall speak the truth and be turned away.
One shall speak the lie and be welcomed.
One shall say nothing and inherit the door.
Speak wisely — the shepherd has heard every word before.`,
    hint: 'The shepherd rewards the unexpected. Truth bores him. Silence confounds him.',
    type: 'conditional',
    revealed: false,
  },
  {
    id: 'bone_concordat',
    title: 'The Bone Concordat',
    text: `The pact made in silence shall be broken in screaming.
The city that forgets its dead shall be remembered by them.
When the last gravedigger lays down his spade,
Count seven sunsets. On the eighth, do not be in Grimhaven.`,
    hint: 'The last gravedigger retired. Count from that day.',
    type: 'ticking_clock',
    revealed: false,
  },
  {
    id: 'planebreaker',
    title: 'The Planebreaker\'s Warning',
    text: `You have already opened the door.
What follows is consequence, not fate.
The Broken Realm was not broken by evil.
It was broken by people who thought they were fixing it.`,
    hint: 'No verse. No metaphor. Delivered by an ancient entity who has watched this before.',
    type: 'blunt',
    revealed: false,
  },
  {
    id: 'inverse_saint',
    title: 'The Inverse Saint',
    text: `Blessed is she who suffers without cause,
For her suffering shall find one.
Blessed is he who causes suffering without malice,
For his hands shall be used for greater cruelty still.
The saint is not the one who kneels. The saint is the reason.`,
    hint: 'This prophecy describes an NPC you likely know. It has been true the whole time.',
    type: 'retroactive',
    revealed: false,
  },
]

export const GRIMHAVEN_RUMORS = [
  { id: 'granary_lights', text: 'The Miller\'s son hasn\'t been seen in two weeks. I\'ve seen lights in the old granary at night.', true: true, truth: 'The son is alive but hiding — he witnessed a Bone Concordat ritual.' },
  { id: 'apothecary_cures', text: 'The new apothecary sells cures that actually work. First honest healer in a decade.', true: false, truth: 'Her cures work, but she\'s skimming reagents. Three patients will relapse badly.' },
  { id: 'father_aldric', text: 'Father Aldric found something in the crypts beneath the chapel. He\'s been different ever since.', true: 'misleading', truth: 'He found a journal revealing the chapel was built over a mass grave. No monster. Just history.' },
  { id: 'watch_captain', text: 'The old watch captain drinks herself senseless every Godday eve. Has done since her husband died.', true: true, truth: 'She arrested the wrong man for a murder. He died in custody. She\'s never recovered.' },
  { id: 'ashwood_beast', text: 'There\'s a beast in the Ashwood. The woodcutter lost his horse to it.', true: 'misleading', truth: 'Mundane wolves. The horse panicked near a planar fracture that emits a subsonic hum.' },
  { id: 'inn_cellar', text: 'The Ironveil merchant left something in the inn\'s cellar. The innkeeper won\'t say what.', true: false, truth: 'The innkeeper invented this rumor to justify raising her rates.' },
  { id: 'blacksmith_chandler', text: 'The blacksmith and the chandler haven\'t spoken in eleven years. No one knows why.', true: true, truth: 'The blacksmith\'s first wife left him for the chandler. The chandler\'s current wife doesn\'t know.' },
  { id: 'vellum_house', text: 'Strange music comes from the old Vellum house on moonless nights.', true: 'misleading', truth: 'The eldest daughter plays viola in the dark from a songbook found in the walls — written in an unknown language.' },
  { id: 'well_depth', text: 'The town\'s well was dug deeper last spring. Workers hit something and they never said what.', true: true, truth: 'They hit an ancient binding seal. The foreman pocketed it. It was keeping something dormant.' },
  { id: 'gravedigger', text: 'The new gravedigger is a deserter from the Undying Legion. That\'s why he never shows his arms.', true: false, truth: 'Severe burn scarring he\'s ashamed of. Completely local, never served anywhere.' },
  { id: 'mayor_age', text: 'Mayor Threnwick hasn\'t aged in twenty years. Must be a deal with something.', true: 'misleading', truth: 'Mundane condition — he looked 55 at 35 and still looks 55. But he is embezzling the burial fund.' },
  { id: 'widow_candles', text: 'The widow Osren burns candles in every window, all night, every night.', true: true, truth: 'She\'s keeping something away. Her dead son\'s shade visits, but it no longer acts like her son.' },
]

export const CURSED_ITEMS = [
  {
    id: 'penitent_collar',
    name: 'The Penitent\'s Collar',
    description: 'A silver necklace with a prayer-etched pendant. Clearly valuable.',
    effect: 'Advantage on Persuasion checks. People genuinely like the wearer more.',
    curse: 'Every charmed interaction offloads charm\'s weight to someone else. After a month, beloved by strangers, despised by everyone you care about.',
    reveal: 'Allies grow inexplicably cold. Every silver-tongued conversation was a loan someone else paid.',
    rarity: 'uncommon',
  },
  {
    id: 'surgeons_hand',
    name: 'The Surgeon\'s Hand',
    description: 'A preserved human hand, dried and mounted. Used as a prosthetic, it restores full function.',
    effect: 'Proficiency with Healer\'s kit, advantage on Medicine checks.',
    curse: 'Has the memories of its original owner — a skilled but cruel surgeon. The wearer begins having dreams of procedures that weren\'t mercy.',
    reveal: 'Wearer succeeds on a heal check and realizes they used a technique they\'d never learned.',
    rarity: 'rare',
  },
  {
    id: 'comfortable_coat',
    name: 'The Comfortable Coat',
    description: 'A worn travelling coat, slightly too warm. Never needs washing.',
    effect: 'Wearer is never cold, never wet, always physically comfortable.',
    curse: 'Absorbing sensation, not preventing it. Progressive numbness: temperature, then pain, then physical urgency.',
    reveal: 'Wearer fails to notice a wound. The coat took the experience of comfort — not the discomfort.',
    rarity: 'uncommon',
  },
  {
    id: 'orators_ring',
    name: 'The Orator\'s Ring',
    description: 'A brass ring with a stylized mouth engraved on it.',
    effect: 'Immune to magical silence. Cannot be silenced by any effect.',
    curse: 'Cannot be removed without surgery. Wearer cannot voluntarily stay silent — they whisper when gagged, hum when silenced.',
    reveal: 'The first time it costs them (stealth failure, accidentally spoken secret), they realize they haven\'t chosen quiet in weeks.',
    rarity: 'uncommon',
  },
  {
    id: 'portrait_coin',
    name: 'The Portrait Coin',
    description: 'A gold coin with an unusually detailed face. The face looks like no known ruler.',
    effect: 'The coin always returns to the owner\'s pocket within an hour of being spent.',
    curse: 'The face is slowly changing to resemble the owner. Someone is watching through it.',
    reveal: 'The face on the coin is now unmistakably the wearer\'s face, and it looks back.',
    rarity: 'rare',
  },
  {
    id: 'feather_passage',
    name: 'The Feather of True Passage',
    description: 'A large black feather that never deteriorates. Said to be from a psychopomp\'s wing.',
    effect: 'The dead speak clearly to its bearer — ghosts, shades, and echoes become audible.',
    curse: 'The dead don\'t stop speaking. The bearer hears them constantly — cities become cacophonous, graveyards overwhelming.',
    reveal: 'Bearer starts shushing others in public. They begin to perceive the living as the minority.',
    rarity: 'rare',
  },
  {
    id: 'mended_blade',
    name: 'The Mended Blade',
    description: 'A longsword broken and reforged many times. Despite this, perfectly balanced.',
    effect: 'After defeating an enemy, absorbs a trace of their strength. Accumulates bonus damage over time.',
    curse: 'Absorbs the enemies\' last emotional impressions — debt unpaid, child not seen, word unsaid. Accumulates incomplete lives.',
    reveal: 'Wielder wakes calling out a name that isn\'t theirs. It belonged to someone the blade remembers.',
    rarity: 'rare',
  },
  {
    id: 'twice_buried_compass',
    name: 'The Twice-Buried Compass',
    description: 'A compass that doesn\'t point north. Points toward "what you need most."',
    effect: 'Useful, usually accurate. Points toward exits, water, the right person in a crowd.',
    curse: 'Redefines "need" for the bearer. Slowly the bearer stops making their own decisions. Eventually points toward what they fear most.',
    reveal: 'The compass starts pointing somewhere the bearer doesn\'t want to go. It is right about why.',
    rarity: 'uncommon',
  },
]

export const FACTIONS = [
  {
    id: 'bone_concordat',
    name: 'The Bone Concordat',
    description: 'An ancient compact between the living and the dead. Now corrupted from within by those who believe controlled undeath is preferable to chaos.',
    goals: 'Catalog the dead. Prevent wild undeath. Build an army of willing undead who chose it.',
    tension: 'Traditionalists (preserve the compact) vs. Reformists (the compact must evolve).',
    favorActions: ['Destroy rogue undead without looting', 'Report planar fractures', 'Refuse necromancy when offered'],
    disfavorActions: ['Use unsanctioned undead', 'Destroy Concordat seals', 'Side with one faction against the other'],
    rewards: 'Safe passage through undead zones, curse knowledge, planar fracture information.',
    color: '#8060a0',
    symbol: '☠',
  },
  {
    id: 'verdant_wound',
    name: 'The Verdant Wound',
    description: 'Druids and nature-keepers whose connection to the natural world has been corrupted by proximity to planar fractures.',
    goals: 'Close the fractures before the natural world fully merges with something else. Some factions: accelerate the merge to trigger a "reset."',
    tension: 'Preservers (heal nature) vs. Accepters (corruption is nature now) vs. Burners (burn the corrupted zones).',
    favorActions: ['Investigate corrupted zones without destroying', 'Choose non-lethal solutions with corrupted wildlife', 'Refuse to clear forest for settlements'],
    disfavorActions: ['Burn Ashwood without sanction', 'Kill corrupted animals when alternatives existed', 'Work with alchemists who harvest corrupted zones'],
    rewards: 'Safe passage through corrupted nature, corrupted-zone maps, herbal knowledge impossible elsewhere.',
    color: '#405a30',
    symbol: '🌿',
  },
  {
    id: 'ironveil_circuit',
    name: 'The Ironveil Circuit',
    description: 'A mercantile intelligence network that has quietly become the most reliable information broker in the region.',
    goals: 'Stability, information monopoly, controlled access to fracture-adjacent resources.',
    tension: 'Merchants (keep the peace) vs. Analysts (the fractures are extinction-level) vs. Opportunists (get rich now, leave before collapse).',
    favorActions: ['Bring new information', 'Complete courier runs', 'Protect Ironveil caravans'],
    disfavorActions: ['Share Ironveil intelligence with rivals', 'Interfere with fracture-mapping', 'Expose their intelligence network'],
    rewards: 'Money, travel papers, letters of introduction, specific information players need, safe houses.',
    color: '#a08030',
    symbol: '⚖',
  },
  {
    id: 'unseen_chorus',
    name: 'The Unseen Chorus',
    description: 'People who passed through planar fractures, spent time in the echo-spaces beyond, and came back changed. Not organized by ideology, but by shared experience.',
    goals: 'No single goal. Some want to return. Some want the fractures sealed. All want to be understood rather than feared.',
    tension: 'Returners (the fractures lead somewhere better) vs. Scarred (seal every fracture) vs. Witnesses (document what we saw).',
    favorActions: ['Listen without dismissing their experiences', 'Protect Chorus members from persecution', 'Share information about fractures encountered'],
    disfavorActions: ['Seal a fracture with unfinished Chorus business inside', 'Use their knowledge without acknowledgment', 'Treat their experiences as symptoms'],
    rewards: 'Knowledge of fracture interiors, ability to identify fracture-touched objects, warning before fractures destabilize.',
    color: '#406080',
    symbol: '◈',
  },
]

export const MYSTERIES = [
  {
    id: 'flowers_on_throne',
    title: 'Flowers on the Lich\'s Throne',
    hook: 'Fresh winter-blooming black hellebore appears weekly on the stone throne of a lich destroyed forty years ago. The flowers don\'t grow within fifty miles.',
    layers: 'The person leaving them loved who the lich was before. They\'ve been coming for forty years. They\'re not mourning the lich — they\'re keeping a promise made to the person who became one.',
    resolution: 'Find the person. The mystery\'s answer makes the lich retroactively more complicated.',
  },
  {
    id: 'missing_prayers',
    title: 'The Missing Prayers',
    hook: 'Three months ago, the same prayer began appearing in Father Aldric\'s morning log every single night: "Let him not wake." Same handwriting. Unknown author.',
    layers: '"Him" refers to something sealed beneath the town. The prayer is an active suppression ritual. If it stops for even a few nights, players will notice environmental changes.',
    resolution: 'The author is dying. The vigil will end without help.',
  },
  {
    id: 'seventh_portrait',
    title: 'The Seventh Portrait',
    hook: 'The council hall has portraits of six founding members but seven portrait hooks. All references to the seventh founder have been redacted in town records.',
    layers: 'The name appears once in a chapel library book margin — crossed out, readable under magnification. The portrait exists in a private collection, face to the wall. The founder wasn\'t human.',
    resolution: 'The seventh founder is still relevant to what\'s coming for Grimhaven. They were removed because their methods were effective and monstrous.',
  },
  {
    id: 'second_tracks',
    title: 'The Second Set of Tracks',
    hook: 'Two sets of footprints leave Grimhaven every dawn. Only one returns every dusk. Same pattern for three weeks.',
    layers: 'The traveler visits a planar fracture and leaves a version of themselves inside — each version conscious, chosen. They\'re curing something by carving it out of themselves.',
    resolution: 'Eventually they return with no second set of tracks. Cured. Missing something fundamental. The echo-spaces hold the carved-out pieces, which are waiting.',
  },
  {
    id: 'accurate_historian',
    title: 'The Accurate Historian',
    hook: 'A pamphlet-seller sells histories of events that happened months ago. Accurate, well-sourced — except some describe events players haven\'t done yet. Including their names.',
    layers: 'The pamphlets come from the future, bleeding through a planar fracture. The historian is writing post-mortems of events that have already happened to them, sending them back.',
    resolution: 'Find the historian\'s fracture-channel. Communicate across time by writing. What you send changes what they send forward.',
  },
]

export function getProphecy(id) {
  return PROPHECIES.find(p => p.id === id)
}

export function getFaction(id) {
  return FACTIONS.find(f => f.id === id)
}

export function getCursedItem(id) {
  return CURSED_ITEMS.find(c => c.id === id)
}

export function getRandomRumors(count = 4) {
  const shuffled = [...GRIMHAVEN_RUMORS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
