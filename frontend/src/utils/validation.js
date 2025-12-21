export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhone = (phone) => {
  // Basic phone validation (digits, +, -, spaces, parentheses)
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

export const validateUsername = (username) => {
  // Alphanumeric, underscore, hyphen, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateOTP = (otp) => {
  // 6-digit OTP
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

export const validateUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = formData[field];

    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = fieldRules.requiredMessage || `${field} is required`;
      return;
    }

    if (value && fieldRules.email && !validateEmail(value)) {
      errors[field] = fieldRules.emailMessage || 'Invalid email address';
      return;
    }

    if (value && fieldRules.password && !validatePassword(value)) {
      errors[field] = fieldRules.passwordMessage || 'Password must be at least 8 characters with uppercase, lowercase, and number';
      return;
    }

    if (value && fieldRules.phone && !validatePhone(value)) {
      errors[field] = fieldRules.phoneMessage || 'Invalid phone number';
      return;
    }

    if (value && fieldRules.minLength && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = fieldRules.minLengthMessage || `Minimum length is ${fieldRules.minLength}`;
      return;
    }

    if (value && fieldRules.maxLength && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = fieldRules.maxLengthMessage || `Maximum length is ${fieldRules.maxLength}`;
      return;
    }

    if (value && fieldRules.username && !validateUsername(value)) {
      errors[field] = fieldRules.usernameMessage || 'Username must be 3-20 characters (alphanumeric, underscore, hyphen)';
      return;
    }

    if (value && fieldRules.custom && !fieldRules.custom(value)) {
      errors[field] = fieldRules.customMessage || `${field} is invalid`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

