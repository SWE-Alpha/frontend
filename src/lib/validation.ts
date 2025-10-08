/**
 * Validates a Ghana phone number
 * Valid formats:
 * 1. +233XXXXXXXXX (total 13 chars where X is 9 more digits after +233)
 * 2. 0XXXXXXXXX (total 10 chars where X is 9 digits after 0)
 * 
 * @param number The phone number to validate
 * @returns An object with isValid flag and a message if invalid
 */

const phoneError: string = "Invalid Phone Number";
export function validatePhoneNumber(number: string): { isValid: boolean; message?: string } {
  // Remove any spaces or hyphens that might have been entered
  const cleanNumber = number.replace(/[\s-]/g, '');
  
  // Check if the number starts with +233 and has 12 more chars (13 total)
  if (cleanNumber.startsWith('+233')) {
    // Check if it has exactly 9 more digits after +233
    if (cleanNumber.length !== 13) {
      return { 
        isValid: false, 
        message: phoneError 
      };
    }
    
    // Check if the remaining characters are digits
    if (!/^\+233\d{9}$/.test(cleanNumber)) {
      return { 
        isValid: false, 
        message: phoneError
      };
    }
    
    return { isValid: true };
  } 
  // Check if it starts with 0 and has 10 chars total
  else if (cleanNumber.startsWith('0')) {
    if (cleanNumber.length !== 10) {
      return { 
        isValid: false, 
        message: phoneError 
      };
    }
    
    // Check if all characters are digits
    if (!/^0\d{9}$/.test(cleanNumber)) {
      return { 
        isValid: false, 
        message: phoneError 
      };
    }
    
    return { isValid: true };
  } 
  // Any other format is invalid
  else {
    return { 
      isValid: false, 
      message: 'Sorry, Buddies Inn is not currently operating in your country. Valid phone numbers must start with +233 or 0 (Ghana)' 
    };
  }
}