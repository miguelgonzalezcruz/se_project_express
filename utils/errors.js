const handleErrors = (err, res) => {
  if (err.statusCode === 400) {
    res.status(err.statusCode).send({ message: err.message });

    return;
  }
  if (err.statusCode === 404) {
    res.status(err.statusCode).send({ message: err.message });

    return;
  }
  res.status(500).send({ message: err.message });
};

module.exports = handleErrors;
