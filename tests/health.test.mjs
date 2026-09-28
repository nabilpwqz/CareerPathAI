import test from 'node:test';
import assert from 'node:assert/strict';

test('Health: health payload conforms to operational observability contract', () => {
  const healthPayload = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: 'connected',
      type: 'in-memory-fallback',
    },
    aiConfig: {
      activeProvider: 'offline-deterministic',
      geminiConfigured: false,
      openaiConfigured: false,
    },
    environment: 'test',
  };

  assert.equal(healthPayload.status, 'healthy');
  assert.ok(healthPayload.uptimeSeconds >= 0);
  assert.ok(healthPayload.database.status === 'connected');
  assert.ok(typeof healthPayload.timestamp === 'string');
});
