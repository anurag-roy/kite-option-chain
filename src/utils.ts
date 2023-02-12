import { EXPIRY_OPTION_LENGTH } from '@/config';

export const getKeys = <T extends Object>(object: T) =>
  Object.keys(object) as Array<keyof T>;

export const classNames = (...classes: (boolean | string)[]) =>
  classes.filter(Boolean).join(' ');

const getMonthNameFronIndex = (monthIndex: number) => {
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
  return formatter.format(new Date(1970, monthIndex, 1));
};

export type ExpiryOption = {
  monthName: string;
  monthValue: number;
  year: number;
};

export const getExpiryOptions = () => {
  const date = new Date();
  let currentMonth = date.getMonth();
  let currentYear = date.getFullYear();

  const options = [] as ExpiryOption[];

  for (let i = 0; i < EXPIRY_OPTION_LENGTH; i++) {
    options.push({
      monthName: getMonthNameFronIndex(currentMonth),
      monthValue: currentMonth,
      year: currentYear,
    });

    currentMonth = currentMonth + 1;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear = currentYear + 1;
    }
  }

  return options;
};
