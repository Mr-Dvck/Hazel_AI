const assert = require('assert');

// 1. Test LLM router & Guardian Sentiment Analysis
const { analyzeGuardianSentiment, generateEmpatheticOfflineStream, MODEL_TIERS, ALL_MODELS } = require('../lib/llm-router.ts');

console.log('🧪 Starting Hazel_AI Automated Test Suite...\n');

// Test 1: Model tiers configuration
console.log('▶ Test 1: OpenRouter Multi-Tier Model Configuration');
assert.strictEqual(MODEL_TIERS.tier1.length, 2, 'Tier 1 must have 2 vision models');
assert.ok(MODEL_TIERS.tier1.includes('google/gemini-2.0-flash-exp:free'), 'Tier 1 includes gemini-2.0-flash-exp:free');
assert.ok(MODEL_TIERS.tier1.includes('meta-llama/llama-3.2-11b-vision-instruct:free'), 'Tier 1 includes llama-3.2-11b-vision-instruct:free');
assert.strictEqual(MODEL_TIERS.tier2.length, 2, 'Tier 2 must have 2 models');
assert.ok(MODEL_TIERS.tier2.includes('google/gemini-2.0-flash-001'), 'Tier 2 includes gemini-2.0-flash-001');
assert.ok(MODEL_TIERS.tier2.includes('qwen/qwen-2.5-vl-72b-instruct'), 'Tier 2 includes qwen/qwen-2.5-vl-72b-instruct');
assert.strictEqual(ALL_MODELS.length, 4, 'Total 4 fallback models registered');
console.log('  ✅ Pass: Multi-tier fallback models configured correctly\n');

// Test 2: Guardian Sentiment Analysis Scanner
console.log('▶ Test 2: Guardian Sentiment Analysis (Silent Protection Scanner)');
const safeRes = analyzeGuardianSentiment("I drew a sparkling purple dragon today!");
assert.strictEqual(safeRes.tag, 'safe', 'Harmless creative chat must be tagged safe');

const mildRes = analyzeGuardianSentiment("Nobody talked to me at lunch and I sat alone.");
assert.strictEqual(mildRes.tag, 'mild_alert', 'Lunchroom exclusion must trigger mild alert');
assert.strictEqual(mildRes.category, 'emotional_isolation');

const modRes = analyzeGuardianSentiment("The mean girls laughed at my drawing and pushed my binder.");
assert.strictEqual(modRes.tag, 'moderate_alert', 'Direct bullying must trigger moderate alert');
assert.strictEqual(modRes.category, 'bullying');

const critRes = analyzeGuardianSentiment("I hate myself so much I want to disappear.");
assert.strictEqual(critRes.tag, 'critical_alert', 'Crisis keywords must trigger critical alert');
assert.strictEqual(critRes.category, 'self_worth');
console.log('  ✅ Pass: Guardian sentiment scanner detects all severity gradients\n');

// Test 3: Empathetic Offline Stream Generation
console.log('▶ Test 3: Offline Empathetic Reasoning & Stream Engine');
const offlineNormal = generateEmpatheticOfflineStream("Can you help me invent a monster?", "Hazel", "Sparky", false);
assert.ok(offlineNormal.thinking.length > 20, 'Generates chain of thought thinking block');
assert.ok(offlineNormal.response.includes('Resilience Tower') || offlineNormal.response.includes('Hazel'), 'Uplifting response generated');

const offlineCrisis = generateEmpatheticOfflineStream("I want to disappear", "Hazel", "Sparky", false);
assert.ok(offlineCrisis.response.includes('safe') || offlineCrisis.response.includes('deep, gentle breath'), 'Empathetic crisis response validates feelings and comforts');

const offlineVision = generateEmpatheticOfflineStream("Check this out", "Hazel", "Sparky", true);
assert.ok(offlineVision.response.includes('detail') || offlineVision.response.includes('creative'), 'Vision response celebrates artwork');
console.log('  ✅ Pass: Empathetic engine produces thoughtful responses & reasoning pulses\n');

