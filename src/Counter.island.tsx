import { useState } from "react";
import { styled } from "classname-variants/react";

type Props = {
  start?: number;
};

export default function Counter({ start = 0 }: Props) {
  const [counter, setCounter] = useState(start);
  return (
    <div className="flex gap-1">
      <Button className="bg-green-600" onClick={() => setCounter((c) => c - 1)}>
        -
      </Button>
      <span>{counter}</span>
      <Button onClick={() => setCounter((c) => c + 1)}>+</Button>
    </div>
  );
}

const Button = styled("button", "rounded bg-green-600 text-white px-2");
