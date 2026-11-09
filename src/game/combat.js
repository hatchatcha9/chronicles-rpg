// D&D 5e combat engine

import { roll, rollMultiple, modifier, rollWithAdvantage, rollWithDisadvantage, delay, rollDamage } from './dice.js'

export const CONDITIONS = {
  poisoned:   { name: 'Poisoned',   color: '#44ff44', icon: 'lorc/dripping-sword',  effect: 'Disadvantage on attacks & ability checks' },
  burning:    { name: 'Burning',    color: '#ff6600', icon: 'lorc/fire',             effect: 'Takes 1d4 fire damage per turn' },
  blessed:    { name: 'Blessed',    color: '#ffdd00', icon: 'lorc/holy-grail',       effect: '+1d4 to attacks & saves' },
  frightened: { name: 'Frightened', color: '#8844ff', icon: 'lorc/screaming',        effect: 'Disadvantage on attacks while source visible' },
  stunned:    { name: 'Stunned',    color: '#88aaff', icon: 'lorc/knockout',         effect: 'Incapacitated; auto-fail STR/DEX saves' },
  restrained: { name: 'Restrained', color: '#996644', icon: 'lorc/chain',            effect: 'Speed 0; disadvantage on attacks; advantage on attack against' },
}

// Physical damage types — Barbarian Rage only resists these
const PHYSICAL_DAMAGE = new Set(['bludgeoning','piercing','slashing','physical','weapon','melee'])

export class CombatEngine {
  constructor(character, boss, log) {
    this.char = character
    this.boss = JSON.parse(JSON.stringify(boss))
    this.bossHp = boss.phases[0].hp
    this.bossMaxHp = boss.phases[0].hp
    this.currentPhase = 0
    this.round = 1
    this.log = log || (() => {})
    this.dodging = false
    this.bossConditions = []     // { name, turnsLeft }
    this.isOver = false
    this.result = null
    this.deathSaveSuccesses = 0
    this.deathSaveFailures  = 0
    this.unconscious = false
    this._lastAbilities = []     // last 6 ability names — repeat prevention

    // Initiative — roll at construction, decide who goes first
    const playerInit = roll(20) + modifier(character.stats?.dex ?? 10)
    const bossInit   = roll(20) + (boss.phases[0].initiativeBonus ?? 3)
    this.playerGoesFirst = playerInit >= bossInit
    this.log(`[Initiative] You roll ${playerInit}, ${boss.name} rolls ${bossInit}. ${this.playerGoesFirst ? 'You act first.' : boss.name + ' acts first.'}`)
  }

  getPhase() { return this.boss.phases[this.currentPhase] }
  getBossAC() { return this.getPhase().ac + (this.boss._acBuff || 0) }
  getBossName() { return this.boss.name }
  hasBossCondition(name) { return this.bossConditions.some(c => c.name === name) }

