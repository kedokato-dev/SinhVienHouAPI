const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support'); // Import wrapper
const { getSession } = require('../sessionStore');

function createClientBySession(sessionId) {
    const jar = getSession(sessionId);
    if (!jar) return null;
    return wrapper(axios.create({ jar, withCredentials: true })); // Use wrapper here
}

async function getTrainingScoreDetails(sessionId) {
    const client = createClientBySession(sessionId);
    if (!client) return { success: false, message: 'Session không tồn tại hoặc đã hết hạn' };

    try {
        const res = await client.get('https://sinhvien.hou.edu.vn/KetQuaRenLuyen.aspx');
        const $ = cheerio.load(res.data);

        const rows = $('#grdViewLopDangKy tbody tr').not('.HeaderStyle'); // Exclude header row
        const scores = [];

        rows.each((index, row) => {
            const columns = $(row).find('td');
            scores.push({
                semester: $(columns[0]).text().trim(),
                academicYear: $(columns[1]).text().trim(),
                totalScore: $(columns[2]).text().trim(),
                rank: $(columns[3]).text().trim(),
            });
        });

        return { success: true, data: scores };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

module.exports = { getTrainingScoreDetails };