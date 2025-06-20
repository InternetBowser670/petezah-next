let currentPassword = 'pzg';

export function getPassword() {
  return currentPassword;
}

export function setPassword(newPass: string) {
  currentPassword = newPass;
  console.log('Password rotated to:', currentPassword);
}