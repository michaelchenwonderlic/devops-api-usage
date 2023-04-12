
export function validateEmailInput(email: string) {
  var regexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;

  // Throw error if email check fails (same regex as from wnd-angular-forms which is used for signup)
  if (!regexp.test(email)) {
    throw new Error(`email Error: email address provided is not in the correct format: "${email}"`);
  }
}