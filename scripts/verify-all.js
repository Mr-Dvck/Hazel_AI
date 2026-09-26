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

console.log('🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY! (6/6 test gates green)\n');
