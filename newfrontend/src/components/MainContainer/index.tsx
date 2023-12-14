import { Container, styled } from "@mui/material";
import { CSSProperties } from "react";

interface Props {
  children: React.ReactNode;
}

const ContainerFluid = styled(Container)(() => {
  return {
    mainContainer: {
      flex: 1,
      // padding: theme.spacing(2),
      // height: `calc(100% - 48px)`,
      padding: 0,
      height: "100%",
    },
  };
});

const contentWrapper: CSSProperties = {
  height: "100%",
  overflowY: "hidden",
  display: "flex",
  flexDirection: "column",
};

function MainContainer(props: Props) {
  const { children } = props;

  return (
    <ContainerFluid maxWidth={false}>
      <div style={contentWrapper}>{children}</div>
    </ContainerFluid>
  );
}

export default MainContainer;