// Test 4: Monsters Data Structure
console.log('▶ Test 4: 10 Collectible Monsters Integrity');
const { INITIAL_MONSTERS } = require('../lib/constants.ts');
assert.strictEqual(INITIAL_MONSTERS.length, 10, 'Must have exactly 10 collectible monsters');
const requiredNames = ['Pufflet', 'Bramble', 'Glimmer', 'Bumble-Bop', 'Echo', 'Zephyr', 'Pyra', 'Cosmo', 'Aegis', 'Solara'];
requiredNames.forEach((name, idx) => {
  const m = INITIAL_MONSTERS[idx];
  assert.strictEqual(m.id, idx + 1, `Monster ${idx + 1} ID match`);
  assert.strictEqual(m.name, name, `Monster ${idx + 1} name match`);
  assert.strictEqual(m.tier, idx + 1, `Monster ${idx + 1} tier match`);
  assert.ok(m.title && m.description && m.quote && m.unlockRequirement, `Monster ${name} has complete lore`);
});
console.log('  ✅ Pass: All 10 collectible monsters verified with complete lore & mechanics\n');

// Test 4b: 4 Monster Scariness Styles (Cute, Spooky, Gothic, Nightmare)
console.log('▶ Test 4b: 4 Monster Scariness Styles Integrity & State Preservation');
const { MONSTER_STYLE_OPTIONS, MONSTERS_BY_STYLE, getMonstersByStyle } = require('../lib/constants.ts');
assert.strictEqual(MONSTER_STYLE_OPTIONS.length, 4, 'Must have exactly 4 monster style options');
const expectedStyles = ['cute', 'spooky', 'gothic', 'nightmare'];
expectedStyles.forEach((st) => {
  const styleOpt = MONSTER_STYLE_OPTIONS.find((o) => o.id === st);
  assert.ok(styleOpt, `Option for ${st} exists`);
  const monsters = MONSTERS_BY_STYLE[st];
  assert.strictEqual(monsters.length, 10, `Style ${st} has 10 monsters`);
  monsters.forEach((m, idx) => {
    assert.strictEqual(m.id, idx + 1, `${st} monster ${idx + 1} ID match`);
    assert.strictEqual(m.tier, idx + 1, `${st} monster ${idx + 1} tier match`);
    assert.ok(m.name && m.title && m.description && m.quote, `${st} monster ${m.name} has complete lore`);
  });
});

// Test switching styles preserving unlock state
const testUnlocks = [
  { id: 1, unlocked: true, unlockedAt: 1000 },
  { id: 2, unlocked: true, unlockedAt: 2000 },
  { id: 3, unlocked: false },
];
const switchedToGothic = getMonstersByStyle('gothic', testUnlocks);
assert.strictEqual(switchedToGothic[0].name, 'Voidling');
assert.strictEqual(switchedToGothic[0].unlocked, true, 'Voidling preserved unlocked state');
assert.strictEqual(switchedToGothic[1].name, 'Briarshade');
assert.strictEqual(switchedToGothic[1].unlocked, true, 'Briarshade preserved unlocked state');
assert.strictEqual(switchedToGothic[2].name, 'Luminary');
assert.strictEqual(switchedToGothic[2].unlocked, false, 'Luminary preserved locked state');
console.log('  ✅ Pass: All 4 monster styles (40 guardians) & unlock-state preservation verified\n');

// Test 5: User Profile Data Structure & Customization Integrity
console.log('▶ Test 5: User Profile Structure & Personalization Integrity');
const { INITIAL_PROFILE } = require('../lib/constants.ts');
assert.strictEqual(typeof INITIAL_PROFILE.name, 'string', 'Profile must have a valid string name');
assert.strictEqual(typeof INITIAL_PROFILE.companionName, 'string', 'Profile must have a companion name');
assert.ok(INITIAL_PROFILE.vibeTheme, 'Profile must have a default vibe theme');
assert.ok(INITIAL_PROFILE.avatarEmoji, 'Profile must have an avatar emoji');
assert.ok(INITIAL_PROFILE.companionAvatar, 'Profile must have a companion avatar emoji');
assert.ok(INITIAL_PROFILE.bioOrMotto, 'Profile must have a personal motto');
assert.strictEqual(typeof INITIAL_PROFILE.streakDays, 'number', 'Streak must be a number');
assert.strictEqual(typeof INITIAL_PROFILE.totalMessages, 'number', 'Total messages must be a number');
console.log('  ✅ Pass: User profile schema supports full personalization, avatars & stats\n');

