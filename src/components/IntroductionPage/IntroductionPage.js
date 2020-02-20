import React, { useState } from 'react';
import styled, {keyframes} from 'styled-components';
import { useHistory } from 'react-router-dom';

//-----< Resource Imports >-----\\
import Background from '../../images/bkg-forest-top.jpg';

//-----< Styling >-----\\
const appear_step1 = keyframes`
  0% {
    opacity: 0;
    transform: translate( 0, -10px);
  }
  100% {
    opacity: 1;
    transform: translate( 0, 0);
  }
`;

const appear_step2 = keyframes`
  0% {opacity: 0;}
  50% {opacity: 0;}
  100% {opacity: 1;}
`;

const BackgroundBox = styled.div`
  background-image: url(${Background});
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 32px;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: grid;
  grid-template-areas: "main" "learn";
  grid-template-rows: 1fr auto;
  border: 4px solid white;
  height: 100%;
`;

const ZipBox = styled.div`
  grid-area: main;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 0 4px black;

  h1, h2 {
    animation: 1s ${appear_step1} ease-in-out;
  }
  label, input, button {
    animation: 1s ${appear_step2} ease-in;
  }
  
  h1 {
    font-family: var(--font-header);
    font-size: 6em;
    margin: 0;
  }
  h2 {
    margin: 0;
    font-family: var(--font-main);
    font-weight: lighter;
  }
  label {
    margin: 64px 0 8px 0;
    font-family: var(--font-main);
  }
  input {
    background-color: rgba(255,255,255,.1);
    backdrop-filter: blur(0px);
    outline: none;
    border: 1px solid white;
    color: white;
    font-size: 30px;
    font-family: var(--font-header);
    padding: 8px;
    text-align: center;
    border-radius: 4px;
  }
`;

const LearnBox = styled.div`
  grid-area: learn;
  text-align: center;
  margin: 16px auto;
`;


//-----< Component Function >-----\\
export default function IntroductionPage() {
  const history = useHistory();
  let [zipInput, setZipInput] = useState('');

  function sendZipValue(){
    if(zipInput && zipInput.length){
      history.push(`/utility/${zipInput}`);
    }
  }

  function pressEnter(event) {
    if (event.key === "Enter") {
      sendZipValue(zipInput);
    }
  }

  return(
    <BackgroundBox>
      <Container>
        <ZipBox>
            <h1>The Green Neighbor Challenge</h1>
            <h2>Find green energy near you.</h2>
            <label>Enter your zip code to get started.</label>
            <input 
              className="zip-input" 
              type="number" 
              value={zipInput} 
              onKeyPress={event=>pressEnter(event)} 
              onChange={event => setZipInput(event.target.value)}/>
            <button className="button-wire" onClick={()=>sendZipValue(zipInput)}>Go</button>
        </ZipBox>

        <LearnBox>
          <button className="button-default" onClick={()=>history.push("/about")}>Learn who we are</button> 
          <button className="button-default" onClick={()=>history.push("/contribute")}>How you can help</button>
        </LearnBox>
      </Container>
    </BackgroundBox>
  )
}