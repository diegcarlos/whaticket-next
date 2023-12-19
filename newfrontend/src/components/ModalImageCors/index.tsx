import { CSSProperties, useEffect, useState } from "react";

import ModalImage from "react-modal-image";
import api from "../../services/api";

const classes: { [v: string]: CSSProperties } = {
  messageMedia: {
    objectFit: "cover",
    width: 100,
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
};

const ModalImageCors = ({ imageUrl }: any) => {
  const [fetching, setFetching] = useState(true);
  const [blobUrl, setBlobUrl] = useState("");

  useEffect(() => {
    if (!imageUrl) return;
    const fetchImage = async () => {
      const { data, headers } = await api.get(imageUrl, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([data], { type: headers["content-type"] })
      );
      setBlobUrl(url);
      setFetching(false);
    };
    fetchImage();
  }, [imageUrl]);

  return (
    <ModalImage
      small=""
      style={classes.messageMedia}
      smallSrcSet={fetching ? imageUrl : blobUrl}
      medium={fetching ? imageUrl : blobUrl}
      large={fetching ? imageUrl : blobUrl}
      alt="image"
    />
  );
};

export default ModalImageCors;
