# D&D Campaign RPG — Veteran Critique
*Reviewing as a player who has run 5e since the PHB dropped. These are the things that would make me close the tab.*

---

## CRITICAL — Breaks the Game

### 1. Legendary Actions Never Fire
`combat.js:25` pulls `boss.legendaryActions` from the boss root object — but that field doesn't exist on the boss root. It lives on each *phase*. The engine always defaults to `|| 3`, stores it in `this.legendaryActionsLeft`, and then **never uses that value to fire anything**. Varethis has 3 legendary actions per phase. The Architect has 3. None of them ever execute. The most iconic 5e boss mechanic — the thing that makes fights feel dangerous and uneven — is completely absent.

Fix: after the player's turn ends, loop `phase.legendaryActions` times, calling `bossTurn()` logic with a `'legendary'` flag, before giving the player their next turn.

### 2. Sneak Attack Distribution Is Broken
`combat.js:71-73`:
```js
const saBonus = roll(6) * Math.ceil(char.level / 2)
```
This rolls **1d6 then multiplies**. A level-5 Rogue gets `roll(6) * 3` — either 3, 6, 9, 12, 15, or 18, with equal probability. Actual 5e Sneak Attack is `3d6` — a bell curve from 3-18, average 10.5. The multiplier produces a flat distribution that feels nothing like Sneak Attack. At high levels the rogue is rolling 1d6×5 (results: 5,10,15,20,25,30 only) instead of 5d6.

Fix: `rollMultiple(Math.ceil(char.level / 2), 6).total`

### 3. Phase Transition On 3-Phase Bosses Uses `transitionAt: 0` Wrong
`combat.js:414`:
```js
const threshold = phase.hp * (phase.transitionAt || 0)
```
For Varethis Phase 2 (`transitionAt: 0.3`, `hp: 80`): threshold = 24. Fine. But the Phase 1 check is `transitionAt: 0.6` with `hp: 100` — meaning Varethis enters Phase 2 when HP drops below **60**. That's 40% health remaining, which feels right. But then Phase 2 spawns with **80 HP** full — the boss healed up. This is mechanically valid if intentional, but there's zero communication to the player. No text says "Phase 2 begins with full HP." Playtesters will think it's a bug.

### 4. Frightened Condition Does Nothing to Player Attacks
`combat.js:41-47`: The player attack function checks for `poisoned` and `restrained` disadvantage, but **ignores `frightened`**. The boss inflicts frightened constantly (Varethis's Enervation Wave, Sylvanax's Verdant Charm). Per 5e PHB, a frightened creature has disadvantage on attack rolls and ability checks while it can see the source of fear. The condition exists in `CONDITIONS` with the right description — it just doesn't do anything in combat.

Fix:
```js
if (char.conditions.includes('frightened') || char.conditions.includes('poisoned') || char.conditions.includes('restrained')) {
  rollResult = rollWithDisadvantage(20)
}
```

---

## MAJOR — Significant Mechanical Failures

### 5. Warlock Short Rest Recovery Missing
`combat.js:432-443`: `shortRest()` does partial Wizard slot recovery. Warlocks are **Pact Magic** casters — they recover ALL spell slots on a short rest. A Warlock with 2 Pact Magic slots recovers both slots on rest. This is the defining tradeoff of the class. The current code gives Warlocks nothing. By the third fight they're casting Eldritch Blast as an ability while their slots sit permanently depleted.

### 6. Barbarian Rage Halves ALL Damage Types
`combat.js:361`:
```js
if (char.isRaging) dmg = Math.max(1, Math.floor(dmg / 2))
```
5e Rage gives resistance to **bludgeoning, piercing, and slashing** damage only. Varethis hits with necrotic, psychic, and fire. A raging Barbarian in this engine halves necrotic bolt damage, Finger of Death, Soul Rupture — everything. This makes Barbarian borderline unkillable against spellcasters and completely misrepresents the class's actual vulnerability profile (it's excellent against fighters, mediocre against wizards).

### 7. Loot Tables Ignore Campaigns
`bosses.js` sets `lootTable: 'encounter_miniboss'` for both the Hollow Warden and the Thornwarden. `items.js:235-243` — `encounter_miniboss` drops "Warden's Shattered Blade" and "Hollow Warden's Shield" from Campaign 1. Fight the Thornwarden in Campaign 2 (a forest corruption boss) and you get ghost armor from a dead knight's ward you've never encountered. These loot tables need to be per-boss or per-campaign, not shared.

### 8. Buff Ability Type Is Hardcoded Wrong
`combat.js:327`:
```js
} else if (ability.type === 'buff') {
  this.log(`... empowers itself!`)
  this.boss._buffed = true
}
```
`_buffed` makes the next attack deal 1.5× damage. But `buff` abilities in bosses.js describe radically different effects: "Deathly Bulwark" (+3 AC), "Undying Rage" (+2 damage), "Phase Shift" (next attack misses automatically). All of them just become "boss hits 50% harder." Phase Shift specifically says "becomes briefly incorporeal — next attack misses" — the player should swing and whiff. Instead it makes the boss hit harder.

### 9. Initiative Not Rolled
Every fight starts with the player acting first. 5e combat opens with DEX initiative for all combatants. Even a coin-flip would be better — a Rogue with 18 DEX should feel faster than a Barbarian with 8 DEX. More importantly, fast bosses should occasionally surprise players. The Hollow Warden is a disciplined ex-knight. The Echo mirrors you perfectly. Neither gets to demonstrate speed.

