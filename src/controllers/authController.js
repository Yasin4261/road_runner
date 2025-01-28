const authService = require('../services/authService');

exports.login = async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).send({ message: 'Authorization header missing' });
  }

  const token = authorizationHeader.split('Bearer ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Token missing' });
  }

  try {
    const decodedToken = await authService.verifyToken(token);
    console.log('Decoded Token:', decodedToken);
    res.status(200).send({ message: 'Login successful', token: token });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).send({ message: 'Invalid token' });
  }
};