import assert from 'node:assert/strict';
import { test } from 'node:test';
import { photosInCategory } from '../src/photos.js';

test('Lọc ảnh theo danh mục và xử lý danh mục lạ', () => {
  assert.ok(photosInCategory('evidence').every(({ category }) => category === 'evidence'));
  assert.equal(photosInCategory('city').length, 2);
  assert.deepEqual(photosInCategory('invalid'), photosInCategory('all'));
});
