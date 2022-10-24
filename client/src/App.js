import React, {useState } from "react";
import axios from "axios";
import "./App.css";
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState();
    const [data, setData] = useState({
        fullName: "",
        email: "",
        phone: "",
        position: "1",
        language: "1",
        experience: "1",
    });

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (selectedFile) {
            formData.append("file", selectedFile);
        }
        formData.append("data", JSON.stringify(data));
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_SERVER}/user/userCV`,
                formData
            );
            if (res.data.success) {
                const { userID, email } = res.data.user;

                localStorage.setItem("userID", userID);
                localStorage.setItem("email", email);

                navigate(`/startTest`, { replace: true })
            }
            else {
                alert(res.data.msg);
            }
        }
        catch (ex) {
            console.log(ex);
        }

        setSelectedFile("");
        setData({
            fullName: "",
            email: "",
            phone: "",
            position: "",
            language: "",
            experience: "",
        });
    };
    

    return (
        <div className="App  container-fluid">
            <h2>Marketing Management</h2>
            <div className="box row col-sm-12 col-md-8 col-lg-6">
                <form
                    onSubmit={(e) => {
                        handleSubmit(e);
                    }}>
                    <p className="info text-center fs-5">
                        Please verify or enter your personal information
                    </p>
                    <br />
                    <label className="fw-normal">Full Name:</label>
                    <br />
                    <input
                        type="text"
                        className="text"
                        name="fullName"
                        placeholder="Please Enter your full name"
                        value={data.fullName}
                        required
                        onChange={handleChange}
                    />{" "}
                    <br />
                    <label className="fw-normal">Email:</label>
                    <br />
                    <input
                        type="email"
                        className="text"
                        name="email"
                        placeholder="Please Enter your Email"
                        value={data.email}
                        required
                        onChange={handleChange}
                    />{" "}
                    <br />
                    <label className="fw-normal">Phone Number:</label>
                    <br />
                    <input
                        type="number"
                        className="text"
                        name="phone"
                        placeholder="Please Enter your phone number"
                        value={data.phone}
                        required
                        onChange={handleChange}
                    />{" "}
                    <br />
                    <label className="fw-normal">Choose Your Position: *</label>
                    <br />
                    <select
                        value={data.position}
                        name="position"
                        className="text"
                        required
                        onChange={handleChange}
                    >
                        <option value="1">A</option>
                        <option value="2">B</option>
                        <option value="3">C</option>
                    </select>
                    <br />
                    <label className="fw-normal">Select Language: *</label>
                    <br />
                    <select
                        value={data.language}
                        name="language"
                        className="text"
                        required
                        onChange={handleChange}
                    >
                        <option value="1">Hindi</option>
                        <option value="2">English</option>
                    </select>
                    <br />
                    <label className="fw-normal">Your Work Experience: *</label>
                    <br />
                    <select
                        value={data.experience}
                        name="experience"
                        className="text"
                        required
                        onChange={handleChange}
                    >
                        <option value="1">0-1 year</option>
                        <option value="2">1-3 years</option>
                        <option value="3">3-5 years</option>
                        <option value="4">5+ years</option>
                    </select>
                    <br />

                    <div className="row d-flex justify-content-center mt-3">
                        <label htmlFor="fileIp" className="fileIp w-auto text-center mb-2 border p-2 rounded">Upload CV</label>
                        {
                            selectedFile?.name &&
                            <p className="fs-6 text-center">File: {selectedFile?.name}</p>
                        }
                        <input
                            id="fileIp"
                            type="file"
                            accept=".pdf"
                            name="file"
                            style={{ display: "none" }}
                            onChange={changeHandler} />
                    </div>

                    <br />
                    <input className="submit" type="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
}

export default App;