  // -- Player attack --
  async playerAttack(weapon) {
    const char = this.char
    const atkMod = modifier(char.stats[char.attackStat]) + char.profBonus
    let rollResult

    // Frightened, poisoned, restrained all impose disadvantage on attacks
    if (char.conditions.some(c => ['poisoned','restrained','frightened'].includes(c))) {
      rollResult = rollWithDisadvantage(20)
      const why = char.conditions.filter(c => ['poisoned','restrained','frightened'].includes(c)).join(', ')
      this.log(`[Disadvantage from: ${why}]`)
    } else {
      rollResult = { result: roll(20), rolls: [], type: 'normal' }
    }

    const blessed = char.conditions.includes('blessed') ? roll(4) : 0
    const total = rollResult.result + atkMod + blessed
    const isCrit = rollResult.result === 20
    const isMiss = rollResult.result === 1

    this.log(`[Attack] Roll: ${rollResult.result}${blessed ? ` +${blessed}(blessed)` : ''} + ${atkMod} = ${total} vs AC ${this.getBossAC()}`)

    // Phase Shift: boss becomes incorporeal, next attack auto-misses
    if (this.boss._phaseShift) {
      this.boss._phaseShift = false
      this.log(`[Phase Shift] ${this.getBossName()} flickers — your strike passes through nothing.`)
      await delay(300)
      return { hit: false }
    }

    // Clear AC buff after player resolves their attack
    if (this.boss._acBuff) {
      this.log(`[Buff] Deathly Bulwark dissolves.`)
      this.boss._acBuff = 0
    }

    if (isMiss || (!isCrit && total < this.getBossAC())) {
      this.log(`[Miss] The strike falls short.`)
      await delay(300)
      return { hit: false }
    }

    const dmgDice = weapon?.damage || char.weaponDamage || '1d6'
    let dmg = rollDamage(isCrit ? dmgDice.replace(/^(\d+)/, n => n*2) : dmgDice)
    dmg += modifier(char.stats[char.attackStat])

    if (char.hunterMarkTarget) dmg += roll(6)

    // Sneak Attack for Rogue — Nd6 bell curve, not 1d6*N
    if (char.class === 'rogue') {
      const saDice = Math.ceil(char.level / 2)
      const saBonus = rollMultiple(saDice, 6).total
      dmg += saBonus
      this.log(`[Sneak Attack] ${saDice}d6 = ${saBonus}`)
    }

    // Crimson Rite for Blood Hunter — d10 per hit die
    if (char.crimsonRiteActive) {
      const rite = roll(10)
      dmg += rite
      this.log(`[Crimson Rite] +${rite} necrotic`)
    }

    if (isCrit) this.log(`[Critical Hit!]`)
    this.log(`[Damage] ${dmg} to ${this.getBossName()}.`)

    this.bossHp -= dmg
    await delay(200)
    return { hit: true, damage: dmg, crit: isCrit }
  }

  // -- Player casts spell --
  async playerSpell(spell) {
    const char = this.char
    const level = spell.level || 1

    if (!char.spellSlots[level] || char.spellSlots[level] <= 0) {
      this.log(`[No Slots] No level-${level} spell slots remain.`)
      return { success: false }
    }

    char.spellSlots[level]--
    this.log(`[Spell] Casting ${spell.name}...`)
    await delay(400)

    if (spell.attackRoll) {
      const spellMod = modifier(char.stats[spell.attackStat || 'int']) + char.profBonus
      const r = roll(20)
      const total = r + spellMod
      const hit = r === 20 || total >= this.getBossAC()
      this.log(`[Spell] Attack: ${r} + ${spellMod} = ${total} vs AC ${this.getBossAC()}`)
      if (!hit) { this.log(`[Miss] ${spell.name} dissipates.`); return { success: false } }

      const dmg = rollDamage(spell.damage)
      this.log(`[Hit] ${spell.name} strikes for ${dmg} ${spell.damageType || ''} damage!`)
      this.bossHp -= dmg
      if (spell.condition) this.applyBossCondition(spell.condition, 3)
      return { success: true, damage: dmg }
    }

    if (spell.saveDC) {
      const bossPhase = this.getPhase()
      const saveMod = bossPhase.saveMods?.[spell.saveType] ?? 2
      const r = roll(20)
      const total = r + saveMod
      this.log(`[Save] ${this.getBossName()} ${spell.saveType.toUpperCase()}: ${r} + ${saveMod} = ${total} vs DC ${spell.saveDC}`)

      const dmg = rollDamage(spell.damage)
      const actualDmg = total >= spell.saveDC ? Math.floor(dmg / 2) : dmg
      this.log(`[Damage] ${spell.name}: ${actualDmg} ${spell.damageType || ''} damage${total >= spell.saveDC ? ' (half — saved)' : '!'}`)
      this.bossHp -= actualDmg
      if (spell.condition && total < spell.saveDC) this.applyBossCondition(spell.condition, 3)
      return { success: true, damage: actualDmg }
    }

    if (spell.heal) {
      const healed = rollDamage(spell.heal)
      char.hp = Math.min(char.maxHp, char.hp + healed)
      this.log(`[Heal] Recovered ${healed} HP. (${char.hp}/${char.maxHp})`)
      return { success: true, healed }
    }

    if (spell.buff) {
      if (!char.conditions.includes(spell.buff)) char.conditions.push(spell.buff)
      this.log(`[Buff] ${char.name} is now ${spell.buff}.`)
      return { success: true }
    }

    return { success: false }
  }

