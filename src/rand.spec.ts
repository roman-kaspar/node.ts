import { randInt } from './rand';

test('randInt(0) is equal to 0', () => {
  expect(randInt(0)).toBe(0);
});
