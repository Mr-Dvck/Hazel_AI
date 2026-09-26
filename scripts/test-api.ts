import assert from 'assert';

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
  console.log('  ✅ Pass: Chat route successfully delivers compliant SSE stream\n');

  console.log('🎉 ALL API END-TO-END TESTS PASSED! (4/4 gates green)\n');
}

testApi().catch((err) => {
  console.error('API Test Failed:', err);
  process.exit(1);
});
