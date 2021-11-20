class Controller {
  sendErrorResponse(res, errors = {}, message = 'An unexpected error occurred', statusCode = 400) {
    return res.status(statusCode)
      .json({
        success: false,
        errors,
        message
      });
  }

  sendServerError(res, message = '') {
    return res.status(500)
      .json({
        success: false,
        message
      });
  }

  sendSuccessResponse(res, data = {}, message = 'Operation Completed Successfully!', statusCode = 200)
  {
    return res.status(statusCode)
      .json({
        success: true,
        data,
        message,
      })
  }
}

module.exports = Controller;