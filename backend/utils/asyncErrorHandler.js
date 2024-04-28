module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      res.status(404).json({
        status: "fail",
        message: err.message,
      });
    });
  };
};
