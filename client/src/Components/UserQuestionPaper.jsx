import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {useNavigate, useParams } from 'react-router'

const UserQuestionPaper = () => {
    const {id, name} = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [user, setUser] = useState({name:"", email:""});

    const getUserPaper = async() => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_SERVER}/admin/getUserPaper`, {id, name});
            if(res.data.success){
                setData(res.data.UserPaper);
                setUser({name:res.data.name, email:res.data.email, country:res.data.country || ""});
            }
            else{
                alert(res.data.msg);
                navigate("/table", {replace:true});
            }
        }
        catch (error) {
            console.log(error)
            navigate("/table", {replace:true});
        }
    }

    useEffect(() => {
      getUserPaper();
    }, [])
    

  return (
    <div className="container">
        <h1 className="text-center">Question Paper</h1>
        <div className='d-flex flex-column justify-content-center bg-light p-4'>
            <div className="row">
                <h6>Name: {user.name}</h6>
                <h6>Email: {user.email}</h6>
                {user.country && <h6>Country: {user.country}</h6>}
            </div>
            {
                data.map((paper,i) => {
                    // 57 == ASCII of 9,
                    // 16 == to get the alphabet.
                    const userOptionNo = String.fromCharCode((57 + (paper.userAnswer - 9)) + 16);
                    const correctOptionNo = String.fromCharCode((57 + (paper.answer - 9)) + 16);

                    return <section className="mt-5 py-2 px-3 shadow-sm" key={i}>
                        <p className='mb-0'>{i+1}. {paper.question}</p>
                        <p>User's Answer: <span className='fst-italic'>
                            ({userOptionNo}). {paper.userAnswerValue}</span>
                        </p>
                        <p>Correct Answer: <span className='mt-3 fw-bold'>
                            ({correctOptionNo}). {paper.answerValue}</span>
                        </p>
                    </section>
                })
            }
        </div>
    </div>
  )
}

export default UserQuestionPaper