import openSocket from "socket.io-client";

function connectToSocket() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  return openSocket(url as any);
}

export default connectToSocket;
