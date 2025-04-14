const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support'); // Import wrapper
const { getSession } = require('../sessionStore');

function createClientBySession(sessionId) {
  const jar = getSession(sessionId);
  if (!jar) return null;
  return wrapper(axios.create({ jar, withCredentials: true })); // Use wrapper here
}

async function getInfoStudent(sessionId) {
    const client = createClientBySession(sessionId);
    if (!client) return { success: false, message: 'Session không tồn tại hoặc đã hết hạn' };

    try {
        const res = await client.get('https://sinhvien.hou.edu.vn/wfrmHoSoSinhVien.aspx');
        const $ = cheerio.load(res.data);
        const studentId = $('#txtMa_sv').attr('value');
        const studentName = $('#txtHo_ten').attr('value');
        const birthDate = $('#txtNgay_sinh').attr('value');
        const sex = $('#txtGioi_tinh').attr('value');
        const address = $('#txtNoi_sinh').attr('value');
        const phone = $('#txtDien_thoai_nr').attr('value');
        const userPhone = $('#txtDien_thoai_cn').attr('value');
        const detailAddress = $('#txtNoi_o_hien_nay').attr('value');
        const email = $('#txtEmail').attr('value');

        return {
            success: true,
            data: {
                studentId,
                studentName,
                birthDate,
                sex,
                address,
                phone,
                userPhone,
                detailAddress,
                email
            }
        };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

module.exports = { getInfoStudent };