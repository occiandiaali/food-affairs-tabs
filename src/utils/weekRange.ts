export enum WEEK_DAYS {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
  }
  
  export const getWeekRange = (
    now: Date,
    firstDay: WEEK_DAYS = WEEK_DAYS.Monday
  ): { from: Date; to: Date } => {
    const currentDay = now.getDate() - now.getDay();
    const from = new Date(now.setDate(currentDay + firstDay));
    const to = new Date(now.setDate(currentDay + 5 + firstDay));
    to.setHours(21);
    to.setMinutes(0);
    to.setSeconds(0);
  
    return {
      from,
      to,
    };
  };