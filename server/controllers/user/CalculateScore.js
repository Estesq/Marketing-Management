import { testModel } from "../../models/testSchema.js";

const CalculateScore = async(userID, userQuestions, res, country) => {
  try {
    const test = await testModel.findOne({userID}, 'Questions _id');
    if(!test) return res.json({success:false, msg:"Failed to find the test"});
    
    // logic to calculate the score of the user
    const QuestionPaper = test.Questions;
    let score = 0;
    let averageTime = 0;
    let questionsAttempted = 0;
    let correctAnswers = 0;
    let accuracy = 0

    const userQuestionsAndAnswers = userQuestions.map((userQuestion, i) => {
        const userAns = userQuestion.answer;
        const mainQuestion = QuestionPaper.find(paper => paper._id.toString() === userQuestion.questionID);
        const mainAnswer = mainQuestion.Answer;

        if(userAns === mainAnswer){
          score+=1;
          correctAnswers+=1;
        };

        return {question:mainQuestion.Question, answer:mainAnswer, userAnswer:userAns, answerValue:mainQuestion.Options[parseInt(mainAnswer)-1], userAnswerValue:mainQuestion.Options[parseInt(userAns)-1]}
    });

    // calculate other stats
    questionsAttempted = userQuestions.length;
    averageTime = (15/questionsAttempted).toFixed(2);
    accuracy = ((correctAnswers/questionsAttempted)*100).toFixed(2);
    
    // save stats in document
    test.score = score;
    test.questionsAttempted = questionsAttempted;
    test.correctAnswers = correctAnswers;
    test.accuracy = Number(accuracy);
    test.averageTime = Number(averageTime);
    test.isTestCompleted = true;

    test.userQuestionsAndAnswers = userQuestionsAndAnswers;
    test.country = country || "";

    await test.save(function(err){
        if(err) return res.send({success:false, msg:'Failed to save test'});

        return res.send({success:true, msg:`Test submitted successfully`});
    });
  }
  catch (error) {
    return res.json({success:false, msg:"Unexpected error occurred"})
  }
}

export default CalculateScore;