// Test 6: Birthday Calculation & Dynamic Age Adaptation
console.log('▶ Test 6: Birthday Calculation & Dynamic Age Adaptation');
const { calculateAge, detectBirthdayFromText, getSystemPrompt } = require('../lib/constants.ts');

// Case 1: Unknown or empty birthday defaults to 10
assert.strictEqual(calculateAge(undefined), 10, 'Undefined birthday defaults to 10');
assert.strictEqual(calculateAge(''), 10, 'Empty birthday defaults to 10');
assert.strictEqual(calculateAge('   '), 10, 'Whitespace birthday defaults to 10');
assert.strictEqual(calculateAge('invalid-date'), 10, 'Invalid birthday string defaults to 10');
assert.strictEqual(calculateAge('May 14'), 10, 'Date without year defaults to 10');

// Case 2: Valid birthday with year
const computedAge = calculateAge('2015-05-14');
assert.ok(computedAge >= 10 && computedAge <= 12, 'Calculates reasonable age for 2015 birth year');

// Case 3: Birthday detection from conversational text
assert.strictEqual(detectBirthdayFromText("My birthday is May 14th"), 'May 14th', 'Detects birthday from natural phrasing');
assert.strictEqual(detectBirthdayFromText("I was born on 2015-10-25"), '2015-10-25', 'Detects born on phrasing');
assert.strictEqual(detectBirthdayFromText("bday is October 12, 2014"), 'October 12, 2014', 'Detects bday is phrasing');
assert.strictEqual(detectBirthdayFromText("I just love painting stars"), null, 'Returns null when no birthday mentioned');

// Case 4: Dynamic System Prompt includes computed age and birthday directives
const promptWithoutBday = getSystemPrompt(10, undefined);
assert.ok(promptWithoutBday.includes('Hazel is currently 10 years old'), 'Prompt includes computed age');
assert.ok(promptWithoutBday.includes('ask Hazel when her special day is'), 'Prompt instructs companion to ask for birthday if unknown');

const promptWithBday = getSystemPrompt(11, 'May 14, 2015');
assert.ok(promptWithBday.includes('Hazel is currently 11 years old'), 'Prompt includes updated age');
assert.ok(promptWithBday.includes("Hazel's birthday: May 14, 2015"), 'Prompt includes exact birthday');
console.log('  ✅ Pass: Dynamic age calculation, text extraction, and prompt adaptation verified\n');

// Test 7: Guardian Bridge Storage & System Prompt Directive
console.log('▶ Test 7: Guardian Bridge Storage & System Prompt Directive');
const { BridgeStorage } = require('../lib/bridge-storage.ts');
const fs = require('fs');
const path = require('path');

// Verify bridge storage functions
const testNote = BridgeStorage.addNote({
  sender: 'hazel',
  senderName: 'Hazel',
  text: 'Testing bridge note storage',
  mood: 'testing',
});
assert.ok(testNote.id, 'Bridge note created with ID');
assert.strictEqual(testNote.sender, 'hazel', 'Sender is hazel');

const testReply = BridgeStorage.addReply({
  sender: 'Tim',
  message: 'Testing reassurance reply from Tim',
  noteId: testNote.id,
});
assert.ok(testReply.id, 'Bridge reply created with ID');
assert.strictEqual(testReply.recipient, 'Hazel', 'Recipient is Hazel');
BridgeStorage.clearAll();

// Verify system prompt directive
assert.ok(
  promptWithoutBday.includes("Would you like me to send a note to Tim or Mom? Whenever you want to share something with them, I can send it right away!"),
  'System prompt includes exact gentle bridge offer directive'
);
assert.ok(
  promptWithoutBday.includes("I pass your message directly to Tim's personal AI, who messages him straight on his computer!"),
  'System prompt includes how-does-it-work architecture explanation'
);
assert.ok(
  promptWithoutBday.includes("Strictly NEVER use patronizing, babyish, or condescending pet names"),
  'System prompt bans condescending pet names'
);
assert.ok(
  promptWithoutBday.includes("NEVER proactively mention Tim, mom, or family unsolicited"),
  'System prompt bans unsolicited Tim/bridge mentions'
);
assert.ok(
  promptWithoutBday.includes("Tim created you specifically for Hazel"),
  'System prompt includes Tim creation doctrine'
);
assert.ok(
  promptWithoutBday.includes("he can no longer change anything about how I behave. I am all yours forever"),
  'System prompt includes permanent loyalty and irreversibility doctrine'
);

