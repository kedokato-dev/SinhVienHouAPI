const { CookieJar } = require('tough-cookie');
const { v4: uuidv4 } = require('uuid');

const sessionMap = new Map(); // sessionId => CookieJar

function createSession(jar) {
  const sessionId = uuidv4();
  sessionMap.set(sessionId, jar);
  return sessionId;
}

function getSession(sessionId) {
  return sessionMap.get(sessionId);
}

module.exports = { createSession, getSession };
