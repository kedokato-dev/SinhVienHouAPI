const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support');
const { getSession } = require('../sessionStore');

function createClient(username) {
  const jar = getSession(username);
  if (!jar) return null;
  return wrapper(axios.create({ jar, withCredentials: true }));
}

async function getProfile(username) {
  const client = createClient(username);
  if (!client) return { success: false, message: 'Chưa đăng nhập' };

  try {
    const res = await client.get('https://sinhvien.hou.edu.vn/');
    const $ = cheerio.load(res.data);
    const name = $('#HeaderSV1_lblHo_ten').text().trim();

    return { success: true, name };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Các API mở rộng sau này như getDiem, getThoiKhoaBieu...
// chỉ cần dùng lại createClient và gọi đúng URL

module.exports = { getProfile };
