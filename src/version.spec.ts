import { version } from './version';

test('version is exported', () => {
  expect(typeof version).toBe('string');
});
