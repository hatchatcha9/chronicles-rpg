// Pixel art weapon sprites — drawn on canvas

// 12×12 pixel grid, each cell = scale px
// Format: row strings, each char = palette key
// Palette:
// . = transparent
// S = steel (#8fa8c0)
// s = dark steel (#5a7080)
// G = gold (#c8a840)
// g = dark gold (#7a6020)
// W = wood (#6b4c2a)
// w = dark wood (#3d2b1a)
// B = bone (#c8b89a)
// b = dark bone (#8a7860)
// R = red (#880000)
// P = purple (#440088)
// E = energy glow (#8844ff)
// V = void (#0a0020)
// v = void glow (#4400cc)
// N = nature (#2d5c1e)
// n = nature glow (#6ab840)
// T = thorn (#4a2810)
// L = leather (#7a5030)
// O = obsidian (#1a1a2a)

const PAL = {
  '.': null,
  'S': '#8fa8c0', 's': '#5a7080',
  'G': '#c8a840', 'g': '#7a6020',
  'W': '#6b4c2a', 'w': '#3d2b1a',
  'B': '#c8b89a', 'b': '#8a7860',
  'R': '#cc2222', 'r': '#880000',
  'P': '#8833ff', 'p': '#440066',
  'E': '#6644cc', 'e': '#330088',
  'V': '#0a0020', 'v': '#3300aa',
  'N': '#2d5c1e', 'n': '#6ab840',
  'T': '#4a2810', 'L': '#7a5030',
  'O': '#1a1a2a', 'o': '#33334a',
  'C': '#44ccff', 'c': '#2288aa',
  'Y': '#ffee44', 'y': '#aa9900',
  'H': '#ffffff', 'h': '#cccccc',
}

function parseSprite(rows) {
  return rows.map(row => [...row].map(ch => PAL[ch] || null))
}

function drawSprite(ctx, pixels, x, y, cellSize) {
  pixels.forEach((row, ry) => {
    row.forEach((color, rx) => {
      if (!color) return
      ctx.fillStyle = color
      ctx.fillRect(
        Math.round(x + rx * cellSize),
        Math.round(y + ry * cellSize),
        cellSize, cellSize
      )
    })
  })
}

// ─── Sprite definitions ───────────────────────────

