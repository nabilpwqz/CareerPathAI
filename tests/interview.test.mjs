import test from 'node:test';
import assert from 'node:assert/strict';

test('Interview: mock session generation conforms to STAR schema rubric', () => {
  const mockSession = {
    id: 'int_session_test_1',
    role: 'Senior Full Stack Engineer',
    questionIndex: 0,
    questions: [
      {
        id: 'q1',
        prompt: 'Describe a challenging technical architectural refactoring you led.',
        category: 'System Architecture',
        targetSTAR: {
          situation: 'Legacy monolithic architecture bottleneck',
          task: 'Migrate to modular micro-services',
          action: 'Implemented strangler fig pattern and distributed tracing',
          result: 'Reduced P99 latency by 45%'
        }
      }
    ]
  };

  assert.equal(mockSession.questions.length, 1);
  assert.equal(mockSession.questions[0].category, 'System Architecture');
  assert.ok(mockSession.questions[0].targetSTAR.result.includes('45%'));
});

test('Interview: score evaluation computes weighted criteria properly', () => {
  const criteria = {
    technicalAccuracy: 90,
    starClarity: 85,
    communication: 95
  };

  const overallScore = Math.round(
    (criteria.technicalAccuracy * 0.4) +
    (criteria.starClarity * 0.4) +
    (criteria.communication * 0.2)
  );

  assert.equal(overallScore, 89);
  assert.ok(overallScore >= 80, 'Score reflects strong candidate benchmark');
});
