import React from 'react';

interface IApolloErrorProps {
  errorMessage: string;
}

function ApolloError({ errorMessage }: IApolloErrorProps) {
  return (
    <div className="w-full flex flex-col px-5 items-center justify-center">
      <div className="max-w-screen-sm bg-red-500 px-24 py-10 mt-24">
        <div className="font-medium text-3xl mb-5">
          <h1>Oops!</h1>
        </div>
        <h3 className="text-xl">Error Occured.</h3>
        <span>Error Message: {errorMessage}</span>
      </div>
    </div>
  );
}

export default ApolloError;
