import { useEffect, useState } from "react";

const classes = {
  timerBox: {
    display: "flex",
    marginLeft: 10,
    marginRight: 10,
    alignItems: "center",
  },
};

const RecordingTimer = () => {
  const initialState = {
    minutes: 0,
    seconds: 0,
  };
  const [timer, setTimer] = useState(initialState);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setTimer((prevState) => {
          if (prevState.seconds === 59) {
            return { ...prevState, minutes: prevState.minutes + 1, seconds: 0 };
          }
          return { ...prevState, seconds: prevState.seconds + 1 };
        }),
      1000
    );
    return () => {
      clearInterval(interval);
    };
  }, []);

  const addZero = (n: any) => {
    return n < 10 ? "0" + n : n;
  };

  return (
    <div style={classes.timerBox}>
      <span>{`${addZero(timer.minutes)}:${addZero(timer.seconds)}`}</span>
    </div>
  );
};

export default RecordingTimer;
