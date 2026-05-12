import 'dotenv/config'
import {app, server} from './src/app.js'
import connectDB from './src/db/db.js';
import {connectToSocket} from './src/controllers/socketManager.js';


const PORT = process.env.PORT  

connectDB();
const io = connectToSocket(server);



server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})