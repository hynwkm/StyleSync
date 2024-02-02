import imageToBase64 from "image-to-base64/browser";

export default function encodeImage(imagePath) {
    imageToBase64(imagePath) // Path to the image
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log(error); // Logs an error if there was one
        });
}
