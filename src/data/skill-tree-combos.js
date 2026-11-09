// Race + Class synergy skill trees
// 8 hand-crafted combos; unlisted combos are generated algorithmically via generateComboNodes().

import { getSkillTree } from './skill-trees.js'

// ── Pre-built combo trees ──────────────────────────────────────────────────
// Each combo adds a 4th "Synergy" tier with 2–3 unique nodes.

const COMBO_TREES = {

  tiefling_warlock: {
    tier: { name: 'Infernal Pact', comboLabel: 'Tiefling × Warlock' },
    nodes: [
      { id: 'cbo_tf_w_hellfire', name: 'Hellfire Rebuke', description: 'When an enemy damages you, deal CHA modifier × 1d6 fire damage back as a reaction. The blood remembers its origin.', tier: 4, type: 'active' },
      { id: 'cbo_tf_w_devils_luck', name: "Devil's Luck", description: 'Once per combat, reroll any failed saving throw. Keep the new result. The infernal contract has fine print.', tier: 4, type: 'active', uses: 1 },
      { id: 'cbo_tf_w_blood_fire', name: 'Blood and Fire', description: 'Eldritch Blast now deals fire damage instead of force, and ignites targets for 1d4 fire each turn until extinguished. The fiend made you a living torch.', tier: 4, type: 'passive' },
    ],
  },

  high_elf_wizard: {
    tier: { name: 'Ancient Spellcraft', comboLabel: 'High Elf × Wizard' },
    nodes: [
      { id: 'cbo_he_wiz_ignore_resist', name: 'Rend the Veil', description: 'Your spells ignore resistance (not immunity) to all damage types. The elven bloodline remembers magic before the mortal laws were written.', tier: 4, type: 'passive' },
      { id: 'cbo_he_wiz_crit', name: 'Arcane Precision', description: 'Cantrips now crit on 19-20. On a critical hit, the cantrip deals an extra d10 of its damage type.', tier: 4, type: 'passive' },
      { id: 'cbo_he_wiz_scribe', name: 'Thousand-Year Archive', description: 'Once per long rest, copy any spell you witness being cast directly into your spellbook. No resources needed. The elf mind records everything.', tier: 4, type: 'active', uses: 1 },
    ],
  },

  half_orc_barbarian: {
    tier: { name: 'Blood Frenzy', comboLabel: 'Half-Orc × Barbarian' },
    nodes: [
      { id: 'cbo_ho_bar_rage_bonus', name: 'Savage Surge', description: "While Raging and below 50% HP, gain +4 STR instead of +2. The orc blood surges when death is near.", tier: 4, type: 'passive' },
      { id: 'cbo_ho_bar_last_stand', name: 'Last Stand', description: "Relentless Endurance activates at 10 HP or fewer (not just 0 HP). Rise before you even fall.", tier: 4, type: 'passive' },
      { id: 'cbo_ho_bar_warpaint', name: 'War Paint', description: "Before combat, spend 1 minute applying war paint. While painted, +1 to all attack rolls and advantage on Intimidation. Lasts until a long rest.", tier: 4, type: 'active' },
    ],
  },

  dwarf_fighter: {
    tier: { name: 'Ironhold Stance', comboLabel: 'Dwarf × Fighter' },
    nodes: [
      { id: 'cbo_dw_ft_stance', name: 'Ironhold', description: "While you haven't moved this turn, +2 AC. Enemies attacking you while you're stationary have disadvantage on the first attack.", tier: 4, type: 'passive' },
      { id: 'cbo_dw_ft_grudge', name: 'Grudge Forge', description: "Mark the first creature to damage you each combat. +2 to attack and damage rolls against that target. The grudge burns hotter than any torch.", tier: 4, type: 'passive' },
      { id: 'cbo_dw_ft_deep_strike', name: 'Deep Strike', description: 'Second Wind also removes one condition (frightened, poisoned, or stunned). The dwarven constitution refuses most ailments.', tier: 4, type: 'passive' },
    ],
  },

  drow_shadow_dancer: {
    tier: { name: 'Void Step', comboLabel: 'Drow × Shadow Dancer' },
    nodes: [
      { id: 'cbo_dr_sd_void_step', name: 'Void Step', description: 'Shadow Step range extends to 90ft. When you arrive, you are invisible until the start of your next turn.', tier: 4, type: 'passive' },
      { id: 'cbo_dr_sd_drow_ambush', name: 'Drow Ambush', description: 'If you attack from invisibility or darkness on the first round of combat, deal +3d6 bonus damage. The drow do not announce themselves.', tier: 4, type: 'passive' },
      { id: 'cbo_dr_sd_shadow_merge', name: 'Shadow Merge', description: "Once per combat, merge with your shadow for 1 round: resistant to all damage, cannot act or be targeted by spells. Reappear anywhere within 30ft.", tier: 4, type: 'active', uses: 1 },
    ],
  },

  aasimar_paladin: {
    tier: { name: 'Celestial Oath', comboLabel: 'Aasimar × Paladin' },
    nodes: [
      { id: 'cbo_aa_pal_radiant_smite', name: 'Celestial Smite', description: 'Divine Smite deals radiant damage (not fire/necrotic). Smite crits leave the target Blinded until the end of their next turn.', tier: 4, type: 'passive' },
      { id: 'cbo_aa_pal_wings', name: 'Sacred Wings', description: "Once per long rest, manifest celestial wings. Fly speed 30ft for 1 minute. While flying, your melee attacks gain +2 and you can't be flanked.", tier: 4, type: 'active', uses: 1 },
      { id: 'cbo_aa_pal_healing_grace', name: 'Healing Grace', description: 'Lay on Hands heals 2 HP per point spent (instead of 1:1). Celestial heritage makes the touch twice as potent.', tier: 4, type: 'passive' },
    ],
  },

  githzerai_monk: {
    tier: { name: 'Psionic Strike', comboLabel: 'Githzerai × Monk' },
    nodes: [
      { id: 'cbo_gz_mnk_flurry', name: 'Psionic Flurry', description: 'Flurry of Blows can target two different creatures simultaneously (one hit each). The psionic mind tracks both.', tier: 4, type: 'passive' },
      { id: 'cbo_gz_mnk_mind_fortress', name: 'Mind Fortress', description: 'Resistance to psychic and charm effects. Enemies must make a WIS save (DC 14) to cast spells targeting you — their concentration breaks on a fail.', tier: 4, type: 'passive' },
      { id: 'cbo_gz_mnk_psionic_sight', name: 'Psionic Sight', description: "Spend 1 ki: read a creature's next intended action type (melee/spell/move). Grants advantage on the attack or save against that action. 30ft range.", tier: 4, type: 'active' },
    ],
  },

  warforged_artificer: {
    tier: { name: 'Arcane Chassis', comboLabel: 'Warforged × Artificer' },
    nodes: [
      { id: 'cbo_wf_art_infuse_self', name: 'Infuse Self', description: "Apply one Infusion to yourself as a free action (not consuming a slot). Your body is a valid infusion target — always was.", tier: 4, type: 'active', uses: 1 },
      { id: 'cbo_wf_art_self_repair', name: 'Self-Repair', description: 'As a bonus action, restore 1d8 + INT modifier HP to yourself. 3 uses per long rest. The chassis maintains itself.', tier: 4, type: 'active', uses: 3 },
      { id: 'cbo_wf_art_store_spell', name: 'Spell Cache', description: 'Once per long rest, store an unused spell slot. Retrieve it later as a free action. Your circuits hold the charge.', tier: 4, type: 'active', uses: 1 },
    ],
  },
}