  // -- Class ability --
  async useAbility(ability) {
    const char = this.char

    if (ability.usesLeft !== undefined && ability.usesLeft <= 0) {
      this.log(`[Error] ${ability.name} has no uses left.`)
      return { success: false }
    }
    if (ability.usesLeft !== Infinity) ability.usesLeft--

    this.log(`[Ability] ${ability.name}...`)
    await delay(300)

    if (ability.id === 'action_surge') {
      char._actionSurge = true
      this.log(`[Ability] Action Surge — take another action!`)
      return { success: true, actionSurge: true }
    }

    if (ability.id === 'second_wind') {
      const h = roll(10) + char.level
      char.hp = Math.min(char.maxHp, char.hp + h)
      this.log(`[Heal] Second Wind: +${h} HP. (${char.hp}/${char.maxHp})`)
      return { success: true, healed: h }
    }

    if (ability.id === 'divine_smite') {
      const slots = Object.entries(char.spellSlots).find(([,v]) => v > 0)
      if (!slots) { this.log(`[Error] No spell slots.`); return { success: false } }
      char.spellSlots[slots[0]]--
      const smiteDmg = rollMultiple(2 + parseInt(slots[0]) - 1, 8).total
      this.log(`[Hit] Divine Smite: ${smiteDmg} radiant damage!`)
      this.bossHp -= smiteDmg
      return { success: true, damage: smiteDmg }
    }

    if (ability.id === 'lay_on_hands') {
      const heal = Math.min(char.layOnHandsPool, char.maxHp - char.hp)
      char.hp += heal
      char.layOnHandsPool -= heal
      this.log(`[Heal] Lay on Hands: +${heal} HP. Pool: ${char.layOnHandsPool} remaining.`)
      return { success: true, healed: heal }
    }

    if (ability.id === 'rage') {
      if (char.ragePowerLeft <= 0) { this.log(`[Error] No rages left.`); return { success: false } }
      char.ragePowerLeft--
      char.isRaging = true
      ability.usesLeft++ // undo decrement — tracked via ragePowerLeft
      this.log(`[Rage] RAGE! +2 damage, resistance to physical damage!`)
      return { success: true }
    }

    if (ability.id === 'flurry_of_blows') {
      if (char.kiPoints <= 0) { this.log(`[Error] No ki points.`); return { success: false } }
      char.kiPoints--
      const d1 = roll(4) + modifier(char.stats.dex)
      const d2 = roll(4) + modifier(char.stats.dex)
      const total = d1 + d2
      this.log(`[Strike] Flurry of Blows: ${d1} + ${d2} = ${total} damage!`)
      this.bossHp -= total
      return { success: true, damage: total }
    }

    if (ability.id === 'bardic_inspiration') {
      if (char.bardicInspirationLeft <= 0) { this.log(`[Error] No inspiration left.`); return { success: false } }
      char.bardicInspirationLeft--
      if (!char.conditions.includes('blessed')) char.conditions.push('blessed')
      this.log(`[Bard] Bardic Inspiration — you feel inspired!`)
      return { success: true }
    }

    // Eldritch Blast is a cantrip — undo the use decrement, no resource cost
    if (ability.id === 'eldritch_blast') {
      ability.usesLeft++
      const spellMod = modifier(char.stats.cha) + char.profBonus
      const r = roll(20)
      const total = r + spellMod
      if (total >= this.getBossAC()) {
        const dmg = roll(10)
        this.log(`[Blast] Eldritch Blast: ${dmg} force damage!`)
        this.bossHp -= dmg
        return { success: true, damage: dmg }
      }
      this.log(`[Miss] Eldritch Blast dissipates.`)
      return { success: false }
    }

    // Crimson Rite — d10 self damage (Blood Hunter's hit die, not d4)
    if (ability.id === 'crimson_rite') {
      const selfDmg = roll(10)
      char.hp -= selfDmg
      char.crimsonRiteActive = true
      this.log(`[Blood] Crimson Rite — paid ${selfDmg} HP. Attacks deal bonus necrotic damage!`)
      return { success: true }
    }

    if (ability.damage) {
      const dmg = rollDamage(ability.damage)
      this.log(`[Ability] ${ability.name}: ${dmg} damage!`)
      this.bossHp -= dmg
      return { success: true, damage: dmg }
    }

    if (ability.heal) {
      const h = rollDamage(ability.heal)
      char.hp = Math.min(char.maxHp, char.hp + h)
      this.log(`[Heal] ${ability.name}: +${h} HP.`)
      return { success: true }
    }

    this.log(`[Ability] ${ability.name} used.`)
    return { success: true }
  }

