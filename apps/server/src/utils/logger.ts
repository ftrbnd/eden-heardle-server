export enum Heardle {
  Daily = '[Daily Heardle]',
  Custom = '[Custom Heardle]',
  Unlimited = '[Unlimited Heardle]'
}

export const logger = (type: Heardle, ...params: any) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(type, ...params);
  }
};
