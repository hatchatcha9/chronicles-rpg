import './style.css'
import { game, on } from './game/engine.js'
import { mountTitle } from './ui/title.js'
import { mountCampaignSelect } from './ui/campaign-select.js'
import { mountCharCreate } from './ui/char-create.js'
import { mountNarrative } from './ui/narrative.js'
import { mountCombat } from './ui/combat-screen.js'
import { mountLoot } from './ui/loot.js'
import { mountWorldMap } from './ui/world-map.js'
import { mountHub } from './ui/hub.js'
import { mountShop } from './ui/shop.js'
import { mountQuestLog } from './ui/quest-log.js'
import { mountSkillTree } from './ui/skill-tree-screen.js'

const app = document.getElementById('app')

const routes = {
  'title':           mountTitle,
  'campaign-select': mountCampaignSelect,
  'char-create':     mountCharCreate,
  'narrative':       mountNarrative,
  'combat':          mountCombat,
  'loot':            mountLoot,
  'world-map':       mountWorldMap,
  'hub':             mountHub,
  'shop':            mountShop,
  'quest-log':       mountQuestLog,
  'skill-tree':      mountSkillTree,
}

function render(screen) {
  app.innerHTML = ''
  const mount = routes[screen]
  if (!mount) {
    console.error('Unknown screen:', screen)
    game.navigate('title')
    return
  }
  mount(app)
}

on('navigate', ({ screen }) => {
  render(screen)
})

// Boot
render('title')
