export enum Heardle {
  Daily = '[Daily Heardle]',
  Custom = '[Custom Heardle]',
  Unlimited = '[Unlimited Heardle]'
}

export const logger = (type: Heardle, ...params: any) => {
  if (process.env.NODE_ENV !== 'test' && type !== Heardle.Unlimited) {
    console.log(type, ...params);
  }
};