### 10. Death Saves Absent
`isPlayerDead()` triggers defeat at 0 HP. 5e has death saving throws: three successes stabilize, three failures mean death. In a game framing itself as D&D, the player dying in one bad boss AoE and getting no death save opportunity is jarring. Even one save roll before defeat would close the loop.

---

## MODERATE — Breaks Immersion or Class Fantasy

### 11. All Emojis, Everywhere
The user said no emojis. The game is full of them:

- `CONDITIONS` icons in `combat.js:6-12`: `☠ 🔥 ✨ 👁 💫 ⛓`
- Combat log strings throughout `combat.js`: `⚔ ❌ 💥 💢 💚 🩸 🎵 🔮 😡 🥋`  
- `combat-screen.js:185`: `🛡 AC`
- `combat-screen.js:199-204`: `⚔ Attack`, `✨ Cast Spell`, `⚡ Use Ability`, `🛡 Dodge`, `🧪 Use Item`
- `getClassIcon()` at `combat-screen.js:447-449`: every class icon is emoji

These need to be replaced with game-icons.net SVGs or CSS symbols. The rework agent is handling this, but it needs to catch the combat log strings too — those are hardcoded in `combat.js`, not just the UI.

### 12. No Concentration Tracking
Ranger's Hunter's Mark, Warlock's Hex, Druid's Entangle — all concentration spells. There's no concentration field on the character. A player could cast Hunter's Mark, then cast Hold Person, then cast Hypnotic Pattern with no conflict. Concentration is the core limiting mechanic for powerful spells. Without it, Druids and Wizards are broken.

### 13. Blood Hunter Crimson Rite Self-Damage Is a d4
`combat.js:248`: `const selfDmg = roll(4)`. The Blood Hunter Crimson Rite (Matt Mercer's class, 2020 version) deals self damage equal to one roll of the character's hit die (1d10 for Blood Hunter). A d4 makes Crimson Rite trivially cheap. At level 5 the self-damage should scale up meaningfully to reflect the blood cost.

### 14. Monk Weapon Damage Wrong
`classes.js` gives Monk `weaponDamage: '1d6+DEX'`. Monk Martial Arts at level 1 is 1d4 + DEX or STR (unarmed), scaling to 1d6 at levels 5-10. Starting at 1d6 skips the whole early-game vulnerability that makes Monk progression feel earned. The unarmed strike shouldn't also be adding DEX as a string literal — `rollDamage` will choke on `'1d6+DEX'` unless there's a parser for stat names.

### 15. Eldritch Blast Treated as Limited-Use Ability
`combat.js:231-243`: Eldritch Blast is a cantrip — infinite uses, no resources. In `char.abilities` it presumably has `usesLeft` decremented on use. If it ever runs out, the Warlock has no basic attack. Cantrips should be separated from limited-use abilities entirely.

---

## MINOR — Real DMs Would Notice

### 16. `pickBossAbility()` Is Pure Random
`combat.js:389-393`:
```js
return abilities[Math.floor(Math.random() * abilities.length)]
```
Bosses have 3-4 abilities. Completely random selection means you can get `Necrotic Bolt` five turns in a row and never see `Finger of Death`. In practice, Varethis's most dramatic ability (Finger of Death, 7d8+30) fires with the same probability as his basic bolt. Weight the dangerous abilities at lower frequencies — or weight them *higher* at low HP for desperation.

### 17. Summoned Minions Are Just a Flat Damage Bonus
`combat.js:317-318`: When the boss summons undead, it adds `ability.count * 5` to its next attack. Varethis summons 3 wights as a +15 damage token on his next hit. Minions should be tracked entities that attack independently, or at least be visible in the combat log as a persistent threat — not a silent damage multiplier that disappears after one swing.

### 18. `getEquippedWeapon()` Returns First Weapon Found
`combat-screen.js:453-456`: Returns the first item in inventory with `type === 'weapon'`. No equipped slot. Player picks up the thornblade mid-campaign but keeps attacking with their starting rusty sword because it was added first. There's no weapon equip system.

### 19. Boss Conditions Clear at 30% Per Turn — Too Fast
`combat.js:405`: `this.bossConditions = this.bossConditions.filter(c => Math.random() > 0.3)`. Every condition on every boss clears with 30% probability each turn. A Ranger who successfully applies a restrained condition might watch it vanish in one round 30% of the time. 5e conditions from spells typically last until the caster loses concentration or a fixed duration. Even a simple 2-round duration would be more legible.

### 20. Campaign 3 Has No Pre-Echo Scene if Player Takes Glass Stair
`campaigns.js` — the glass stair path (`timeline_beta`) goes to `mirror_floor`. The stone stair path goes to `timeline_alpha` then `mirror_floor`. If a player takes the glass stair, they skip `timeline_alpha` — which means they never find the notes explaining that something came through the aperture with Ivelion. The Echo fight and the Architect's motivation make less sense without that context. The timeline flow should require both alpha and beta before the mirror floor, or the mirror floor scene should fill in the gap.

---

## Verdict

The narrative writing is genuinely good — Varethis's diary reveal, Sylvanax's three-stage tragedy, Ivelion's self-aware doom all land. The campaign structure branches well. The bones are here.

The mechanics are where this loses D&D players. Legendary actions missing, frightened doing nothing, sneak attack broken, and emojis everywhere in a "no emoji" game — these are the four things that would make a veteran close the tab in the first five minutes. Fix those four and you have something playable. Fix the rest and you have something worth running.
