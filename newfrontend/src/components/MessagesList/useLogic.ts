export function useLogic() {
  const audioTime = (mediaUrl: any, callback: (duration: number) => void) => {
    const audioElement = new Audio(mediaUrl);

    const handleMetadataLoaded = () => {
      const time = audioElement.duration;
      callback(time);
    };

    audioElement.addEventListener("loadedmetadata", handleMetadataLoaded);
    audioElement.load();
  };

  return { audioTime };
}
