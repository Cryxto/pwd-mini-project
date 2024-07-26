export async function setDateNowAndAddDays(days: number) {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
export async function setDateNowAndAddMonth(month: number) {
  const newDate = new Date();
  newDate.setMonth(newDate.getMonth() + month);
  return newDate;
}
