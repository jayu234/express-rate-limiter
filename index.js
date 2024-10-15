const rateLimiter = (options = {}) => {
  const { timeWindow = 10000, maxRequests = 2 } = options;
  const clients = new Map();

  return (req, res, next) => {
    const clientIP = req.ip;
    const currentTime = Date.now();

    const clientData = clients.get(clientIP) || { count: 1, startTime: currentTime };

    if(clientData?.count > maxRequests) {
      return res.status(429).json({ message: 'Too many requests, please try again later.'});
    }

    if(currentTime - clientData?.startTime <= timeWindow) {
      clientData.count += 1;
    } else {
      clientData.count = 1;
      clientData.startTime = currentTime;
    }

    clients.set(clientIP, clientData);

    next();
  }
}

export default rateLimiter;
