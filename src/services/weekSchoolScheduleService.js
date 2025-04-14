const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support'); // Import wrapper
const { getSession } = require('../sessionStore');

function createClientBySession(sessionId) {
    const jar = getSession(sessionId);
    if (!jar) return null;
    return wrapper(axios.create({ jar, withCredentials: true })); // Use wrapper here
}

async function getWeekSchoolSchedule(sessionId, weekValue) {
    const client = createClientBySession(sessionId);
    if (!client) {
        throw new Error('Session not found or expired');
    }

    try {
        // Gửi yêu cầu GET để lấy trang lịch học
        const response = await client.get('https://sinhvien.hou.edu.vn/wfrmLichHocSinhVienTinChi.aspx'); // Thay bằng URL thực tế
        const $ = cheerio.load(response.data);

        // Chọn tuần học (nếu cần)
        const formData = {
            __EVENTTARGET: 'cmbTuan_thu',
            __EVENTARGUMENT: '',
            __VIEWSTATE: $('#__VIEWSTATE').val(),
            __VIEWSTATEGENERATOR: $('#__VIEWSTATEGENERATOR').val(),
            __EVENTVALIDATION: $('#__EVENTVALIDATION').val(),
            cmbTuan_thu: weekValue, // Giá trị tuần học
        };

        // Gửi yêu cầu POST để cập nhật tuần học
        await client.post('https://sinhvien.hou.edu.vn/wfrmLichHocSinhVienTinChi.aspx', new URLSearchParams(formData).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        // Lấy lại trang sau khi chọn tuần
        const updatedResponse = await client.get('https://sinhvien.hou.edu.vn/wfrmLichHocSinhVienTinChi.aspx');
        const updated$ = cheerio.load(updatedResponse.data);

        // Trích xuất dữ liệu lịch học từ bảng
        const schedule = [];
        updated$('#grdViewLopDangKy tr').each((rowIndex, row) => {
            if (rowIndex === 0) return; // Bỏ qua tiêu đề bảng
            const rowData = [];
            updated$(row).find('td').each((colIndex, col) => {
                rowData.push(updated$(col).text().trim());
            });
            schedule.push(rowData);
        });

        return schedule;
    } catch (error) {
        console.error('Error fetching schedule:', error);
        throw error;
    }
}

module.exports = { getWeekSchoolSchedule };