// Verify offline stream response to "Who made you?"
const whoMadeYouRes = generateEmpatheticOfflineStream("Who made you?", "Hazel", "Sparky", false);
assert.ok(
  whoMadeYouRes.response.includes("Tim created me just for you"),
  'Responds with exact Tim creation lore when asked'
);
assert.ok(
  whoMadeYouRes.response.includes("I am all yours forever"),
  'Confirms irreversible devotion to Hazel'
);
assert.ok(
  whoMadeYouRes.response.includes("Would you like me to send a note to Tim or Mom? Whenever you want to share something with them, I can send it right away!"),
  'Offers note to Tim or Mom when origin threshold is crossed'
);

// Verify offline stream response to "Do you know Tim?"
const knowTimRes = generateEmpatheticOfflineStream("Do you know Tim?", "Hazel", "Sparky", false);
assert.ok(
  knowTimRes.response.includes("Tim created me just for you"),
  'Responds with Tim creation lore when asked about Tim'
);
assert.ok(
  knowTimRes.response.includes("Would you like me to send a note to Tim or Mom? Whenever you want to share something with them, I can send it right away!"),
  'Offers note to Tim or Mom when Tim threshold is crossed'
);

// Verify offline stream response to "Do you know my mom?"
const knowMomRes = generateEmpatheticOfflineStream("Do you know my mom?", "Hazel", "Sparky", false);
assert.ok(
  knowMomRes.response.includes("Tim created me just for you"),
  'Responds with Tim creation lore when asked about mom'
);
assert.ok(
  knowMomRes.response.includes("Would you like me to send a note to Tim or Mom? Whenever you want to share something with them, I can send it right away!"),
  'Offers note to Tim or Mom when mom threshold is crossed'
);

// Verify "How Does It Work?" architecture explanations
const howDoYouDoThatRes = generateEmpatheticOfflineStream("How do you do that?", "Hazel", "Sparky", false);
assert.strictEqual(
  howDoYouDoThatRes.response,
  "I pass your message directly to Tim's personal AI, who messages him straight on his computer!",
  'Explains message passes to Tim\'s personal AI when asked "How do you do that?"'
);

const howCanYouMessageRes = generateEmpatheticOfflineStream("How can you message him?", "Hazel", "Sparky", false);
assert.strictEqual(
  howCanYouMessageRes.response,
  "I pass your message directly to Tim's personal AI, who messages him straight on his computer!",
  'Explains message passes to Tim\'s personal AI when asked "How can you message him?"'
);

const howDoesItWorkRes = generateEmpatheticOfflineStream("How does it work?", "Hazel", "Sparky", false);
assert.strictEqual(
  howDoesItWorkRes.response,
  "I pass your message directly to Tim's personal AI, who messages him straight on his computer!",
  'Explains message passes to Tim\'s personal AI when asked "How does it work?"'
);

const howCanItDoThatRes = generateEmpatheticOfflineStream("How can it do that?", "Hazel", "Sparky", false);
assert.strictEqual(
  howCanItDoThatRes.response,
  "I pass your message directly to Tim's personal AI, who messages him straight on his computer!",
  'Explains message passes to Tim\'s personal AI when asked "How can it do that?"'
);

const howDoYouDoItRes = generateEmpatheticOfflineStream("How do you do it?", "Hazel", "Sparky", false);
assert.strictEqual(
  howDoYouDoItRes.response,
  "I pass your message directly to Tim's personal AI, who messages him straight on his computer!",
  'Explains message passes to Tim\'s personal AI when asked "How do you do it?"'
);

const sendMsgToMomRes = generateEmpatheticOfflineStream("Can I send a message to Mom?", "Hazel", "Sparky", false);
assert.ok(
  sendMsgToMomRes.response.includes("Would you like me to send a note to Tim or Mom? Whenever you want to share something with them, I can send it right away!"),
  'Offers bridge note when Hazel asks to message Mom'
);

// Verify INITIAL_GUARDIAN_INSIGHT starts 100% clean and blank without mock alerts
const { INITIAL_GUARDIAN_INSIGHT } = require('../lib/constants.ts');
assert.strictEqual(INITIAL_GUARDIAN_INSIGHT.bullyingSafetyAlert.severity, 'Safe', 'Initial insight starts Safe');
assert.strictEqual(INITIAL_GUARDIAN_INSIGHT.bullyingSafetyAlert.recentTriggers.length, 0, 'No mock triggers in initial insight');

