// Boss definitions with phases, abilities, and combat data

export const BOSSES = {
  // ────── Campaign 1: The Ashen Throne ──────
  hollow_warden: {
    id: 'hollow_warden',
    name: 'The Hollow Warden',
    title: 'Guardian of the Fallen Gate',
    cr: 5,
    xp: 1800,
    lootTable: 'encounter_miniboss',
    sprite: 'hollow_warden',
    arenaTheme: 'crypt',
    intro: 'From the shadows of the ruined gatehouse, a massive armored figure steps forward. Ancient blue fire burns in the eye slits of its helm. It raises a cracked tower shield and a corroded blade — and says nothing. It has not spoken in three centuries.',
    phases: [
      {
        phaseName: 'Phase 1 — Shield Wall',
        hp: 70,
        ac: 17,
        atkBonus: 7,
        transitionAt: 0.4,
        saveModifiers: { str: 5, dex: 1, con: 4, int: -1, wis: 2, cha: -2 },
        saveMods: { str: 5, dex: 1, con: 4, wis: 2 },
        abilities: [
          { name: 'Longsword Strike', type: 'attack', damage: '2d6+5', atkBonus: 7 },
          { name: 'Shield Bash', type: 'attack', damage: '1d6+5', atkBonus: 6, saveDC: 14, saveType: 'str', condition: 'restrained', description: 'Knocks target prone — restrained' },
          { name: 'Deathly Bulwark', type: 'buff', buffEffect: 'ac+3', description: 'Raises shield, granting +3 AC until next turn.' },
        ],
        legendaryActions: 1,
        phaseTransitionText: "The Warden roars — a hollow, echoing sound from behind its visor. Its shield shatters as a surge of dark energy erupts from its chest. The armor staggers. Then straightens. Something older than Aldric moves the steel now.",
      },
      {
        phaseName: 'Phase 2 — Berserk Fury',
        hp: 55,
        ac: 14,
        atkBonus: 9,
        transitionAt: 0,
        saveMods: { str: 6, dex: 2, con: 5, wis: 1 },
        abilities: [
          { name: 'Reckless Assault', type: 'attack', damage: '2d8+5', atkBonus: 9, description: 'Attacks twice — uncontrolled fury' },
          { name: 'Necrotic Slam', type: 'aoe', damage: '2d6+4', damageType: 'necrotic', saveDC: 14, saveType: 'con', description: 'Waves of necrotic energy' },
          { name: 'Undying Rage', type: 'buff', buffEffect: 'dmg+2', description: 'Deals +2 extra damage on all attacks for 2 rounds.' },
        ],
        legendaryActions: 2,
        phaseTransitionText: null,
      }
    ]
  },

  varethis: {
    id: 'varethis',
    name: 'Varethis the Undying',
    title: 'Lich of Valdris',
    cr: 15,
    xp: 13000,
    lootTable: 'encounter_boss',
    sprite: 'varethis',
    arenaTheme: 'throne',
    intro: 'At the heart of the Ashen Throne, a robed skeleton sits upon a seat of fused bones. As you enter, its head turns — deliberate, patient. Two motes of pale violet light regard you from empty sockets. When it speaks, the air grows cold. "Another mortal comes to die in this place. How refreshing. It has been... forty years since the last one."',
    phases: [
      {
        phaseName: 'Phase 1 — The Lich Enthroned',
        hp: 100,
        ac: 17,
        atkBonus: 9,
        transitionAt: 0.6,
        saveMods: { str: 1, dex: 3, con: 5, int: 7, wis: 6, cha: 4 },
        abilities: [
          { name: 'Necrotic Bolt', type: 'attack', damage: '4d8+5', damageType: 'necrotic', atkBonus: 9 },
          { name: 'Finger of Death', type: 'aoe', damage: '7d8+30', damageType: 'necrotic', saveDC: 18, saveType: 'con', description: 'Targets vital force' },
          { name: 'Blight', type: 'aoe', damage: '6d8', damageType: 'necrotic', saveDC: 16, saveType: 'con', condition: 'poisoned' },
          { name: 'Enervation Wave', type: 'condition', target: 'player', condition: 'frightened', description: 'Radiates overwhelming dread' },
        ],
        legendaryActions: 3,
        phaseTransitionText: "The lich rises from its throne. Robes fall away. Its skeletal form crackles with violet energy — and it speaks, almost quietly: 'You are still alive. That has not happened before.' The violet light intensifies.",
      },
      {
        phaseName: 'Phase 2 — Skeletal Ascension',
        hp: 80,
        ac: 16,
        atkBonus: 10,
        transitionAt: 0.3,
        saveMods: { str: 2, dex: 4, con: 5, int: 8, wis: 7, cha: 5 },
        abilities: [
          { name: 'Bone Lance', type: 'attack', damage: '3d8+6', damageType: 'piercing', atkBonus: 10 },
          { name: 'Summon Undead', type: 'summon', count: 3, description: 'Raises fallen bones into wights' },
          { name: 'Necrotic Burst', type: 'aoe', damage: '5d8', damageType: 'necrotic', saveDC: 17, saveType: 'dex', condition: 'burning' },
          { name: 'Life Drain', type: 'attack', damage: '4d6', damageType: 'necrotic', atkBonus: 8, healSelf: true, description: 'Drains life and heals Varethis' },
        ],
        legendaryActions: 3,
        phaseTransitionText: "The skeleton collapses. But the violet light remains — three orbs circling each other in the air above. The throne shakes. The walls crack. 'YOU CANNOT KILL WHAT NEVER TRULY LIVED.'",
      },
      {
        phaseName: 'Phase 3 — Soul Orb',
        hp: 60,
        ac: 20,
        atkBonus: 11,
        transitionAt: 0,
        saveMods: { str: 0, dex: 5, con: 6, int: 9, wis: 8, cha: 6 },
        abilities: [
          { name: 'Soul Rupture', type: 'aoe', damage: '6d8', damageType: 'psychic', saveDC: 19, saveType: 'int', condition: 'stunned' },
          { name: 'Phylactery Pulse', type: 'attack', damage: '5d8+5', damageType: 'necrotic', atkBonus: 11, description: 'Each orb fires a bolt' },
          { name: 'Deathweb', type: 'condition', target: 'player', condition: 'restrained', description: 'Invisible tendrils hold you in place' },
          { name: 'Void Touch', type: 'aoe', damage: '4d10', damageType: 'necrotic', saveDC: 18, saveType: 'con' },
        ],
        legendaryActions: 3,
        phaseTransitionText: null,
        note: 'Player must destroy 3 phylactery shards — tracked as boss condition mechanic',
      }
    ]
  },

  // ────── Campaign 2: The Verdant Labyrinth ──────
  thornwarden: {
    id: 'thornwarden',
    name: 'The Thornwarden',
    title: 'Corrupted Sentinel of the Mirewood',
    cr: 6,
    xp: 2300,
    lootTable: 'forest_miniboss',
    sprite: 'thornwarden',
    arenaTheme: 'forest',
    intro: "You smell it before you see it — wet bark and something sweet and rotten. The treant steps from the undergrowth, bark split to reveal pulsing crimson veins. It is not angry. It is not afraid. It simply does not recognize you as something that deserves to exist.",
    phases: [
      {
        phaseName: 'Phase 1 — Ancient Horror',
        hp: 90,
        ac: 15,
        atkBonus: 8,
        transitionAt: 0.4,
        saveMods: { str: 7, dex: -1, con: 6, int: -2, wis: 3, cha: -1 },
        abilities: [
          { name: 'Branch Slam', type: 'attack', damage: '3d8+7', damageType: 'bludgeoning', atkBonus: 8 },
          { name: 'Entangle', type: 'aoe', damage: '0', saveDC: 15, saveType: 'str', condition: 'restrained', damageType: '' },
          { name: 'Spore Cloud', type: 'aoe', damage: '2d6', damageType: 'poison', saveDC: 14, saveType: 'con', condition: 'poisoned' },
          { name: 'Root Stomp', type: 'attack', damage: '2d6+7', damageType: 'bludgeoning', atkBonus: 7, condition: 'restrained' },
        ],
        legendaryActions: 2,
        phaseTransitionText: "The Thornwarden shudders — and then SPLITS. Three smaller forms tear themselves free from the original body, each pulsing with that same sick red light. They circle you.",
      },
      {
        phaseName: 'Phase 2 — The Three Warden Shards',
        hp: 65,
        ac: 13,
        atkBonus: 6,
        transitionAt: 0,
        saveMods: { str: 5, dex: 1, con: 4, int: -2, wis: 2, cha: -1 },
        abilities: [
          { name: 'Coordinated Strike', type: 'attack', damage: '2d6+5', damageType: 'piercing', atkBonus: 6, description: 'Three forms attack at once' },
          { name: 'Resin Spray', type: 'aoe', damage: '3d6', damageType: 'poison', saveDC: 14, saveType: 'con', condition: 'poisoned' },
          { name: 'Merge Threat', type: 'buff', description: 'They begin merging back — growing stronger' },
        ],
        legendaryActions: 3,
        phaseTransitionText: null,
      }
    ]
  },

  sylvanax: {
    id: 'sylvanax',
    name: 'Sylvanax the Unbound',
    title: 'Ancient Will of the Mirewood',
    cr: 14,
    xp: 11500,
    lootTable: 'encounter_boss',
    sprite: 'sylvanax',
    arenaTheme: 'heartroot',
    intro: "The clearing opens into something impossible — a cathedral of living trees, cathedral-vaulted with woven branches. In its center, a figure of impossible grace turns to face you. Her form is humanoid, made of bark and leaf and deep forest shadow. Her eyes are the color of the moon through fog. 'I was beautiful once,' she says. 'What the poison has made me... I regret you must witness.'",
    phases: [
      {
        phaseName: 'Phase 1 — The Dryad Sovereign',
        hp: 95,
        ac: 16,
        atkBonus: 9,
        transitionAt: 0.55,
        saveMods: { str: 4, dex: 6, con: 4, int: 5, wis: 7, cha: 8 },
        abilities: [
          { name: 'Thorn Lash', type: 'attack', damage: '2d8+5', damageType: 'piercing', atkBonus: 9 },
          { name: 'Verdant Charm', type: 'condition', target: 'player', condition: 'frightened', description: 'Her beauty warps into horror' },
          { name: 'Briar Wall', type: 'aoe', damage: '3d6', damageType: 'piercing', saveDC: 16, saveType: 'dex', condition: 'restrained' },
          { name: 'Nature\'s Wrath', type: 'aoe', damage: '4d8', damageType: 'poison', saveDC: 15, saveType: 'con', condition: 'poisoned' },
        ],
        legendaryActions: 3,
        phaseTransitionText: "Sylvanax screams — not in pain, in transformation. The elegant form explodes outward. Bark thickens. Roots tear through the earth. She rises and rises, a tower of wood and corruption, her face split into a rictus of flowers that still somehow looks like sorrow.",
      },
      {
        phaseName: 'Phase 2 — The Titan Unbound',
        hp: 110,
        ac: 18,
        atkBonus: 10,
        transitionAt: 0.25,
        saveMods: { str: 9, dex: 2, con: 7, int: 4, wis: 6, cha: 7 },
        abilities: [
          { name: 'Root Crush', type: 'attack', damage: '4d10+8', damageType: 'bludgeoning', atkBonus: 10 },
          { name: 'Grasping Canopy', type: 'aoe', damage: '3d8', damageType: 'bludgeoning', saveDC: 17, saveType: 'str', condition: 'restrained' },
          { name: 'Poison Flood', type: 'aoe', damage: '5d6', damageType: 'poison', saveDC: 16, saveType: 'con', condition: 'poisoned' },
          { name: 'Tremor Slam', type: 'aoe', damage: '4d6', damageType: 'bludgeoning', saveDC: 16, saveType: 'dex' },
        ],
        legendaryActions: 3,
        phaseTransitionText: "The titan collapses — but from the wreckage rises something far smaller. Far stranger. A sphere of pure silver-green light, orbiting itself. When it speaks, you hear it in the oldest part of your mind. 'Help me. Please. Help me.'",
      },
      {
        phaseName: 'Phase 3 — The Pure Essence',
        hp: 45,
        ac: 22,
        atkBonus: 11,
        transitionAt: 0,
        saveMods: { str: 1, dex: 8, con: 5, int: 8, wis: 9, cha: 10 },
        abilities: [
          { name: 'Nature\'s Lament', type: 'aoe', damage: '5d8', damageType: 'psychic', saveDC: 18, saveType: 'wis', condition: 'frightened' },
          { name: 'Verdant Pulse', type: 'attack', damage: '4d6+6', damageType: 'radiant', atkBonus: 11, description: 'Bursts of pure life energy' },
          { name: 'Phase Shift', type: 'buff', buffEffect: 'dodge', description: 'Becomes briefly incorporeal — next attack misses automatically' },
        ],
        legendaryActions: 3,
      }
    ]
  },

  // ────── Campaign 3: The Shattered Spire ──────
  the_echo: {
    id: 'the_echo',
    name: 'The Echo',
    title: 'Your Shadow Self',
    cr: 8,
    xp: 3900,
    lootTable: 'encounter_miniboss',
    sprite: 'echo',
    arenaTheme: 'fractured',
    intro: 'It steps from the mirror at the center of the fractured hall. It has your face. Your weapons. Your posture. When you raise a hand, it raises the opposite. It has no voice. It has no mercy. It is everything you could become if you stopped caring why.',
    phases: [
      {
        phaseName: 'Phase 1 — The Perfect Mirror',
        hp: 75,
        ac: 15,
        atkBonus: 7,
        transitionAt: 0.35,
        saveMods: { str: 3, dex: 4, con: 3, int: 4, wis: 3, cha: 3 },
        abilities: [
          { name: 'Shadow Strike', type: 'attack', damage: '2d8+4', damageType: 'necrotic', atkBonus: 7 },
          { name: 'Void Reflection', type: 'aoe', damage: '3d6', damageType: 'psychic', saveDC: 15, saveType: 'wis', condition: 'frightened', description: 'Shows you your worst self' },
          { name: 'Mirror Copy', type: 'buff', buffEffect: 'dodge', description: 'Creates illusory double — next attack misses automatically' },
          { name: 'Shadow Slash', type: 'attack', damage: '1d8+4', damageType: 'slashing', atkBonus: 8, description: 'Quick precise strike' },
        ],
        legendaryActions: 2,
        phaseTransitionText: "The Echo staggers — and then grins. Your grin. It speaks with a voice made of the sounds that have hurt you most: 'You hold back. I never learned how.'",
      },
      {
        phaseName: 'Phase 2 — Unchained',
        hp: 60,
        ac: 14,
        atkBonus: 9,
        transitionAt: 0,
        saveMods: { str: 4, dex: 5, con: 4, int: 5, wis: 4, cha: 4 },
        abilities: [
          { name: 'Full Assault', type: 'attack', damage: '2d8+5', damageType: 'necrotic', atkBonus: 9, description: 'Three rapid strikes' },
          { name: 'Void Nova', type: 'aoe', damage: '4d8', damageType: 'psychic', saveDC: 16, saveType: 'wis', condition: 'stunned' },
          { name: 'Life Steal', type: 'attack', damage: '3d8', damageType: 'necrotic', atkBonus: 8, healSelf: true },
        ],
        legendaryActions: 2,
      }
    ]
  },

  the_architect: {
    id: 'the_architect',
    name: 'The Architect',
    title: 'Ivelion, Unmaker of Worlds',
    cr: 17,
    xp: 18000,
    lootTable: 'encounter_boss',
    sprite: 'architect',
    arenaTheme: 'void',
    intro: 'At the apex of the Shattered Spire, above the fracture lines of three realities, an old man sits writing at a desk. He doesn\'t look up when you enter. "I\'ve been expecting you," he says. His quill moves. "In seventeen of my projections, you make it this far." He looks up. One eye is normal, rheumy with age. The other is a void — absolute black with distant stars. "In twelve of those, you\'re worth talking to first."',
    phases: [
      {
        phaseName: 'Phase 1 — The Master of Forms',
        hp: 105,
        ac: 17,
        atkBonus: 10,
        transitionAt: 0.6,
        saveMods: { str: 2, dex: 4, con: 5, int: 10, wis: 7, cha: 6 },
        abilities: [
          { name: 'Arcane Bolt', type: 'attack', damage: '4d10+5', damageType: 'arcane', atkBonus: 10 },
          { name: 'Gravity Well', type: 'aoe', damage: '3d10', damageType: 'force', saveDC: 18, saveType: 'str', condition: 'restrained', description: 'Crushes you with warped gravity' },
          { name: 'Time Slow', type: 'condition', target: 'player', condition: 'stunned', description: 'Your next action takes effect one turn later', saveDC: 17, saveType: 'wis' },
          { name: 'Force Lattice', type: 'aoe', damage: '5d6', damageType: 'force', saveDC: 17, saveType: 'dex' },
        ],
        legendaryActions: 3,
        phaseTransitionText: "The Architect closes his book. His human eye closes. Then the void one opens wider — impossibly wide. His body tears apart and reconstitutes around the darkness, half his flesh consumed by swirling null-space. 'You\'re stronger than I modeled. Let me recalculate.'",
      },
      {
        phaseName: 'Phase 2 — Half-Consumed',
        hp: 90,
        ac: 19,
        atkBonus: 12,
        transitionAt: 0.35,
        saveMods: { str: 3, dex: 5, con: 7, int: 12, wis: 9, cha: 8 },
        abilities: [
          { name: 'Void Claw', type: 'attack', damage: '3d10+7', damageType: 'necrotic', atkBonus: 12, description: 'His void-consumed arm tears reality' },
          { name: 'Concept: Fear', type: 'aoe', damage: '5d8', damageType: 'psychic', saveDC: 19, saveType: 'wis', condition: 'frightened' },
          { name: 'Concept: Gravity', type: 'aoe', damage: '6d8', damageType: 'force', saveDC: 18, saveType: 'str', condition: 'restrained' },
          { name: 'Reality Fold', type: 'buff', description: 'Teleports and gets a free attack', healSelf: true },
        ],
        legendaryActions: 3,
        phaseTransitionText: "The Architect laughs — the last human sound he\'ll make. The void consumes the rest of him. What remains is pure concept: a geometric shape that shouldn\'t exist, thinking thoughts that no mind was built to contain. The walls of the Spire begin to collapse inward.",
      },
      {
        phaseName: 'Phase 3 — The Pure Concept',
        hp: 70,
        ac: 21,
        atkBonus: 13,
        transitionAt: 0,
        saveMods: { str: 2, dex: 6, con: 8, int: 14, wis: 11, cha: 10 },
        abilities: [
          { name: 'Concept: Time', type: 'aoe', damage: '6d10', damageType: 'force', saveDC: 20, saveType: 'con', condition: 'stunned', description: 'Ages the target by decades' },
          { name: 'Concept: Void', type: 'attack', damage: '5d10+8', damageType: 'necrotic', atkBonus: 13, description: 'Obliteration at the molecular level' },
          { name: 'Unwrite', type: 'aoe', damage: '4d12', damageType: 'psychic', saveDC: 19, saveType: 'int', description: 'Attempts to erase the player\'s existence' },
          { name: 'Collapse', type: 'aoe', damage: '7d8', damageType: 'force', saveDC: 20, saveType: 'dex' },
        ],
        legendaryActions: 3,
      }
    ]
  }
}

export function getBoss(id) {
  return BOSSES[id]
}
