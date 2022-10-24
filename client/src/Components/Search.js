import React, { useState } from "react";
import UserTable from "./UserTables";
import "./Search.css";

const Search = () => {
  const [filterData, setFilterData] = useState("");

  return (
    <>
      <div className="d-flex justify-content-between">
        <img src="/logo.png" alt="Logo" width={180}/>
        {/* <h2>Marketing Management</h2> */}
      </div>

      <div className="searchBox mt-5 container-fluid">
        <input
          className="form-control w-75 mx-auto"
          type="text"
          placeholder="Search..."
          onChange={(e) => setFilterData(e.target.value)}
        />
        <UserTable filterData={filterData} />
      </div>
    </>
  );
};

export default Search;
