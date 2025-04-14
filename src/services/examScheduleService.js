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
            if (index === 0) return;
            
            const $row = $(element);
            
            // Kiểm tra nếu có thuộc tính rowspan ở ô đầu tiên (học kỳ, năm học)
            const semesterCell = $row.find('td:first-child');
            if (semesterCell.attr('rowspan')) {
                currentSemester = semesterCell.text().trim();
            }
            
            const examSchedule = {
                semester: currentSemester,
                subject: $row.find('td:nth-child(2)').text().trim(),
                testTime: $row.find('td:nth-child(3)').text().trim(),
                testPhase: $row.find('td:nth-child(4)').text().trim(),
                date: $row.find('td:nth-child(5)').text().trim(),
                session: $row.find('td:nth-child(6)').text().trim(),
                time: $row.find('td:nth-child(7)').text().trim(),
                room: $row.find('td:nth-child(8)').text().trim(),
                studentNumber: $row.find('td:nth-child(9)').text().trim(),
                examType: $row.find('td:nth-child(10)').text().trim(),
                note: $row.find('td:nth-child(11)').text().trim()
            };
            
            examSchedules.push(examSchedule);
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