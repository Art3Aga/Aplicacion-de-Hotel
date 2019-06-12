import { MPipe } from './m.pipe';

describe('MPipe', () => {
  it('create an instance', () => {
    const pipe = new MPipe();
    expect(pipe).toBeTruthy();
  });
});
