/**
 * Formats a standardized JSON response for successful operations.
 * 
 * @param {Object} res - Express response object.
 * @param {any} data - Content data payload to return.
 * @param {String} message - Accompanying status message description.
 * @param {Number} [statusCode=200] - HTTP status code (defaults to 200).
 * @returns {Object} Express JSON response.
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Formats a standardized JSON response for failed operations/errors.
 * 
 * @param {Object} res - Express response object.
 * @param {String} message - Error description message.
 * @param {Number} [statusCode=500] - HTTP status code (defaults to 500).
 * @param {any} [errors=null] - Detailed error parameters or validation arrays.
 * @returns {Object} Express JSON response.
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Formats a standardized JSON response for paginated data sets.
 * 
 * @param {Object} res - Express response object.
 * @param {Array} data - Array containing items of the current page.
 * @param {Number} total - Total count of documents across all pages.
 * @param {Number} page - Current page number.
 * @param {Number} limit - Current items-per-page limit.
 * @returns {Object} Express JSON response.
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const pages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  });
};
