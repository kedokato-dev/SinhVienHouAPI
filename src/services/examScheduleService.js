const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support');
const { getSession } = require('../sessionStore');

function createClientBySession(sessionId) {
    const jar = getSession(sessionId);
    if (!jar) return null;
    return wrapper(axios.create({ jar, withCredentials: true }));
}

async function getExamSchedule(sessionId) {
    const client = createClientBySession(sessionId);
    if (!client) return { success: false, message: 'Session không tồn tại hoặc đã hết hạn' };

    try {
        const res = await client.get('https://sinhvien.hou.edu.vn/ThongTinLichThi.aspx');
        const $ = cheerio.load(res.data);

        const examSchedules = [];
        let currentSemester = '';

        // Lấy dữ liệu từ bảng lịch thi
        $('#grd tbody tr').each((index, element) => {
            // Bỏ qua hàng tiêu đề
            if ($(element).hasClass('HeaderStyle')) return;

            const $row = $(element);
            const cells = $row.find('td');
            
            // Kiểm tra xem hàng này có chứa ô semester không
            const firstCell = cells.first();
            const hasSemesterCell = firstCell.attr('rowspan') !== undefined;
            
            if (hasSemesterCell) {
                // Lưu học kỳ mới nếu có
                currentSemester = firstCell.text().trim();
                
                // Khi có ô học kỳ (có rowspan), các ô tiếp theo sẽ là các thông tin khác
                const examSchedule = {
                    semester: currentSemester,
                    subject: $(cells[1]).text().trim(),
                    testTime: $(cells[2]).text().trim(),
                    testPhase: $(cells[3]).text().trim(),
                    date: $(cells[4]).text().trim(),
                    session: $(cells[5]).text().trim(),
                    time: $(cells[6]).text().trim(),
                    room: $(cells[7]).text().trim(),
                    studentNumber: $(cells[8]).text().trim(),
                    examType: $(cells[9]).text().trim(),
                    note: $(cells[10]).text().trim() || ""
                };
                examSchedules.push(examSchedule);
            } else {
                // Khi không có ô học kỳ (do rowspan từ hàng trước), các ô bắt đầu từ 0
                const examSchedule = {
                    semester: currentSemester,
                    subject: $(cells[0]).text().trim(),
                    testTime: $(cells[1]).text().trim(),
                    testPhase: $(cells[2]).text().trim(), 
                    date: $(cells[3]).text().trim(),
                    session: $(cells[4]).text().trim(),
                    time: $(cells[5]).text().trim(),
                    room: $(cells[6]).text().trim(),
                    studentNumber: $(cells[7]).text().trim(),
                    examType: $(cells[8]).text().trim(),
                    note: $(cells[9]).text().trim() || ""
                };
                examSchedules.push(examSchedule);
            }
        });

        return { 
            success: true, 
            data: {
                examSchedules
            }
        };
    } catch (err) {
        console.error('Error getting exam schedule:', err);
        return { success: false, message: err.message };
    }
}

module.exports = {
    getExamSchedule
};