// ── Algorithmic generation (stub) ──────────────────────────────────────────
// Called when no pre-built combo exists. Produces 2 generic synergy nodes
// based on the race's stat bonuses and the class's attack stat / hit die.

function generateComboNodes(raceId, classId, raceDef, classDef) {
  const statBonus = Object.entries(raceDef?.statBonuses || {}).sort((a, b) => b[1] - a[1])[0]
  const topStat = statBonus ? statBonus[0] : 'str'
  const className = classDef?.name || classId

  return [
    {
      id: `cbo_${raceId}_${classId}_heritage`,
      name: 'Racial Heritage',
      description: `Your ${raceDef?.name || raceId} ancestry sharpens your ${className} training. +1 to all ${topStat.toUpperCase()}-based checks and saves.`,
      tier: 4,
      type: 'passive',
    },
    {
      id: `cbo_${raceId}_${classId}_synergy`,
      name: 'Innate Synergy',
      description: `The overlap of ${raceDef?.name || raceId} traits and ${className} discipline grants advantage on the first save each combat.`,
      tier: 4,
      type: 'passive',
    },
  ]
}

// ── Public API ─────────────────────────────────────────────────────────────

export function getComboTree(raceId, classId) {
  return COMBO_TREES[`${raceId}_${classId}`] || null
}

export function getFullSkillTree(classId, raceId = null) {
  const base = getSkillTree(classId)
  if (!base) return null
  if (!raceId) return base

  const comboKey = `${raceId}_${classId}`
  const combo = COMBO_TREES[comboKey]

  let synergyNodes
  if (combo) {
    synergyNodes = combo.nodes
  } else {
    // Generate 2 generic nodes for unlisted combos
    synergyNodes = generateComboNodes(raceId, classId, null, { name: classId })
  }

  const synergyTier = {
    name: combo?.tier?.name || 'Racial Synergy',
    comboLabel: combo?.tier?.comboLabel || null,
    nodes: synergyNodes,
  }

  return {
    ...base,
    tiers: [...base.tiers, synergyTier],
  }
}
