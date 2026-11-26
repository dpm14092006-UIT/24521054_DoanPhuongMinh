import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getSwipeDirection, scoreHistory } from '../src/deck.js';

test('Điểm được tính từ lịch sử và thay đổi khi hoàn tác lượt cuối', () => {
  const history = [{ direction: 'right' }, { direction: 'up' }, { direction: 'left' }];
  assert.equal(scoreHistory(history), 0);
  assert.equal(scoreHistory(history.slice(0, -1)), 5);
});

test('Vuốt chỉ nhận trục chính và đủ khoảng cách', () => {
  assert.equal(getSwipeDirection(55, 9), 'right');
  assert.equal(getSwipeDirection(-60, 20), 'left');
  assert.equal(getSwipeDirection(15, -60), 'up');
  assert.equal(getSwipeDirection(10, 70), null);
  assert.equal(getSwipeDirection(20, -15), null);
});
