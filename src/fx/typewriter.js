// Dramatic text reveal — typewriter with optional skip-on-click
// Usage: await typewrite(el, text, { speed, onDone })

export function typewrite(el, text, { speed = 28, onDone, skipEl } = {}) {
  return new Promise(resolve => {
    el.textContent = ''
    let i = 0
    let done = false

    function finish() {
      if (done) return
      done = true
      el.textContent = text
      if (onDone) onDone()
      resolve()
      if (skipEl) skipEl.removeEventListener('click', finish)
    }

    if (skipEl) skipEl.addEventListener('click', finish, { once: true })

    function step() {
      if (i >= text.length) { finish(); return }
      // Punctuation pause
      const pause = /[.,!?;:]/.test(text[i]) ? speed * 6 : speed
      el.textContent += text[i]
      i++
      setTimeout(step, pause)
    }
    step()
  })
}

// Reveal multiple lines with stagger
export async function revealLines(lines, container, speed = 28) {
  container.innerHTML = ''
  for (const line of lines) {
    const p = document.createElement('p')
    p.style.minHeight = '1.6em'
    container.appendChild(p)
    await typewrite(p, line, { speed })
    await delay(80)
  }
}

export function floatDamage(x, y, text, color = '#ff4444') {
  const el = document.createElement('div')
  el.textContent = text
  Object.assign(el.style, {
    position: 'fixed', left: x + 'px', top: y + 'px',
    color, fontFamily: "'VT323', monospace", fontSize: '1.8rem',
    fontWeight: '700', pointerEvents: 'none', zIndex: '1000',
    textShadow: `0 0 8px ${color}`,
    transform: 'translate(-50%, 0)',
    transition: 'transform 0.9s ease-out, opacity 0.9s ease-out',
    willChange: 'transform, opacity',
  })
  document.body.appendChild(el)
  requestAnimationFrame(() => {
    el.style.transform = 'translate(-50%, -60px)'
    el.style.opacity = '0'
  })
  setTimeout(() => el.remove(), 950)
}

export function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
