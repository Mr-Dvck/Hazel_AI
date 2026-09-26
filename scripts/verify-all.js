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

console.log('🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY! (4/4 test gates green)\n');
