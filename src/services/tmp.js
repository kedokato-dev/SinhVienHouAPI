const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support'); // Import wrapper
const { getSession } = require('../sessionStore');

function createClientBySession(sessionId) {
    const jar = getSession(sessionId);
    if (!jar) return null;
    return wrapper(axios.create({ jar, withCredentials: true })); // Use wrapper here
}

async function getScore(sessionId) {
    const client = createClientBySession(sessionId);
    if (!client) return { success: false, message: 'Session không tồn tại hoặc đã hết hạn' };

    try {
        const res = await client.get('https://sinhvien.hou.edu.vn/KetQuaHocTap.aspx');
        const $ = cheerio.load(res.data);

        // Lấy dữ liệu từ các input fields
        const data = {
            gpa4: $('#lblTBC_tich_luy4').val()?.trim() || null,
            academicRank4: $('#lblXep_loai_hoc_luc').val()?.trim() || null,
            gpa4Current: $('#lblTBCHT4').val()?.trim() || null,
            academicRank4Current: $('#lblXep_loai_hoc_tap4').val()?.trim() || null,
            accumulatedCredits: $('#lblSo_tin_chi_tich_luy').val()?.trim() || null,
            gpa10Current: $('#lblTBCHT10').val()?.trim() || null,
            academicRank10Current: $('#lblXep_loai_hoc_tap10').val()?.trim() || null,
            retakeSubjects: $('#lblSo_mon_thi_lai').val()?.trim() || null,
            repeatSubjects: $('#lblSo_mon_hoc_lai').val()?.trim() || null,
            pendingSubjects: $('#lblSo_mon_cho_diem').val()?.trim() || null,
        };

        return { success: true, data };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

module.exports = { getScore };