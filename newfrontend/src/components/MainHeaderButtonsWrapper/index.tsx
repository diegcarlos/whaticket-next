import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const mainHeaderButtonsWrapper = {
  flex: "none",
  marginLeft: "auto",
};

function MainHeaderButtonsWrapper(props: Props) {
  const { children } = props;

  return <div style={mainHeaderButtonsWrapper}>{children}</div>;
}

export default MainHeaderButtonsWrapper;
