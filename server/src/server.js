const app = require('./app');
const connectDB = require('./config/db');
const { serverPort } = require('./secret');

app.listen(serverPort, async ()=>{
    logger.log('info', `Server running at http://localhost:${serverPort}`);
    await connectDB();
});
