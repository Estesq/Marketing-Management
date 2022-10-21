import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Search from "./Search";
import { Users } from "./Users";
import "./UserTable.css";

const UserTable = ({ filterData }) => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [duplicateData, setduplicateData] = useState([]);
  const [errMsg, setErrMsg] = useState("Loading Tests");


  //get details of all tests
  const getTestDetails = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER}/admin/getTestDetails`);
      if (res.data.success) {
        setData(res.data.user)
        setduplicateData(res.data.user)
      }
      else {
        setErrMsg(res.data.msg)
      }
    }
    catch (error) {
      alert("Unexpected error occurred")
    }
  }

  useEffect(() => {
    getTestDetails();
  }, [])



  // Sorting
  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...data].sort((a, b) =>
        a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("DSC");
    } else {
      const sorted = [...data].sort((a, b) =>
        a[col].toString().toLowerCase() < b[col].toString().toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("ASC");
    }
  };

  // Search
  useEffect(() => {
    if (filterData !== "") {
      let searchedData = duplicateData.filter((item) => {
        return item.fullName.toLowerCase().trim().includes(filterData.toLowerCase().trim());
      });
      setData(searchedData);

      searchedData.length <= 0 && setErrMsg("No tests found");
    }
    else {
      setData(duplicateData);
    }
  }, [filterData]);

  return (
    <div className="userTable mt-5">
      {
        data.length > 0 ?
          <table className="table table-striped">

            <thead className="bg-dark text-light border-dark border">
              <tr>
                <th onClick={(e) => sorting("fullName")}>Name</th>
                <th onClick={(e) => sorting("position")}>Position</th>
                <th onClick={(e) => sorting("country")}>Country</th>
                <th onClick={(e) => sorting("score")}>Total Score</th>
                <th onClick={(e) => sorting("questionsAttempted")}>Questions Attempted</th>
                <th onClick={(e) => sorting("correctAnswers")}>Questions Answered Correctly</th>
                <th onClick={(e) => sorting("averageTime")}>
                  Average time taken per Question(in minutes)
                </th>
                <th onClick={() => sorting("accuracy")}>
                  Accuracy (percent correct of questions answered)
                </th>
                <th onClick={() => sorting("cv")}>
                  CV
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>
                      <NavLink to={`/questionPaper/${val.fullName}/${val.userID}`} className="fw-semibold text-decoration-none">
                        {val.fullName}
                      </NavLink>
                    </td>
                    <td>{val.position}</td>
                    <td>{val?.country || ""}</td>
                    <td>{val.score}</td>
                    <td>{val.questionsAttempted}</td>
                    <td>{val.correctAnswers}</td>
                    <td>{val.averageTime}</td>
                    <td>{val.accuracy}</td>
                    <td>
                      {
                        val?.file ?
                        <a href={val.file} target="_blank" rel="noopener noreferrer" className="fw-semibold text-decoration-none">
                          Click to view
                        </a>
                        :
                        <p>Not Found</p>
                      }
                    </td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
          :
          <h1>{errMsg}</h1>
      }
    </div>
  );
};

export default UserTable;
