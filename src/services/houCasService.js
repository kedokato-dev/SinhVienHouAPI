const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const { createSession } = require('../sessionStore');

const casUrl = 'https://cas.hou.edu.vn/cas/login?service=https://sinhvien.hou.edu.vn/login.aspx';

async function login(username, password) {
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar, withCredentials: true }));

  try {
    // B1: Lấy token
    const res = await client.get(casUrl);
    const $ = cheerio.load(res.data);
    const execution = $('input[name=execution]').val();

    if (!execution) throw new Error('Không lấy được execution token');

    // B2: Gửi POST login
    const loginRes = await client.post(casUrl, new URLSearchParams({
      username,
      password,
      execution,
      '_eventId': 'submit',
      geolocation: ''
    }), {
      maxRedirects: 0,
      validateStatus: status => status === 302
    });

    const ticketUrl = loginRes.headers.location;
    if (!ticketUrl) throw new Error('Đăng nhập thất bại');

    // B3: Truy cập ticket
    await client.get(ticketUrl);

    // ✅ Lưu session cookie
    createSession(jar);

    return { success: true, message: 'Đăng nhập thành công' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

module.exports = { login };
