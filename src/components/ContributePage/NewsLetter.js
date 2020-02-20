import React from 'react';

export default function NewsLetter() {

  return(
  <div className="cardContent">
    <h2>Keep up to date with what we are doing!</h2>
      <a 
        href="https://mailchi.mp/f38a195f62f3/jointheneighborhood" 
        rel="noopener noreferrer"
        target="_blank">
          <button className="button-wire">Sign up for our News Letter</button>
      </a>
  </div>
  )
}