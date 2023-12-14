import { Skeleton, TableCell, TableRow } from "@mui/material";
import { CSSProperties } from "react";

const classes: { [v: string]: CSSProperties } = {
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const TableRowSkeleton = ({ avatar, columns }: any) => (
  <>
    <TableRow>
      {avatar && (
        <>
          <TableCell style={{ paddingRight: 0 }}>
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" height={30} width={80} />
          </TableCell>
        </>
      )}
      {Array.from({ length: columns }, (_, index) => (
        <TableCell align="center" key={index}>
          <div style={classes.customTableCell}>
            <Skeleton animation="wave" height={30} width={80} />
          </div>
        </TableCell>
      ))}
    </TableRow>
  </>
);

export default TableRowSkeleton;
