import React, { useState, useEffect } from "react";
import { Box, Stack, Card, Button } from '@mui/material';

import Logo from "../Logo/Logo";
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
// import QuestionChips from '../QuestionChips/QuestionChips';
import QuestionTable from '../QuestionTable/QuestionTable';
import axios from 'axios'
import { useNavigate } from "react-router";


const FinalScreen = () => {
    const [data, setData] = useState([]);
    const [country, setCountry] = useState("");
    const [mount, setMount] = useState(false);
    const navigate = useNavigate();


    const getQuestions = async () => {
        try {
            const testID = localStorage.getItem("testID");
            const userID = localStorage.getItem("userID");
            const data = {
                testID,
                userID
            }

            const res = await axios.post(`${process.env.REACT_APP_SERVER}/user/getQuestionFromId`, data);

            if (res.data.success) {
                let questionsArr = res.data.data;
                questionsArr = questionsArr.map(q => ({ ...q, choice: 0 }))
                setData(questionsArr);
            }
            else {
                if (res.data.isTestStarted) navigate("/startTest", { replace: true });
                else if (res.data.retestExhausted) navigate("/retestExhasuted", { replace: true });
                else {
                    alert(res.data.msg);
                    navigate("/startTest", { replace: true });
                }
            }
        } 
        catch (error) {
            alert("Unexpected error occurred");
            navigate("/startTest", { replace: true });
        }
    }

    const getCountry = async () => {
        const res = await axios.get("http://ip-api.com/json");
        setCountry(res.data?.country || "")
    }


    useEffect(() => {
        if (mount) {
            getQuestions();
            getCountry();
        }
        
        setMount(true);

        window.onbeforeunload = function () {
            return "Data will be lost if you leave the page, are you sure?";
        };

        return () => {
            window.onbeforeunload = null;
        };
    }, [mount]);


    const [index, setIndex] = useState(0);
    const setAns = (choice) => {
        data[index].choice = choice
    }

    async function Submit() {
        let finalAnswers = data.map(d => ({ questionID: d._id, answer: d.choice }));

        let userID = localStorage.getItem("userID");
        const data1 = {
            userID,
            questions: finalAnswers,
            country
        }

        const res = await axios.post(`${process.env.REACT_APP_SERVER}/user/submitTest`, { data: data1 });
        if (res.data.success) {
            navigate("/TestCompleted", { replace: true });
        }
        else {
            alert(res.data.msg);
            navigate("/startTest", { replace: true });
        }
    }




    return (
        <>
        <div className="container">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', }} padding={"1rem"} id='timer'>
                <Logo />

            </Box>
            
            {data[index]?.Images.length > 0 ? (
                <Stack flexDirection='column' >
                    <Stack className="testing" sx={{ display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>


                        <Card sx={{ flex: 1, boxShadow: 'none' }}>

                            <QuestionTable data={data[index]} index={index} sendAns={setAns} />
                        </Card>

                        <Card sx={{ flex: 0.8, boxShadow: 'none' }}>
                            {data[index].Images.map((img, key) => <img
                                src={"https://luke-pdf-image.s3.ap-south-1.amazonaws.com/" + img} key={key} className="img-fluid" />)}
                        </Card>
                    </Stack>

                    <Stack sx={{ justifyContent: 'center', alignItems: 'center', m: 2, mt: 5 }}>

                        {index < data.length - 1 && <Button sx={{
                            "&:hover": { 'background': 'lightblue' }, color: 'white', backgroundColor: 'green', padding: '0.5rem 1rem',
                            mt: '5%',
                        }} onClick={() => setIndex(i => i + 1)} > Submit Answer <ChevronRightOutlinedIcon /> </Button>}
                        {index === data.length - 1 && <Button variant='outlined' size='medium' sx={{
                                mt: '5%',
                                color: 'white', backgroundColor: 'green'
                            }} onClick={Submit}> Submit Answer </Button>}
                    </Stack>
                </Stack>
            )

                :

                (
                    <Stack flexDirection='column'>

                        <Stack className="" sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>

                            <Card sx={{ flex: 1, boxShadow: 'none' }}>
                                <QuestionTable data={data[index]} index={index} sendAns={setAns} />
                            </Card>

                        </Stack>

                        <Stack sx={{ justifyContent: 'center', alignItems: 'center', m: 2, mt: 5, }}>
                            {index < data.length - 1 && <Button sx={{
                                "&:hover": {
                                    'background': 'lightblue'
                                }, color: 'white', backgroundColor: 'green', padding: '0.5rem 1rem',

                            }} onClick={() => setIndex(i => i + 1)}> Submit Answer <ChevronRightOutlinedIcon /> </Button>}
                            {index === data.length - 1 && <Button variant='outlined' size='medium' sx={{
                                mt: '5%',
                                color: 'white', backgroundColor: 'green'
                            }} onClick={Submit}> Submit Answer </Button>}
                        </Stack>

                    </Stack>)
            }
</div>
        </>
    )
}
export default FinalScreen;


