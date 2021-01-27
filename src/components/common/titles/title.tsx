import React from 'react';

interface ITitleProps {
  text: string;
}

function Title({ text }: ITitleProps) {
  return (
    <div className="max-w-screen-xl mb-3 flex flex-col justify-center md:flex-row md:justify-between">
      <h1 className="font-semibold text-4xl justify-center md:justify-start items-center md:items-start text-center">
        {text}
      </h1>
      <div className="flex flex-col items-center md:items-end justify-center md:justify-start text-center">
        <h3 className="font-medium text-base"># Stay at Home for a While 🏠</h3>
        <h6 className="font-light">Thanks for using Our Service 🙏</h6>
      </div>
    </div>
  );
}

export default Title;
