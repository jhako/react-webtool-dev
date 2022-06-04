import React, { useState } from 'react';
import './Page.css';

interface Props {
  text: string;
  onInputChanged: (newText: string) => void;
}

function TextInput(props: Props) {
  const { text, onInputChanged } = props;

  return (
    <input
      className="TextInput"
      type="text"
      value={text}
      onInput={(e) => onInputChanged((e.target as HTMLInputElement).value)}
    />
  );
}

export default function PageBinaryTranslator() {
  const [binaryUnique, setBinaryUnique] = useState(new ArrayBuffer(8));
  const [messageTxt, setMessageText] = useState('');

  // 文字列→整数  ※ カリー化
  const parseFuncInt = (radix: number) => (s: string) => {
    const buf = new ArrayBuffer(8);
    const n = parseInt(s, radix);
    if (Number.isNaN(n)) return undefined;
    new DataView(buf).setInt32(0, n);
    return buf;
  };

  // 整数→文字列  ※ カリー化
  const convFuncInt = (radix: number) => (b: ArrayBuffer) => {
    return new DataView(b).getInt32(0).toString(radix);
  };

  const onInputChanged =
    (parseFunc: (s: string) => ArrayBuffer | undefined) =>
    (newText: string) => {
      const newVal = parseFunc(newText);
      if (newVal !== undefined) {
        setBinaryUnique(newVal);
        setMessageText('OK');
      } else {
        setMessageText('NG');
      }
    };

  return (
    <div className="PageBinaryTranslator">
      <div>
        <span>10進数</span>
        <TextInput
          text={convFuncInt(10)(binaryUnique)}
          onInputChanged={onInputChanged(parseFuncInt(10))}
        />
      </div>
      <div>
        <span>16進数</span>
        <TextInput
          text={convFuncInt(16)(binaryUnique)}
          onInputChanged={onInputChanged(parseFuncInt(16))}
        />
      </div>
      <p>{messageTxt}</p>
    </div>
  );
}