  // -- Dodge action --
  async playerDodge() {
    this.dodging = true
    this.log(`[Dodge] You take the Dodge action. Attacks against you have disadvantage.`)
    return { success: true }
  }

  // -- Boss turn --
  async bossTurn() {
    const phase = this.getPhase()
    const char = this.char

    this.tickBossConditions()

    // Process player conditions — skip if unconscious (death save handles it)
    if (!this.unconscious) {
      if (char.conditions.includes('burning')) {
        const bd = roll(4)
        char.hp -= bd
        this.log(`[Burn] ${char.name} takes ${bd} fire damage! (${char.hp}/${char.maxHp})`)
      }
      if (char.conditions.includes('poisoned')) {
        const pd = roll(4)
        char.hp -= pd
        this.log(`[Poison] Poison deals ${pd} damage! (${char.hp}/${char.maxHp})`)
      }
    }

    // Check if player just dropped to 0 from conditions
    if (char.hp <= 0 && !this.unconscious) {
      char.hp = 0
      this.unconscious = true
      this.log(`[Down] ${char.name} falls unconscious!`)
    }

    // Death save instead of normal boss turn if player is down
    if (this.unconscious) {
      this.rollDeathSave()
      return { deathSave: true }
    }

    await delay(500)

    const ability = this.pickBossAbility(phase)
    this.log(`[Boss] ${this.getBossName()} — ${ability.name}!`)
    await delay(400)

    if (ability.type === 'attack') {
      await this.bossAttack(ability)
    } else if (ability.type === 'aoe') {
      await this.bossAoe(ability)
    } else if (ability.type === 'heal') {
      const h = rollDamage(ability.amount)
      this.bossHp = Math.min(this.bossMaxHp, this.bossHp + h)
      this.log(`[Heal] ${this.getBossName()} recovers ${h} HP!`)
    } else if (ability.type === 'summon') {
      this.log(`[Summon] ${this.getBossName()} calls ${ability.count} undead! (+${ability.count * 5} bonus damage next hit)`)
      this.boss._minionBonus = (ability.count || 2) * 5
    } else if (ability.type === 'condition') {
      if (ability.target === 'player') {
        if (!char.conditions.includes(ability.condition)) {
          char.conditions.push(ability.condition)
          this.log(`[Status] ${char.name} is now ${ability.condition}!`)
        }
      }
    } else if (ability.type === 'buff') {
      this.log(`[Buff] ${this.getBossName()} — ${ability.description || 'empowers itself'}!`)
      const eff = ability.buffEffect || 'dmg_boost'
      if (eff === 'dodge') {
        this.boss._phaseShift = true
      } else if (eff.startsWith('ac+')) {
        this.boss._acBuff = parseInt(eff.slice(3))
      } else if (eff.startsWith('dmg+')) {
        this.boss._damageBuff = parseInt(eff.slice(4))
      } else {
        this.boss._buffed = true
      }
    }

    return { used: ability.name }
  }

  // -- Legendary actions fire after the player's turn, before boss normal turn --
  async fireLegendaryActions() {
    const phase = this.getPhase()
    const count = phase.legendaryActions ?? 0
    if (count <= 0) return []

    const results = []
    for (let i = 0; i < count; i++) {
      await delay(700)
      const ability = this.pickBossAbility(phase)
      this.log(`[Legendary] ${this.getBossName()} — Legendary Action: ${ability.name}!`)
      if (ability.type === 'attack') {
        await this.bossAttack(ability)
        results.push({ legendary: true, ability: ability.name })
      } else if (ability.type === 'aoe') {
        await this.bossAoe(ability)
        results.push({ legendary: true, ability: ability.name })
      }
    }
    return results
  }

