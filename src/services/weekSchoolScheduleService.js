const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support');
const { getSession } = require('../sessionStore');

function createClientBySession(sessionId) {
    const jar = getSession(sessionId);
    if (!jar) return null;
    return wrapper(axios.create({ jar, withCredentials: true }));
}

async function getWeekSchoolSchedule(sessionId, weekValue) {
    const client = createClientBySession(sessionId);
    if (!client) {
        throw new Error('Session not found or expired');
    }

    try {
        // Gửi yêu cầu GET để lấy trang lịch học
        const response = await client.get('https://sinhvien.hou.edu.vn/wfrmLichHocSinhVienTinChi.aspx');
        const $ = cheerio.load(response.data);

        // Chọn tuần học (nếu cần)
        const formData = {
            __EVENTTARGET: 'cmbTuan_thu',
            __EVENTARGUMENT: '',
            __VIEWSTATE: $('#__VIEWSTATE').val(),
            __VIEWSTATEGENERATOR: $('#__VIEWSTATEGENERATOR').val(),
            __EVENTVALIDATION: $('#__EVENTVALIDATION').val(),
            cmbTuan_thu: weekValue, 
        };

        // Gửi yêu cầu POST để cập nhật tuần học
        await client.post('https://sinhvien.hou.edu.vn/wfrmLichHocSinhVienTinChi.aspx', new URLSearchParams(formData).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        // Lấy lại trang sau khi chọn tuần
        const updatedResponse = await client.get('https://sinhvien.hou.edu.vn/wfrmLichHocSinhVienTinChi.aspx');
        const updated$ = cheerio.load(updatedResponse.data);

        // Trích xuất thông tin ngày trong tuần
        const weekdays = [];
        const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
        
        updated$('#grdViewLopDangKy tr.HeaderStyle th').each((index, element) => {
            if (index > 0) { // Bỏ qua cột đầu tiên (Ca học)
                weekdays.push(updated$(element).text().trim());
            }
        });

        // Khởi tạo cấu trúc dữ liệu cho lịch học theo thứ trong tuần
        const weekSchedule = {
            weekDays: weekdays,
            byDays: {} 
        };

        // Khởi tạo cấu trúc dữ liệu cho từng ngày trong tuần
        daysOfWeek.forEach((day, index) => {
            weekSchedule.byDays[day] = {
                fullDate: weekdays[index] || "",
                classes: []
            };
        });

        // Cào dữ liệu theo từng ngày (cột)
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const dayOfWeek = daysOfWeek[dayIndex];
            
            // Duyệt qua từng hàng để lấy dữ liệu của ngày đó
            updated$('#grdViewLopDangKy tr').each((rowIndex, row) => {
                if (rowIndex === 0) return; // Bỏ qua hàng tiêu đề
                
                const timeSlot = updated$(row).find('td').first().text().trim();
                const cell = updated$(row).find(`td:nth-child(${dayIndex + 2})`); // +2 vì cột đầu tiên là Ca học
                
                const cellContent = cell.html();
                if (cellContent && cellContent.trim() !== '&nbsp;') {
                    const classInfo = parseClassInfo(cell);
                    
                    // Thêm thông tin về ngày và ca học
                    classInfo.dayOfWeek = dayOfWeek;
                    classInfo.fullDateInfo = weekdays[dayIndex];
                    classInfo.timeSlot = timeSlot;
                    
                    // Thêm vào mảng lớp học của ngày tương ứng
                    weekSchedule.byDays[dayOfWeek].classes.push(classInfo);
                }
            });
        }

        return weekSchedule;
    } catch (error) {
        console.error('Error fetching schedule:', error);
        throw error;
    }
}

function parseClassInfo(cellElement) {
    // Kiểm tra xem cell có nội dung không
    if (!cellElement.find('p').length) {
        return null;
    }

    // Lấy nội dung từ thẻ p
    const classText = cellElement.find('p').html();
    if (!classText) return null;

    // Loại bỏ thẻ HTML và phân tích nội dung
    const plainText = classText.replace(/<br>/g, '\n').trim();
    const lines = plainText.split('\n').map(line => line.trim()).filter(line => line);

    // Trích xuất thông tin môn học
    const classInfo = {
        subject: lines[0] || '',
        session: extractValue(lines[1] || '', 'Tiết học:'),
        classId: extractValue(lines[2] || '', 'Mã lớp:'),
        teacher: extractValue(lines[3] || '', 'GV:'),
        room: extractValue(lines[4] || '', 'Phòng:'),
        type: extractValue(lines[5] || '', 'Hình thức học:'),
        isSubstitute: cellElement.find('p').hasClass('hocbu')
    };

    return classInfo;
}

function extractValue(text, prefix) {
    if (text.startsWith(prefix)) {
        return text.substring(prefix.length).trim();
    }
    return text.trim();
}

module.exports = { getWeekSchoolSchedule };