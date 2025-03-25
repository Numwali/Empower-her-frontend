import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='not-found'>
      <h1>404 Page Not Found</h1>
      <p>Sorry, we couldn't find the page you were looking for.</p>
      <Link to="/">Back To Home</Link>
    </div>
  );
};

export default NotFound;