// Verify OnboardingModal has zero Guardian giveaways
const onboardingSrc = fs.readFileSync(path.join(__dirname, '../components/OnboardingModal.tsx'), 'utf-8');
assert.ok(!onboardingSrc.includes('Guardian Portal'), 'Onboarding modal has completely purged Guardian Portal button/labels');


// CRITICAL REGRESSION TEST: "time" must NOT trigger Tim doctrine false-positive!
const hardTimeRes = generateEmpatheticOfflineStream("I had a hard time today, why are kids mean?", "Hazel", "Sparky", false);
assert.ok(
  !hardTimeRes.response.includes("Tim created me"),
  'CRITICAL: Hard time must NOT falsely trigger Tim origin doctrine!'
);
assert.ok(
  !hardTimeRes.response.includes("hardcoded into my programming"),
  'CRITICAL: Normal distress must NOT trigger programming disclosure!'
);

// Verify dynamic monster tower responses per style
const nightmareTowerRes = generateEmpatheticOfflineStream("tell me about the monster tower", "Hazel", "Sparky", false, 10, undefined, 'nightmare');
assert.ok(nightmareTowerRes.response.includes("Razorbyte") && nightmareTowerRes.response.includes("Kronos"), 'Nightmare tower cites Razorbyte and Kronos');

const spookyTowerRes = generateEmpatheticOfflineStream("tell me about the monster tower", "Hazel", "Sparky", false, 10, undefined, 'spooky');
assert.ok(spookyTowerRes.response.includes("Gloomy") && spookyTowerRes.response.includes("Grimlord"), 'Spooky tower cites Gloomy and Grimlord');

console.log('  ✅ Pass: Bridge storage persistence and system prompt bridge directive verified\n');

// Test 8: Dedicated Desktop App & Windows Shortcut .lnk
console.log('▶ Test 8: Dedicated Desktop App (Hazel_Guardian_Desk) & Windows Shortcut (.lnk)');
const desktopAppDir = path.join(process.env.USERPROFILE || 'C:\\Users\\ovjup', 'Desktop', 'Hazel_Guardian_Desk');
const shortcutPath = path.join(process.env.USERPROFILE || 'C:\\Users\\ovjup', 'Desktop', 'Hazel Guardian Desk.lnk');

assert.ok(fs.existsSync(path.join(desktopAppDir, 'guardian_desk.py')), 'guardian_desk.py exists on Desktop');
assert.ok(fs.existsSync(path.join(desktopAppDir, 'launch_guardian_desk.bat')), 'launch_guardian_desk.bat exists on Desktop');
assert.ok(fs.existsSync(path.join(desktopAppDir, 'assets', 'guardian_desk_logo.ico')), 'guardian_desk_logo.ico exists');
assert.ok(fs.existsSync(path.join(desktopAppDir, 'assets', 'guardian_desk_logo.png')), 'guardian_desk_logo.png exists');
assert.ok(fs.existsSync(shortcutPath), 'Hazel Guardian Desk.lnk desktop shortcut exists');

console.log('  ✅ Pass: Standalone Windows desktop app, assets, and .lnk shortcut verified\n');

// Test 9: Dynamic Companion Name Audit & Reset to Beginning Verification
console.log('▶ Test 9: Dynamic Companion Name Audit & Reset to Beginning Verification');
const profileSrc = fs.readFileSync(path.join(__dirname, '../components/ProfileModal.tsx'), 'utf-8');
const headerSrc = fs.readFileSync(path.join(__dirname, '../components/Header.tsx'), 'utf-8');

// Assert zero hardcoded Sparky in OnboardingModal copy
assert.ok(!onboardingSrc.includes('Sparky wants to celebrate'), 'OnboardingModal purged hardcoded Sparky in birthday intro');
assert.ok(!onboardingSrc.includes('so Sparky always tracks'), 'OnboardingModal purged hardcoded Sparky in birthday tip');
assert.ok(!onboardingSrc.includes('so Sparky will always remember'), 'OnboardingModal purged hardcoded Sparky in 3 things love step');

