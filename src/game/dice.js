// Dice rolling engine

export function roll(sides) {
  return Math.floor(Math.random() * sides) + 1
}

export function rollMultiple(count, sides) {
  const results = []
  for (let i = 0; i < count; i++) results.push(roll(sides))
  return { results, total: results.reduce((a, b) => a + b, 0) }
}

export function rollWithAdvantage(sides = 20) {
  const a = roll(sides), b = roll(sides)
  return { result: Math.max(a, b), rolls: [a, b], type: 'advantage' }
}

export function rollWithDisadvantage(sides = 20) {
  const a = roll(sides), b = roll(sides)
  return { result: Math.min(a, b), rolls: [a, b], type: 'disadvantage' }
}

export function rollStat() {
  // 4d6 drop lowest
  const rolls = [roll(6), roll(6), roll(6), roll(6)].sort((a, b) => a - b)
  return rolls.slice(1).reduce((a, b) => a + b, 0)
}

export function rollStats() {
  return {
    str: rollStat(), dex: rollStat(), con: rollStat(),
    int: rollStat(), wis: rollStat(), cha: rollStat()
  }
}

export function modifier(score) {
  return Math.floor((score - 10) / 2)
}

export function rollInitiative(dexScore) {
  return roll(20) + modifier(dexScore)
}

// Roll a die with async "animation" delay - returns promise
export async function rollAnimated(sides, onRolling) {
  const steps = 4
  let lastVal = 0
  for (let i = 0; i < steps; i++) {
    lastVal = roll(sides)
    if (onRolling) onRolling(lastVal, false)
    await delay(80)
  }
  const final = roll(sides)
  if (onRolling) onRolling(final, true)
  return final
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Parse dice notation like "2d6+3"
export function parseDice(notation) {
  const match = notation.match(/^(\d+)d(\d+)([+-]\d+)?$/)
  if (!match) return { count: 1, sides: 6, bonus: 0 }
  return {
    count: parseInt(match[1]),
    sides: parseInt(match[2]),
    bonus: match[3] ? parseInt(match[3]) : 0
  }
}

export function rollDamage(notation) {
  const { count, sides, bonus } = parseDice(notation)
  const r = rollMultiple(count, sides)
  return Math.max(1, r.total + bonus)
}
