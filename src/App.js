import { useEffect, useState } from "react";
import "./App.css";

// react toasts
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import CreateAlbumForm from "./Components/CreateAlbumForm";

// firebase imports
import { db } from "./firebaseInit";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import AllAlbumList from "./Components/AllAlbumList";
import AddImageForm from "./Components/AddImageForm";
import ImageList from "./Components/ImageList";

function App() {
  // necessare useStates
  const [shouldShowForm, setShouldShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [allAlbums, setAllAlbums] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [createImageData, setCreateImageData] = useState({
    id: null,
    title: null,
    imageURL: null,
  });
  const [currentAlbum, setCurrentAlbum] = useState(null);

  // useEffect to load data in real time using onSnapshot
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "AllAlbums"), (snapShot) => {
      const allAlbumsFromDB = snapShot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setAllAlbums(allAlbumsFromDB);
    });
  }, []);

  // adding album submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newAlbum = {
        name: albumName,
        images: [],
      };

      const allAlbumsRef = collection(db, "AllAlbums");

      const docRef = await addDoc(allAlbumsRef, newAlbum);

      setAllAlbums([{ ...newAlbum, id: docRef.id }, ...allAlbums]);

      setAlbumName("");

      toast.success("Album added successfully");
    } catch (error) {
      toast.error("Error occurred while adding album");
      console.error("Error adding album: ", error);
    }
  };

  // this function is used to open particular album and show all images present in that album
  const handleAlbumClick = (id) => {
    const targetedAlbum = allAlbums.find((album) => album.id === id);
    setCurrentAlbum(targetedAlbum);
  };

  // function to handle addition of image to an album
  const handleAddImageToAlbum = async (e) => {
    e.preventDefault();

    // Check if the form is in edit mode
    if (editMode) {
      // If in edit mode, call the update function and return
      handleUpdateImage();
      return;
    }

    // Create a new image object using the form data
    const newImage = {
      id: createImageData.id,
      title: createImageData.title,
      imageURL: createImageData.imageURL,
    };

    try {
      // Reference to the "AllAlbums" collection in the Firestore database
      const allAlbumsRef = collection(db, "AllAlbums");

      // Reference to the specific album document in the "AllAlbums" collection
      const albumRef = doc(allAlbumsRef, currentAlbum.id);

      // Retrieve the current state of the album document
      const albumSnapshot = await getDoc(albumRef);

      // Check if the album document exists
      if (albumSnapshot.exists()) {
        // If it exists, update the document by adding the new image to the existing images
        await updateDoc(albumRef, {
          images: [...currentAlbum.images, newImage],
        });

        // Update the local state with the new image added to the album
        setCurrentAlbum({
          ...currentAlbum,
          images: [...currentAlbum.images, newImage],
        });
      } else {
        // If the album document does not exist, create a new document with the album and the new image
        await setDoc(albumRef, {
          ...currentAlbum,
          images: [newImage],
        });

        // Update the local state with the new image added to the album
        setCurrentAlbum({
          ...currentAlbum,
          images: [newImage],
        });
      }

      // Reset the form data
      setCreateImageData({
        id: null,
        title: "",
        imageURL: "",
      });

      // Log success message and show a success toast
      console.log("Image added successfully!");
      toast.success("Image added successfully");
    } catch (error) {
      // Log error and show an error toast
      toast.error("Error occurred while adding image");
      console.error("Error adding image: ", error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      // Filter out the image with the specified id from the current album's images
      const updatedImages = currentAlbum.images.filter(
        (image) => image.id !== imageId
      );

      // Update the local state with the album's images excluding the deleted image
      setCurrentAlbum({
        ...currentAlbum,
        images: updatedImages,
      });

      // Reference to the "AllAlbums" collection in the Firestore database
      const allAlbumsRef = collection(db, "AllAlbums");

      // Reference to the specific album document in the "AllAlbums" collection
      const albumRef = doc(allAlbumsRef, currentAlbum.id);

      // Update the document in Firestore with the updated images
      await updateDoc(albumRef, {
        images: updatedImages,
      });

      // Show a success toast when the image is deleted
      toast.success("Image deleted successfully!");
    } catch (error) {
      // Show an error toast if there's an issue deleting the image
      toast.error("Error deleting image");
      console.error("Error deleting image: ", error);
    }
  };

  // function to fill form with image data that we want to edit
  const handleEdit = (image) => {
    setCreateImageData({
      id: image.id,
      title: image.title,
      imageURL: image.imageURL,
    });

    setShouldShowForm(true);
    setEditMode(true);
  };

  const handleUpdateImage = async () => {
    try {
      // Update the local state with the edited image data
      const updatedImages = currentAlbum.images.map((image) =>
        image.id === createImageData.id ? createImageData : image
      );

      // Update the local state with the updated images
      setCurrentAlbum({
        ...currentAlbum,
        images: updatedImages,
      });

      // Update the Firestore document to reflect the changes
      const allAlbumsRef = collection(db, "AllAlbums");
      const albumRef = doc(allAlbumsRef, currentAlbum.id);

      await updateDoc(albumRef, {
        images: updatedImages,
      });

      // Reset the state variables
      setShouldShowForm(false);
      setEditMode(false);
      setCreateImageData({
        id: null,
        title: "",
        imageURL: "",
      });

      toast.success("Image updated successfully!");
    } catch (error) {
      console.error("Error updating image: ", error);
    }
  };

  return (
    <div className="App">
      <ToastContainer />
      {/* navbar */}
      <div className="navBar">
        <div className="logo">
          <img src="https://mellow-seahorse-fc9268.netlify.app/assets/logo.png" />
          <h2>PhotoFolio</h2>
        </div>
      </div>

      {!currentAlbum && (
        <div className="albumBody">
          {/* create album form */}
          {shouldShowForm && (
            <CreateAlbumForm
              handleSubmit={handleSubmit}
              setAlbumName={setAlbumName}
              albumName={albumName}
            />
          )}
          {/* all albums list */}
          <div className="allAlbumContainer">
            <div className="allAlbumsHeading">
              <h2>Your Albums</h2>
              <button onClick={() => setShouldShowForm(!shouldShowForm)}>
                {!shouldShowForm ? "Add Album" : "Cancel"}
              </button>
            </div>
            <div className="allAlbums">
              <AllAlbumList
                allAlbums={allAlbums}
                handleAlbumClick={handleAlbumClick}
              />
            </div>
          </div>
        </div>
      )}
      {currentAlbum && (
        <>
          {shouldShowForm && (
            // add image form
            <AddImageForm
              currentAlbum={currentAlbum}
              handleAddImageToAlbum={handleAddImageToAlbum}
              setAlbumName={setAlbumName}
              setCreateImageData={setCreateImageData}
              createImageData={createImageData}
              editMode={editMode}
            />
          )}

          {/* image list header */}
          <div className="albumImages">
            <button
              className="createButton"
              onClick={() => setCurrentAlbum(null)}
            >
              Back
            </button>
            <h2>{currentAlbum.name}</h2>
            <button
              className={shouldShowForm ? "clearButton" : "createButton"}
              onClick={() => {
                setShouldShowForm(!shouldShowForm);
                setEditMode(false);
              }}
            >
              {!shouldShowForm ? "Add Image" : "Cancle"}
            </button>
          </div>
          {/* album's image lists */}
          <ImageList
            currentAlbum={currentAlbum}
            handleEdit={handleEdit}
            handleDeleteImage={handleDeleteImage}
          />
        </>
      )}
    </div>
  );
}

export default App;
