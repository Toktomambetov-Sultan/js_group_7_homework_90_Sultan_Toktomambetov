import React, { useEffect, useRef, useState } from "react";

const lineWidth = 5;

const App = () => {
  const [state, setState] = useState({
    mouseDown: false,
    intermediateDots: [],
    allDots: [],
  });
  const ws = useRef(null);
  useEffect(() => {
    ws.current = new WebSocket("ws:/localhost:8000/canvas");
    ws.current.onopen = () => {
      ws.current.send(
        JSON.stringify({
          type: "INIT_CANVAS",
        })
      );
    };
    ws.current.onclose = () => console.log("ws closed");
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "CREATE_DOTS":
          setState((prevState) => ({
            ...prevState,
            allDots: [data.dots, ...prevState.allDots],
          }));
          break;
        case "INIT_CANVAS":
          setState((prevState) => ({
            ...prevState,
            allDots: [...data.dots, ...prevState.allDots],
          }));
          break;
        default:
      }
    };

    return () => ws.current.close();
  }, []);
  const drawCanvas = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = lineWidth * 2 + 0.3 * lineWidth;
    for (const dotsArray of [state.intermediateDots, ...state.allDots]) {
      const len = dotsArray.length;
      for (let i = 0; i < len; i++) {
        const { x: x1, y: y1 } = dotsArray[i];
        const { x: x2, y: y2 } = dotsArray[
          i + 1 === dotsArray.length ? i : i + 1
        ];
        console.log({ x1, y1 });
        ctx.beginPath();
        ctx.arc(x1, y1, lineWidth, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  };
  useEffect(() => {
    drawCanvas();
  });
  const canvas = useRef(null);
  const canvasMouseMoveHandler = (event) => {
    if (state.mouseDown) {
      event.persist();
      const x = event.clientX;
      const y = event.clientY;
      setState((prevState) => {
        return {
          ...prevState,
          intermediateDots: [
            ...prevState.intermediateDots,
            {
              x,
              y,
            },
          ],
        };
      });
    }
  };

  const mouseDownHandler = (event) => {
    setState({ ...state, mouseDown: true });
  };
  const mouseUpHandler = (event) => {
    const ctx = canvas.current.getContext("2d");
    ctx.beginPath();

    ws.current.send(
      JSON.stringify({
        type: "CREATE_DOTS",
        dots: state.intermediateDots,
      })
    );
    setState((prevState) => ({
      ...state,
      mouseDown: false,
      intermediateDots: [],
    }));
  };
  return (
    <div>
      <canvas
        ref={canvas}
        style={{ border: "1px solid black" }}
        width={800}
        height={600}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onMouseMove={canvasMouseMoveHandler}
      />
    </div>
  );
};
export default App;
