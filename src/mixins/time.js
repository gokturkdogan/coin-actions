export default {
  getNextHourMinus2MinTimestamp() {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    now.setMinutes(now.getMinutes() - 2);
    return now.getTime();
  }
}