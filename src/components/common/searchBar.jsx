import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="form-outline">
      <input
        type="search"
        id="searchBar"
        className="form-control"
        placeholder="Search..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
