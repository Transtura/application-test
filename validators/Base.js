class Base {
  validateString(data) {
    return /^[a-zA-Z]+$/.test(data);
  }

  validateEmail(data) {
    return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(data);
  }
}

module.exports = Base;