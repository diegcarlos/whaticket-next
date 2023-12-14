import { ReactNode, createContext, useContext, useState } from "react";

interface PropsReplyMessageContext {
  replyingMessage: any;
  setReplyingMessage: (data: any) => void;
}

const ReplyMessageContext = createContext<PropsReplyMessageContext>(
  {} as PropsReplyMessageContext
);

function ReplyMessageProvider({ children }: { children: ReactNode }) {
  const [replyingMessage, setReplyingMessage] = useState(null);

  return (
    <ReplyMessageContext.Provider
      value={{ replyingMessage, setReplyingMessage }}
    >
      {children}
    </ReplyMessageContext.Provider>
  );
}

function useReplyAccess() {
  return { ...useContext(ReplyMessageContext) };
}

export { ReplyMessageContext, ReplyMessageProvider, useReplyAccess };
