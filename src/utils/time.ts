export const delay = (ms: number): Promise<void> => (
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
);

const offset = (new Date()).getTimezoneOffset();
export const timestamp = (): string => (
  (new Date(Date.now() - offset * 60 * 1000))
    .toISOString()
    .substr(0, 23)
    .replace('T', ' ')
);
