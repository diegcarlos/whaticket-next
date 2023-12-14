import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const contactsHeader = {
  display: "flex",
  alignItems: "center",
  padding: "0px 6px 6px 6px",
};

function MainHeader(props: Props) {
  const { children } = props;
  return <div style={contactsHeader}>{children}</div>;
}

export default MainHeader;
