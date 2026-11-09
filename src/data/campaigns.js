// Campaign narrative trees — 3 full campaigns with branching

export const CAMPAIGNS = [
  {
    id: 'ashen_throne',
    title: 'The Ashen Throne',
    subtitle: 'Campaign I',
    tagline: 'A kingdom of death. A throne of bones. An enemy who cannot die.',
    description: 'Three hundred years ago, the lich Varethis cursed the kingdom of Valdris into eternal undeath. You arrive seeking a rumored artifact — and find yourself the last hope of a dead nation.',
    coverTheme: 'crypt',
    difficulty: 'Medium',
    length: '~45 min',
    recommendedClasses: ['paladin', 'cleric', 'fighter', 'wizard'],
    openingArt: 'ashen_throne',
    scenes: {
      start: {
        id: 'start',
        type: 'narrative',
        atmosphere: 'crypt',
        title: 'The Ruined Capital',
        text: `The city of Valdris hangs in perpetual twilight. Ash drifts like snow across streets where no living foot has crossed in three centuries — it smells of cold chalk and very old stone, of nothing in particular, which is its own kind of wrongness. The towers are intact. They simply absorbed the silence.\n\nAt the city gate, something moves among the rubble. A knight in battered silver armor steps into your path. Alive — genuinely alive, though barely. She holds her sword loosely, like someone who gave up gripping it tight a long time ago.\n\n"Stop. I don't know if you're real or another vision." She squints. "If you're real, you've walked into a tomb that covers fifty square miles. The lich Varethis rules here. Nothing else does."`,
        choices: [
          { id: 'ask_knight', text: '"Who are you? And how are you still breathing in a city full of corpses?"', next: 'meet_saria', flag: ['met_saria'] },
          { id: 'ask_artifact', text: '"The Ashen Scepter. Tell me where it is."', next: 'scepter_clue', flag: ['knows_scepter'] },
          { id: 'press_on', text: 'Shoulder past her. Didn\'t come here to talk.', next: 'hostile_entry', flag: ['dismissed_saria'] },
        ]
      },

      meet_saria: {
        id: 'meet_saria',
        type: 'narrative',
        atmosphere: 'crypt',
        title: 'The Last Knight',
        text: `"Saria. Knight-Commander of Valdris — of what's left of it." She sheathes her sword. "Surviving is... complicated here. Varethis's curse makes the dead walk but doesn't touch the living. So I walk among corpses and they ignore me as long as I don't interfere with them."\n\nShe looks at you with something between exhaustion and hope.\n\n"You're looking for the Scepter. Everyone who comes here is looking for the Scepter. It's in the palace throne room, beneath Varethis himself. If you want to reach it, you'll need to pass through the royal catacombs first. I can show you the way. If you want."`,
        choices: [
          { id: 'accept_saria', text: 'Nod once. "Show me the way."', next: 'catacomb_approach', flag: ['saria_ally'] },
          { id: 'decline_saria', text: 'Look past her at the city. "I\'ll manage on my own."', next: 'solo_approach', flag: ['solo_run'] },
        ]
      },

      scepter_clue: {
        id: 'scepter_clue',
        type: 'narrative',
        atmosphere: 'crypt',
        title: 'The Ashen Scepter',
        text: `The knight's expression shifts. "Then you know the same rumor I heard fifteen years ago." She looks over her shoulder at the silent city. "I came to steal it too. Thought I could use it to lift the curse from outside. The catacombs are the only way through to the throne room. The Warden guards the only passage."\n\nShe meets your eyes. "I've been trying to get past it for three years. I haven't managed it alone."`,
        choices: [
          { id: 'team_up', text: 'Step up beside her. "Then we go together."', next: 'catacomb_approach', flag: ['saria_ally'] },
          { id: 'ask_warden', text: '"This Warden. Tell me what I\'m walking into."', next: 'warden_lore', flag: ['knows_warden'] },
        ]
      },

      warden_lore: {
        id: 'warden_lore',
        type: 'narrative',
        atmosphere: 'crypt',
        title: 'The Hollow Warden',
        text: `"It was the king's champion — Sir Aldric. When the curse fell, he was at his post." Saria's voice is careful, clinical. "The curse didn't just reanimate him. It... hollowed him out. Left the armor, left the memory of his purpose. He guards the gate because he was always going to guard the gate."\n\nShe pauses. "There's nothing left in there to reason with. No mercy, no hesitation. The closest thing to Aldric that remains is how precise he fights. He was the best swordsman I ever saw."`,
        choices: [
          { id: 'continue_catacomb', text: 'You\'ve heard enough. Follow her in.', next: 'catacomb_approach', flag: ['saria_ally'] },
        ]
      },

      hostile_entry: {
        id: 'hostile_entry',
        type: 'narrative',
        atmosphere: 'crypt',
        title: 'On Your Own',
        text: `The knight watches you go without a word. You navigate the silent streets alone. The undead drift past you like smoke — some kind of suppression field here, or maybe they simply don't register the living as prey. Yet.\n\nYou find the catacomb entrance marked by a bronze door embossed with the royal seal of Valdris. It stands open. Whatever was keeping people out is no longer present — or whatever was keeping people in is no longer concerned.\n\nThe Hollow Warden stands at the interior gate.`,
        choices: [
          { id: 'fight_warden_alone', text: 'Step into the dark. Find out what three centuries of purpose looks like.', next: 'combat_warden', combatId: 'hollow_warden' },
        ]
      },

      solo_approach: {
        id: 'solo_approach',
        type: 'narrative',
        atmosphere: 'crypt',
        title: 'The Quiet Road',
        text: `You navigate without her. It takes longer. Two wrong turns lead into halls of dormant undead — you move carefully and they don't stir. The catacomb entrance is large, bronze, and marked with royal seals. It opens when you push it.`,
        choices: [
          { id: 'face_warden', text: 'Go down. Whatever\'s waiting, you\'ve come too far to stop now.', next: 'combat_warden', combatId: 'hollow_warden' },
        ]
      },

      catacomb_approach: {
        id: 'catacomb_approach',
        type: 'narrative',
        atmosphere: 'crypt',
        title: 'Into the Catacombs',
        text: `Saria leads you through alleys that seem to breathe wrongly. The undead give her a wide berth — she says it took months to learn how to move so they don't register her.\n\n"Here." The catacomb door. Bronze, heavy, cold — the smell of turned earth and something older rises from behind it. "Aldric is just inside." She draws her sword. The blade is notched from three years of survival. "Try to keep it quick. The longer you fight him, the more he focuses."`,
        choices: [
          { id: 'fight_warden', text: 'Follow her in. Meet what used to be Sir Aldric.', next: 'combat_warden', combatId: 'hollow_warden' },
        ]
      },

      combat_warden: {
        id: 'combat_warden',
        type: 'combat',
        bossId: 'hollow_warden',
        atmosphere: 'crypt',
        next_victory: 'post_warden',
        next_defeat: 'death_screen',
      },

      post_warden: {
        id: 'post_warden',
        type: 'narrative',
        atmosphere: 'crypt',
        title: 'Through the Gate',
        text: `The Hollow Warden falls to one knee. The blue fire in its visor dims slowly, like an ember cooling. Whatever held it here — three hundred years of purpose, of cold duty — finally releases. The armor settles to the ground.\n\nSaria is quiet for a moment. "Aldric." She shakes her head. "Rest." She says it the way you'd say it to someone who's been working too long.\n\nThe catacombs open ahead. The air is different — less like a tomb, more like a room that hasn't been entered in a long time. You need a moment before the palace.`,
        choices: [
          { id: 'rest_briefly', text: 'Take a moment. Tend your wounds, catch your breath.', next: 'catacomb_rest', flag: ['rested_catacombs'], heal: 0.25 },
          { id: 'press_on_no_rest', text: 'Keep moving. The lich isn\'t resting.', next: 'catacomb_chapel' },
        ]
      },

      catacomb_rest: {
        id: 'catacomb_rest',
        type: 'narrative',
        atmosphere: 'crypt',
        title: 'The Brief Silence',
        text: `You sit in the dark of the catacombs and let the silence do what it does. Saria leans against the wall nearby, eyes open, watching the passage back.\n\n"I've been in this city for three years," she says quietly. "I've thought about leaving. But whoever came next would just..." She doesn't finish. "I told myself I was waiting for the right person. I think I was just waiting for anyone who'd actually stay long enough to see it through."\n\nThe rest helps. When you rise, your wounds have knitted somewhat, your focus sharpened.\n\nBelow, the catacombs open into something unexpected: a family chapel. Candles still burning. Paintings of a family that died with the kingdom. At the altar, a diary. The last entry is dated the night of the curse.`,
        choices: [
          { id: 'read_diary_rest', text: 'Open it. You want to know who you\'re about to kill.', next: 'varethis_origin', flag: ['knows_origin'] },
          { id: 'skip_diary_rest', text: 'Leave it. You came here to end something, not read someone\'s regrets.', next: 'throne_approach' },
        ]
      },

      catacomb_chapel: {
        id: 'catacomb_chapel',
        type: 'narrative',
        atmosphere: 'crypt',
        title: 'The Family Chapel',
        text: `Below, the catacombs open into something unexpected: a family chapel. Candles still burning. Paintings of a family that died with the kingdom. At the altar, a diary. The last entry is dated the night of the curse.`,
        choices: [
          { id: 'read_diary', text: 'Open it. You want to know who you\'re about to kill.', next: 'varethis_origin', flag: ['knows_origin'] },
          { id: 'skip_diary', text: 'Leave it. You came here to end something, not read someone\'s regrets.', next: 'throne_approach' },
        ]
      },

      varethis_origin: {
        id: 'varethis_origin',
        type: 'narrative',
        atmosphere: 'crypt',
        title: "The King's Diary",
        text: `The handwriting grows erratic near the end:\n\n*"Varethis was my court mage for twenty years. Twenty years of loyalty. He told me the phylactery ritual was the only way to save the kingdom from the plague. He said only a lich could keep the curse contained. I believed him. I gave him my blessing."\n\n"I understand now. The plague was his. The curse was always the point. Not to save us — to own us. I die tonight knowing that I handed the most beautiful kingdom in the world to a monster who wore the face of a friend."*\n\nThe candles flicker in a wind that doesn't exist.`,
        choices: [
          { id: 'honor_king', text: 'Set a coin on the altar. It\'s not much, but it\'s something.', next: 'throne_approach', flag: ['honored_dead'] },
          { id: 'move_on', text: 'Close the book. Nothing left to do here but end it.', next: 'throne_approach' },
        ]
      },

      throne_approach: {
        id: 'throne_approach',
        type: 'narrative',
        atmosphere: 'throne',
        title: 'The Palace',
        text: `The palace interior is pristine. Varethis keeps it that way. Tapestries of the royal family hang undisturbed, candles in their sconces trimmed and burning, floors swept clean. It smells of beeswax and cold stone — precise, maintained, dead. It is a museum. A mausoleum with excellent maintenance.\n\nAt the top of the grand stair, the throne room doors stand open. Inside, the lich waits on his throne of fused bones — the bones of those who challenged him and failed.\n\nHe is facing away when you enter. Then his head turns, deliberate and patient, and the violet fire in his sockets regards you.`,
        choices: [
          { id: 'challenge_varethis', text: 'Step forward. No preamble. End it.', next: 'combat_varethis', combatId: 'varethis' },
          { id: 'parley_varethis', text: '"Before this starts — what did you actually want? All those years ago."', next: 'varethis_speech' },
        ]
      },

      varethis_speech: {
        id: 'varethis_speech',
        type: 'narrative',
        atmosphere: 'throne',
        title: 'The Lich Speaks',
        text: `Varethis is quiet for a moment. Then:\n\n"What I wanted." His voice is dry parchment and old tombs. "I wanted to not die. I watched every person I loved rot into the earth. I found a solution. I applied it." He tilts his skull slightly. "The kingdom was... collateral. A resource. You understand resource management, I assume."\n\nHis violet gaze drifts past you — searching for the knight, if she followed you here.\n\n"You have brought one of the survivors." He stands from the throne, unhurried. "That is either very brave or very foolish. I have never decided which." A pause. "Shall we determine which it is together?"`,
        choices: [
          { id: 'fight_after_speech', text: 'No more words. Draw.', next: 'combat_varethis', combatId: 'varethis' },
        ]
      },

      combat_varethis: {
        id: 'combat_varethis',
        type: 'combat',
        bossId: 'varethis',
        atmosphere: 'throne',
        next_victory: 'post_varethis',
        next_defeat: 'death_screen',
      },

      post_varethis: {
        id: 'post_varethis',
        type: 'narrative',
        atmosphere: 'throne',
        title: 'The Silence After',
        text: `The violet light dies. Three phylactery shards clatter to the floor — shattered, inert. The throne room is silent. Then, from everywhere and nowhere, a sound like a long-held breath being released.\n\nOutside, through the high windows, the ash stops falling. You can see sky for the first time — grey still, but sky.\n\nSaria picks up the Ashen Scepter from beside the empty throne. It pulses once, gold, then goes still. She holds it out to you.\n\n"Take it. You earned it." She looks around the throne room. "We have to decide what to do with all of this. With them." She means the undead — thousands of them, aimless now that the lich's will is gone. "I think... I think they're just waiting to rest. I think they've always been waiting."`,
        flagText: {
          saria_ally: {
            missing: `The violet light dies. Three phylactery shards clatter to the floor — shattered, inert. The throne room fills with silence.\n\nOutside, through the high windows, the ash stops falling. You can see sky for the first time — grey still, but sky.\n\nThe Ashen Scepter lies beside the empty throne. It pulses once, gold, then goes still. You pick it up alone. The dead outside have already begun to slow, to drift. Without the lich's will anchoring them, there is nothing left for them to do. They begin to lie down — one by one, as if finally permitted.\n\nYou are the only living thing in a city-sized graveyard. The sky is getting lighter.`
          }
        },
        choices: [
          { id: 'destroy_throne', text: 'Raise the Scepter. Bring the whole thing down.', next: 'ending_destroy', flag: ['throne_destroyed'] },
          { id: 'take_throne', text: 'Sit down. Feel what it costs. Decide you can carry it.', next: 'ending_throne', flag: ['throne_taken'] },
        ]
      },

      ending_destroy: {
        id: 'ending_destroy',
        type: 'ending',
        atmosphere: 'throne',
        title: 'The Kingdom Released',
        text: `You shatter the Ashen Throne with the Scepter. The structure doesn't collapse — it dissolves, each bone returning to the earth it was taken from. The undead across the city stop, sigh, and lie down.\n\nBy morning, Valdris is empty. Truly empty. Just stone and silence and sky.\n\nSaria builds a cairn at the palace gate for Aldric. You leave the Scepter there too. Some things are better left behind.\n\nAs you walk out of the city, the ash does not follow you. The road ahead is long. But it is clear.`,
        xp: 5000,
        loot: 'boss',
        end: true,
      },

      ending_throne: {
        id: 'ending_throne',
        type: 'ending',
        atmosphere: 'throne',
        title: 'The Weight of Power',
        text: `You claim the throne. The moment you sit, you understand what it cost Varethis to make it. The weight of three hundred years of death presses against your mind. But it is manageable. You are not him.\n\nSaria watches. She doesn't speak for a long time.\n\n"You could do a lot of good with this," she says finally. "Or a lot of damage." She looks at you — not accusing. Measuring. "I'll stay. Someone should watch."`,
        xp: 5000,
        loot: 'boss',
        bonus: ['varethis_phylactery_shard'],
        end: true,
      },

      death_screen: {
        id: 'death_screen',
        type: 'death',
        text: 'The darkness takes you. But the dead have patience. And sometimes, the dead wake up.',
        end: true,
      }
    }
  },

  // ═══════════════════════════════════════════════
  {
    id: 'verdant_labyrinth',
    title: 'The Verdant Labyrinth',
    subtitle: 'Campaign II',
    tagline: 'The forest is alive. It has decided it no longer likes you.',
    description: 'Hired to find missing villagers in the Mirewood, you discover a forest where time moves wrong and something ancient and poisoned waits at its heart.',
    coverTheme: 'forest',
    difficulty: 'Hard',
    length: '~50 min',
    recommendedClasses: ['druid', 'ranger', 'cleric', 'barbarian'],
    openingArt: 'verdant_labyrinth',
    scenes: {
      start: {
        id: 'start',
        type: 'narrative',
        atmosphere: 'forest',
        title: 'The Mirewood',
        text: `The treeline is wrong from twenty feet away. The moment you step past the first old oak, the village sounds cut off — not gradually, instantly, like a door closing behind you. The birdsong inside is off-key. The trees are too close together and somehow too far apart.\n\nYou find the first sign within minutes: a village woman's shawl, clean and dry despite the wet grass, hanging from a branch at exactly eye height. As if placed there. As if a door.\n\nA figure steps from behind a tree. A boy, ten or eleven. He's wearing leaves woven into his hair and he stares at you with the eyes of someone who has been here too long.\n\n"You shouldn't come in," he says. "But you won't be able to leave either way."`,
        choices: [
          { id: 'ask_boy', text: '"Are you from the village? How long have you been in here?"', next: 'boy_lore', flag: ['met_boy'] },
          { id: 'comfort_boy', text: 'Crouch down to his level. "I\'m going to get everyone out. That includes you."', next: 'boy_trust', flag: ['boy_trusts'] },
          { id: 'press_forward', text: 'Not your problem right now. "Move. I need to find the missing."', next: 'forest_alone' },
        ]
      },

      boy_lore: {
        id: 'boy_lore',
        type: 'narrative',
        atmosphere: 'forest',
        title: 'The Boy in the Trees',
        text: `"Ewin." He doesn't move from his position. "I came with my father to gather mushrooms. That was..." He frowns, genuinely confused. "I don't know how long ago. The light doesn't change here. I think some of the others are further in. The ones who were already here before us."\n\nHe tilts his head. "The Heartroot speaks. Not in words. But if you listen long enough, you start to understand. It's sick. It's so sick and it can't tell anyone." He looks at you with too much knowledge in a child's face. "You might be able to help. Or you might make it worse. It doesn't know the difference anymore."`,
        choices: [
          { id: 'ask_heartroot', text: '"The Heartroot. What is it?"', next: 'heartroot_explained' },
          { id: 'find_missing', text: '"The others — where are they?"', next: 'missing_camp', flag: ['found_missing'] },
        ]
      },

      boy_trust: {
        id: 'boy_trust',
        type: 'narrative',
        atmosphere: 'forest',
        title: 'A Small Trust',
        text: `Ewin considers you carefully. Then he nods once.\n\n"There are twelve others from the village deeper in. They built a kind of camp — the forest lets them. They're not hurt." He pauses. "Yet. The Thornwarden is getting closer to their camp. It used to only go toward things that threaten the Heartroot. Now it goes toward anything that breathes."\n\nHe points deeper into the trees. "The Heartroot is at the center. If you want to stop this, that's where you need to go. The Thornwarden guards the last approach."`,
        choices: [
          { id: 'go_to_heartroot', text: 'Go straight to the center. That\'s where this ends.', next: 'thornwarden_approach' },
          { id: 'check_camp', text: 'Find the missing people first. Make sure they\'re safe.', next: 'missing_camp', flag: ['checked_camp'] },
        ]
      },

      heartroot_explained: {
        id: 'heartroot_explained',
        type: 'narrative',
        atmosphere: 'forest',
        title: 'The Ancient Thing',
        text: `"The forest has a center. It always has. Ancient trees have hearts like animals, and when enough of them grow together long enough..." Ewin's voice sounds older than it should. "The Heartroot is the will of the whole Mirewood. It's been here since before people had words for time."\n\nHe pulls a leaf from his hair and stares at it. "Something got into the water. Something from very deep underground — old magic that shouldn't be surface magic. It's poisoning the Heartroot. The Thornwarden is... the forest's immune response. Except the infection is invisible so it's attacking everything visible instead."`,
        choices: [
          { id: 'go_thornwarden', text: 'You\'ve heard enough. Go.', next: 'thornwarden_approach' },
        ]
      },

      forest_alone: {
        id: 'forest_alone',
        type: 'narrative',
        atmosphere: 'forest',
        title: 'The Deep Wood',
        text: `The boy doesn't follow. The forest swallows the path behind you.\n\nYou walk for what feels like an hour, finding the same clearing four times. Each repetition is slightly wrong — a fallen branch in a different position, the light filtering from a different angle. The forest is thinking about you. Trying to decide what you are.\n\nYou find a clearing full of stopped birds. They are mid-flight, wing-locked, perfectly still. As you pass through, one turns its head to look at you. Just one.\n\nThen the trees thin. A wide space opens — something that feels like the center of everything wrong here. The Thornwarden stands with its back to the black pool at the heart of the clearing. Its bark-and-corruption form registers you immediately. No hesitation. The infected thing it has become doesn't hesitate anymore.`,
        choices: [
          { id: 'face_thornwarden_alone', text: 'Stand your ground. It\'s already seen you.', next: 'combat_thornwarden', combatId: 'thornwarden' },
        ]
      },

      missing_camp: {
        id: 'missing_camp',
        type: 'narrative',
        atmosphere: 'forest',
        title: 'The Lost Villagers',
        text: `The camp is circular — the villagers arranged themselves back-to-back by instinct. Twelve people, ranging from a grandmother to a toddler who seems delighted with the whole situation. They\'re hungry but not hurt. The forest has been providing water.\n\n"It won't let us leave," an elderly farmer explains. "Every path leads back. But it hasn\'t touched us either. I think..." He chews his lip. "I think it's confused. Like it lost the rules."`,
        choices: [
          { id: 'reassure_villagers', text: 'Tell them to stay put. "I\'m ending this. Don\'t move."', next: 'thornwarden_approach', flag: ['villagers_reassured'] },
          { id: 'hurry', text: 'No time. Leave them and keep moving.', next: 'thornwarden_approach' },
        ]
      },

      thornwarden_approach: {
        id: 'thornwarden_approach',
        type: 'narrative',
        atmosphere: 'forest',
        title: 'The Guardian',
        text: `The Thornwarden clearing is unmistakable — every tree around it is dead or dying, their vitality drained toward something that shouldn't exist at their roots. The Thornwarden itself is terrible and vast. Bark split by crimson veins. Eyes like wounds in wood.\n\nIt turns its enormous head toward you. Something in its posture suggests it remembers being gentle. It moves anyway.`,
        choices: [
          { id: 'fight_thornwarden', text: 'Engage the Thornwarden.', next: 'combat_thornwarden', combatId: 'thornwarden' },
          { id: 'try_to_speak', text: 'Try to reach what\'s left of its original self.', next: 'thornwarden_plea' },
        ]
      },

      thornwarden_plea: {
        id: 'thornwarden_plea',
        type: 'narrative',
        atmosphere: 'forest',
        title: 'Speak to the Forest',
        text: `You speak to it directly. To whatever it was. The Thornwarden stops advancing. Something flickers in the wound-eyes. Then the crimson veins pulse once, hard, and it surges forward.\n\nThere's not enough left to hear you. But for a moment, it hesitated. That might mean something, if you survive.`,
        choices: [
          { id: 'fight_now', text: 'Fight.', next: 'combat_thornwarden', combatId: 'thornwarden' },
        ]
      },

      combat_thornwarden: {
        id: 'combat_thornwarden',
        type: 'combat',
        bossId: 'thornwarden',
        atmosphere: 'forest',
        next_victory: 'post_thornwarden',
        next_defeat: 'death_screen',
      },

      post_thornwarden: {
        id: 'post_thornwarden',
        type: 'narrative',
        atmosphere: 'heartroot',
        title: 'After the Thornwarden',
        text: `Beyond the Thornwarden's clearing, the trees grow younger. Then older. Then young again. Time does not work here. But the path is clear and the air smells clean for the first time since you entered the Mirewood.\n\nEwin appears, as if the forest carried him. He looks at the Thornwarden's still form with an expression too old for his face.\n\n"You can rest here. The corruption hasn't reached this stretch yet." He sits among the roots of an old oak. "She used to sing. The whole forest would go quiet when she did." He pauses. "I think it still does. Even now. Even like this."`,
        choices: [
          { id: 'rest_before_sylvanax', text: 'Sit for a moment. Let the quieter part of the forest do its work.', next: 'heartroot_approach', flag: ['rested_mirewood'], heal: 0.25 },
          { id: 'press_to_heartroot', text: 'No time. Move on while the path is clear.', next: 'heartroot_approach' },
        ]
      },

      heartroot_approach: {
        id: 'heartroot_approach',
        type: 'narrative',
        atmosphere: 'heartroot',
        title: 'The Heart of the Forest',
        text: `The Heartroot clearing is a cathedral. Ancient oaks arch a hundred feet overhead, forming a nave of living wood. At the center is a pool of black water — and above it, the form of Sylvanax.\n\nShe was beautiful once. That's still visible. Through the corruption, through the way her form ripples between human and bark and void, you can see what she was meant to be.\n\n"Another comes," she says. Her voice is the sound of a tree falling in a forest where everyone is listening. "To help or to end it. I can no longer tell the difference between those two things."`,
        choices: [
          { id: 'offer_to_cleanse', text: '"I can try to cleanse the infection. I\'m not leaving until I do."', next: 'sylvanax_trust', flag: ['offered_cleanse'] },
          { id: 'prepare_to_fight', text: '"I don\'t know if there\'s enough left of you to save. But I have to try."', next: 'combat_sylvanax', combatId: 'sylvanax' },
          { id: 'warn_burn', text: '"If I can\'t cleanse you, I\'ll burn the forest. Mercy.', next: 'sylvanax_warning', flag: ['burn_threat'] },
        ]
      },

      sylvanax_trust: {
        id: 'sylvanax_trust',
        type: 'narrative',
        atmosphere: 'heartroot',
        title: 'An Ancient Bargain',
        text: `Something in Sylvanax shifts. Not hope — she is past hope. But perhaps recognition. "Then come. If you mean what you say, the corruption will be clear to you. It runs through my core — the black pool. It must be drawn out through contest. Through struggle."\n\nShe turns away from you. "But I must warn you: what I am becoming has no patience for what I was. If it overwhelms me before you can help..." She looks back. "Fight me. And know that whatever I do to you, I am sorry for it."`,
        choices: [
          { id: 'fight_with_intent', text: 'Enter combat with the intention of saving her.', next: 'combat_sylvanax', combatId: 'sylvanax' },
        ]
      },

      sylvanax_warning: {
        id: 'sylvanax_warning',
        type: 'narrative',
        atmosphere: 'heartroot',
        title: 'An Ultimatum',
        text: `Sylvanax goes very still. Then she laughs — and it sounds like timber cracking.\n\n"You would burn a living god." The corruption surges through her. "Then you are as much an invader as the poison itself." She rises to her full height, bark hardening, roots tearing.\n\n"Show me, then, what you're worth."`,
        choices: [
          { id: 'fight_burn', text: 'Fight her — and keep that option open.', next: 'combat_sylvanax', combatId: 'sylvanax' },
        ]
      },

      combat_sylvanax: {
        id: 'combat_sylvanax',
        type: 'combat',
        bossId: 'sylvanax',
        atmosphere: 'heartroot',
        next_victory: 'post_sylvanax',
        next_defeat: 'death_screen',
      },

      post_sylvanax: {
        id: 'post_sylvanax',
        type: 'narrative',
        atmosphere: 'heartroot',
        title: 'The Choice',
        text: `Sylvanax\'s essence — the silver-green orb — orbits you slowly. The voice in your mind is exhausted. Ancient. Grateful.\n\n"The poison is exposed. My roots can absorb it now, if you help me draw it out. But it will take everything I have. I will become dormant. The forest will be... quiet, for a long time. Perhaps forever." A pause. "Or you can burn it out. The infection and me both. The forest will survive, without me. It will be ordinary. Safe. But I will be gone."\n\nEwin appears at the edge of the clearing. He sits in the roots and waits to see what you do.`,
        choices: [
          { id: 'cleanse', text: 'Help Sylvanax draw out the poison. Accept the slow path.', next: 'ending_cleanse', flag: ['forest_cleansed'] },
          { id: 'burn', text: 'Burn the black pool. End the infection quickly. End everything quickly.', next: 'ending_burn', flag: ['forest_burned'] },
        ]
      },

      ending_cleanse: {
        id: 'ending_cleanse',
        type: 'ending',
        atmosphere: 'heartroot',
        title: 'The Long Healing',
        text: `It takes three hours. The black water retreats. Sylvanax becomes quieter and quieter, until the orb dims to a steady, peaceful glow and sinks into the roots of the great tree at the center of the clearing.\n\nThe forest shifts. The wrongness bleeds away. Time begins moving correctly again. The paths straighten.\n\nEwin leads the villagers out. The forest lets them go. As you leave, a single white flower blooms on the old oak at the treeline — out of season, impossible, and exactly right.\n\nSylvanax will sleep for a long time. But she will wake.`,
        xp: 5500,
        loot: 'boss',
        end: true,
      },

      ending_burn: {
        id: 'ending_burn',
        type: 'ending',
        atmosphere: 'heartroot',
        title: 'The Ash and the Ordinary',
        text: `The fire is clean and fast. The black pool burns with a green-black flame that smells like sick things being cured. Sylvanax doesn't cry out.\n\nThe forest dims. The wrongness dissolves. The trees remain, ordinary and familiar. The paths straighten. The missing villagers walk out dazed but whole.\n\nThere are no flowers. There is no silver light. The forest is just a forest now.\n\nEwin doesn't speak to you on the way out.`,
        xp: 4000,
        loot: 'boss',
        end: true,
      },

      death_screen: {
        id: 'death_screen',
        type: 'death',
        text: 'The forest takes you. Time passes strangely here. Eventually, it might give you back.',
        end: true,
      }
    }
  },

  // ═══════════════════════════════════════════════
  {
    id: 'shattered_spire',
    title: 'The Shattered Spire',
    subtitle: 'Campaign III',
    tagline: 'Reality is a suggestion. The Architect is done suggesting.',
    description: 'A wizard\'s tower shattered across three planes. You must enter to retrieve a stolen relic — and find yourself caught in a web of fractured timelines where every choice echoes.',
    coverTheme: 'void',
    difficulty: 'Brutal',
    length: '~60 min',
    recommendedClasses: ['wizard', 'sorcerer', 'warlock', 'artificer'],
    openingArt: 'shattered_spire',
    scenes: {
      start: {
        id: 'start',
        type: 'narrative',
        atmosphere: 'fractured',
        title: 'The Fractured Tower',
        text: `The Spire of Ivelion doesn\'t cast a shadow. It casts three, in different directions, none of which correspond to the position of the sun. The tower itself is intact, except for the way it seems to exist in several places at once — your eye slides off it if you look directly and catches it better in peripheral vision.\n\nYou were hired to retrieve the Tessellation Crystal, a navigational relic that the scholar Ivelion allegedly stole from your employer. Reportedly, Ivelion has become... less than he was. More than he was. Something has happened to him in that tower.\n\nThe door opens before you touch it.`,
        choices: [
          { id: 'enter_cautious', text: 'Enter carefully. Weapon ready.', next: 'first_floor', flag: ['cautious_entry'] },
          { id: 'enter_bold', text: 'Walk in. You\'ve entered worse places.', next: 'first_floor' },
          { id: 'examine_exterior', text: 'Study the exterior. Learn what you\'re walking into.', next: 'exterior_study', flag: ['studied_exterior'] },
        ]
      },

      exterior_study: {
        id: 'exterior_study',
        type: 'narrative',
        atmosphere: 'fractured',
        title: 'What the Tower Shows',
        text: `The three shadows move independently. Watching them, you can make out that they correspond to different times of day — early morning, midday, and dusk. Three times existing simultaneously at the same point in space.\n\nThere are three doors visible on the exterior. Two of them are not actually there when you move toward them — but for a moment, you could have sworn you saw yourself standing in one of the doorways, looking back.`,
        choices: [
          { id: 'enter_main', text: 'Enter the central door.', next: 'first_floor' },
        ]
      },

      first_floor: {
        id: 'first_floor',
        type: 'narrative',
        atmosphere: 'fractured',
        title: 'The Antechamber',
        text: `The interior is larger than the exterior. That's rule one of the Spire. The antechamber is the size of a cathedral, with bookshelves that extend upward past where the ceiling should be, into a haze of floating pages.\n\nThere are three paths upward: a staircase of stone, one of glass, one of wood. Each seems to lead to a different version of the same next floor.\n\nA small figure sits cross-legged in the center of the room. A construct — a metal clockwork owl with one eye replaced by a crystal lens. It opens its crystal eye and regards you.\n\n"You are approximately sixteen minutes late," it says. "All three versions of you."`,
        choices: [
          { id: 'ask_construct', text: '"What do you mean, three versions?"', next: 'construct_explains' },
          { id: 'stone_stair', text: 'Take the stone staircase.', next: 'timeline_alpha', flag: ['took_stone'] },
          { id: 'glass_stair', text: 'Take the glass staircase.', next: 'timeline_beta', flag: ['took_glass'] },
          { id: 'wood_stair', text: 'Take the wood staircase.', next: 'timeline_gamma', flag: ['took_wood'] },
        ]
      },

      construct_explains: {
        id: 'construct_explains',
        type: 'narrative',
        atmosphere: 'fractured',
        title: 'The Clockwork Owl',
        text: `"When the Master conducted his final experiment, the Spire shattered across three temporal planes," the construct says. "This antechamber sits at the nexus. The three staircases lead to the three concurrent versions of the tower, each at a different point in time."\n\nIts crystal eye rotates. "The stone stair leads to the tower as it was when the Master was still human. The glass stair leads to the moment of fracture. The wood stair leads to what the Master has become."\n\n"The Crystal you seek is somewhere in the nexus of all three. To reach it, you must pass through all three planes. Sequentially or simultaneously — the tower does not distinguish."`,
        choices: [
          { id: 'take_stone', text: 'Stone stair first. Start at the beginning.', next: 'timeline_alpha', flag: ['construct_briefed'] },
          { id: 'take_glass', text: 'Glass stair. See the moment it broke.', next: 'timeline_beta', flag: ['construct_briefed'] },
          { id: 'take_wood', text: 'Wood stair. See what he\'s become.', next: 'timeline_gamma', flag: ['construct_briefed'] },
        ]
      },

      timeline_gamma: {
        id: 'timeline_gamma',
        type: 'narrative',
        atmosphere: 'void',
        title: 'The Tower as It Is Now',
        text: `The wood stair leads to what might be called the present — except the present here is not what you recognize as present. The floor is half-real. The walls breathe. The bookshelves contain books that have not been written yet, their spines labeled in languages that don't exist.\n\nIvelion's desk is here. He is not. But his notes are open, written in two handwritings simultaneously — one precise and academic, one spiraling and vast, occupying the margins in every direction:\n\n*"The void does not want. This is the crucial misunderstanding. It does not want anything from me. It is simply — through me — looking at the world. And I am looking back. This is called mutual comprehension. I am the first.*\n\n*The Crystal keeps the timelines from collapsing entirely. If it is removed, the fracture becomes permanent. If it remains, so do I. I do not know if remaining is what I want.*\n\n*I have been writing this note for four years. I finished it three years ago."*\n\nThe void eye on the wall — painted, but somehow not — blinks once.`,
        choices: [
          { id: 'take_void_note', text: 'Pocket the dual-written note. Continue to the mirror floor.', next: 'mirror_floor', flag: ['understands_void'] },
          { id: 'keep_moving_gamma', text: 'Keep ascending. You have enough pieces of this.', next: 'mirror_floor' },
        ]
      },

      timeline_alpha: {
        id: 'timeline_alpha',
        type: 'narrative',
        atmosphere: 'fractured',
        title: 'The Tower As It Was',
        text: `The stone stair leads to a floor that exists in the past. Warm. Cluttered with the working detritus of a scholar — half-finished experiments, scattered notes, an astrolabe still spinning. Through the window, it's early morning. The view is of a landscape that no longer exists.\n\nIn the notes, scattered across the floor, you piece together the sequence: Ivelion was conducting a planar navigation experiment. The Crystal was a component — not stolen, used. And something came back through the aperture with him. Something that found his mind delicious.`,
        choices: [
          { id: 'take_notes', text: 'Take the research notes. They might matter later.', next: 'mirror_floor', flag: ['has_notes'] },
          { id: 'press_on', text: 'Keep moving upward.', next: 'mirror_floor' },
        ]
      },

      timeline_beta: {
        id: 'timeline_beta',
        type: 'narrative',
        atmosphere: 'fractured',
        title: 'The Moment of Fracture',
        text: `The glass stair leads to the moment of the experiment itself, frozen mid-catastrophe. Tables have lifted into the air and stay there. A spell is forever halfway cast, its syllables hanging as frozen light. Ivelion himself is here — or was — the glass-plane version of him, arms outstretched, his face halfway between terror and wonder.\n\nHe can\'t see you. You are a ghost in this moment. But you can read his expression: he knows what\'s happening. He chose to let it happen.\n\nFrom a frozen midair notebook, a page falls and unfreezes at your feet: "If the fracture succeeds, I will understand everything. If it doesn't succeed, I will understand everything anyway. I am no longer afraid of what I'm becoming."`,
        choices: [
          { id: 'took_frozen_page', text: 'Pocket the fallen page. Continue upward.', next: 'mirror_floor', flag: ['has_frozen_page'] },
          { id: 'continue_up', text: 'Keep ascending.', next: 'mirror_floor' },
        ]
      },

      mirror_floor: {
        id: 'mirror_floor',
        type: 'narrative',
        atmosphere: 'fractured',
        title: 'The Hall of Mirrors',
        text: `The three timelines converge at a floor covered in mirrors — not reflective ones. Each shows a different version of the space you're standing in. In one, it's ruins. In another, a library in full operation. In a third, nothing — just void.\n\nIf you passed through the stone stair: you know what came through the aperture with Ivelion — something that found his mind useful. If you came straight here: you catch a fragment from a loose page drifting down: "...something came back through with me. It is not malevolent. It is simply through me now..." The page dissolves when you try to hold it.\n\nIn the center, one mirror shows you your own reflection. But your reflection takes a step toward you independently.\n\nIt steps out of the mirror. Your face. Your weapons. Your posture. The only difference: where your eyes have something behind them, its eyes are empty.\n\n"The Architect wants to know if you're worth keeping," it says. "I'm the test."`,
        choices: [
          { id: 'fight_echo', text: 'Fight your Echo.', next: 'combat_echo', combatId: 'the_echo' },
          { id: 'try_reasoning', text: '"I know what you are. There\'s nothing to fight about."', next: 'echo_reasoning' },
        ]
      },

      echo_reasoning: {
        id: 'echo_reasoning',
        type: 'narrative',
        atmosphere: 'fractured',
        title: 'Speaking to the Echo',
        text: `The Echo tilts its head. Your head, your angle. "Interesting." It steps back. "Most try to fight. You understand that fighting yourself is counterproductive." It moves to one side, giving you a clear path. "The Architect will find this data point significant." A pause. "Also: your left guard is weak. You\'ve always known. I wanted you to know I know too."\n\nIt steps back into the mirror.`,
        choices: [
          { id: 'continue_after_echo', text: 'Continue to the apex.', next: 'architect_approach', flag: ['passed_echo_peacefully'] },
        ]
      },

      combat_echo: {
        id: 'combat_echo',
        type: 'combat',
        bossId: 'the_echo',
        atmosphere: 'fractured',
        next_victory: 'post_echo',
        next_defeat: 'death_screen',
      },

      post_echo: {
        id: 'post_echo',
        type: 'narrative',
        atmosphere: 'fractured',
        title: 'Alone Again',
        text: `The Echo dissolves into shadow and silence. The mirror where it emerged now shows nothing — a permanent black window. Somehow that feels more disturbing than if it had shattered.\n\nYou continue upward. The stairs become geometric, non-Euclidean. You arrive at the top floor before you've walked enough stairs to get there.`,
        choices: [
          { id: 'enter_architect', text: 'Enter the apex chamber.', next: 'architect_approach' },
        ]
      },

      architect_approach: {
        id: 'architect_approach',
        type: 'narrative',
        atmosphere: 'void',
        title: 'The Architect\'s Study',
        text: `He is exactly as described. An old man at a desk, writing by the light of a candle that produces black flame. The Tessellation Crystal sits in a bracket on the desk, rotating slowly.\n\nHe doesn't look up immediately. His quill scratches.\n\n"I knew you were coming," he says. "I know everything that happens in seventeen simultaneous timestreams. The question is never what will happen — it's whether I care to change it." He looks up. The void eye opens. "You've been through my library, my memories, and my Echo. You know enough to be dangerous." He stands. "So. What would you like to discuss before we determine how this ends?"`,
        flagText: {
          passed_echo_peacefully: {
            set: `He is exactly as described. An old man at a desk, writing by the light of a candle that produces black flame. The Tessellation Crystal sits in a bracket on the desk, rotating slowly.\n\nHe doesn't look up immediately. His quill scratches.\n\n"I knew you were coming," he says. "I know everything that happens in seventeen simultaneous timestreams. The question is never what will happen — it's whether I care to change it." He looks up. The void eye opens. "You've been through my library, my memories, and my Echo. You know enough to be dangerous."\n\nHe pauses. The quill stills — a thing you notice he has not done since you entered. "In eleven of my projections, you fought it. You didn't." He sets the quill down. "That was not modeled." The void eye narrows with something that might be respect.\n\nHe stands. "So. What would you like to discuss before we determine how this ends?"`
          }
        },
        choices: [
          { id: 'demand_crystal', text: '"Give me the Crystal and I leave."', next: 'architect_refuses' },
          { id: 'ask_about_void', text: '"What is consuming you? Can it be stopped?"', next: 'architect_reveals' },
          { id: 'attack_immediately', text: 'No talking. Attack while he\'s still explaining.', next: 'combat_architect', combatId: 'the_architect' },
        ]
      },

      architect_refuses: {
        id: 'architect_refuses',
        type: 'narrative',
        atmosphere: 'void',
        title: 'The Refusal',
        text: `He sets the Crystal down with the care of a man handling something alive.\n\n"No." A pause. The void eye opens — the real one, the one that shouldn't exist in a human face. It looks at you with something that is not quite sight. "The Crystal is load-bearing now. Remove it without understanding the structure it supports and the Spire doesn't fracture — it inverts. Everything inside becomes outside." He tilts his head. "Including you."\n\nHe picks up his quill. "You walked through my tower. You have seen things. Ask what you actually came here to ask."`,
        choices: [
          { id: 'ask_better', text: '"Then tell me what you\'ve become."', next: 'architect_reveals' },
          { id: 'fight_architect', text: 'Fight him anyway.', next: 'combat_architect', combatId: 'the_architect' },
        ]
      },

      architect_reveals: {
        id: 'architect_reveals',
        type: 'narrative',
        atmosphere: 'void',
        title: 'What the Void Is',
        text: `The Architect sets his quill down with infinite care.\n\n"I reached through a planar aperture and something reached back." He's quiet for a moment. "It is not malevolent. It simply is. It is the concept of unmaking — the entropic force between planes. It found in me something interesting. A mind that could contain it. Most minds shatter." He turns his void eye toward you. "It's been two years. I'm still here. I'm still me." A pause. "Less of me. But more of... everything else."\n\nHe picks up the Crystal. "If you want this back, you'll have to take it. I won't give it freely — the void wants to see how you fight. And frankly, so do I."`,
        choices: [
          { id: 'fight_understanding', text: 'Fight him — with the knowledge of what he is.', next: 'combat_architect', combatId: 'the_architect', flag: ['understands_architect'] },
        ]
      },

      combat_architect: {
        id: 'combat_architect',
        type: 'combat',
        bossId: 'the_architect',
        atmosphere: 'void',
        next_victory: 'post_architect',
        next_defeat: 'death_screen',
      },

      post_architect: {
        id: 'post_architect',
        type: 'narrative',
        atmosphere: 'void',
        title: 'The Choice of Timelines',
        text: `The Architect\'s geometric form collapses. What remains is the old man, sitting on the floor, looking more himself than he has in years. The Crystal is on the floor between you, still spinning.\n\n"Well." He sounds surprised. "I didn't model that outcome." He touches his face — both eyes, including the void one. "I'm still here. More here than I've been since—" He stops. "The Spire will stabilize now. The three timelines will converge.\n\nBut the void doesn't go without a cost. Either the timelines merge and I lose the memories of everything I learned — or they stay fractured and the power remains, but nothing is ever quite real again."\n\nHe looks at you. "I don\'t think I should be the one to decide that."`,
        choices: [
          { id: 'merge_timelines', text: 'Merge the timelines. Stability over power.', next: 'ending_merge', flag: ['timelines_merged'] },
          { id: 'keep_fractured', text: 'Keep them fractured. Knowledge shouldn\'t be destroyed.', next: 'ending_fractured', flag: ['timelines_fractured'] },
        ]
      },

      ending_merge: {
        id: 'ending_merge',
        type: 'ending',
        atmosphere: 'void',
        title: 'The Single World',
        text: `The three timelines collapse into one. The Spire shudders, groans, and settles. Its three shadows become one. The floating pages drift to the floor. Time flows in one direction again.\n\nIvelion sits in his study with the expression of a man who has forgotten a dream he knew was important. "I know something happened," he says quietly. "I know I understood something vast. I can't—" He presses his hand to his temple. "Gone."\n\nHe picks up the Crystal and hands it to you without being asked. "I don\'t know what you did. But it feels like breathing again."`,
        xp: 6000,
        loot: 'boss',
        end: true,
      },

      ending_fractured: {
        id: 'ending_fractured',
        type: 'ending',
        atmosphere: 'void',
        title: 'The Fracture Remains',
        text: `The timelines stay separate. The Spire\'s three shadows remain. The Crystal duplicates itself — one for Ivelion, one for you. Your copy has a slightly different weight than it should, as though it exists in three places at once.\n\n"You've kept the fracture open," Ivelion says. He doesn\'t sound displeased. "That\'s either wisdom or the best kind of foolishness." He studies you. "The power will bleed through. Into you. Into the places you walk. Things will be slightly... unreliable around you."\n\nHe smiles. It's the first human thing you've seen from him. "Welcome to my world."`,
        xp: 5000,
        loot: 'boss',
        bonus: ['architects_wand'],
        end: true,
      },

      death_screen: {
        id: 'death_screen',
        type: 'death',
        text: 'The fracture claims you. Somewhere in another timeline, you survived. But not this one.',
        end: true,
      }
    }
  }
]

export function getCampaign(id) {
  return CAMPAIGNS.find(c => c.id === id)
}

export function getScene(campaign, sceneId) {
  return campaign.scenes[sceneId]
}
