import React, { useEffect, useState } from 'react';
import axios from 'axios'

const Test = () => {
  const [questions, setQuestions] = useState([]);

  const getQuestions = async () => {
    const testID = localStorage.getItem("testId");
    try {
      const data = {
        testID,
        userID: localStorage.getItem("userID")
      }

      const res = await axios.post(`${process.env.REACT_APP_SERVER}/user/getQuestionFromId`, data);
      if (res.data.success) {
        const questionsArr = res.data.data[0].Questions;
        setQuestions(questionsArr);
      }
      else {
        alert(res.data.msg)
      }
    }
    catch (error) {
      console.log(error)
      alert("Unexpexted error occurred!!")
    }
  }

  useEffect(() => {
    getQuestions();
  }, [])


  return (
    <>
      <h1>Test</h1>
      {
        questions.map((q, i) => {
          return <div key={q._id}>
            <span style={{ fontWeight: "bold" }}>{i + 1}. </span>
            <p style={{ display: "inline-block" }}>{q.Question}</p>
            <div style={{ marginLeft: "20px" }}>
              {
                q.Options.map((option, index) => {
                  return <span style={{ marginRight: "10px" }} key={index}>{option}</span>
                })
              }
            </div>
          </div>
        })
      }
    </>
  )
}

export default Test