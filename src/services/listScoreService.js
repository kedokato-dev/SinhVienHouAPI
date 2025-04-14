const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support'); // Import wrapper
const { getSession } = require('../sessionStore');

function createClientBySession(sessionId) {
  const jar = getSession(sessionId);
  if (!jar) return null;
  return wrapper(axios.create({ jar, withCredentials: true })); // Use wrapper here
}

async function getListScore(sessionId) {
    const client = createClientBySession(sessionId);
    if (!client) return { success: false, message: 'Session không tồn tại hoặc đã hết hạn' };
  
    try {
      const res = await client.get('https://sinhvien.hou.edu.vn/KetQuaHocTap.aspx');
      const $ = cheerio.load(res.data);
  
      // Extracting the list of scores from the page
      const scores = [];
      
      // Find the table with scores
      const scoreTable = $('#grdDiemDaTichLuy');
      
      // Process each row except the header row
      scoreTable.find('tr').each((index, element) => {
        // Skip the header row (index 0)
        if (index === 0) return;
        
        const columns = $(element).find('td');
        
        // Extract data from each column
        const semester = $(columns[0]).text().trim();
        const academicYear = $(columns[1]).text().trim();
        const courseCode = $(columns[2]).text().trim();
        const courseName = $(columns[3]).text().trim();
        const credits = $(columns[4]).text().trim();
        const score10 = $(columns[5]).text().trim();
        const score4 = $(columns[6]).text().trim();
        const letterGrade = $(columns[7]).text().trim();
        const notCounted = $(columns[8]).find('input').prop('checked') === true;
        const note = $(columns[9]).text().trim();
        
        // Extract detail link
        const detailLink = $(columns[10]).find('a').attr('href');
        
        scores.push({
          semester,
          academicYear,
          courseCode,
          courseName,
          credits: credits ? parseFloat(credits) : null,
          score10: score10 ? parseFloat(score10) : null,
          score4: score4 ? parseFloat(score4) : null,
          letterGrade,
          notCounted,
          note: note !== '\u00A0' ? note : '', // Replace non-breaking space with empty string
          detailLink: detailLink || ''
        });
      });
  
      // Calculate additional statistics
      const totalCredits = scores
        .filter(score => !score.notCounted && score.credits)
        .reduce((sum, score) => sum + score.credits, 0);
      
      const totalScorePoints = scores
        .filter(score => !score.notCounted && score.credits && score.score4)
        .reduce((sum, score) => sum + (score.credits * score.score4), 0);
      
      const gpa = totalCredits > 0 ? (totalScorePoints / totalCredits).toFixed(2) : 0;
  
      return { 
        success: true, 
        data: {
          scores,
        }
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

module.exports = { getListScore };