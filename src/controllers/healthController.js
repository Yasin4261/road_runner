exports.healthCheck = (req, res) => {
    res.status(200).send({ message: 'Courier API is running' });
};