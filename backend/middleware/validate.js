import { validationResult } from "express-validator";

/**
 * Validation wrapper middleware.
 * Executes express-validator validation rules, aggregates errors,
 * and formats them into a consistent structure if validation fails.
 * 
 * @param {Array} validations - Array of validation chains.
 * @returns {Function} Express middleware.
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validation rules concurrently
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format the validation error response to match: [{ field, message }]
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  };
};

export default validate;