  async bossAttack(ability) {
    const char = this.char
    const atkBonus = this.getPhase().atkBonus || 5

    let r
    if (this.hasBossCondition('restrained') || this.hasBossCondition('stunned')) {
      const a = roll(20), b = roll(20)
      r = Math.min(a, b)
      this.log(`[Roll] ${this.getBossName()} (disadvantage): ${r}`)
    } else if (this.dodging) {
      const a = roll(20), b = roll(20)
      r = Math.min(a, b)
      this.log(`[Roll] ${this.getBossName()} (you dodge): ${r}`)
      this.dodging = false
    } else {
      r = roll(20)
      this.log(`[Roll] ${this.getBossName()}: ${r} + ${atkBonus} = ${r + atkBonus} vs AC ${char.ac}`)
    }

    const total = r + atkBonus
    if (r === 1 || (r !== 20 && total < char.ac)) {
      this.log(`[Miss] Attack misses!`)
      return
    }

    let dmg = rollDamage(ability.damage || '2d6+3')
    if (r === 20) {
      dmg = rollDamage((ability.damage || '2d6+3').replace(/^(\d+)/, n => n*2))
      this.log(`[Crit] Critical strike!`)
    }

    // Barbarian Rage: physical damage only — necrotic/fire/psychic bypass
    if (char.isRaging && PHYSICAL_DAMAGE.has(ability.damageType || 'physical')) {
      dmg = Math.max(1, Math.floor(dmg / 2))
    }
    if (this.boss._minionBonus)  { dmg += this.boss._minionBonus; this.boss._minionBonus = 0 }
    if (this.boss._buffed)       { dmg = Math.floor(dmg * 1.5);   this.boss._buffed = false }
    if (this.boss._damageBuff)   { dmg += this.boss._damageBuff;  this.boss._damageBuff = 0 }

    char.hp -= dmg
    if (char.hp <= 0 && !this.unconscious) {
      char.hp = 0
      this.unconscious = true
      this.log(`[Hit] ${this.getBossName()} deals ${dmg} damage! ${char.name} falls unconscious!`)
    } else {
      this.log(`[Hit] ${this.getBossName()} deals ${dmg} damage to ${char.name}. (${char.hp}/${char.maxHp})`)
    }
  }

  async bossAoe(ability) {
    const char = this.char
    const saveDC = ability.saveDC || 14
    const saveType = ability.saveType || 'dex'
    const saveMod = modifier(char.stats[saveType]) + (char.saveProficiencies?.includes(saveType) ? char.profBonus : 0)
    const r = roll(20)
    const saveTotal = r + saveMod

    this.log(`[Save] ${char.name} ${saveType.toUpperCase()}: ${r} + ${saveMod} = ${saveTotal} vs DC ${saveDC}`)

    const dmg = rollDamage(ability.damage || '3d6')
    const actual = saveTotal >= saveDC ? Math.floor(dmg / 2) : dmg
    char.hp -= actual
    this.log(`[Hit] ${actual} ${ability.damageType || ''} damage${saveTotal >= saveDC ? ' (saved, half)' : '!'}`)
    if (ability.condition && saveTotal < saveDC) {
      if (!char.conditions.includes(ability.condition)) char.conditions.push(ability.condition)
      this.log(`[Status] ${char.name} is now ${ability.condition}!`)
    }
    if (char.hp <= 0 && !this.unconscious) {
      char.hp = 0
      this.unconscious = true
      this.log(`[Down] ${char.name} falls unconscious!`)
    }
  }

  pickBossAbility(phase) {
    const abilities = phase.abilities
    const hpPct = this.bossHp / this.bossMaxHp

    // Build weighted pool — prevent same ability 3 turns in a row, weight dangerous at low HP
    const weighted = []
    for (const ability of abilities) {
      const recentRepeats = this._lastAbilities.slice(-2).filter(n => n === ability.name).length
      if (recentRepeats >= 2) continue

      const isDangerous = ability.damage || ability.condition
      const weight = isDangerous && hpPct < 0.4 ? 3 : 1
      for (let i = 0; i < weight; i++) weighted.push(ability)
    }

    const pool = weighted.length > 0 ? weighted : abilities
    const chosen = pool[Math.floor(Math.random() * pool.length)]
    this._lastAbilities.push(chosen.name)
    if (this._lastAbilities.length > 6) this._lastAbilities.shift()
    return chosen
  }

