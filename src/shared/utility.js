export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const checkValidity = (value, rules) => {
  let isValid = false;

  if (rules.required) {
    isValid = value.trim() !== '';
  }

  if (rules.minLength && isValid) {
    isValid = value.length >= rules.minLength;
  }

  if (rules.maxLength && isValid) {
    isValid = value.length <= rules.maxLength;
  }

  if (rules.isEmail && isValid) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = pattern.test(value);
  }

  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value);
  }

  return isValid;
}