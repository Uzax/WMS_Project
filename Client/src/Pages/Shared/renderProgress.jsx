import React, { memo } from "react";
import clsx from "clsx";
import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        border: `1px solid ${theme.palette.divider}`,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: 26,
        borderRadius: 2
      },
      value: {
        position: "absolute",
        lineHeight: "24px",
        width: "100%",
        display: "flex",
        justifyContent: "center"
      },
      bar: {
        height: "100%",
        "&.low": {
          backgroundColor: "#088208a3"
        },
        "&.medium": {
          backgroundColor: "#efbb5aa3"
        },
        "&.high": {
          backgroundColor:  "#f44336"
         
        }
      }
    }),
  { defaultTheme }
);

const ProgressBar = memo(function ProgressBar(props) {
  const { value } = props;
  const valueInPercent = value ;
  const classes = useStyles();

  return (
    <div className={classes.root} >
      <div
        className={classes.value}
      >
        {`${valueInPercent.toLocaleString()} %`}
        {/* {valueInPercent + '%'} */}
      
      </div>
      <div
        className={clsx(classes.bar, {
          low: valueInPercent < 50,
          medium: valueInPercent >= 50 && valueInPercent <= 80,
          high: valueInPercent > 80
        })}
        style={{ maxWidth: `${valueInPercent}%` }}
      />
    </div>
  );
});


function renderProgress(params) {
    return <ProgressBar value={Number(params.row.Fill)} />;
  }

export default renderProgress;