const SPRITES = {
  sword_basic: parseSprite([
    '....SS......',
    '....SS......',
    '....SS......',
    '....SS......',
    '....SS......',
    '....SS......',
    '....SS......',
    '..GgGgGg....',
    '...LLLL.....',
    '....WW......',
    '....WW......',
    '....WW......',
  ]),

  sword_broken: parseSprite([
    '....SS......',
    '...SS.......',
    '..SS........',
    '..S.........', // break
    '..SS........',
    '..sSS.......',
    '...sSS......',
    '..GgGgGg....',
    '...LLLL.....',
    '....WW......',
    '....WW......',
    '....WW......',
  ]),

  sword_thorn: parseSprite([
    '....nN......',
    '....nN......',
    '...TnN......',
    '....nN.T....',
    '...TnN......',
    '....NnT.....',
    '....nN......',
    '..ggNngg....',
    '...NNNN.....',
    '....WW......',
    '....WW......',
    '....WW......',
  ]),

  sword_void: parseSprite([
    '....vV......',
    '...vVv......',
    '..VvVv......',
    '..EevV......',
    '..vVeE......',
    '...vVv......',
    '....vV......',
    '..ppPppp....',
    '....pp......',
    '....OO......',
    '....OO......',
    '....OO......',
  ]),

  dagger_bone: parseSprite([
    '..........B.',
    '.........Bb.',
    '........Bb..',
    '.......Bb...',
    '......Bb....',
    '.....Bb.....',
    '....bB......',
    '...GgG......',
    '..LLL.......',
    '.LLL........',
    '............',
    '............',
  ]),

  staff_dark: parseSprite([
    '..pPPp......',
    '.pP..Pp.....',
    '.EP..PE.....',
    '.pP..Pp.....',
    '..pPPp......',
    '....WW......',
    '....WW......',
    '....wW......',
    '....WW......',
    '....Ww......',
    '....WW......',
    '....Ww......',
  ]),

  staff_grove: parseSprite([
    '..nNNn......',
    '.nN..Nn.....',
    '.nN..nN.....',
    '.nN..Nn.....',
    '..nNNn......',
    '....NN......',
    '....WW......',
    '....Ww......',
    '....WW......',
    '....wW......',
    '....NW......',
    '....Wn......',
  ]),

  bow_ashen: parseSprite([
    '.....s......',
    '....ss......',
    '...ss.......',
    '..ss........',
    '.ss.........', // lower limb
    'W...........', // grip
    'W...........', // grip
    '.WW.........',
    '..WWs.......',
    '...sWss.....',
    '....sss.....',
    '.....ss.....',
  ]),

  wand_architect: parseSprite([
    '..CCCC......',
    '.CC..CC.....',
    'C.EEEE.C....',
    '.CC..CC.....',
    '..CCCC......',
    '....vv......',
    '....VV......',
    '....vV......',
    '....Vv......',
    '....vV......',
    '....VV......',
    '....vV......',
  ]),

  orb_phylactery: parseSprite([
    '..pPPPp.....',
    '.pP...Pp....',
    'pP.EeE.Pp...',
    'P.E.H.E.P...',
    'P.e.H.e.P...',
    'pP.EeE.Pp...',
    '.pP...Pp....',
    '..pPPPp.....',
    '............',
    '............',
    '............',
    '............',
  ]),

  potion_red: parseSprite([
    '.....hh.....',
    '....hHh.....',
    '....Rr......',
    '...rRRr.....',
    '..rRRRRr....',
    '..rRRRRr....',
    '..rRRRRr....',
    '..rRRRRr....',
    '...rRRr.....',
    '...rRRr.....',
    '....rr......',
    '............',
  ]),

  potion_red_greater: parseSprite([
    '.....hh.....',
    '....hHh.....',
    '....RR......',
    '...RRRR.....',
    '..rRRRRr....',
    '..RRYRRr....',
    '..rRRRRR....',
    '..rRRRRr....',
    '...rRRr.....',
    '...rRRr.....',
    '....rr......',
    '............',
  ]),

  potion_green: parseSprite([
    '.....hh.....',
    '....hHh.....',
    '....nN......',
    '...nNNn.....',
    '..nNNNNn....',
    '..nNnNNn....',
    '..nNNNNn....',
    '..nNNNNn....',
    '...nNNn.....',
    '...nNNn.....',
    '....nn......',
    '............',
  ]),

  potion_gold: parseSprite([
    '.....hh.....',
    '....hHh.....',
    '....GY......',
    '...GYYg.....',
    '..gGYYGg....',
    '..GYHYGg....',
    '..gGYYGG....',
    '..gGYYGg....',
    '...gGGg.....',
    '...gGGg.....',
    '....gg......',
    '............',
  ]),

  flask_holy: parseSprite([
    '.....hh.....',
    '....hHh.....',
    '....YH......',
    '...YHHH.....',
    '..HHhhhH....',
    '..HhYYhH....',
    '..HhhhHH....',
    '..HHhHHH....',
    '...HhhH.....',
    '...HHhH.....',
    '....HH......',
    '............',
  ]),

  armor_leather: parseSprite([
    '............',
    '...LLLLLL...',
    '..LLbbbbLL..',
    '..LLbbbbLL..',
    '..LL....LL..',
    '..LbbbbbLL..',
    '..LLbLbLL...',
    '..LLLLbLL...',
    '...LLLLLL...',
    '............',
    '............',
    '............',
  ]),

  shield_hollow: parseSprite([
    '..ssSSss....',
    '.sSSSSSss...',
    'sSSSSSSSSs..',
    'sSSSSSSSSs..',
    'sSSSGGSSs...',
    'sSSGCCGSs...',
    'sSSSGGSSs...',
    'sSSSSSSSSs..',
    '.sSSSSSss...',
    '..ssSSss....',
    '............',
    '............',
  ]),

  armor_bark: parseSprite([
    '............',
    '..nNNNNNn...',
    '.nNNwwNNNn..',
    '.nNwwwwwNn..',
    '.nNw....Nn..',
    '.nNwNNwNNn..',
    '.nNwNwNwNn..',
    '.nNNwwwNNn..',
    '..nNNNNNn...',
    '............',
    '............',
    '............',
  ]),

  cloak_echo: parseSprite([
    '............',
    '...vVVVv....',
    '..vVVVVVv...',
    '.vVV..VVVv..',
    '.vV....VVv..',
    '.vV....VVv..',
    '..vVVVVVv...',
    '..vVVVVVv...',
    '...vvVvv....',
    '...vV.Vv....',
    '....v.v.....',
    '............',
  ]),
}

// Draw a weapon sprite centered at (cx, cy) at given pixel size per cell
export function drawWeaponSprite(ctx, spriteId, cx, cy, cellSize = 8) {
  const sprite = SPRITES[spriteId]
  if (!sprite) return
  const cols = sprite[0].length
  const rows = sprite.length
  const x = cx - (cols * cellSize) / 2
  const y = cy - (rows * cellSize) / 2
  ctx.imageSmoothingEnabled = false
  drawSprite(ctx, sprite, x, y, cellSize)
}

export function getWeaponSpriteIds() {
  return Object.keys(SPRITES)
}
