// Shop screen — Blacksmith and Alchemist in Grimhaven

import { game } from '../game/engine.js'
import { SHOP_INVENTORIES } from '../data/items.js'
import { gi, I } from '../icons.js'
import { RARITIES } from '../data/items.js'

export function mountShop(container) {
  const shopId = game.state.shopId || 'blacksmith'
  const shop = SHOP_INVENTORIES[shopId]
  if (!shop) { game.navigate('hub'); return }

  render(container, shopId, shop)
}

function render(container, shopId, shop) {
  const state = game.state

  container.innerHTML = `
    <div id="shop-screen" class="screen active shop-screen">
      <div class="shop-ui">

        <div class="shop-header gothic-panel">
          <button class="btn-back" id="btn-leave-shop">← Leave</button>
          <div class="shop-title-block">
            <h2 class="shop-name">${shop.name}</h2>
            <p class="shop-keeper-line">"${shop.keeperLine}"</p>
          </div>
          <div class="shop-gold-display">
            ${gi(I.ABILITY, 14)} <span id="shop-gold-amt">${state.gold || 0}</span> gold
          </div>
        </div>

        <div class="shop-layout">

          <!-- Inventory for sale -->
          <div class="shop-catalog gothic-panel">
            <h3 class="shop-section-title">For Sale</h3>
            <div class="shop-items" id="shop-items">
              ${shop.items.map(entry => renderShopItem(entry)).join('')}
            </div>
          </div>

          <!-- Player inventory -->
          <div class="shop-player-inv gothic-panel">
            <h3 class="shop-section-title">Your Pack</h3>
            <div class="shop-inv-list" id="shop-inv-list">
              ${renderPlayerInventory(state.inventory || [])}
            </div>
          </div>

        </div>
      </div>
    </div>
  `

  // Buy handlers
  document.querySelectorAll('.shop-buy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.itemId
      const price  = parseInt(btn.dataset.price)
      const entry  = shop.items.find(e => e.item.id === itemId)
      if (!entry) return

      if ((game.state.gold || 0) < price) {
        btn.textContent = 'Too costly'
        btn.disabled = true
        setTimeout(() => { btn.textContent = `${price}g`; btn.disabled = false }, 1800)
        return
      }

      const spent = game.spendGold(price)
      if (!spent) return

      game.addItem(entry.item)
      document.getElementById('shop-gold-amt').textContent = game.state.gold

      btn.textContent = 'Purchased!'
      btn.disabled = true
      btn.style.borderColor = 'rgba(60,160,60,0.6)'
      btn.style.color = '#80d080'
      setTimeout(() => {
        btn.textContent = `${price}g`
        btn.disabled = false
        btn.style.borderColor = ''
        btn.style.color = ''
      }, 2000)

      // Refresh player inventory panel
      document.getElementById('shop-inv-list').innerHTML = renderPlayerInventory(game.state.inventory || [])
    })
  })

  document.getElementById('btn-leave-shop')?.addEventListener('click', () => {
    game.navigate('hub')
  })
}

function renderShopItem(entry) {
  const item = entry.item
  const rarity = RARITIES[item.rarity] || RARITIES.common
  const statLine = item.damage
    ? `${item.damage} ${item.damageType || 'damage'}`
    : item.acBonus
      ? `+${item.acBonus} AC`
      : item.heal
        ? `Heals ${item.heal}`
        : ''

  return `
    <div class="shop-item">
      <div class="shop-item-info">
        <div class="shop-item-name" style="color:${rarity.color}">${item.name}</div>
        <div class="shop-item-type">${item.type} · <span style="color:${rarity.color}">${rarity.label}</span></div>
        ${statLine ? `<div class="shop-item-stat">${statLine}</div>` : ''}
        <div class="shop-item-desc">${item.description}</div>
        ${item.flavor ? `<div class="shop-item-flavor">${item.flavor}</div>` : ''}
      </div>
      <div class="shop-item-buy">
        <button class="shop-buy-btn" data-item-id="${item.id}" data-price="${entry.price}">${entry.price}g</button>
      </div>
    </div>
  `
}

function renderPlayerInventory(inventory) {
  if (!inventory.length) return '<div class="shop-inv-empty">Your pack is empty.</div>'
  return inventory.map(item => {
    const rarity = RARITIES[item.rarity] || RARITIES.common
    return `
      <div class="shop-inv-item">
        <span class="shop-inv-name" style="color:${rarity.color}">${item.name}</span>
        <span class="shop-inv-type">${item.type}</span>
      </div>
    `
  }).join('')
}
