import imageToBase64 from "image-to-base64/browser";

export default function encodeImage(imagePath) {
    imageToBase64(imagePath)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log(error);
        });
}
