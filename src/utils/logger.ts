export enum Heardle {
  Daily = '[Daily Heardle]',
  Custom = '[Custom Heardle]'
}

export const logger = (type: Heardle, ...params: any) => {
  console.log(type, ...params);
};
