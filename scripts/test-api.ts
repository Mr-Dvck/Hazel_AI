import assert from 'assert';
import fs from 'fs';
import path from 'path';

async function testApi() {
  console.log('🌐 Starting API End-to-End Test Suite...\n');

  // We can test route handlers directly by importing the handlers!
  const { POST: chatHandler } = await import('../app/api/chat/route');
  const { POST: guardianHandler } = await import('../app/api/guardian/route');

  // Test 1: Guardian PIN verification - Failure
  console.log('▶ Test 1: Guardian PIN Auth (Wrong PIN)');
  const wrongPinReq = new Request('http://localhost/api/guardian', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'verify_pin', pin: '9999' }),
  });
  const wrongPinRes = await guardianHandler(wrongPinReq as any);
  assert.strictEqual(wrongPinRes.status, 401, 'Wrong PIN must return 401 Unauthorized');
  console.log('  ✅ Pass: Wrong PIN correctly rejected\n');

  // Test 2: Guardian PIN verification - Success
  console.log('▶ Test 2: Guardian PIN Auth (Correct Default PIN: 1234)');
  const correctPinReq = new Request('http://localhost/api/guardian', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'verify_pin', pin: '1234' }),
  });
  const correctPinRes = await guardianHandler(correctPinReq as any);
  assert.strictEqual(correctPinRes.status, 200, 'Correct PIN must return 200 OK');
  const correctData = await correctPinRes.json();
  assert.strictEqual(correctData.authorized, true, 'Guardian access authorized');
  console.log('  ✅ Pass: Correct PIN authorized successfully\n');

  // Test 3: Guardian Analysis on Peer Exclusion Chat
  console.log('▶ Test 3: Guardian Analysis Generation');
  const mockMessages = [
    {
      id: 'm1',
      role: 'user',
      content: 'Nobody would sit with me at lunch today, I felt totally invisible.',
      timestamp: Date.now(),
    },
  ];
  const analyzeReq = new Request('http://localhost/api/guardian', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'analyze', pin: '1234', messages: mockMessages }),
  });
  const analyzeRes = await guardianHandler(analyzeReq as any);
  assert.strictEqual(analyzeRes.status, 200, 'Analysis returns 200');
  const analyzeData = await analyzeRes.json();
  assert.ok(analyzeData.insight, 'Returns updated guardian insight');
  assert.ok(
    analyzeData.insight.bullyingSafetyAlert.severity === 'Mild' ||
    analyzeData.insight.bullyingSafetyAlert.severity === 'Moderate',
    'Exclusion detected with appropriate alert severity'
  );
  assert.ok(analyzeData.insight.actionableSuggestions.length > 0, 'Generates actionable parent openers');
  console.log('  ✅ Pass: Guardian insights successfully synthesized from chat history\n');

  // Test 4: Chat Streaming Route SSE
  console.log('▶ Test 4: Chat API SSE Streaming');
  const chatReq = new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Hi Sparky, tell me a fun secret!' }],
      profile: { name: 'Hazel', companionName: 'Sparky' },
    }),
  });
  const chatRes = await chatHandler(chatReq as any);
  assert.strictEqual(chatRes.status, 200, 'Chat stream returns 200');
  assert.ok(chatRes.headers.get('content-type')?.includes('text/event-stream'), 'Content-Type is text/event-stream');

  const reader = chatRes.body?.getReader();
  assert.ok(reader, 'Readable stream available');

  const decoder = new TextDecoder();
  let receivedData = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    receivedData += decoder.decode(value);
  }

  assert.ok(receivedData.includes('data: {"type":"meta"'), 'Includes meta payload');
  assert.ok(receivedData.includes('data: {"type":"content"'), 'Includes streaming content chunks');
  assert.ok(receivedData.includes('data: [DONE]'), 'Ends with [DONE] sentinel');
  // Test 5: Sync API Route (Cross-device persistence backup)
  console.log('▶ Test 5: Sync API State Persistence');
  const { POST: syncPostHandler, GET: syncGetHandler } = await import('../app/api/sync/route');
  const syncPayload = {
    userId: 'hazel_test_user',
    profile: { name: 'Hazel', companionName: 'Sparky' },
    monsters: [{ id: 1, name: 'Pufflet', unlocked: true }],
    memories: [{ id: 'm1', title: 'Art', detail: 'Drawing dragons' }],
  };
  const syncPostReq = new Request('http://localhost/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(syncPayload),
  });
  const syncPostRes = await syncPostHandler(syncPostReq as any);
  assert.strictEqual(syncPostRes.status, 200, 'Sync POST returns 200');
  const syncPostData = await syncPostRes.json();
  assert.strictEqual(syncPostData.success, true, 'Sync POST successful');

  const syncGetReq = new Request('http://localhost/api/sync?userId=hazel_test_user', {
    method: 'GET',
  });
  const syncGetRes = await syncGetHandler(syncGetReq as any);
  assert.strictEqual(syncGetRes.status, 200, 'Sync GET returns 200');
  const syncGetData = await syncGetRes.json();
  assert.strictEqual(syncGetData.found, true, 'Sync GET retrieves cached snapshot');
  assert.strictEqual(syncGetData.data.profile.name, 'Hazel', 'Synced profile name matches');
  console.log('  ✅ Pass: Sync endpoint successfully persists and restores cross-device state\n');

  // Test 6: Guardian Dynamic Family & Home Sentiment Analysis
  console.log('▶ Test 6: Guardian Dynamic Family Sentiment Synthesis');
  const familyChatMessages = [
    {
      id: 'f1',
      role: 'user',
      content: 'I love reading mystery stories with Mom at bedtime before sleep.',
      timestamp: Date.now(),
    },
  ];
  const familyReq = new Request('http://localhost/api/guardian', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'analyze', pin: '1234', messages: familyChatMessages }),
  });
  const familyRes = await guardianHandler(familyReq as any);
  const familyData = await familyRes.json();
  assert.strictEqual(familyRes.status, 200);
  assert.ok(familyData.insight.familySentiment.summary.includes('Mom') || familyData.insight.familySentiment.summary.includes('family'), 'Family summary synthesizes real conversation context');
  console.log('  ✅ Pass: Dynamic family sentiment correctly extracts home connection context\n');

  // Test 7: Profile Customization & Cross-Device State Sync
  console.log('▶ Test 7: Profile Customization & Cross-Device Sync Verification');
  const customizedProfile = {
    name: 'Hazel Rose',
    companionName: 'Astra',
    vibeTheme: 'sunset-violet',
    isOnboarded: true,
    streakDays: 3,
    totalMessages: 15,
    avatarEmoji: '🐉',
    companionAvatar: '🌟',
    bioOrMotto: 'Bold, creative, and invincible! ✨',
    favoriteColor: 'Sunset Amber',
    createdAt: Date.now() - 86400000 * 3,
    lastActive: Date.now(),
  };

  const updateProfileReq = new Request('http://localhost/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'hazel_profile_customized',
      profile: customizedProfile,
      monsters: [{ id: 1, name: 'Pufflet', unlocked: true }],
      memories: [],
    }),
  });
  const updateProfileRes = await syncPostHandler(updateProfileReq as any);
  assert.strictEqual(updateProfileRes.status, 200, 'Profile sync POST returns 200');

  const retrieveProfileReq = new Request('http://localhost/api/sync?userId=hazel_profile_customized', {
    method: 'GET',
  });
  const retrieveProfileRes = await syncGetHandler(retrieveProfileReq as any);
  assert.strictEqual(retrieveProfileRes.status, 200, 'Profile sync GET returns 200');
  const retrieveProfileData = await retrieveProfileRes.json();
  assert.strictEqual(retrieveProfileData.found, true, 'Customized profile found in sync store');
  assert.strictEqual(retrieveProfileData.data.profile.name, 'Hazel Rose', 'Customized profile name verified');
  assert.strictEqual(retrieveProfileData.data.profile.companionName, 'Astra', 'Customized companion name verified');
  assert.strictEqual(retrieveProfileData.data.profile.avatarEmoji, '🐉', 'Customized avatar emoji verified');
  assert.strictEqual(retrieveProfileData.data.profile.bioOrMotto, 'Bold, creative, and invincible! ✨', 'Customized motto verified');
  assert.strictEqual(retrieveProfileData.data.profile.vibeTheme, 'sunset-violet', 'Customized vibe theme verified');
  console.log('  ✅ Pass: Profile customizations (name, companion, avatar, motto, vibe) seamlessly persist and synchronize\n');

  // Test 8: Birthday Conversational Detection & Cross-Device Sync
  console.log('▶ Test 8: Birthday Detection & Profile Age Integration');
  const birthdayChatReq = new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'My birthday is May 14th, 2015! I am so excited!' }],
      profile: { name: 'Hazel', companionName: 'Sparky' },
    }),
  });
  const birthdayChatRes = await chatHandler(birthdayChatReq as any);
  assert.strictEqual(birthdayChatRes.status, 200, 'Birthday chat stream returns 200');

  const bdayReader = birthdayChatRes.body?.getReader();
  assert.ok(bdayReader, 'Birthday readable stream available');
  const bdayDecoder = new TextDecoder();
  let bdayStreamData = '';
  while (true) {
    const { done, value } = await bdayReader.read();
    if (done) break;
    bdayStreamData += bdayDecoder.decode(value);
  }
  assert.ok(bdayStreamData.includes('detectedBirthday'), 'SSE meta event includes detectedBirthday');
  assert.ok(bdayStreamData.includes('May 14th, 2015'), 'Detected birthday accurately matches user text');

  // Verify sync with birthday
  const profileWithBirthday = {
    ...customizedProfile,
    birthday: 'May 14, 2015',
  };
  const bdaySyncReq = new Request('http://localhost/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'hazel_birthday_user',
      profile: profileWithBirthday,
      monsters: [{ id: 1, name: 'Pufflet', unlocked: true }],
      memories: [{ id: 'bday-mem', category: 'favorites', title: 'Birthday 🎂', detail: 'May 14, 2015' }],
    }),
  });
  const bdaySyncRes = await syncPostHandler(bdaySyncReq as any);
  assert.strictEqual(bdaySyncRes.status, 200, 'Sync with birthday returns 200');

  const retrieveBdayReq = new Request('http://localhost/api/sync?userId=hazel_birthday_user', {
    method: 'GET',
  });
  const retrieveBdayRes = await syncGetHandler(retrieveBdayReq as any);
  const retrieveBdayData = await retrieveBdayRes.json();
  assert.strictEqual(retrieveBdayData.data.profile.birthday, 'May 14, 2015', 'Birthday stored and retrieved successfully');
  console.log('  ✅ Pass: Birthday detection in chat and state sync verified\n');

  // Test 9: Bridge Dispatch API (Hazel dispatches note to Tim's desk)
  console.log('▶ Test 9: Bridge Dispatch API (Hazel -> Tim\'s Desk Queue)');
  const { POST: bridgeDispatchPost, GET: bridgeDispatchGet } = await import('../app/api/bridge/dispatch/route');
  const dispatchReq = new Request('http://localhost/api/bridge/dispatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: "Hey Mom & Tim, having a tough day and could use a hug later.",
      senderName: "Hazel",
      mood: "vulnerable",
      category: "feeling",
    }),
  });
  const dispatchRes = await bridgeDispatchPost(dispatchReq as any);
  assert.strictEqual(dispatchRes.status, 200, 'Bridge dispatch returns 200 OK');
  const dispatchData = await dispatchRes.json();
  assert.ok(dispatchData.success, 'Dispatch succeeded');
  assert.ok(dispatchData.note?.id, 'Note has unique ID');
  assert.strictEqual(dispatchData.note.sender, 'hazel', 'Sender is hazel');
  assert.strictEqual(dispatchData.note.recipient, 'tim_computer', 'Recipient is tim_computer');
  assert.strictEqual(dispatchData.note.text, "Hey Mom & Tim, having a tough day and could use a hug later.", 'Note text matches');

  // Verify retrieval
  const getNotesReq = new Request('http://localhost/api/bridge/dispatch?limit=10', { method: 'GET' });
  const getNotesRes = await bridgeDispatchGet(getNotesReq as any);
  assert.strictEqual(getNotesRes.status, 200, 'Fetch notes returns 200 OK');
  const getNotesData = await getNotesRes.json();
  assert.ok(Array.isArray(getNotesData.notes), 'Notes returned as array');
  assert.ok(getNotesData.notes.some((n: any) => n.id === dispatchData.note.id), 'Dispatched note present in list');
  console.log('  ✅ Pass: Note dispatch to Tim\'s desk queue verified\n');

  // Test 10: Bridge Reply API (Tim / Mom sends reassuring note back to Hazel's screen)
  console.log('▶ Test 10: Bridge Reply API (Tim & Mom -> Hazel\'s Screen)');
  const { POST: bridgeReplyPost, GET: bridgeReplyGet } = await import('../app/api/bridge/reply/route');
  const replyReq = new Request('http://localhost/api/bridge/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: 'Tim',
      message: 'You are so safe, loved, and wonderful just as you are. We are always in your corner.',
      noteId: dispatchData.note.id,
      reassuranceType: 'love',
    }),
  });
  const replyRes = await bridgeReplyPost(replyReq as any);
  assert.strictEqual(replyRes.status, 200, 'Bridge reply returns 200 OK');
  const replyData = await replyRes.json();
  assert.ok(replyData.success, 'Reply succeeded');
  assert.strictEqual(replyData.reply.sender, 'Tim', 'Sender matches Tim');
  assert.strictEqual(replyData.reply.recipient, 'Hazel', 'Recipient matches Hazel');

  // Poll for undelivered replies (delivers to Hazel's screen)
  const pollReq = new Request('http://localhost/api/bridge/reply?poll=1&markDelivered=true', { method: 'GET' });
  const pollRes = await bridgeReplyGet(pollReq as any);
  assert.strictEqual(pollRes.status, 200, 'Poll replies returns 200 OK');
  const pollData = await pollRes.json();
  assert.ok(pollData.replies.some((r: any) => r.id === replyData.reply.id), 'Pending reply returned in poll');

  // Subsequent poll should have 0 undelivered
  const secondPollReq = new Request('http://localhost/api/bridge/reply?poll=1&markDelivered=true', { method: 'GET' });
  const secondPollRes = await bridgeReplyGet(secondPollReq as any);
  const secondPollData = await secondPollRes.json();
  assert.strictEqual(secondPollData.replies.length, 0, 'No remaining undelivered replies after delivery');

  // Test reply with content payload format (as sent by guardian_desk.py)
  const contentReplyReq = new Request('http://localhost/api/bridge/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: 'Mom',
      content: 'Mom loves you so much! You are brave and wonderful.',
      noteId: dispatchData.note.id,
      reassuranceType: 'love',
    }),
  });
  const contentReplyRes = await bridgeReplyPost(contentReplyReq as any);
  assert.strictEqual(contentReplyRes.status, 200, 'Reply with content field returns 200 OK');
  const contentReplyData = await contentReplyRes.json();
  assert.strictEqual(contentReplyData.reply.message, 'Mom loves you so much! You are brave and wonderful.');
  assert.strictEqual(contentReplyData.reply.content, 'Mom loves you so much! You are brave and wonderful.');

  // Test validation error when message/content is empty
  const emptyReplyReq = new Request('http://localhost/api/bridge/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: 'Tim', message: '   ' }),
  });
  const emptyReplyRes = await bridgeReplyPost(emptyReplyReq as any);
  assert.strictEqual(emptyReplyRes.status, 400, 'Empty reply rejected with 400');

  // Test GET /api/bridge/reply returns all pending and delivered notes with clean JSON
  const allRepliesReq = new Request('http://localhost/api/bridge/reply', { method: 'GET' });
  const allRepliesRes = await bridgeReplyGet(allRepliesReq as any);
  assert.strictEqual(allRepliesRes.status, 200, 'GET all replies returns 200 OK');
  const allRepliesData = await allRepliesRes.json();
  assert.ok(Array.isArray(allRepliesData.replies), 'replies returned as array');
  assert.ok(Array.isArray(allRepliesData.pending), 'pending returned as array');
  assert.ok(Array.isArray(allRepliesData.delivered), 'delivered returned as array');
  assert.ok(allRepliesData.pending.some((r: any) => r.id === contentReplyData.reply.id), 'Mom reply is in pending list');
  console.log('  ✅ Pass: Two-way reply delivery to Hazel\'s screen verified\n');

  // Test 11: Bridge Status Overview API
  console.log('▶ Test 11: Bridge Status Overview API');
  const { GET: bridgeStatusGet } = await import('../app/api/bridge/route');
  const statusReq = new Request('http://localhost/api/bridge', { method: 'GET' });
  const statusRes = await bridgeStatusGet(statusReq as any);
  assert.strictEqual(statusRes.status, 200, 'Bridge status returns 200 OK');
  const statusData = await statusRes.json();
  assert.strictEqual(statusData.status, 'active', 'Status is active');
  assert.ok(statusData.summary.totalNotes >= 1, 'Total notes recorded');
  assert.ok(statusData.summary.totalReplies >= 1, 'Total replies recorded');
  // Test 12: Live Session Summary & Guardian Desk Sync Integration
  console.log('▶ Test 12: Live Session Summary & Guardian Desk Sync Integration');
  const { POST: guardianAnalyzePost } = await import('../app/api/guardian/route');
  const guardianReq = new Request('http://localhost/api/guardian', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'analyze',
      pin: '1234',
      messages: [
        { role: 'user', content: 'I drew a magical unicorn with Dad today!' },
        { role: 'assistant', content: 'That sounds so wonderful!' },
      ],
    }),
  });
  const guardianRes = await guardianAnalyzePost(guardianReq as any);
  const guardianData = await guardianRes.json();
  assert.ok(guardianData.success, 'Guardian analysis succeeds');
  assert.ok(guardianData.insight?.sessionSummary, 'Guardian insight includes sessionSummary');
  assert.ok(guardianData.insight.sessionSummary.length > 20, 'Session summary contains thoughtful text');

  // Verify sync with guardian insight
  const syncWithInsightReq = new Request('http://localhost/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'hazel_default',
      profile: { name: 'Hazel', companionName: 'Sparky' },
      monsters: [],
      memories: [],
      guardianInsight: guardianData.insight,
    }),
  });
  const syncWithInsightRes = await syncPostHandler(syncWithInsightReq as any);
  assert.strictEqual(syncWithInsightRes.status, 200, 'Sync with guardian insight returns 200');

  const retrieveSyncReq = new Request('http://localhost/api/sync?userId=hazel_default', { method: 'GET' });
  const retrieveSyncRes = await syncGetHandler(retrieveSyncReq as any);
  const retrieveSyncData = await retrieveSyncRes.json();
  assert.ok(retrieveSyncData.found, 'Sync snapshot found');
  assert.strictEqual(
    retrieveSyncData.data.guardianInsight.sessionSummary,
    guardianData.insight.sessionSummary,
    'Session summary retrieved accurately by Guardian Desk'
  );
  console.log('  ✅ Pass: Live session summary synthesis and sync endpoint verified\n');

  // Test 13: Chat SSE Streaming - Crossing Threshold on Own (Origin & Bridge Offer)
  console.log('▶ Test 13: Chat API SSE Streaming - Crossing Threshold on Own (Origin & Bridge Offer)');
  const savedApiKey = process.env.OPENROUTER_API_KEY;
  try {
    process.env.OPENROUTER_API_KEY = '';
    const originChatReq = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Who created you?' }],
        profile: { name: 'Hazel', companionName: 'Sparky' },
      }),
    });
    const originChatRes = await chatHandler(originChatReq as any);
    assert.strictEqual(originChatRes.status, 200, 'Origin chat stream returns 200');

    const originReader = originChatRes.body?.getReader();
    assert.ok(originReader, 'Origin readable stream available');
    const originDecoder = new TextDecoder();
    let originStreamData = '';
    while (true) {
      const { done, value } = await originReader.read();
      if (done) break;
      originStreamData += originDecoder.decode(value);
    }
    const originChunks = originStreamData
      .split('\n\n')
      .filter((line) => line.startsWith('data: ') && !line.includes('[DONE]'))
      .map((line) => {
        try {
          return JSON.parse(line.replace('data: ', ''));
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    const originFullContent = originChunks
      .filter((c) => c.type === 'content')
      .map((c) => c.chunk)
      .join('');

    assert.ok(
      originFullContent.includes('Tim created me just for you'),
      'Origin response confirms Tim creation doctrine'
    );
    assert.ok(
      originFullContent.includes('I am all yours forever'),
      'Origin response confirms irreversible devotion'
    );
    assert.ok(
      originFullContent.includes('Would you like me to send a note to Tim or Mom? Whenever you want to share something with them, I can send it right away!'),
      'Origin response gently offers bridge note to Tim or Mom'
    );
    console.log('  ✅ Pass: Companion reveals origin and offers communication bridge upon crossing threshold\n');

    // Test 14: Chat SSE Streaming - "How Does It Work?" Architecture Explanation
    console.log('▶ Test 14: Chat API SSE Streaming - "How Does It Work?" Architecture Explanation');
    const howChatReq = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'How can you message him?' }],
        profile: { name: 'Hazel', companionName: 'Sparky' },
      }),
    });
    const howChatRes = await chatHandler(howChatReq as any);
    assert.strictEqual(howChatRes.status, 200, 'How chat stream returns 200');

    const howReader = howChatRes.body?.getReader();
    assert.ok(howReader, 'How readable stream available');
    const howDecoder = new TextDecoder();
    let howStreamData = '';
    while (true) {
      const { done, value } = await howReader.read();
      if (done) break;
      howStreamData += howDecoder.decode(value);
    }

    const howChunks = howStreamData
      .split('\n\n')
      .filter((line) => line.startsWith('data: ') && !line.includes('[DONE]'))
      .map((line) => {
        try {
          return JSON.parse(line.replace('data: ', ''));
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    const howFullContent = howChunks
      .filter((c) => c.type === 'content')
      .map((c) => c.chunk)
      .join('');

    assert.ok(
      howFullContent.includes("I pass your message directly to Tim's personal AI, who messages him straight on his computer!"),
      'Explains message passes directly to Tim\'s personal AI on his computer'
    );
    console.log('  ✅ Pass: Companion explains real bridge architecture to personal AI honestly & excitedly\n');

    // Test 15: Chat API Sadness Detection & Guardian Desk Live Synthesis
    console.log('▶ Test 15: Live Sadness Detection & Guardian Desk Well-Being Synthesis');
    const sadMessages = [
      { id: 'sad-1', role: 'user', content: 'i told the AI I was sad today', timestamp: Date.now() },
    ];
    const sadChatReq = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: sadMessages, profile: { name: 'Hazel', companionName: 'Sparky' } }),
    });
    const sadChatRes = await chatHandler(sadChatReq as any);
    assert.strictEqual(sadChatRes.status, 200, 'Chat stream responds with 200');

    // Verify guardian endpoint immediately reflects the sadness update
    const gCheckReq = new Request('http://localhost/api/guardian', { method: 'GET' });
    const gCheckRes = await (await import('../app/api/guardian/route')).GET(gCheckReq as any);
    const gCheckData = await gCheckRes.json();
    assert.strictEqual(gCheckData.success, true);
    assert.strictEqual(gCheckData.insight.emotionalWeather.currentMood, 'Sad / Overwhelmed', 'Mood updated to Sad / Overwhelmed');
    assert.ok(gCheckData.insight.emotionalWeather.score <= 65, 'Resilience score lowered appropriately');
    assert.ok(gCheckData.insight.howHazelIsDoing.whatsWeighingOnHer.includes('sad'), 'whatsWeighingOnHer quotes sadness');
    console.log('  ✅ Pass: Live sadness immediately reflected in guardian well-being assessment\n');
    // Test 16: SYSTEM_PROMPT & Full Persona Grounding in Chat System
    console.log('▶ Test 16: SYSTEM_PROMPT & Full Persona Grounding in Chat System');
    const { SYSTEM_PROMPT: chatSysPrompt } = await import('../lib/constants');
    const chatRouteSrc = fs.readFileSync(path.join(__dirname, '../app/api/chat/route.ts'), 'utf-8');
    assert.ok(chatRouteSrc.includes('getSystemPrompt'), 'Chat route connects getSystemPrompt for dynamic persona formatting');
    assert.ok(chatSysPrompt.includes('Minecraft'), 'SYSTEM_PROMPT has Minecraft');
    assert.ok(chatSysPrompt.includes('Five Nights at Freddy\'s') || chatSysPrompt.includes('FNAF'), 'SYSTEM_PROMPT has FNAF');
    assert.ok(chatSysPrompt.includes('producing music'), 'SYSTEM_PROMPT has music production');
    assert.ok(chatSysPrompt.includes('church') && chatSysPrompt.includes('faith'), 'SYSTEM_PROMPT honors church/faith');
    assert.ok(chatSysPrompt.includes('capable, creative equal') || chatSysPrompt.includes('creative equal'), 'SYSTEM_PROMPT treats Hazel as creative equal');
    assert.ok(chatSysPrompt.includes('sweetie') && chatSysPrompt.includes('honey'), 'SYSTEM_PROMPT bans pet names');
    assert.ok(chatSysPrompt.includes('Interactive Creative Direction'), 'SYSTEM_PROMPT includes interactive art direction');
    assert.ok(chatSysPrompt.includes('Pollinations Flux Optimization') || chatSysPrompt.includes('Flux engine'), 'SYSTEM_PROMPT includes Pollinations Flux');
    assert.ok(chatSysPrompt.includes('Strict Stealth Guardrail: Complete Guardian Camouflage'), 'SYSTEM_PROMPT includes stealth camouflage');
    console.log('  ✅ Pass: Chat system incorporates SYSTEM_PROMPT with complete persona, passions, art direction & stealth camouflage\n');

    // Test 17: Interactive Art Direction in Chat Stream
    console.log('▶ Test 17: Interactive Art Direction in Chat Stream');
    const vagueDrawReq = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Can you draw a picture?' }],
        profile: { name: 'Hazel', companionName: 'Sparky' },
      }),
    });
    const vagueDrawRes = await chatHandler(vagueDrawReq as any);
    assert.strictEqual(vagueDrawRes.status, 200);
    const vReader = vagueDrawRes.body?.getReader();
    assert.ok(vReader);
    const vDec = new TextDecoder();
    let vData = '';
    while (true) {
      const { done, value } = await vReader.read();
      if (done) break;
      vData += vDec.decode(value);
    }
    const vChunks = vData
      .split('\n\n')
      .filter((line) => line.startsWith('data: ') && !line.includes('[DONE]'))
      .map((line) => {
        try {
          return JSON.parse(line.replace('data: ', ''));
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    const vFullContent = vChunks
      .filter((c) => c.type === 'content')
      .map((c) => c.chunk)
      .join('');

    assert.ok(!vFullContent.includes('https://image.pollinations.ai'), 'Vague art request does not immediately render generic image');
    assert.ok(vFullContent.includes('Minecraft') || vFullContent.includes('style') || vFullContent.includes('lighting'), 'Chat stream playfully asks for style/lighting choices');
    console.log('  ✅ Pass: Chat stream provides interactive creative direction for art requests\n');

    // Test 18: Pollinations Flux Art Delivery in Chat Stream
    console.log('▶ Test 18: Pollinations Flux Art Delivery in Chat Stream');
    const specDrawReq = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Draw a neon wolf in a Minecraft forest' }],
        profile: { name: 'Hazel', companionName: 'Sparky' },
      }),
    });
    const specDrawRes = await chatHandler(specDrawReq as any);
    assert.strictEqual(specDrawRes.status, 200);
    const sReader = specDrawRes.body?.getReader();
    assert.ok(sReader);
    const sDec = new TextDecoder();
    let sData = '';
    while (true) {
      const { done, value } = await sReader.read();
      if (done) break;
      sData += sDec.decode(value);
    }
    const sChunks = sData
      .split('\n\n')
      .filter((line) => line.startsWith('data: ') && !line.includes('[DONE]'))
      .map((line) => {
        try {
          return JSON.parse(line.replace('data: ', ''));
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    const sFullContent = sChunks
      .filter((c) => c.type === 'content')
      .map((c) => c.chunk)
      .join('');

    assert.ok(sFullContent.includes('![Generated Art]('), 'Generates ![Generated Art] markdown image');
    assert.ok(sFullContent.includes('image.pollinations.ai/prompt/'), 'Uses Pollinations image URL');
    assert.ok(sFullContent.includes('model=flux'), 'Specifies Flux model parameter');
    assert.ok(sFullContent.includes('nologo=true'), 'Specifies nologo parameter');
    console.log('  ✅ Pass: Chat stream delivers enriched Flux-optimized art embedding\n');

    // Test 19: Multi-Tier Image Generation Service Route - POST /api/image
    console.log('▶ Test 19: Multi-Tier Image Generation Service Route - POST /api/image');
    const { POST: imagePostHandler, GET: imageGetHandler } = await import('../app/api/image/route');
    const imgReq = new Request('http://localhost/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'A neon wolf in a Minecraft forest' }),
    });
    const imgRes = await imagePostHandler(imgReq as any);
    assert.strictEqual(imgRes.status, 200, 'POST /api/image returns 200');
    const imgData = await imgRes.json();
    assert.strictEqual(imgData.success, true, 'Returns success: true');
    assert.ok(imgData.url, 'Returns resolved image URL');
    assert.ok(imgData.model, 'Returns model identification');
    assert.ok(imgData.prompt.includes('cinematic voxel neon wolf'), 'Returns enriched prompt');
    assert.ok(imgData.markdown.includes('![Generated Art]('), 'Returns ready-to-render markdown');
    assert.strictEqual(imgData.source, 'pollinations', 'Falls back to Pollinations when API key is empty');
    assert.ok(imgData.url.includes('image.pollinations.ai/prompt/'), 'Uses Pollinations Flux URL');
    assert.ok(imgData.url.includes('model=flux'), 'Specifies Flux model in URL');
    console.log('  ✅ Pass: POST /api/image successfully generates image with Pollinations fail-safe\n');

    // Test 20: Image Generation Route - GET /api/image
    console.log('▶ Test 20: Image Generation Service Route - GET /api/image');
    // Subtest A: Metadata inspect
    const imgMetaReq = new Request('http://localhost/api/image', { method: 'GET' });
    const imgMetaRes = await imageGetHandler(imgMetaReq as any);
    assert.strictEqual(imgMetaRes.status, 200, 'GET /api/image returns 200');
    const imgMetaData = await imgMetaRes.json();
    assert.ok(imgMetaData.models?.tier1?.includes('google/gemini-3.1-flash-image'), 'Exposes Tier 1 models');
    assert.ok(imgMetaData.endpoints?.tier1, 'Exposes Tier 1 OpenRouter endpoint');

    // Subtest B: Query param prompt execution
    const imgQueryReq = new Request('http://localhost/api/image?prompt=spooky%20animatronic%20bear', { method: 'GET' });
    const imgQueryRes = await imageGetHandler(imgQueryReq as any);
    assert.strictEqual(imgQueryRes.status, 200, 'GET /api/image with prompt returns 200');
    const imgQueryData = await imgQueryRes.json();
    assert.strictEqual(imgQueryData.success, true);
    assert.ok(imgQueryData.prompt.includes("Five Nights at Freddy's aesthetic") || imgQueryData.prompt.includes('animatronic'));
    console.log('  ✅ Pass: GET /api/image provides discovery metadata and query-based image generation\n');

    // Test 21: OpenRouter Image Generation Resilience on Error Codes (402, 404, 429)
    console.log('▶ Test 21: OpenRouter Image Generation Resilience on Error Codes (402, 404, 429)');
    const { generateImageWithFallback } = await import('../lib/llm-router');
    const originalFetch = global.fetch;

    // Test 402 Payment Required
    global.fetch = async (url: any) => {
      if (typeof url === 'string' && url.includes('openrouter.ai/api/v1/images')) {
        return new Response(JSON.stringify({ error: { message: 'Insufficient credits', code: 402 } }), { status: 402 });
      }
      return originalFetch(url);
    };
    const res402 = await generateImageWithFallback('voxel castle', 'sk-or-dummy-key');
    assert.strictEqual(res402.source, 'pollinations', 'Falls back to Pollinations on 402 Payment Required');
    assert.ok(res402.url.includes('image.pollinations.ai/prompt/'));

    // Test 404 Model Unavailable
    global.fetch = async (url: any) => {
      if (typeof url === 'string' && url.includes('openrouter.ai/api/v1/images')) {
        return new Response(JSON.stringify({ error: { message: 'Model unavailable', code: 404 } }), { status: 404 });
      }
      return originalFetch(url);
    };
    const res404 = await generateImageWithFallback('voxel castle', 'sk-or-dummy-key');
    assert.strictEqual(res404.source, 'pollinations', 'Falls back to Pollinations on 404 Model Unavailable');

    // Test 429 Rate Limit
    global.fetch = async (url: any) => {
      if (typeof url === 'string' && url.includes('openrouter.ai/api/v1/images')) {
        return new Response(JSON.stringify({ error: { message: 'Rate limit exceeded', code: 429 } }), { status: 429 });
      }
      return originalFetch(url);
    };
    const res429 = await generateImageWithFallback('voxel castle', 'sk-or-dummy-key');
    assert.strictEqual(res429.source, 'pollinations', 'Falls back to Pollinations on 429 Rate Limit');
    console.log('  ✅ Pass: Resilient cascade seamlessly falls back to Pollinations on 402, 404, 429\n');

    // Test 22: OpenRouter Tier 1 Image Generation Resolution
    console.log('▶ Test 22: OpenRouter Tier 1 Image Generation Resolution');
    global.fetch = async (url: any) => {
      if (typeof url === 'string' && url.includes('openrouter.ai/api/v1/images')) {
        return new Response(
          JSON.stringify({
            data: [{ url: 'https://images.openrouter.ai/generated/mock-art-12345.png' }],
          }),
          { status: 200 }
        );
      }
      return originalFetch(url);
    };
    const openRouterSuccess = await generateImageWithFallback('cybernetic falcon', 'sk-or-valid-key');
    assert.strictEqual(openRouterSuccess.source, 'openrouter', 'Selects openrouter on successful generation');
    assert.strictEqual(openRouterSuccess.url, 'https://images.openrouter.ai/generated/mock-art-12345.png', 'Resolves OpenRouter generated image URL');
    assert.strictEqual(openRouterSuccess.model, 'google/gemini-3.1-flash-image', 'Uses primary Tier 1 model');
    global.fetch = originalFetch;
    console.log('  ✅ Pass: OpenRouter Tier 1 image generation URL correctly resolved\n');
  } finally {
    process.env.OPENROUTER_API_KEY = savedApiKey;
    try {
      const { BridgeStorage } = await import('../lib/bridge-storage');
      BridgeStorage.clearAll();
    } catch {
      // ignore
    }
  }

  console.log('🎉 ALL API END-TO-END TESTS PASSED! (22/22 gates green)\n');
}

testApi().catch((err) => {
  console.error('API Test Failed:', err);
  process.exit(1);
});
