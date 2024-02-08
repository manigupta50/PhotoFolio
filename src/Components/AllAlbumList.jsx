import React from "react";

const AllAlbumList = ({ allAlbums, handleAlbumClick }) => {
  return (
    <div className="allAlbums">
      {allAlbums.map((album, index) => {
        return (
          <div
            className="album"
            key={index}
            onClick={() => handleAlbumClick(album.id)}
          >
            <img src="https://mellow-seahorse-fc9268.netlify.app/assets/photos.png" />
            <h3>{album.name}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default AllAlbumList;