  // Duration-based boss conditions — {name, turnsLeft}
  applyBossCondition(cond, duration = 2) {
    if (!this.bossConditions.some(c => c.name === cond)) {
      this.bossConditions.push({ name: cond, turnsLeft: duration })
    }
  }

  tickBossConditions() {
    const burning = this.bossConditions.find(c => c.name === 'burning')
    if (burning) {
      const d = roll(4)
      this.bossHp -= d
      this.log(`[Burn] ${this.getBossName()} takes ${d} fire damage!`)
    }
    this.bossConditions = this.bossConditions
      .map(c => ({ ...c, turnsLeft: c.turnsLeft - 1 }))
      .filter(c => c.turnsLeft > 0)
  }

  // Death saving throw per 5e: 10+ success, 1 = 2 failures, 20 = instant stabilize
  rollDeathSave() {
    const r = roll(20)
    if (r === 20) {
      this.deathSaveSuccesses = 3
      this.char.hp = 1
      this.unconscious = false
      this.log(`[Death Save] Rolled ${r} — Miraculous recovery! ${this.char.name} stands with 1 HP!`)
      return
    }
    if (r === 1) {
      this.deathSaveFailures += 2
      this.log(`[Death Save] Rolled ${r} — Critical failure! (${this.deathSaveFailures}/3 failures)`)
    } else if (r >= 10) {
      this.deathSaveSuccesses++
      this.log(`[Death Save] Rolled ${r} — Success! (${this.deathSaveSuccesses}/3 successes)`)
    } else {
      this.deathSaveFailures++
      this.log(`[Death Save] Rolled ${r} — Failure! (${this.deathSaveFailures}/3 failures)`)
    }
    if (this.deathSaveSuccesses >= 3) {
      this.unconscious = false
      this.char.hp = 0
      this.log(`[Death Save] ${this.char.name} stabilizes... alive, barely.`)
    }
  }

  // Check phase transitions
  checkPhaseTransition() {
    const phase = this.getPhase()
    const nextPhase = this.boss.phases[this.currentPhase + 1]
    if (!nextPhase) return null

    const threshold = phase.hp * (phase.transitionAt || 0)
    if (this.bossHp <= threshold) {
      this.currentPhase++
      this.bossHp = nextPhase.hp
      this.bossMaxHp = nextPhase.hp
      this.bossConditions = []
      this._lastAbilities = []
      this.log(`[Phase!] ${this.getBossName()} enters ${nextPhase.phaseName}!`)
      return nextPhase
    }
    return null
  }

  // Player is truly dead only after 3 death save failures
  isPlayerDead() { return this.deathSaveFailures >= 3 }

  isBossDead() {
    if (this.bossHp <= 0 && this.currentPhase >= this.boss.phases.length - 1) return true
    return false
  }

  shortRest() {
    const char = this.char
    const hd = roll(char.hitDie || 8)
    const heal = Math.max(1, hd + modifier(char.stats.con))
    char.hp = Math.min(char.maxHp, char.hp + heal)
    char.conditions = char.conditions.filter(c => c !== 'burning')

    // Warlock: Pact Magic recovers ALL spell slots on short rest (not just long rest like others)
    if (char.class === 'warlock') {
      char.spellSlots = { ...(char.maxSpellSlots || {}) }
    }
    if (char.class === 'wizard') {
      const lvl = Math.ceil(char.level / 2)
      char.spellSlots[1] = Math.min(char.maxSpellSlots[1] || 0, (char.spellSlots[1] || 0) + lvl)
    }
    if (char.class === 'monk') char.kiPoints = Math.min(char.maxKiPoints, char.kiPoints + Math.floor(char.maxKiPoints / 2))
    return heal
  }
}
