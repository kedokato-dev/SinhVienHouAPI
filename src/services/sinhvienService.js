const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support'); // Import wrapper
const { getSession } = require('../sessionStore');

function createClientBySession(sessionId) {
  const jar = getSession(sessionId);
  if (!jar) return null;
  return wrapper(axios.create({ jar, withCredentials: true })); // Use wrapper here
}

async function getProfile(sessionId) {
  const client = createClientBySession(sessionId);
  if (!client) return { success: false, message: 'Session không tồn tại hoặc đã hết hạn' };

  try {
    const res = await client.get('https://sinhvien.hou.edu.vn/');
    const $ = cheerio.load(res.data);
    
    const name = $('#HeaderSV1_lblHo_ten').text().trim();
    const studentId = $('#HeaderSV1_lblMa_sv').text().trim();

    return {
      success: true,
      data: {
        name,
        studentId
      }
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

module.exports = { getProfile };