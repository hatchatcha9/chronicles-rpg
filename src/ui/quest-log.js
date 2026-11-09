// Quest Log — main quest tracker + side quests

import { game } from '../game/engine.js'
import { MAIN_QUEST_STAGES, getAvailableSideQuests, getSideQuest } from '../data/quests.js'
import { gi, I } from '../icons.js'

export function mountQuestLog(container) {
  const state = game.state
  const mqStage = MAIN_QUEST_STAGES[state.mainQuestStage || 0]
  const availQuests = getAvailableSideQuests(state.flags || {}, state.completedQuests || [])
  const activeQuests = (state.activeQuests || []).map(id => getSideQuest(id)).filter(Boolean)
  const doneQuests   = (state.completedQuests || []).map(id => getSideQuest(id)).filter(Boolean)

  container.innerHTML = `
    <div id="quest-log-screen" class="screen active ql-screen">
      <div class="ql-ui">
        <div class="ql-header gothic-panel">
          <button class="btn-back" id="btn-back-ql">← Back</button>
          <h2 class="ql-title">Chronicle of Deeds</h2>
          <span class="ql-subtitle">Lv.${state.level || 1} · ${state.character?.name || 'Adventurer'}</span>
        </div>

        <div class="ql-layout">

          <!-- Main Quest -->
          <div class="ql-section gothic-panel ql-main-section">
            <div class="ql-section-label">Main Quest</div>
            <div class="ql-mq-title">${mqStage.title}</div>
            <div class="ql-mq-summary">${mqStage.summary}</div>
            <div class="ql-mq-objective">
              <span class="ql-obj-label">Objective</span>
              ${mqStage.objective}
            </div>
            ${mqStage.hint ? `<div class="ql-mq-hint">${mqStage.hint}</div>` : ''}

            <!-- Stage progress -->
            <div class="ql-mq-stages">
              ${MAIN_QUEST_STAGES.map((s, i) => `
                <div class="ql-stage ${i < (state.mainQuestStage || 0) ? 'done' : i === (state.mainQuestStage || 0) ? 'current' : 'locked'}">
                  <span class="ql-stage-dot"></span>
                  <span class="ql-stage-name">${s.title}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="ql-right-col">

            <!-- Active side quests -->
            ${activeQuests.length > 0 ? `
              <div class="ql-section gothic-panel">
                <div class="ql-section-label">Active Quests</div>
                ${activeQuests.map(q => renderSideQuestCard(q, 'active')).join('')}
              </div>
            ` : ''}

            <!-- Available side quests -->
            ${availQuests.length > 0 ? `
              <div class="ql-section gothic-panel">
                <div class="ql-section-label">Available</div>
                ${availQuests.map(q => renderSideQuestCard(q, 'available')).join('')}
              </div>
            ` : ''}

            <!-- Completed -->
            ${doneQuests.length > 0 ? `
              <div class="ql-section gothic-panel ql-done-section">
                <div class="ql-section-label">Completed</div>
                ${doneQuests.map(q => renderSideQuestCard(q, 'done')).join('')}
              </div>
            ` : ''}

            ${(activeQuests.length + availQuests.length + doneQuests.length) === 0 ? `
              <div class="ql-section gothic-panel">
                <div class="ql-empty">No bounties taken. The notice board in Grimhaven may have work.</div>
              </div>
            ` : ''}

          </div>
        </div>
      </div>
    </div>
  `

  // Accept quest buttons
  document.querySelectorAll('.ql-accept-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const questId = btn.dataset.questId
      game.startQuest(questId)
      btn.textContent = 'Accepted'
      btn.disabled = true
      btn.style.opacity = '0.5'
    })
  })

  document.getElementById('btn-back-ql')?.addEventListener('click', () => {
    // Go back to wherever we came from
    const prev = game.state.worldLocation === 'grimhaven' ? 'hub' : 'world-map'
    game.navigate(prev)
  })
}

function renderSideQuestCard(quest, status) {
  return `
    <div class="ql-quest-card ql-quest-${status}">
      <div class="ql-quest-header">
        <span class="ql-quest-title">${quest.title}</span>
        <span class="ql-quest-region">${quest.region}</span>
      </div>
      <div class="ql-quest-giver">Given by: ${quest.giver}</div>
      <div class="ql-quest-summary">${quest.summary}</div>
      <div class="ql-quest-reward">
        Reward: ${quest.reward.gold > 0 ? `${quest.reward.gold}g` : ''}
        ${quest.reward.xp ? `· ${quest.reward.xp} XP` : ''}
        ${quest.reward.item ? '· Item' : ''}
      </div>
      ${status === 'available' ? `
        <button class="btn-fantasy btn-ghost ql-accept-btn" data-quest-id="${quest.id}">Accept Quest</button>
      ` : status === 'done' ? `
        <div class="ql-done-label">✓ Complete</div>
      ` : `
        <div class="ql-active-label">→ In Progress</div>
      `}
    </div>
  `
}
