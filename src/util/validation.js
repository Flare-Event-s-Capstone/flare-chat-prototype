export function hasNumber(str) {
  return /\d/.test(str);
}

export function hasUpperCase(str) {
  return /[A-Z]/.test(str);
}

export function hasSpecialChars(str) {
  return /[!@#$%^&*(),.?":{}|<>]/.test(str);
}

export function meetsLength(str) {
  return str.length >= 8;
}
