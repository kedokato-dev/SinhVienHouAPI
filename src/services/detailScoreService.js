const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support'); // Import wrapper
const { getSession } = require('../sessionStore');

function createClientBySession(sessionId) {
    const jar = getSession(sessionId);
    if (!jar) return null;
    return wrapper(axios.create({ jar, withCredentials: true })); // Use wrapper here
}

async function getDetailScore(sessionId, subjectId) {
    const client = createClientBySession(sessionId);
    if (!client) return { success: false, message: 'Session không tồn tại hoặc đã hết hạn' };

    try {
        // Truy cập link chi tiết điểm
        const detailUrl = `https://sinhvien.hou.edu.vn/KetQuaHocTapChiTiet.aspx?&ID_mon=${subjectId}`;
        const res = await client.get(detailUrl); // Gửi yêu cầu HTTP GET
        const $ = cheerio.load(res.data); // Phân tích cú pháp HTML từ phản hồi

        // Tìm bảng chứa dữ liệu chi tiết điểm
        const detailTable = $('#grdViewDiem');
        const detailScores = [];

        // Duyệt qua từng hàng trong bảng (trừ hàng tiêu đề)
        detailTable.find('tr').each((index, element) => {
            if (index === 0) return; // Bỏ qua hàng tiêu đề

            const columns = $(element).find('td');

            // Trích xuất dữ liệu từ từng cột
            const semester = $(columns[0]).text().trim();
            const academicYear = $(columns[1]).text().trim();
            const studyTime = $(columns[2]).text().trim();
            const examTime = $(columns[3]).text().trim();
            const componentScores = $(columns[4]).text().trim();
            const noExamReason = $(columns[5]).text().trim();
            const examScore = $(columns[6]).text().trim();
            const practicalExamScore = $(columns[7]).text().trim();
            const note = $(columns[8]).text().trim();
            const averageScore = $(columns[9]).text().trim();
            const letterGrade = $(columns[10]).text().trim();

            // Đẩy dữ liệu vào mảng detailScores
            detailScores.push({
                semester,
                academicYear,
                studyTime: studyTime ? parseInt(studyTime, 10) : null,
                examTime: examTime ? parseInt(examTime, 10) : null,
                componentScores: componentScores !== '\u00A0' ? componentScores : '',
                noExamReason: noExamReason !== '\u00A0' ? noExamReason : '',
                examScore: examScore !== '\u00A0' ? parseFloat(examScore) : null,
                practicalExamScore: practicalExamScore !== '\u00A0' ? parseFloat(practicalExamScore) : null,
                note: note !== '\u00A0' ? note : '',
                averageScore: averageScore !== '\u00A0' ? parseFloat(averageScore) : null,
                letterGrade: letterGrade !== '\u00A0' ? letterGrade : ''
            });
        });

        // Trả về dữ liệu chi tiết điểm
        return { success: true, data: detailScores };
    } catch (error) {
        console.error('Error fetching score details:', error.message);
        return { success: false, message: 'Lỗi khi lấy chi tiết điểm', error: error.message };
    }
}

// Export the new function
module.exports = {
    getDetailScore
};
