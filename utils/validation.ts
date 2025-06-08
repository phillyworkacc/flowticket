export function validateEmail(email: string) {
   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
   return regex.test(email);
}
