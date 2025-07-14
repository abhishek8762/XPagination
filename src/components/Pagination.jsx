import React, { useEffect, useMemo, useState } from "react";
import "./Pagination.css";

const Pagination = () => {
  // functions to handle the table data
  const [tableData, setTableData] = useState([]);

  // functions to handle current page
  const [currentPage, setCurrentPage] = useState(1);

  // function to determine entries per page
  const entriesPerPage = 10;

  const indexOfLastItem = currentPage * entriesPerPage;

  const indexOfFirstItem = indexOfLastItem - entriesPerPage;

  const currentItems = useMemo(
    () => tableData.slice(indexOfFirstItem, indexOfLastItem),
    [tableData, indexOfFirstItem, indexOfLastItem]
  );

  //   const currentItems = tableData?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(tableData?.length / entriesPerPage);

  //console.log(totalPages);

  // functions to check if data is loading
  const [loading, setLoading] = useState(true);

  // functions for error handling
  const [error, setError] = useState(null);

  // using useEffect hook to render data
  useEffect(() => {
    fetchTableData();
  }, []);

  // function to call the api
  const fetchTableData = async () => {
    setLoading(true);
    try {
      let data = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );

      if (!data.ok) {
        throw new Error("Network response was not ok: ", data.status);
      }

      let json = await data.json();

      setTableData(json);
      //console.log(json);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching table data : ", error);
      window.alert("Failed to fetch data: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  // function to go back a page
  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // function to go to next page
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  return (
    <div className="pagination-parent">
      <div className="table-div">
        {loading ? (
          <p>Loading Table Data...</p>
        ) : (
          <div className="data-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{entry.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br />

            <div className="pagination">
              <button
                className="prev-btn"
                onClick={handlePrev}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
              >
                Previous
              </button>
              <button className="active">{currentPage}</button>
              <button
                className="next-btn"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
