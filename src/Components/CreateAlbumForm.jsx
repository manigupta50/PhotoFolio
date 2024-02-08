import React from "react";

const CreateAlbumForm = ({ handleSubmit, setAlbumName, albumName }) => {
  return (
    <div className="createAlbumForm">
      <h2>Create an album</h2>
      <form onSubmit={handleSubmit}>
        <input
          required
          placeholder="Enter Album Name"
          type="text"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
        />
        <button className="clearButton" onClick={() => setAlbumName("")}>
          Clear
        </button>
        <button className="createButton" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateAlbumForm;
