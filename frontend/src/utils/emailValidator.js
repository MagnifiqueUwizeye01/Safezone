export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateEmailDomain = (email, allowedDomains = []) => {
  if (!validateEmail(email)) return false;
  if (allowedDomains.length === 0) return true;
  
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
};

