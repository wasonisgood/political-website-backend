// src/utils/response.js
class ResponseHandler {
    static success(res, data, message = 'Success', statusCode = 200) {
      return res.status(statusCode).json({
        success: true,
        message,
        data
      });
    }
  
    static error(res, error, statusCode = 400) {
      return res.status(statusCode).json({
        success: false,
        error: error.message || error
      });
    }
  }
  
  module.exports = ResponseHandler;