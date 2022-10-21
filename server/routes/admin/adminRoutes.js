import express from 'express';
import uploadExcelToDB from '../../controllers/admin/uploadExcelToDB.js';
import { testModel } from '../../models/testSchema.js';
import { userModal } from '../../models/UserSchema.js';
export const adminRouter = express.Router();

import {test1} from '../../utils/json/test1.js';

adminRouter.post("/excelUpload", (req, res) => {
    const file = req.files?.file;
    const filePath = "public/excels";
    const fileName = file?.name;
    const fullPath = `${filePath}/${fileName}`

    if(!file && fileName){
        return res.json({success:false, msg:"File not found"})
    }

    uploadExcelToDB(res,test1);
});



adminRouter.post("/getTestDetails", async(req, res) => {
    try {
        const user = await userModal.find().lean().select({__v:0});
        const test = await testModel.find().lean().select({Questions:0 ,email:0, __v:0})

        if(!user || !test) return res.json({success:false, msg:"Cannot find user and his test details"});

        const userDataArr = user.map(userDetails => {
            const testDetails = test.find(t => t.userID === userDetails._id.toString());
            return {...userDetails, ...testDetails}
        });

        if(!userDataArr.length>0) return res.json({success:false, msg:"Failed to find any test details"});

        return res.json({success:true, user:userDataArr})
    }
    catch (error) {
        return res.json({success:false, msg:"Internal server error occurred"})
    }
});



adminRouter.post("/getUserPaper", async(req, res) => {
    try {
        const {id, name} = req.body;

        const test = await testModel.findOne({userID:id}, "userQuestionsAndAnswers email country");
        const user = await userModal.findOne({_id:id}, "fullName file");

        if(!test || !user) return res.json({success:false, msg:"Failed to find the user or his test"});

        return res.json({success:true, UserPaper:test.userQuestionsAndAnswers, email:test.email, name:user.fullName, country:test.country})
    }
    catch (error) {
        return res.json({success:false, msg:"Internal server error occurred"})
    }
})