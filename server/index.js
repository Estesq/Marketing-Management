import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/user/userRoutes.js';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import fileupload from 'express-fileupload'
import { adminRouter } from './routes/admin/adminRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(fileupload());
app.use(express.json());

const uri = process.env.MONGODB_CONNECTION_URL;
const PORT = process.env.PORT || 5000;


// routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);


app.get("/", (req, res) => {
    // main()
    return res.status(200).send("<h1>Hello World</h1>")
})



// Setup your mongodb connection here
try {
    mongoose.connect(`${uri}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    
    mongoose.connection.on('open', async () => {
        app.listen(PORT, () => {
            console.log('Server started and database connected')
        })
    })
}
catch (error) {
    console.log(error)
    process.exit(0);
}
