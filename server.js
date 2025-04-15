const app = require('./src/index');
const axios = require('axios');

const PORT = process.env.PORT || 3000;


const pingServer = () => {
    const serverUrl = `https://sinhvienhouapi.onrender.com`;
    setInterval(async () => {
      try {
        const response = await axios.get(serverUrl);
        console.log(`✅ Ping thành công đến ${serverUrl}: ${response.status}`);
      } catch (error) {
        console.error(`❌ Lỗi khi ping: ${error.message}`);
      }
    }, 5 * 60 * 1000); // Ping mỗi 5 phút
  };

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  pingServer(); 
});
