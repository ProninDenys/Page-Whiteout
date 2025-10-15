// Глобальные утилиты (без модулей)
window.isLuhnValid = function(num) {
  const s = (num || '').replace(/\D+/g, '');
  if (s.length < 12) return false;
  let sum = 0, dbl = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = +s[i];
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d; dbl = !dbl;
  }
  return (sum % 10) === 0;
};
window.getDefaultCfg = () =>
  ({ detectEmail:true, detectPhone:true, detectCard:true, detectIban:true, pad:2 });