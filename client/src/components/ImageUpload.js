import React from "react";
import { Button } from "@material-ui/core";
function ImageUpload({
  successCallback,
  errorCallback,
  buttonText,
  buttonProps = {
    variant: "outlined",
    color: "primary",
    size: "small",
  },
  style = {
    marginBottom: "10px",
  },
}) {
  let openWidget = () => {
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "sunshinephoto",
        uploadPreset: "cxettook",
        cropping: true,
        clientAllowedFormats: ["png", "gif", "jpeg"],
        showCompletedButton: true,
        multiple: false,
        sources: ["local", "url", "camera"],
      },
      (error, result) => {
        if (error) {
          console.log("upload error", error);
          errorCallback(error);
        } else {
          if (result.event === "success") {
            successCallback(result);
          }
        }
      }
    );
    widget.open();
  };
  return (
    <Button {...buttonProps} onClick={openWidget} style={style}>
      {buttonText}
    </Button>
  );
}

export default ImageUpload;
