// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//     const token = req.header('Authorization');
    
//     if (!token) {
//         return res.status(401).json({ msg: 'No token, authorization denied' });
//     }

//     try {
//         const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
//         req.user = decoded.user;
//         next();
//     } catch (err) {
//         res.status(401).json({ msg: 'Invalid token' });
//     }
// };
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.customer = decoded; // directly attach decoded payload (id and userType)
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

