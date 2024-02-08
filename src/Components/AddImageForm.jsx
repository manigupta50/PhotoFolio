import React from "react";

const AddImageForm = ({
  currentAlbum,
  handleAddImageToAlbum,
  setAlbumName,
  setCreateImageData,
  createImageData,
  editMode,
}) => {
  return (
    <div className="createAlbumForm">
      <h2>Add image to {currentAlbum.name}</h2>
      <form onSubmit={handleAddImageToAlbum}>
        {/* image title input */}
        <input
          required
          placeholder="Title"
          type="text"
          value={createImageData.title}
          onChange={(e) =>
            setCreateImageData({
              ...createImageData,
              title: e.target.value,
            })
          }
        />
        {/* image url input */}
        <input
          required
          placeholder="Enter image URL"
          type="text"
          value={createImageData.imageURL}
          onChange={(e) =>
            setCreateImageData({
              ...createImageData,
              id: new Date().toISOString(),
              imageURL: e.target.value,
            })
          }
        />
        <button className="clearButton" onClick={() => setAlbumName("")}>
          Clear
        </button>
        {/* conditionaly rendering button text*/}
        <button className="createButton" type="submit">
          {editMode ? "Save" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default AddImageForm;
