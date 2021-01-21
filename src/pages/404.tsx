import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2>Oops! Page Not Found.</h2>
      <Link to="/">Go Back to &rarr;</Link>
    </div>
  );
}

export default NotFound;
