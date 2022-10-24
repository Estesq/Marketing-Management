import express from 'express';
import StartTest from '../../controllers/user/StartTest.js';
import { userCV } from '../../controllers/user/userCV.js';
import { userDetails } from '../../controllers/user/userDetails.js';
import { userModal } from '../../models/UserSchema.js';
import { testModel } from '../../models/testSchema.js';
import CalculateScore from '../../controllers/user/CalculateScore.js';
import { userTestSchema } from '../../utils/YupSchemas.js';

export const userRouter = express.Router();

userRouter.post("/userCV", (req, res) => {
    try {
        let data = JSON.parse(req.body.data);
        const file = req.files?.file;

        if (file) {
            if (file.size > 500000) return res.json({ success: false, msg: "File too big" })

            data = { ...data, file }
            userCV(data, req, res);
        }
        else {
            data = { ...data }
            userDetails(data, req, res)
        }
    }
    catch (error) {
        console.log(error)
        return res.json({ success: false, msg: "Unexpected error occurred!" })
    }
});


userRouter.post("/StartTest", async (req, res) => {
    try {
        const { email, userID } = req.body;
        let isTestAlreadyAvailable = false;

        const user = await userModal.findOne({ email: email, _id: userID });
        const test = await testModel.findOne({ email: email, userID: userID });

        if (!user) return res.json({ success: false, msg: "User not found!!" });

        else if (test?.isTestCompleted) return res.json({ success: false, msg: "Test already given!!", testCompleted: true });

        else if(test?.retest >= 3) {
            return res.json({ success: false, msg: 'You have exhausted your retest limit, please contact the admin', retestExhausted: true })
        }

        else if (test?.isTestStarted) {
            isTestAlreadyAvailable = true;
        };

        const size = 50;
        StartTest(userID, email, res, size, { isTestAlreadyAvailable, testID: test?._id });
    }
    catch (error) {
        console.log(error)
        return res.json({ success: false, msg: "Unexpected error occurred, or user not found" })
    }
});


userRouter.post("/getQuestionFromId", async (req, res) => {
    try {
        const { testID, userID } = req.body;
        if (!testID || !userID) return res.json({ success: false, msg: 'Cannot find the user or his test' });

        const userTestDoc = await testModel.find({ _id: testID, userID: userID }).select({ Questions: 1, retest: 1, isTestStarted: 1 });
        const { Questions, retest, isTestStarted } = userTestDoc[0];

        if (retest >= 3) {
            return res.json({ success: false, msg: 'You have exhausted your retest limit, please contact the admin', retestExhausted: true })
        }

        if (isTestStarted) {
            return res.json({ success: false, msg: 'You already started the test', isTestStarted: isTestStarted })
        }

        else {
            const questionsWithOptions = Questions.map(q => {
                const { _id, Question, Options, Images } = q;
                return { _id, Question, Options, Images }
            })

            userTestDoc[0].retest += 1;
            userTestDoc[0].isTestStarted = true;
            await userTestDoc[0].save();
            return res.json({ success: true, data: questionsWithOptions })
        }
    }
    catch (error) {
        console.log(error)
        return res.json({ success: false, msg: "Unexpected error occurred" })
    }
});


userRouter.post("/submitTest", (req, res) => {
    try {
        let { userID, questions, country } = req.body.data;
        questions = questions.filter(question => question.answer !== 0)

        if (!userID) return res.json({ success: false, msg: "Test not found" });
        else if (!questions || !questions.length > 0) return res.json({ success: false, msg: "No question was answered" });


        userTestSchema.validate({ questions })
            .then(response => {
                const { questions: userQuestions } = response;
                CalculateScore(userID, userQuestions, res, country);
            })
            .catch(err => {
                return res.json({ success: false, msg: "Validation error occurred", errror: err.message })
            })
    }
    catch (error) {
        return res.json({ success: false, msg: "Unexpected error occurred" })
    }
})