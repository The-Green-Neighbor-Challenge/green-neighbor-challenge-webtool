import React from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBullhorn, faEnvelopeOpenText, faHandHoldingUsd} from '@fortawesome/free-solid-svg-icons';


//-----< Resource Imports >-----\\
import Background from '../../images/bkg-forest-top.jpg';
import HomeButton from '../HomeButton/HomeButton';
import SocialMedia from '../ContributePage/SocialMedia';
import NewsLetter from './NewsLetter';
import Donate from './Donate';


//-----< Styling >-----\\
const BackgroundBox = styled.div`
  background-image: url(${Background});
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  min-height: 100vh;
  margin: 0;
  box-sizing: border-box;

  h2, h3 {
    color: white;
    text-align: center;
    text-shadow: 0 0 4px black;
  }
  
  a {
    display: block;
    width: 100%;
    text-decoration: none;
    display: flex;
    justify-content: center;
  }
  
  .socialMediaBox {
    background-color: #EEE;
    padding: 8px;
    border-radius: 8px;
  }
  
  .cardContent {
    display: grid;
    grid-template-rows: 1fr auto;
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Header = styled.div`
  display: flex;
    align-items: center;
    justify-content: center;
    
  color: white;
  text-shadow: 0 0 4px black;
  h1 {
    font-family: var(--font-header);
    font-size: 64px;
    margin: 0;
  }
`;

const Card = styled.div` 
  border: 2px solid white;
  border-radius: 16px;
  width: 320px;
  height: 320px;
  margin: 8px 16px;
  padding: 12px;
  box-sizing: border-box;

  display: grid;
  grid-template-rows: auto 1fr;

  .icon {
    color: white;
    display: block;
    margin: 16px auto;
    font-size: 80px;
  }
`;


//-----< Component Function >-----\\
export default function ContributePage() {
        
  return(
    <BackgroundBox>

      <HomeButton/>
      <Header>
          <h1>Contribute</h1>
      </Header>

      <Container>

        <Card className="blur-background">
          <FontAwesomeIcon className="icon" icon={faBullhorn} />
          
          <SocialMedia />
        </Card>

        <Card className="blur-background">
          <FontAwesomeIcon className="icon" icon={faEnvelopeOpenText} />
          <NewsLetter />
        </Card>

        <Card className="blur-background">
          <FontAwesomeIcon className="icon" icon={faHandHoldingUsd} />
          <Donate />
        </Card>
      
      </Container>

    </BackgroundBox>
  )
}