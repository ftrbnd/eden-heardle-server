export enum Heardle {
  Daily = '[Daily Heardle]',
  Custom = '[Custom Heardle]'
}

export const logger = (type: Heardle, ...params: any) => {
  if (process.env.NODE_ENV !== 'test') console.log(type, ...params);
};
