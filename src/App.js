import { useState } from "react";
import "./css/app.css";

const App = () => {

    const [images, setImages] = useState();
    const [allFiles, setAllFiles] = useState([]);

    const [uploading, setUploading] = useState(false);

    const [showImageModal, setShowImageModal] = useState(false);
    const [currImage, setCurrImage] = useState("");

    const getImages = (e) => {
        try {

            // console.log("e.target.files : ", e.target.files);

            const imageUrls = [];

            setAllFiles(e.target.files);

            for (const image of e.target.files) {
                let url = URL.createObjectURL(image);
                imageUrls.push(url);
            }

            setImages(imageUrls);

        } catch (err) {
            console.log(err);
        }
    }

    const uploadImages = async () => {

        setUploading(true);

        const formData = new FormData();

        for (const image in images) {
            console.log("Image: ", image);
            formData.append(image.name, allFiles[image]);
        }

        const raw_res = await fetch(`http://localhost:8080/business/upload-images`, {
            method: "POST",
            body: formData
        });

        const res = await raw_res.json();

        setUploading(false);

        return res;

    }

    const removeImage = (src) => {
        setImages((prevValue) => {
            return prevValue.filter((pv) => pv !== src);
        });
    }

    const showImage = (src) => {
        setCurrImage(src);
        setShowImageModal(true);
    }

    return (
        <>

            {
                uploading ?

                    <div style={{ overflow: "auto", zIndex: 9999, position: "absolute", width: "100%", height: "100%", top: 0, left: 0, display: "grid", placeItems: "center", background: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)" }}>
                        
                        <progress></progress>

                        <br />

                        <h1>Uploading...</h1>

                    </div>

                    :
                    null
            }

            {
                showImageModal && currImage ?
                    <>
                        <div style={{ overflow: "auto", zIndex: 9999, position: "absolute", width: "100%", height: "100%", top: 0, left: 0, display: "grid", placeItems: "center", background: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(10px)" }}>
                            <img alt="foods" src={currImage} style={{ width: "100%" }} />

                            <h1 onClick={() => {
                                setCurrImage("");
                                setShowImageModal(false);
                            }} style={{ cursor: "pointer", border: "0.2rem solid black", position: "absolute", top: "3%", right: "5%", backgroundColor: "white", fontSize: "3rem", width: "4rem", height: "4rem", display: "grid", placeItems: "center", borderRadius: "5rem" }}>&times;</h1>

                        </div>
                    </>
                    :
                    null
            }

            <h1 className="header">Upload Images</h1>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <input onChange={getImages} type="file" id="files" multiple className="input-type-file" />
                <label htmlFor="files" className="files-label">Add Photos &nbsp; + </label>
            </div>

            <br />
            <br />

            <div style={{ display: "flex", flexWrap: "wrap", flex: 1 }}>
                {
                    images && images.length > 0 && images.map((img) => {
                        return (
                            <div style={{ position: "relative", width: "25%", height: "25%", display: "grid", placeItems: "center", }}>
                                <img alt="foods" onClick={() => showImage(img)} src={img} style={{ width: "90%", height: "90%" }} />
                                <h1 onClick={() => removeImage(img)} style={{ cursor: "pointer", position: "absolute", top: 0, right: 0, backgroundColor: "white", width: "2rem", height: "2rem", display: "grid", placeItems: "center", borderRadius: "5rem" }}>&times;</h1>
                            </div>
                        );
                    })
                }
            </div>

            <br />
            <br />

            {
                images && images.length > 0 ?
                    <div style={{ display: "grid", placeItems: "center" }}>
                        <button onClick={async () => {
                            const res = await uploadImages();
                            window?.ReactNativeWebView?.postMessage(JSON.stringify(res));
                        }} className="files-label" style={{ border: "none", backgroundColor: "indigo" }}>Upload &nbsp; ⇧</button>
                    </div>
                    :
                    null
            }
        </>
    );
}

export default App;