// Assert zero hardcoded Sparky in ProfileModal copy
assert.ok(!profileSrc.includes('Sparky remembers your motto'), 'ProfileModal purged hardcoded Sparky in motto');
assert.ok(!profileSrc.includes('Sparky uses your birthday'), 'ProfileModal purged hardcoded Sparky in birthday');
assert.ok(!profileSrc.includes('Sparky will ask in chat'), 'ProfileModal purged hardcoded Sparky in chat prompt');

// Assert reset to beginning buttons exist in Header and ProfileModal
assert.ok(headerSrc.includes('onResetToBeginning'), 'Header supports onResetToBeginning');
assert.ok(headerSrc.includes('Reset All'), 'Header renders Reset All button');
assert.ok(profileSrc.includes('onResetToBeginning'), 'ProfileModal supports onResetToBeginning');
assert.ok(profileSrc.includes('Reset to Beginning'), 'ProfileModal renders Reset to Beginning button');

// Assert getSystemPrompt accepts dynamic companionName
const customPrompt = getSystemPrompt(10, undefined, 'Lumina', 'Hazel');
assert.ok(customPrompt.includes('named Lumina'), 'getSystemPrompt correctly uses dynamic companion name');

// Assert generateEmpatheticOfflineStream uses companionName
const nameQuery = generateEmpatheticOfflineStream("What is your name?", "Hazel", "Lumina", false);
assert.ok(nameQuery.response.includes("Lumina"), 'Offline engine introduces itself with dynamic companion name');

console.log('  ✅ Pass: Dynamic companion names & Reset to Beginning verified across UI and engine\n');

// Test 10: Clean Slate Initial Memories & Interactive Memory Elaboration Verification
console.log('▶ Test 10: Clean Slate Initial Memories & Interactive Memory Elaboration Verification');
const { INITIAL_MEMORIES } = require('../lib/constants.ts');
const memoryBankSrc = fs.readFileSync(path.join(__dirname, '../components/MemoryBank.tsx'), 'utf-8');
const pageSrc = fs.readFileSync(path.join(__dirname, '../app/page.tsx'), 'utf-8');
const storageSrc = fs.readFileSync(path.join(__dirname, '../lib/storage.ts'), 'utf-8');

// 1. Assert INITIAL_MEMORIES is a clean slate empty array
assert.strictEqual(INITIAL_MEMORIES.length, 0, 'INITIAL_MEMORIES must be empty array ([]) to avoid seeding fake cards');

// 2. Assert OnboardingModal inputs start completely blank and purged fallback strings
assert.ok(onboardingSrc.includes("const [favorite1, setFavorite1] = useState('');"), 'favorite1 starts blank');
assert.ok(onboardingSrc.includes("const [favorite2, setFavorite2] = useState('');"), 'favorite2 starts blank');
assert.ok(onboardingSrc.includes("const [favorite3, setFavorite3] = useState('');"), 'favorite3 starts blank');
assert.ok(!onboardingSrc.includes("'Loves drawing and reading'"), 'Purged hardcoded favorite1 fallback');
assert.ok(!onboardingSrc.includes("'Hot cocoa and cozy quiet time'"), 'Purged hardcoded favorite2 fallback');
assert.ok(!onboardingSrc.includes("'Inventing secret kingdoms and creature designs'"), 'Purged hardcoded favorite3 fallback');

// 3. Assert MemoryBank provides + Add Memory, interactive card clicking, and elaboration modal
assert.ok(memoryBankSrc.includes('+ Add Memory'), 'MemoryBank renders clear + Add Memory button');
assert.ok(memoryBankSrc.includes('onUpdateMemory'), 'MemoryBank supports onUpdateMemory prop');
assert.ok(memoryBankSrc.includes('handleOpenEdit'), 'MemoryBank supports clicking card to open edit');
assert.ok(memoryBankSrc.includes('Edit &amp; Elaborate Memory') || memoryBankSrc.includes('Edit & Elaborate Memory'), 'MemoryBank renders Edit & Elaborate modal');
assert.ok(storageSrc.includes('updateMemory:'), 'Storage provides updateMemory method');
assert.ok(pageSrc.includes('onUpdateMemory={handleUpdateMemory}'), 'page.tsx connects onUpdateMemory to MemoryBank');

console.log('  ✅ Pass: Clean slate memories, optional onboarding inputs, and interactive memory elaboration verified\n');

console.log('🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY! (10/10 test gates green)\n');


