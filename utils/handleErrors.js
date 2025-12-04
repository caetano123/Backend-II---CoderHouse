
module.exports = function handleErrors(res, error, status = 500) {
  console.error(error);
  return res.status(status).json({
    error: error.message || 'Error interno del servidor'
  });
};
