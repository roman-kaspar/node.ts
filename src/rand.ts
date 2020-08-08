export const randInt = (max: number): number => {
  const num = max * Math.random();
  return Math.round(num);
};
