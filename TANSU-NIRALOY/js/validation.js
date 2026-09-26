/**
 * ==========================================================================
 * TANSU NIRALOY - FORM VALIDATION SUITE
 * Pure Vanilla JavaScript
 * Strict validation according to specification requirements:
 * - Email: Must end with @gmail.com
 * - Password: Must contain both English letters and numbers (reject letters-only/numbers-only)
 * - Phone: Bangladesh phone format (+8801... or 01...)
 * - Price, Area, Bedrooms, Bathrooms positive values
 * - File validation: Image type and size constraints
 * ==========================================================================
 */

const Validation = {
  /**
   * Validate Gmail Address
   * @param {string} email
   * @returns {{ valid: boolean, message: string }}
   */
  validateGmail(email) {
    if (!email || !email.trim()) {
      return { valid: false, message: "Email address is required." };
    }
    const trimmed = email.trim().toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(trimmed)) {
      return { valid: false, message: "Please enter a valid Gmail address (e.g. yourname@gmail.com)." };
    }
    return { valid: true, message: "" };
  },

  /**
   * Validate Password Strength
   * Must contain letters and numbers; reject letters-only or numbers-only
   * @param {string} password
   * @returns {{ valid: boolean, message: string }}
   */
  validatePassword(password) {
    if (!password) {
      return { valid: false, message: "Password is required." };
    }
    if (password.length < 6) {
      return { valid: false, message: "Password must be at least 6 characters long." };
    }
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);

    if (hasLetters && !hasNumbers) {
      return { valid: false, message: "Password cannot contain letters only. It must also include numbers." };
    }
    if (!hasLetters && hasNumbers) {
      return { valid: false, message: "Password cannot contain numbers only. It must also include letters." };
    }
    if (!hasLetters || !hasNumbers) {
      return { valid: false, message: "Password must contain both English letters and numbers." };
    }
    return { valid: true, message: "" };
  },

  /**
   * Validate Password Confirmation Match
   */
  validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
      return { valid: false, message: "Please confirm your password." };
    }
    if (password !== confirmPassword) {
      return { valid: false, message: "Confirm password does not match password." };
    }
    return { valid: true, message: "" };
  },

  /**
   * Validate Bangladesh Phone Number
   * Accept: 017XXXXXXXX, 018XXXXXXXX, 019XXXXXXXX, 013XXXXXXXX, 014XXXXXXXX, 015XXXXXXXX, 016XXXXXXXX,
   * or with +88 prefix: +88017... or 88017...
   */
  validateBangladeshPhone(phone) {
    if (!phone || !phone.trim()) {
      return { valid: false, message: "Phone number is required." };
    }
    const cleanPhone = phone.trim().replace(/[\s-]/g, "");
    const bdPhoneRegex = /^(?:\+?88|88)?01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanPhone)) {
      return { valid: false, message: "Please enter a valid Bangladesh phone number (e.g. 01712345678)." };
    }
    return { valid: true, message: "" };
  },

  /**
   * Validate Positive Number
   */
  validatePositiveNumber(value, fieldLabel = "Value") {
    if (value === "" || value === null || value === undefined) {
      return { valid: false, message: `${fieldLabel} is required.` };
    }
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return { valid: false, message: `${fieldLabel} must be greater than 0.` };
    }
    return { valid: true, message: "" };
  },

  /**
   * Validate Non-negative integer (e.g. Bedrooms, Bathrooms)
   */
  validateNonNegativeInt(value, fieldLabel = "Value") {
    if (value === "" || value === null || value === undefined) {
      return { valid: false, message: `${fieldLabel} is required.` };
    }
    const num = Number(value);
    if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
      return { valid: false, message: `${fieldLabel} must be 0 or a positive whole number.` };
    }
    return { valid: true, message: "" };
  },

  /**
   * Validate Uploaded Image
   * @param {File} file
   * @param {number} maxMb
   */
  validateImageFile(file, maxMb = 5) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, message: `File "${file.name}" is not supported. Please upload JPG, PNG, or WEBP.` };
    }
    const maxBytes = maxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return { valid: false, message: `File "${file.name}" exceeds the ${maxMb}MB size limit.` };
    }
    return { valid: true, message: "" };
  },

  /**
   * UI Error Renderer
   */
  showError(inputElement, message) {
    if (!inputElement) return;
    inputElement.classList.add("is-invalid");
    let errorContainer = inputElement.parentElement.querySelector(".form-error");
    if (!errorContainer) {
      errorContainer = document.createElement("div");
      errorContainer.className = "form-error";
      inputElement.parentElement.appendChild(errorContainer);
    }
    errorContainer.textContent = message;
    errorContainer.classList.add("show");
  },

  /**
   * UI Error Cleaner
   */
  clearError(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove("is-invalid");
    const errorContainer = inputElement.parentElement.querySelector(".form-error");
    if (errorContainer) {
      errorContainer.textContent = "";
      errorContainer.classList.remove("show");
    }
  },

  /**
   * Clear All Form Errors
   */
  clearAllErrors(formElement) {
    if (!formElement) return;
    formElement.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
    formElement.querySelectorAll(".form-error").forEach(el => {
      el.textContent = "";
      el.classList.remove("show");
    });
  }
};
