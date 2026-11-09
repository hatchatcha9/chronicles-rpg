// Extensive skill trees per class — 3 tiers (Foundation / Mastery / Legend), 9 nodes each
// Each node: { id, name, description, tier, requires, icon, type }

export const SKILL_TREES = {
  fighter: {
    name: 'Fighter',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'martial_training', name: 'Martial Training', description: 'Proficiency with all martial weapons and armor. The blade is an extension of your arm.', tier: 1, type: 'passive' },
          { id: 'second_wind', name: 'Second Wind', description: 'Heal 1d10 + Fighter level HP as a bonus action once per rest.', tier: 1, type: 'active', uses: 1 },
          { id: 'fighting_style', name: 'Fighting Style', description: 'Choose a combat style: Dueling (+2 dmg one-handed), Great Weapon (+2 on dmg rolls), or Defense (+1 AC).', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'action_surge', name: 'Action Surge', description: 'Take one additional action on your turn. Resets on rest. The body obeys where the mind refuses to.', tier: 2, requires: ['martial_training'], type: 'active', uses: 1 },
          { id: 'extra_attack', name: 'Extra Attack', description: 'Attack twice instead of once when you use the Attack action.', tier: 2, requires: ['fighting_style'], type: 'passive' },
          { id: 'indomitable', name: 'Indomitable', description: 'Reroll a failed saving throw once per long rest. You have never accepted what the dice decided.', tier: 2, requires: ['second_wind'], type: 'active', uses: 1 },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'battle_master', name: 'Battle Master', description: 'Gain Superiority Dice (d8s). Spend them on maneuvers: Riposte, Precision Attack, or Menacing Attack.', tier: 3, requires: ['action_surge', 'extra_attack'], type: 'maneuver' },
          { id: 'champion', name: 'Champion', description: 'Critical hits on 19–20. When you roll for HP on level up, minimum roll is 2.', tier: 3, requires: ['indomitable'], type: 'passive' },
          { id: 'warlord', name: 'Warlord', description: 'Once per turn, give an ally a free attack as a bonus action. Command changes the tide of war.', tier: 3, requires: ['action_surge', 'indomitable'], type: 'active' },
        ],
      },
    ],
  },

  paladin: {
    name: 'Paladin',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'divine_sense', name: 'Divine Sense', description: 'Detect the presence of undead, fiends, and consecrated ground within 60 feet. Uses = 1 + CHA mod.', tier: 1, type: 'active', uses: 'cha' },
          { id: 'lay_on_hands', name: 'Lay on Hands', description: 'Pool of HP equal to level × 5. Touch to restore HP or cure disease/poison.', tier: 1, type: 'active' },
          { id: 'sacred_oath', name: 'Sacred Oath', description: 'Choose your oath: Devotion (defense), Vengeance (pursuit), or Ancients (preservation). Shapes your smites.', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'divine_smite', name: 'Divine Smite', description: 'Expend a spell slot to deal +2d8 radiant damage per slot level on a hit. Undead take +1d8.', tier: 2, requires: ['sacred_oath'], type: 'active' },
          { id: 'aura_of_protection', name: 'Aura of Protection', description: 'Allies within 10 feet add your CHA modifier to saving throws. The oath is a shield for more than yourself.', tier: 2, requires: ['lay_on_hands'], type: 'passive' },
          { id: 'divine_health', name: 'Divine Health', description: 'Immune to disease. The corruption that claims mortals cannot take root in consecrated flesh.', tier: 2, requires: ['divine_sense'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'sacred_weapon', name: 'Sacred Weapon', description: 'Imbue your weapon with holy power for 1 minute. +CHA to attacks, weapon becomes magical, sheds bright light.', tier: 3, requires: ['divine_smite', 'aura_of_protection'], type: 'active' },
          { id: 'aura_of_courage', name: 'Aura of Courage', description: 'Allies within 10 feet cannot be frightened while you are conscious. Fear knows your name and turns away.', tier: 3, requires: ['divine_health'], type: 'passive' },
          { id: 'holy_avenger', name: 'Holy Avenger', description: 'On a crit, also deal 2d8 necrotic to all enemies within 5 feet, and dispel magic (3rd level).', tier: 3, requires: ['sacred_weapon', 'aura_of_courage'], type: 'active' },
        ],
      },
    ],
  },

  rogue: {
    name: 'Rogue',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'sneak_attack', name: 'Sneak Attack', description: 'Deal extra 1d6 per 2 levels when attacking with advantage or when an ally flanks the target.', tier: 1, type: 'passive' },
          { id: 'thieves_cant', name: 'Thieves\' Cant', description: 'You speak a hidden language of signs, passwords, and signals understood only by other rogues.', tier: 1, type: 'passive' },
          { id: 'expertise', name: 'Expertise', description: 'Double proficiency bonus in two skills of your choice. The gap between expert and amateur is a killing field.', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'cunning_action', name: 'Cunning Action', description: 'Dash, Disengage, or Hide as a bonus action. Survival is never accidental.', tier: 2, requires: ['sneak_attack'], type: 'active' },
          { id: 'uncanny_dodge', name: 'Uncanny Dodge', description: 'Halve the damage of one attack per turn when you can see the attacker.', tier: 2, requires: ['expertise'], type: 'active' },
          { id: 'evasion', name: 'Evasion', description: 'On a DEX save for half damage: succeed = no damage, fail = half damage. The world misses you.', tier: 2, requires: ['cunning_action'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'assassinate', name: 'Assassinate', description: 'Automatic crit against surprised enemies. Add Sneak Attack damage to any crit against surprised targets.', tier: 3, requires: ['cunning_action', 'uncanny_dodge'], type: 'passive' },
          { id: 'shadow_step', name: 'Shadow Step', description: 'Teleport up to 60 feet to unoccupied space in dim light or darkness. Advantage on next attack.', tier: 3, requires: ['evasion'], type: 'active', uses: 1 },
          { id: 'death_strike', name: 'Death Strike', description: 'If your Sneak Attack hits a surprised target, they must pass CON save or take double damage.', tier: 3, requires: ['assassinate', 'shadow_step'], type: 'passive' },
        ],
      },
    ],
  },

  ranger: {
    name: 'Ranger',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'favored_enemy', name: 'Favored Enemy', description: 'Advantage on survival checks to track and INT checks to recall info about undead, beasts, or humanoids.', tier: 1, type: 'passive' },
          { id: 'natural_explorer', name: 'Natural Explorer', description: 'Choose a terrain type. Ignore difficult terrain, never become lost, foraging brings twice the normal result.', tier: 1, type: 'passive' },
          { id: 'primeval_awareness', name: 'Primeval Awareness', description: 'Expend a spell slot to sense the presence of your favored enemies within 1 mile.', tier: 1, type: 'active' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'hunters_mark', name: 'Hunter\'s Mark', description: 'Mark a target. Deal extra 1d6 on attacks against them and track them through any terrain.', tier: 2, requires: ['favored_enemy'], type: 'active' },
          { id: 'colossus_slayer', name: 'Colossus Slayer', description: 'Once per turn, deal extra 1d8 damage to any creature below max HP.', tier: 2, requires: ['natural_explorer'], type: 'passive' },
          { id: 'escape_the_horde', name: 'Escape the Horde', description: 'Opportunity attacks against you are made with disadvantage. The wilds taught you never to be cornered.', tier: 2, requires: ['primeval_awareness'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'foe_slayer', name: 'Foe Slayer', description: 'Once per turn, add WIS modifier to attack or damage rolls against your Favored Enemy.', tier: 3, requires: ['hunters_mark', 'colossus_slayer'], type: 'passive' },
          { id: 'whirlwind_attack', name: 'Whirlwind Attack', description: 'Attack every creature within 5 feet in a single sweeping action.', tier: 3, requires: ['escape_the_horde'], type: 'active', uses: 1 },
          { id: 'stand_against_the_tide', name: 'Stand Against the Tide', description: 'Force a missed attack to strike an adjacent enemy instead. Use their own momentum.', tier: 3, requires: ['foe_slayer', 'whirlwind_attack'], type: 'active' },
        ],
      },
    ],
  },

  wizard: {
    name: 'Wizard',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'arcane_recovery', name: 'Arcane Recovery', description: 'Once per day during a short rest, recover spell slots totaling half your level (rounded up).', tier: 1, type: 'active', uses: 1 },
          { id: 'spellbook', name: 'Spellbook', description: 'Your spellbook contains two spells per level you can cast. Add spells by copying scrolls.', tier: 1, type: 'passive' },
          { id: 'arcane_tradition', name: 'Arcane Tradition', description: 'Choose your school: Evocation (damage), Necromancy (undead), or Divination (foresight).', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'sculpt_spells', name: 'Sculpt Spells', description: 'Exclude allies from area-effect spells. The difference between wizard and artillery.', tier: 2, requires: ['arcane_tradition'], type: 'passive' },
          { id: 'potent_cantrip', name: 'Potent Cantrip', description: 'Enemies who make saving throws against your cantrips still take half damage.', tier: 2, requires: ['spellbook'], type: 'passive' },
          { id: 'benign_transposition', name: 'Conjurer\'s Step', description: 'Teleport 30 feet as a bonus action. Once per short rest. The body is merely a suggestion.', tier: 2, requires: ['arcane_recovery'], type: 'active', uses: 1 },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'empowered_evocation', name: 'Empowered Evocation', description: 'Add INT modifier to damage of evocation spells. Pure destructive mathematics.', tier: 3, requires: ['sculpt_spells', 'potent_cantrip'], type: 'passive' },
          { id: 'grim_harvest', name: 'Grim Harvest', description: 'When you kill with a spell, regain HP equal to twice the spell\'s level (3× for necromancy).', tier: 3, requires: ['benign_transposition'], type: 'passive' },
          { id: 'spell_mastery', name: 'Spell Mastery', description: 'Choose a 1st and 2nd level spell. Cast them at their lowest level without expending a spell slot.', tier: 3, requires: ['empowered_evocation', 'grim_harvest'], type: 'passive' },
        ],
      },
    ],
  },

  sorcerer: {
    name: 'Sorcerer',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'sorcerous_origin', name: 'Sorcerous Origin', description: 'Wild Magic (unpredictable surges), Draconic Bloodline (scales/breath), or Shadow Magic (darkness/void).', tier: 1, type: 'passive' },
          { id: 'font_of_magic', name: 'Font of Magic', description: 'Gain sorcery points equal to your level. Convert to spell slots or fuel metamagic.', tier: 1, type: 'resource' },
          { id: 'flexible_casting', name: 'Flexible Casting', description: 'Convert between sorcery points and spell slots (2 pts = 1st level, 3 = 2nd, etc.).', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'twinned_spell', name: 'Twinned Spell', description: 'Spend sorcery points to target a second creature with a single-target spell. Magic loves multiplicity.', tier: 2, requires: ['font_of_magic'], type: 'metamagic' },
          { id: 'quickened_spell', name: 'Quickened Spell', description: 'Cast a spell as a bonus action instead of an action (2 sorcery points).', tier: 2, requires: ['flexible_casting'], type: 'metamagic' },
          { id: 'dragon_wings', name: 'Dragon Wings', description: 'Sprout draconic wings, gaining 30-foot fly speed. Origin: the blood remembers what your body forgot.', tier: 2, requires: ['sorcerous_origin'], type: 'active' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'empowered_spell', name: 'Empowered Spell', description: 'Reroll up to CHA modifier damage dice on a spell (1 sorcery point). Keep the new results.', tier: 3, requires: ['twinned_spell', 'quickened_spell'], type: 'metamagic' },
          { id: 'wild_surge', name: 'Bend Luck', description: 'Add 1d4 to any attack, check, or save made by or against any creature within sight (2 sorcery points).', tier: 3, requires: ['dragon_wings'], type: 'active' },
          { id: 'sorcerous_restoration', name: 'Sorcerous Restoration', description: 'Regain 4 sorcery points when reduced to 0, before going unconscious. The power refuses to die before you do.', tier: 3, requires: ['empowered_spell', 'wild_surge'], type: 'passive' },
        ],
      },
    ],
  },

  druid: {
    name: 'Druid',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'wild_shape', name: 'Wild Shape', description: 'Transform into a beast you have encountered. CR limit scales with level. Twice per rest.', tier: 1, type: 'active', uses: 2 },
          { id: 'druidic', name: 'Druidic', description: 'Speak the secret language of druids. Leave messages only initiates can read.', tier: 1, type: 'passive' },
          { id: 'circle_of_land', name: 'Circle Bond', description: 'Choose your circle: Land (extra spells/recovery), Moon (stronger Wild Shape), or Spores (necrotic growth).', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'combat_wild_shape', name: 'Combat Wild Shape', description: 'Wild Shape as a bonus action. Heal 1d8 per level while wild shaped by spending spell slots.', tier: 2, requires: ['wild_shape'], type: 'passive' },
          { id: 'land_stride', name: 'Land\'s Stride', description: 'Ignore nonmagical difficult terrain. Plants you summon never impede you.', tier: 2, requires: ['circle_of_land'], type: 'passive' },
          { id: 'timeless_body', name: 'Timeless Body', description: 'Age at 1/10 the normal rate. Immune to magical aging. The land does not let its shepherds wither.', tier: 2, requires: ['druidic'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'beast_spells', name: 'Beast Spells', description: 'Cast druid spells while in Wild Shape form. The wolf speaks in lightning.', tier: 3, requires: ['combat_wild_shape', 'land_stride'], type: 'passive' },
          { id: 'archdruid', name: 'Archdruid', description: 'Wild Shape unlimited times. Ignore verbal/somatic spell components. The realm\'s corruption cannot silence you.', tier: 3, requires: ['timeless_body'], type: 'passive' },
          { id: 'thousand_forms', name: 'Thousand Forms', description: 'Cast Alter Self at will without concentration. Take any humanoid form without limitation.', tier: 3, requires: ['beast_spells', 'archdruid'], type: 'active' },
        ],
      },
    ],
  },

  cleric: {
    name: 'Cleric',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'divine_domain', name: 'Divine Domain', description: 'Choose Life (healing), Death (undeath), or War (combat). Your god has a purpose for you.', tier: 1, type: 'passive' },
          { id: 'channel_divinity', name: 'Channel Divinity', description: 'Channel divine power. Turn Undead or use domain power once between rests.', tier: 1, type: 'active', uses: 1 },
          { id: 'holy_symbol', name: 'Holy Symbol', description: 'Proficiency using your holy symbol as a spellcasting focus. It costs nothing to believe.', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'destroy_undead', name: 'Destroy Undead', description: 'Turn Undead obliterates creatures of CR 0.5 or lower. Higher with progression.', tier: 2, requires: ['channel_divinity'], type: 'passive' },
          { id: 'divine_intervention', name: 'Divine Intervention', description: 'Roll d100. If ≤ level, your god intervenes directly. At level 20, always succeeds.', tier: 2, requires: ['divine_domain'], type: 'active', uses: 1 },
          { id: 'disciple_of_life', name: 'Disciple of Life', description: 'Healing spells restore extra HP equal to 2 + spell level. Life magic given willingly returns twice.', tier: 2, requires: ['holy_symbol'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'supreme_healing', name: 'Supreme Healing', description: 'Roll maximum dice for healing spells instead of rolling.', tier: 3, requires: ['destroy_undead', 'disciple_of_life'], type: 'passive' },
          { id: 'blessed_healer', name: 'Blessed Healer', description: 'Healing spells also restore HP to you (equal to 2 + spell level). The conduit is renewed by what flows through it.', tier: 3, requires: ['divine_intervention'], type: 'passive' },
          { id: 'avatar_of_battle', name: 'Avatar of Battle', description: 'Resistance to bludgeoning, piercing, and slashing from nonmagical weapons. The god makes you into something they need.', tier: 3, requires: ['supreme_healing', 'blessed_healer'], type: 'passive' },
        ],
      },
    ],
  },

  monk: {
    name: 'Monk',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'martial_arts', name: 'Martial Arts', description: 'Unarmed strikes deal 1d4 (scales to 1d10). DEX instead of STR for monk weapons. Bonus action unarmed strike.', tier: 1, type: 'passive' },
          { id: 'ki', name: 'Ki', description: 'Pool of Ki points equal to level. Fuel monk abilities. Replenish on short rest. The body is an instrument.', tier: 1, type: 'resource' },
          { id: 'unarmored_defense', name: 'Unarmored Defense', description: 'AC = 10 + DEX + WIS while unarmored. Perfect understanding of movement is perfect armor.', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'flurry_of_blows', name: 'Flurry of Blows', description: 'Spend 1 Ki: make two bonus unarmed strikes. Speed becomes your weapon.', tier: 2, requires: ['ki'], type: 'active' },
          { id: 'stunning_strike', name: 'Stunning Strike', description: 'Spend 1 Ki on hit: target must pass CON save or be stunned until end of your next turn.', tier: 2, requires: ['martial_arts'], type: 'active' },
          { id: 'deflect_missiles', name: 'Deflect Missiles', description: 'Reduce ranged attack damage by 1d10 + DEX + level. If reduced to 0, catch and throw it back.', tier: 2, requires: ['unarmored_defense'], type: 'active' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'empty_body', name: 'Empty Body', description: 'Spend 4 Ki: become invisible for 1 minute, resistance to all damage except force. The absence of self is protection.', tier: 3, requires: ['flurry_of_blows', 'stunning_strike'], type: 'active', uses: 1 },
          { id: 'quivering_palm', name: 'Quivering Palm', description: 'Set deadly vibrations in a creature\'s body. Use action later: 10d10 necrotic damage (CON save half).', tier: 3, requires: ['deflect_missiles'], type: 'active', uses: 1 },
          { id: 'perfect_self', name: 'Perfect Self', description: 'If you have no Ki at start of turn, regain 4 Ki. Enlightenment finds expression in recursion.', tier: 3, requires: ['empty_body', 'quivering_palm'], type: 'passive' },
        ],
      },
    ],
  },

  barbarian: {
    name: 'Barbarian',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'rage', name: 'Rage', description: 'Enter rage as a bonus action: advantage on STR checks/saves, bonus damage, resistance to physical damage. 2 uses, long rest.', tier: 1, type: 'active', uses: 2 },
          { id: 'unarmored_defense_barb', name: 'Unarmored Defense', description: 'AC = 10 + DEX + CON while unarmored. Anger is thicker than steel.', tier: 1, type: 'passive' },
          { id: 'primal_path', name: 'Primal Path', description: 'Berserker (bonus attacks), Totem Warrior (animal spirit powers), or Ancestral Guardian (protect allies).', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'reckless_attack', name: 'Reckless Attack', description: 'Attack with advantage. Attackers also have advantage against you until next turn. The only defense is overwhelming offense.', tier: 2, requires: ['rage'], type: 'active' },
          { id: 'danger_sense', name: 'Danger Sense', description: 'Advantage on DEX saves against visible effects. You have survived enough ambushes to hear them coming.', tier: 2, requires: ['primal_path'], type: 'passive' },
          { id: 'brutal_critical', name: 'Brutal Critical', description: 'Roll one additional weapon damage die on a critical hit.', tier: 2, requires: ['unarmored_defense_barb'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'relentless_rage', name: 'Relentless Rage', description: 'When reduced to 0 HP while raging, CON save to drop to 1 HP instead. DC increases each use per rest.', tier: 3, requires: ['reckless_attack', 'danger_sense'], type: 'passive' },
          { id: 'frenzy', name: 'Frenzy', description: 'Frenzied rage: make a melee attack as a bonus action each turn. Exhaustion after rage ends.', tier: 3, requires: ['brutal_critical'], type: 'passive' },
          { id: 'primal_champion', name: 'Primal Champion', description: '+4 STR, +4 CON. The body has become something the gods didn\'t intend.', tier: 3, requires: ['relentless_rage', 'frenzy'], type: 'passive' },
        ],
      },
    ],
  },

  bard: {
    name: 'Bard',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'bardic_inspiration', name: 'Bardic Inspiration', description: 'Give an ally 1d6 to add to any roll (CHA mod uses per long rest). The best thing you can offer someone is belief.', tier: 1, type: 'active', uses: 'cha' },
          { id: 'jack_of_all_trades', name: 'Jack of All Trades', description: 'Add half proficiency to any check you\'re not proficient in. Everything is a performance once you understand the audience.', tier: 1, type: 'passive' },
          { id: 'bard_college', name: 'Bard College', description: 'Lore (expanded knowledge/countercharm), Valor (combat magic), or Whispers (shadows/manipulation).', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'cutting_words', name: 'Cutting Words', description: 'Spend Bardic Inspiration to subtract 1d6 from an enemy\'s attack, check, or damage. Words are ammunition.', tier: 2, requires: ['bardic_inspiration'], type: 'active' },
          { id: 'song_of_rest', name: 'Song of Rest', description: 'Allies who hear you during a short rest regain 1d6 extra HP. Even during war, there must be music.', tier: 2, requires: ['jack_of_all_trades'], type: 'passive' },
          { id: 'magical_secrets', name: 'Magical Secrets', description: 'Learn two spells from any class. The bard\'s library has no walls.', tier: 2, requires: ['bard_college'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'superior_inspiration', name: 'Superior Inspiration', description: 'If no Bardic Inspiration dice when initiative is rolled, regain one die. The muse cannot be denied.', tier: 3, requires: ['cutting_words', 'song_of_rest'], type: 'passive' },
          { id: 'peerless_skill', name: 'Peerless Skill', description: 'Spend Bardic Inspiration to add it to your own skill check.', tier: 3, requires: ['magical_secrets'], type: 'active' },
          { id: 'words_of_terror', name: 'Words of Terror', description: 'Psychic Blades: 3d6 psychic damage on target below half HP, CON save or frightened. Some songs are weapons.', tier: 3, requires: ['superior_inspiration', 'peerless_skill'], type: 'active' },
        ],
      },
    ],
  },

  warlock: {
    name: 'Warlock',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'otherworldly_patron', name: 'Otherworldly Patron', description: 'Pact with the Fiend (fire/fear), Great Old One (telepathy/madness), or Archfey (charm/terror).', tier: 1, type: 'passive' },
          { id: 'eldritch_blast', name: 'Eldritch Blast', description: 'Beam of crackling energy: 1d10 force damage per beam (additional beams at higher levels).', tier: 1, type: 'attack' },
          { id: 'pact_boon', name: 'Pact Boon', description: 'Choose your pact: Chain (familiar), Blade (summoned weapon), or Tome (spellbook with extra cantrips).', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'agonizing_blast', name: 'Agonizing Blast', description: 'Add CHA modifier to Eldritch Blast damage. The pain is personal.', tier: 2, requires: ['eldritch_blast'], type: 'passive' },
          { id: 'dark_one_blessing', name: 'Dark One\'s Blessing', description: 'Gain temporary HP equal to CHA + warlock level when you reduce a creature to 0 HP. The patron rewards carnage.', tier: 2, requires: ['otherworldly_patron'], type: 'passive' },
          { id: 'devils_sight', name: 'Devil\'s Sight', description: 'See normally in magical and nonmagical darkness to 120 feet. You traded a small thing for this.', tier: 2, requires: ['pact_boon'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'one_with_shadows', name: 'One with Shadows', description: 'While in dim light or darkness, become invisible as an action. The pact made you something the dark can\'t see either.', tier: 3, requires: ['agonizing_blast', 'dark_one_blessing'], type: 'active' },
          { id: 'create_thrall', name: 'Create Thrall', description: 'Touch an incapacitated humanoid to charm them permanently. They obey telepathic commands.', tier: 3, requires: ['devils_sight'], type: 'active', uses: 1 },
          { id: 'eldritch_master', name: 'Eldritch Master', description: 'Spend 1 minute entreating your patron: regain all warlock spell slots. Once per long rest.', tier: 3, requires: ['one_with_shadows', 'create_thrall'], type: 'active', uses: 1 },
        ],
      },
    ],
  },

  bloodhunter: {
    name: 'Blood Hunter',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'blood_maledict', name: 'Blood Maledict', description: 'Curse a creature with crimson blood rite. Uses = proficiency bonus. Effects based on Order chosen.', tier: 1, type: 'active', uses: 2 },
          { id: 'hunters_bane', name: 'Hunter\'s Bane', description: 'Advantage on survival checks to track undead and fiends. Insight against supernatural creatures.', tier: 1, type: 'passive' },
          { id: 'blood_rite', name: 'Blood Rite', description: 'Imbue your weapon with elemental or necrotic energy. Deal extra 1d4 damage (psychic, necrotic, or fire).', tier: 1, type: 'active' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'crimson_rite', name: 'Crimson Rite', description: 'Pay HP to empower your weapon permanently until rest. The price of power is blood. Always blood.', tier: 2, requires: ['blood_rite'], type: 'active' },
          { id: 'brand_of_castigation', name: 'Brand of Castigation', description: 'Mark a creature with Blood Maledict. Each hit brands them, dealing psychic damage on their next attack against you.', tier: 2, requires: ['blood_maledict'], type: 'active' },
          { id: 'grim_psychometry', name: 'Grim Psychometry', description: 'By concentrating on an object, sense its history — particularly violence, suffering, and supernatural contact.', tier: 2, requires: ['hunters_bane'], type: 'active' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'sanguine_mastery', name: 'Sanguine Mastery', description: 'Blood Rite dice become d6s. No longer lose HP to activate Crimson Rite. The pain became something else.', tier: 3, requires: ['crimson_rite', 'brand_of_castigation'], type: 'passive' },
          { id: 'hardened_soul', name: 'Hardened Soul', description: 'Immunity to being charmed or frightened. Advantage on saving throws against possession.', tier: 3, requires: ['grim_psychometry'], type: 'passive' },
          { id: 'rite_of_the_dawn', name: 'Rite of the Dawn', description: 'Create a 20-ft radius aura of dawn. Undead have disadvantage. Allies in aura regain HP at start of each turn.', tier: 3, requires: ['sanguine_mastery', 'hardened_soul'], type: 'active', uses: 1 },
        ],
      },
    ],
  },

  artificer: {
    name: 'Artificer',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'magical_tinkering', name: 'Magical Tinkering', description: 'Imbue small objects with magical properties: light, recorded sounds, detection, or simple effects.', tier: 1, type: 'active' },
          { id: 'infuse_item', name: 'Infuse Item', description: 'Infuse mundane items with magical properties. Number of active infusions scales with level.', tier: 1, type: 'active' },
          { id: 'artificer_specialist', name: 'Artificer Specialist', description: 'Alchemist (potions), Artillerist (cannon/turret), or Battle Smith (steel defender companion).', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'flash_of_genius', name: 'Flash of Genius', description: 'Add INT modifier to any attack, save, or check made by a creature within 30 feet. INT is force multiplier.', tier: 2, requires: ['infuse_item'], type: 'active', uses: 'int' },
          { id: 'elixir_of_health', name: 'Alchemical Savant', description: 'Add INT modifier to damage or healing rolls made by alchemist\'s supplies spells.', tier: 2, requires: ['artificer_specialist'], type: 'passive' },
          { id: 'spell_storing_item', name: 'Spell-Storing Item', description: 'Store a 1st or 2nd level spell in an object. Another creature can activate it (2 × INT mod times).', tier: 2, requires: ['magical_tinkering'], type: 'active' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'soul_of_artifice', name: 'Soul of Artifice', description: '+1 to all saves for each active infusion. When reduced to 0 HP, end one infusion to drop to 1 HP instead.', tier: 3, requires: ['flash_of_genius', 'elixir_of_health'], type: 'passive' },
          { id: 'mechanical_servant', name: 'Steel Defender Perfected', description: 'Steel Defender gains +2 AC, two attacks per action, and repairs itself for 2d6 when repaired.', tier: 3, requires: ['spell_storing_item'], type: 'passive' },
          { id: 'arcane_armament', name: 'Arcane Armament', description: 'Attack twice with an arcane firearm or magic weapon when you use the Attack action.', tier: 3, requires: ['soul_of_artifice', 'mechanical_servant'], type: 'passive' },
        ],
      },
    ],
  },
}

  // ── Skill trees for expanded classes ─────────────────────────────────────

  necromancer: {
    name: 'Necromancer',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'n_corpse_puppet', name: 'Corpse Puppet', description: 'Your Raise Dead minion gains +2 AC and attacks twice per turn.', tier: 1, type: 'passive' },
          { id: 'n_life_drain', name: 'Life Drain', description: "Death's Grasp heals you for the full necrotic damage instead of half.", tier: 1, type: 'passive' },
          { id: 'n_undead_lore', name: 'Undead Lore', description: 'Immunity to being frightened by undead. Advantage on checks to control or rebuke undead creatures.', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'n_grave_horde', name: 'Grave Horde', description: 'Raise Dead can animate up to two corpses simultaneously. The second minion is weaker (1d4+1 attack) but costs no extra resources.', tier: 2, requires: ['n_corpse_puppet'], type: 'passive' },
          { id: 'n_necrotic_channeling', name: 'Necrotic Channeling', description: 'Add INT modifier to all necrotic spell damage. Death magic sharpened by intellect.', tier: 2, requires: ['n_life_drain'], type: 'passive' },
          { id: 'n_speak_dead', name: 'Speak with Dead', description: 'Ask a corpse up to three questions about its life, death, or last memories. 1 use per long rest.', tier: 2, requires: ['n_undead_lore'], type: 'active', uses: 1 },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'n_undying_legion', name: 'Undying Legion', description: "Minions can't be destroyed while you have more than 10 HP. If a minion falls, it rises again at the start of your next turn.", tier: 3, requires: ['n_grave_horde', 'n_necrotic_channeling'], type: 'passive' },
          { id: 'n_lichling', name: 'Lichling', description: "Once per long rest, when you would drop to 0 HP, drop to 1 HP instead. A fragment of a lich's undying nature woven into your soul.", tier: 3, requires: ['n_speak_dead'], type: 'passive' },
          { id: 'n_death_mastery', name: 'Death Mastery', description: 'Life Drain crits on 18-20. On a crit, the target must pass CON save or drop to 0 HP.', tier: 3, requires: ['n_undying_legion', 'n_lichling'], type: 'passive' },
        ],
      },
    ],
  },

  hexblade: {
    name: 'Hexblade',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'hx_cha_to_weapons', name: 'Hexblade Sight', description: 'Use CHA modifier instead of STR or DEX for attack and damage rolls with weapons. The curse does the aiming.', tier: 1, type: 'passive' },
          { id: 'hx_medium_proficiency', name: 'Cursed Steel', description: 'Proficiency with medium armor, shields, and all martial weapons. The shadow taught you.',  tier: 1, type: 'passive' },
          { id: 'hx_hex_warrior', name: "Hex Warrior's Pact", description: 'Once per rest, summon a pact blade (1d8 melee, counts as magical). Lasts until combat ends.', tier: 1, type: 'active', uses: 1 },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'hx_curse_extended', name: 'Lingering Curse', description: "Hexblade's Curse extends to creatures that damage you — they are automatically cursed for the rest of the encounter.", tier: 2, requires: ['hx_cha_to_weapons'], type: 'passive' },
          { id: 'hx_specter_upgrade', name: 'Bound Specter', description: 'Accursed Specter permanent: a specter companion joins you between combats. Max HP = your level × 2.', tier: 2, requires: ['hx_medium_proficiency'], type: 'passive' },
          { id: 'hx_shadow_blade', name: 'Shadow Blade', description: 'Pact blade becomes shadow-forged: +1d8 psychic damage and renders wielder hard to see (half-cover in dim light).', tier: 2, requires: ['hx_hex_warrior'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'hx_master_curse', name: 'Master Hexblade', description: "Hexblade's Curse recharges on a short rest. Apply it to multiple targets simultaneously (max CHA modifier creatures).", tier: 3, requires: ['hx_curse_extended', 'hx_specter_upgrade'], type: 'passive' },
          { id: 'hx_void_smite', name: 'Void Smite', description: 'Once per combat, declare a Void Smite before attacking. On hit: 4d8 necrotic + target must pass WIS save or be banished for 1 round.', tier: 3, requires: ['hx_shadow_blade'], type: 'active', uses: 1 },
          { id: 'hx_avatar_of_shadow', name: 'Avatar of Shadow', description: 'While cursed enemies are present, you become partially incorporeal: resistance to nonmagical BPS damage.', tier: 3, requires: ['hx_master_curse', 'hx_void_smite'], type: 'passive' },
        ],
      },
    ],
  },

  eldritch_knight: {
    name: 'Eldritch Knight',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'ek_spellcasting', name: 'Warrior Spellcasting', description: 'Cast spells while wearing heavy armor. Proficiency with INT-based attack spells. STR for melee, INT for spells — seamlessly.', tier: 1, type: 'passive' },
          { id: 'ek_weapon_bond', name: 'Weapon Bond', description: 'Bond with one weapon. It returns to your hand as a bonus action. Cannot be disarmed or removed by magic.', tier: 1, type: 'active' },
          { id: 'ek_eldritch_strike', name: 'Eldritch Strike', description: 'When you hit with a weapon attack, the target has disadvantage on its next saving throw against your next spell.', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'ek_war_magic', name: 'War Magic', description: 'After casting a cantrip, make one weapon attack as a bonus action. The body and the formula execute together.', tier: 2, requires: ['ek_spellcasting'], type: 'active' },
          { id: 'ek_arcane_charge', name: 'Arcane Charge', description: 'When you use Action Surge, you can teleport up to 30ft before or after your extra action.', tier: 2, requires: ['ek_weapon_bond'], type: 'passive' },
          { id: 'ek_improved_war_magic', name: 'Improved War Magic', description: 'War Magic now works with 1st level spells (not just cantrips). One weapon attack after any spell.', tier: 2, requires: ['ek_eldritch_strike'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'ek_arcane_knight', name: 'Arcane Knight', description: 'Attack three times with the Attack action. The blade finds every gap the spell opened.', tier: 3, requires: ['ek_war_magic', 'ek_arcane_charge'], type: 'passive' },
          { id: 'ek_spell_absorption', name: 'Spell Absorption', description: "Once per short rest, as a reaction: absorb a spell targeting you, gaining spell slots equal to its level. The armor learns.", tier: 3, requires: ['ek_improved_war_magic'], type: 'active', uses: 1 },
          { id: 'ek_arcane_bastion', name: 'Arcane Bastion', description: 'Resistance to all spell damage while wearing heavy armor. Your enchanted steel has become a ward.', tier: 3, requires: ['ek_arcane_knight', 'ek_spell_absorption'], type: 'passive' },
        ],
      },
    ],
  },

  chronomancer: {
    name: 'Chronomancer',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'ch_temporal_sight', name: 'Temporal Sight', description: 'You always act in the first round of combat (you saw it coming). Advantage on initiative rolls.', tier: 1, type: 'passive' },
          { id: 'ch_temporal_charges', name: 'Temporal Charges', description: 'Time Step pool = INT modifier. Regain all charges on a short rest. The clock can be wound.', tier: 1, type: 'resource' },
          { id: 'ch_slow_field', name: 'Slow Field', description: 'Concentration: enemies entering a 10ft radius around you move at half speed. Time bends in your presence.', tier: 1, type: 'active' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'ch_rewind', name: 'Rewind', description: 'Once per long rest, undo your last action — reset HP, spell slots, and position to what they were one full round ago.', tier: 2, requires: ['ch_temporal_charges'], type: 'active', uses: 1 },
          { id: 'ch_haste_self', name: 'Temporal Acceleration', description: 'Cast Haste on yourself without concentration (CHA mod, lasts until start of your next turn). Movement is an echo.', tier: 2, requires: ['ch_temporal_sight'], type: 'active', uses: 1 },
          { id: 'ch_time_lock', name: 'Time Lock', description: 'Spend a Temporal Charge to freeze a creature in time for 1 round (auto-fail saves, cannot act). CON save to resist, DC = INT + 8.', tier: 2, requires: ['ch_slow_field'], type: 'active' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'ch_time_stop', name: 'Time Stop', description: 'Once per long rest: take three additional turns in a row while time is frozen. Other creatures and effects are suspended.', tier: 3, requires: ['ch_rewind', 'ch_time_lock'], type: 'active', uses: 1 },
          { id: 'ch_paradox', name: 'Temporal Paradox', description: 'Once per combat, duplicate your previous round — repeat every action you took (attacks, spells, movement) exactly.', tier: 3, requires: ['ch_haste_self'], type: 'active', uses: 1 },
          { id: 'ch_outside_time', name: 'Outside Time', description: 'You cannot be surprised. Reactions can be used at any point in a round, not just on your turn.', tier: 3, requires: ['ch_time_stop', 'ch_paradox'], type: 'passive' },
        ],
      },
    ],
  },

  runesmith: {
    name: 'Runesmith',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'rs_runecarve', name: 'Runecarve', description: 'Inscribe a rune as a bonus action. Ward (+2 AC, 2 rds), Blast (1d8+INT triggered), or Bind (restrained, STR save DC 14).', tier: 1, type: 'active', uses: 3 },
          { id: 'rs_runic_armor', name: 'Runic Body', description: 'Carved runes on your skin reduce all incoming damage by 2. Passive — always active.', tier: 1, type: 'passive' },
          { id: 'rs_ancient_script', name: 'Ancient Script', description: 'Read all rune-based languages and magical inscriptions without a check. Transcribe enemy runes to nullify them.', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'rs_empowered_rune', name: 'Empowered Runes', description: 'Blast Rune damage scales to 2d8+INT. Ward Rune grants +3 AC. All runes persist for one additional round.', tier: 2, requires: ['rs_runecarve'], type: 'passive' },
          { id: 'rs_runebond', name: 'Runebond', description: 'Transfer one active rune to an ally as a bonus action. They carry its effect as though the rune is inscribed on them.', tier: 2, requires: ['rs_runic_armor'], type: 'active' },
          { id: 'rs_rune_mastery', name: 'Rune Mastery', description: 'Runecarve recharge becomes INT modifier (not 3 flat). Every rest replenishes more as your skill grows.', tier: 2, requires: ['rs_ancient_script'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'rs_world_rune', name: 'World Rune', description: 'Once per long rest, inscribe a World Rune on the battlefield. 20ft radius: enemies take 2d10 force damage entering; allies gain +3 AC inside.', tier: 3, requires: ['rs_empowered_rune', 'rs_runebond'], type: 'active', uses: 1 },
          { id: 'rs_unbreakable', name: 'Unbreakable', description: "Your Runic Body damage reduction increases to 5. You cannot be critically hit while your HP is above half.", tier: 3, requires: ['rs_rune_mastery'], type: 'passive' },
          { id: 'rs_runic_apotheosis', name: 'Runic Apotheosis', description: 'All active runes recharge at the start of each turn. The language of creation speaks through you unimpeded.', tier: 3, requires: ['rs_world_rune', 'rs_unbreakable'], type: 'passive' },
        ],
      },
    ],
  },

  shadow_dancer: {
    name: 'Shadow Dancer',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'sd_umbral_training', name: 'Umbral Training', description: 'Proficiency in Stealth doubled. See perfectly in complete darkness. The shadow knows you.', tier: 1, type: 'passive' },
          { id: 'sd_shadow_step', name: 'Shadow Step', description: 'Bonus action teleport between any two areas of dim light or darkness within 60ft. Advantage on the next attack.', tier: 1, type: 'active' },
          { id: 'sd_cloak_of_shadow', name: 'Cloak of Shadow', description: 'If you end your turn in dim light or darkness, become invisible until your next turn begins.', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'sd_shadow_strike', name: 'Shadow Strike', description: 'Attacks from darkness or while invisible deal +2d6 necrotic damage. The void itself wants the target dead.', tier: 2, requires: ['sd_shadow_step'], type: 'passive' },
          { id: 'sd_umbral_form', name: 'Umbral Form', description: 'Once per rest, become incorporeal for 1 round (resistance all damage, pass through solids). Part of you lives in shadow already.', tier: 2, requires: ['sd_umbral_training'], type: 'active', uses: 1 },
          { id: 'sd_shadow_anchor', name: 'Shadow Anchor', description: 'Create a shadow anchor at your current location. Teleport back to it as a bonus action within 60ft. Last 10 minutes.', tier: 2, requires: ['sd_cloak_of_shadow'], type: 'active' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'sd_void_step', name: 'Void Step', description: 'Shadow Step range extends to 90ft. Can step to any area of shadow you can see, regardless of obstacles.', tier: 3, requires: ['sd_shadow_strike', 'sd_umbral_form'], type: 'passive' },
          { id: 'sd_death_from_shadow', name: 'Death from Shadow', description: 'If you kill a creature while invisible or in shadow, you remain invisible afterward. The kill was never witnessed.', tier: 3, requires: ['sd_shadow_anchor'], type: 'passive' },
          { id: 'sd_lord_of_shadow', name: 'Lord of Shadow', description: "Once per combat, cast Darkness centered on yourself (60ft radius). You see perfectly inside it; enemies are blind.", tier: 3, requires: ['sd_void_step', 'sd_death_from_shadow'], type: 'active', uses: 1 },
        ],
      },
    ],
  },

  plague_doctor: {
    name: 'Plague Doctor',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'pd_contagion_lore', name: 'Contagion Lore', description: 'Immunity to poison and disease. Advantage on checks to identify diseases, poisons, and their sources.', tier: 1, type: 'passive' },
          { id: 'pd_virulent_touch', name: 'Virulent Touch', description: 'Infect ability now triggers on a hit instead of requiring a touch attack. The disease follows the blade.', tier: 1, type: 'passive' },
          { id: 'pd_field_surgery', name: 'Field Surgery', description: 'As an action, stabilize an ally at 0 HP and restore them to 1 HP. 3 uses per long rest.', tier: 1, type: 'active', uses: 3 },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'pd_epidemic', name: 'Epidemic', description: 'When a Diseased creature fails their CON save against your Infect, the disease leaps to the nearest enemy within 10ft.', tier: 2, requires: ['pd_virulent_touch'], type: 'passive' },
          { id: 'pd_alchemical_mastery', name: 'Alchemical Mastery', description: 'Add INT modifier to all poison and disease spell damage. Your formulas are precise, not random.', tier: 2, requires: ['pd_contagion_lore'], type: 'passive' },
          { id: 'pd_plague_bomb', name: 'Plague Bomb', description: 'Create a thrown alchemical bomb (30ft range): 15ft AoE, 2d8 poison + Diseased condition. DEX save DC 14. 2/long rest.', tier: 2, requires: ['pd_field_surgery'], type: 'active', uses: 2 },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'pd_black_death', name: 'Black Death', description: 'Your diseases now deal an extra 1d6 necrotic per turn until cured. The sickness eats at flesh and soul.', tier: 3, requires: ['pd_epidemic', 'pd_alchemical_mastery'], type: 'passive' },
          { id: 'pd_mass_cure', name: 'Mass Cure', description: 'Remove all conditions from all allies within 30ft as a single action. 1/long rest. The doctor can fix anything.', tier: 3, requires: ['pd_plague_bomb'], type: 'active', uses: 1 },
          { id: 'pd_pandemic', name: 'Pandemic', description: 'Epidemic now leaps up to three times per creature that fails. A single Infect touch can consume an entire encounter.', tier: 3, requires: ['pd_black_death', 'pd_mass_cure'], type: 'passive' },
        ],
      },
    ],
  },

  skald: {
    name: 'Skald',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'sk_warrior_poet', name: 'Warrior-Poet', description: 'Proficiency with all martial weapons, medium armor. Your saga earns you INT-based advantages on morale checks.', tier: 1, type: 'passive' },
          { id: 'sk_war_cry', name: 'War Cry', description: 'Bonus action: you and all allies within 30ft deal +1d6 bonus damage until your next turn. 2 uses per long rest.', tier: 1, type: 'active', uses: 2 },
          { id: 'sk_tale_of_the_fallen', name: 'Tale of the Fallen', description: "When an ally drops to 0 HP, you can use your reaction to give them a death saving throw advantage. The saga isn't over.", tier: 1, type: 'active' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'sk_saga_mark', name: 'Saga Mark', description: 'Each kill marks your saga. Gain +1 attack and damage per mark (max +3) until your next long rest. The saga grows.', tier: 2, requires: ['sk_war_cry'], type: 'passive' },
          { id: 'sk_bolstering_verse', name: 'Bolstering Verse', description: 'Once per rest, recite a verse as an action. All allies regain HP = your level + CHA modifier. Even the wounded fight on.', tier: 2, requires: ['sk_warrior_poet'], type: 'active', uses: 1 },
          { id: 'sk_iron_verse', name: 'Iron Verse', description: 'Your War Cry now also grants +1 AC to all affected allies. The song is also a shield.', tier: 2, requires: ['sk_tale_of_the_fallen'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'sk_undying_saga', name: 'Undying Saga', description: 'Once per combat, when reduced to 0 HP, the saga keeps you standing: drop to 1 HP and take one free action instead.', tier: 3, requires: ['sk_saga_mark', 'sk_bolstering_verse'], type: 'passive' },
          { id: 'sk_great_battle_cry', name: 'Great Battle Cry', description: 'War Cry is upgraded: +2d6 bonus damage, three uses per rest, range extends to 60ft. The battlefield hears you.', tier: 3, requires: ['sk_iron_verse'], type: 'passive' },
          { id: 'sk_legend_complete', name: 'Legend Complete', description: 'Saga Mark now stacks to +6 max. When at +6, your attacks deal an additional 2d6 and you are immune to being frightened.', tier: 3, requires: ['sk_undying_saga', 'sk_great_battle_cry'], type: 'passive' },
        ],
      },
    ],
  },

  beastmaster: {
    name: 'Beastmaster',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'bm_animal_bond', name: 'Animal Bond', description: 'Your companion obeys complex commands and uses your proficiency for attack rolls. It acts on its own initiative.', tier: 1, type: 'passive' },
          { id: 'bm_pack_tactics', name: 'Pack Tactics', description: 'While companion is adjacent to your target, you have advantage on attack rolls against that target.', tier: 1, type: 'passive' },
          { id: 'bm_primal_instinct', name: 'Primal Instinct', description: 'Advantage on WIS (Perception) and WIS (Survival) checks. Your companion warns you of hidden threats.', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'bm_beast_guard', name: 'Beast Guard', description: 'Your companion can use its reaction to intercept an attack targeting you, taking the hit instead. Once per round.', tier: 2, requires: ['bm_animal_bond'], type: 'passive' },
          { id: 'bm_coordinated_strike', name: 'Coordinated Strike', description: "When you and your companion both hit the same target in the same round, deal +2d6 bonus damage. Pack instinct.", tier: 2, requires: ['bm_pack_tactics'], type: 'passive' },
          { id: 'bm_resilient_bond', name: 'Resilient Bond', description: "If your companion falls, it regains 2d6 HP at the start of your next turn. The bond doesn't break that easily.", tier: 2, requires: ['bm_primal_instinct'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'bm_apex_predator', name: 'Apex Predator', description: 'Your companion gains a second attack. Its damage dice step up (d6 → d8 → d10). The bond sharpens both of you.', tier: 3, requires: ['bm_beast_guard', 'bm_coordinated_strike'], type: 'passive' },
          { id: 'bm_hive_mind', name: 'Hive Mind', description: 'Share senses with your companion: see, hear, and smell what it does while concentrating (bonus action). No range limit.', tier: 3, requires: ['bm_resilient_bond'], type: 'active' },
          { id: 'bm_legendary_beast', name: 'Legendary Beast', description: "Your companion gains Legendary Resistance (1/day: succeed on a failed saving throw). It has become something the wilds remember.", tier: 3, requires: ['bm_apex_predator', 'bm_hive_mind'], type: 'passive' },
        ],
      },
    ],
  },

  warden: {
    name: 'Warden',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'wa_natures_mark', name: "Nature's Mark", description: "Mark one creature. They have disadvantage on attacks against anyone except you until you re-mark. The land names you its champion.", tier: 1, type: 'active' },
          { id: 'wa_iron_will', name: 'Iron Will', description: 'Immunity to being frightened. Advantage on all CON saving throws. The root does not fear the wind.', tier: 1, type: 'passive' },
          { id: 'wa_ancient_guardian', name: 'Ancient Guardian', description: 'Proficiency bonus added twice to AC when not moving. Stand your ground.', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'wa_bulwark', name: "Nature's Bulwark", description: 'When an ally within 10ft is hit, reduce their damage by your WIS modifier. The covenant extends.', tier: 2, requires: ['wa_natures_mark'], type: 'passive' },
          { id: 'wa_primal_resilience', name: 'Primal Resilience', description: 'At the start of each turn, choose one damage type. Resistance to that type until your next turn.', tier: 2, requires: ['wa_iron_will'], type: 'active' },
          { id: 'wa_ground_lock', name: 'Ground Lock', description: "While you don't move, enemies can't move away from you without provoking an opportunity attack. The earth holds them.", tier: 2, requires: ['wa_ancient_guardian'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'wa_sovereign_ground', name: 'Sovereign Ground', description: "Nature's Mark now applies to up to WIS modifier creatures simultaneously. The Warden claims the field.", tier: 3, requires: ['wa_bulwark', 'wa_primal_resilience'], type: 'passive' },
          { id: 'wa_treant_form', name: 'Treant Aspect', description: 'Once per long rest, grow bark-covered and 8ft tall for 1 minute: +20 max HP, +3 AC, attacks deal +1d8 bludgeoning.', tier: 3, requires: ['wa_ground_lock'], type: 'active', uses: 1 },
          { id: 'wa_immortal_covenant', name: 'Immortal Covenant', description: "While any ally within 30ft is at 0 HP, you cannot be reduced below 1 HP. The covenant will not let its guardian fall while others need it.", tier: 3, requires: ['wa_sovereign_ground', 'wa_treant_form'], type: 'passive' },
        ],
      },
    ],
  },

  soul_weaver: {
    name: 'Soul Weaver',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'sw_spirit_sight', name: 'Spirit Sight', description: 'See invisible creatures and undead within 30ft. Read surface emotions of any creature you can see.', tier: 1, type: 'passive' },
          { id: 'sw_soul_tap', name: 'Soul Tap', description: 'Cast a spell without spending a slot by paying HP = spell level × 2. Max once per turn.', tier: 1, type: 'active' },
          { id: 'sw_thread_reading', name: 'Thread Reading', description: 'Once per rest, read the fate of a creature: learn their current HP, one active condition, and whether they will act next turn.', tier: 1, type: 'active', uses: 1 },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'sw_vital_theft', name: 'Vital Theft', description: 'When you deal necrotic damage, heal for half that amount. The thread taken from them is woven into you.', tier: 2, requires: ['sw_soul_tap'], type: 'passive' },
          { id: 'sw_soul_anchor', name: 'Soul Anchor', description: 'Tether your soul to an ally. If either of you would die, the other can choose to absorb the fatal blow (taking the damage instead, min 1 HP remaining). 1/long rest.', tier: 2, requires: ['sw_spirit_sight'], type: 'active', uses: 1 },
          { id: 'sw_reweave_mastery', name: 'Reweave Mastery', description: "Reweave now restores HP = your WIS modifier × 3 (instead of ×1). It costs 2 HP instead of 4. Death's door becomes a revolving one.", tier: 2, requires: ['sw_thread_reading'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'sw_soulstorm', name: 'Soulstorm', description: "Once per long rest: 30ft burst of soul energy — 6d8 necrotic to all enemies, heal all allies for 3d8. The threads unravel and reform.", tier: 3, requires: ['sw_vital_theft', 'sw_soul_anchor'], type: 'active', uses: 1 },
          { id: 'sw_unraveling', name: 'Soul Unraveling', description: 'Bestow Curse deals +3d8 necrotic per turn instead of disadvantage. The curse eats the soul directly.', tier: 3, requires: ['sw_reweave_mastery'], type: 'passive' },
          { id: 'sw_master_weaver', name: 'Master Weaver', description: 'Soul Tap no longer costs HP for 1st-level spells. You have learned to draw on ambient soul-energy instead of your own.', tier: 3, requires: ['sw_soulstorm', 'sw_unraveling'], type: 'passive' },
        ],
      },
    ],
  },

  invoker: {
    name: 'Invoker',
    tiers: [
      {
        name: 'Foundation',
        nodes: [
          { id: 'iv_elemental_body', name: 'Elemental Body', description: 'Resistance to the damage type of your chosen element. The element flows through you, not past you.', tier: 1, type: 'passive' },
          { id: 'iv_channel', name: 'Elemental Channel', description: 'Choose Fire, Ice, or Lightning aspect. Spells of that type deal +CON modifier damage and your damage dice are d8s.', tier: 1, type: 'passive' },
          { id: 'iv_raw_power', name: 'Raw Power', description: 'Add CON modifier to all spell damage rolls. The body is the conduit; its endurance is the power.', tier: 1, type: 'passive' },
        ],
      },
      {
        name: 'Mastery',
        nodes: [
          { id: 'iv_overload', name: 'Overload', description: 'Double all damage dice on your next spell. Take half that damage yourself as backlash. Once per short rest.', tier: 2, requires: ['iv_channel'], type: 'active', uses: 1 },
          { id: 'iv_elemental_surge', name: 'Elemental Surge', description: 'Once per combat, when casting a spell, treat it as if you spent an extra spell slot on it (one level up).', tier: 2, requires: ['iv_raw_power'], type: 'active', uses: 1 },
          { id: 'iv_blast_mastery', name: 'Blast Mastery', description: 'Your elemental cantrip (Fire Bolt / Ray of Frost / Lightning Lure) hits twice per cast. The element divides and strikes from both sides.', tier: 2, requires: ['iv_elemental_body'], type: 'passive' },
        ],
      },
      {
        name: 'Legend',
        nodes: [
          { id: 'iv_avatar_element', name: 'Elemental Avatar', description: 'Once per long rest, fully embody your element for 1 minute: immunity (not resistance) to your element, deal your element in a 5ft aura (1d8 each turn), and Overload is free.', tier: 3, requires: ['iv_overload', 'iv_elemental_surge'], type: 'active', uses: 1 },
          { id: 'iv_unstoppable', name: 'Unstoppable Force', description: 'Your spells of your chosen element bypass immunity (treat it as resistance). Nothing is proof against the source.', tier: 3, requires: ['iv_blast_mastery'], type: 'passive' },
          { id: 'iv_catastrophe', name: 'Catastrophe', description: 'Once per long rest, cast one spell of your highest slot level as if it were 3 levels higher — but take 2d6 backlash per extra level. Some power consumes the vessel.', tier: 3, requires: ['iv_avatar_element', 'iv_unstoppable'], type: 'active', uses: 1 },
        ],
      },
    ],
  },
}

export function getSkillTree(classId, raceId = null) {
  const baseTree = SKILL_TREES[classId] || null
  if (!raceId || !baseTree) return baseTree

  // Lazy-import combo trees to avoid circular deps at module level
  try {
    const { mergeComboIntoTree } = require('./skill-tree-combos.js')
    return mergeComboIntoTree(baseTree, raceId, classId)
  } catch {
    return baseTree
  }
}
