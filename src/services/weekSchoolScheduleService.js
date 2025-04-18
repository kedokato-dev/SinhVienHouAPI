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
        let $ = cheerio.load(response.data);

        // Chỉ thực hiện POST để chọn tuần học nếu weekValue được cung cấp
        if (weekValue) {
            const currentSelectedWeek = $('#cmbTuan_thu').val();
            console.log(`Current week: ${currentSelectedWeek}, Requested week: ${weekValue}`);
            
            // Lấy tất cả các giá trị form cần thiết
            const formData = new URLSearchParams();
            
            // Set the correct target for ASP.NET form
            formData.append('__EVENTTARGET', 'cmbTuan_thu');
            formData.append('__EVENTARGUMENT', '');
            formData.append('__LASTFOCUS', '');
            formData.append('__VIEWSTATE', $('#__VIEWSTATE').val());
            formData.append('__VIEWSTATEGENERATOR', $('#__VIEWSTATEGENERATOR').val());
            formData.append('__EVENTVALIDATION', $('#__EVENTVALIDATION').val());
            
            // Add all dropdown values and select controls
            $('select').each((i, el) => {
                const name = $(el).attr('name');
                if (name) {
                    if (name === 'cmbTuan_thu') {
                        formData.append(name, weekValue);
                    } else {
                        formData.append(name, $(el).val() || '');
                    }
                }
            });
            
            // Add all hidden fields
            $('input[type="hidden"]').each((i, el) => {
                const name = $(el).attr('name');
                if (name && !formData.has(name)) {
                    formData.append(name, $(el).val() || '');
                }
            });
            
            console.log(`Submitting form with week value: ${weekValue}`);
            
            // Gửi yêu cầu POST để cập nhật tuần học
            const postResponse = await client.post(
                'https://sinhvien.hou.edu.vn/wfrmLichHocSinhVienTinChi.aspx', 
                formData.toString(),
                {
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': 'https://sinhvien.hou.edu.vn/wfrmLichHocSinhVienTinChi.aspx',
                        'Origin': 'https://sinhvien.hou.edu.vn'
                    },
                    maxRedirects: 5
                }
            );
            
            // Load the new page content
            $ = cheerio.load(postResponse.data);
            
            // Check if week was actually changed
            const newSelectedWeek = $('#cmbTuan_thu').val();
            console.log(`After form submission, selected week: ${newSelectedWeek}`);
            
            if (newSelectedWeek !== weekValue) {
                console.warn(`Week did not change as expected! Using direct GET method instead.`);
                
                // Try a more direct approach - sometimes GET with params works
                const directGetResponse = await client.get(
                    'https://sinhvien.hou.edu.vn/wfrmLichHocSinhVienTinChi.aspx', 
                    { params: { week: weekValue.replace(/\//g, '-') } }
                );
                $ = cheerio.load(directGetResponse.data);
            }
        }

        // Check current selected week
        const actualSelectedWeek = $('#cmbTuan_thu').val();
        console.log(`Processing schedule for week: ${actualSelectedWeek}`);

        // Trích xuất thông tin ngày trong tuần
        const weekdays = [];
        const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
        
        $('#grdViewLopDangKy tr.HeaderStyle th').each((index, element) => {
            if (index > 0) { // Bỏ qua cột đầu tiên (Ca học)
                weekdays.push($(element).text().trim());
            }
        });

        // Khởi tạo cấu trúc dữ liệu cho lịch học theo thứ trong tuần
        const weekSchedule = {
            weekValue: actualSelectedWeek,
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
            $('#grdViewLopDangKy tr').each((rowIndex, row) => {
                if (rowIndex === 0) return; // Bỏ qua hàng tiêu đề
                
                const timeSlot = $(row).find('td').first().text().trim();
                const cell = $(row).find(`td:nth-child(${dayIndex + 2})`); // +2 vì cột đầu tiên là Ca học
                
                const cellContent = cell.html();
                if (cellContent && cellContent.trim() !== '&nbsp;') {
                    const classInfo = parseClassInfo($, cell);
                    
                    if (classInfo) {
                        // Thêm thông tin về ngày và ca học
                        classInfo.dayOfWeek = dayOfWeek;
                        classInfo.fullDateInfo = weekdays[dayIndex];
                        classInfo.timeSlot = timeSlot;
                        
                        // Thêm vào mảng lớp học của ngày tương ứng
                        weekSchedule.byDays[dayOfWeek].classes.push(classInfo);
                    }
                }
            });
        }

        return weekSchedule;
    } catch (error) {
        console.error('Error fetching schedule:', error);
        throw error;
    }
}

function parseClassInfo($, cellElement) {
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