import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useHistory} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScroll, faSeedling, faExclamation, faHandsHelping, faCaretUp } from '@fortawesome/free-solid-svg-icons';

//-----< Resource Imports >-----\\
import Background from '../../images/bkg-forest-top.jpg';
import HomeButton from '../HomeButton/HomeButton';


//-----< Styling >-----\\
const Container = styled.div`
  width: auto;
  height: 100vh;
  margin: 0 auto;
  display: grid;
  grid-template-areas: "home" "main" "action";
  grid-template-rows: auto 1fr auto;
  background-image: url(${Background});
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  overflow: hidden;
`;

const TitleDiv = styled.div`
  grid-area: main;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 0 4px black;
  h1 {
    font-family: var(--font-header);
    font-size: 4em;
    margin: 0;
    margin-bottom: 32px;
  }
  h2 {
    font-family: var(--font-main);
    margin: 8px;
    font-size: 16px;
  }
  h3 {
    font-family: var(--font-main);
    margin: 4px;
    font-size: 24px;
  }
  p {
    margin: 0;
    font-family: var(--font-main);
  }
`;

const BottomDisplay = styled.div`
  grid-area: action;
  display: flex;
  margin: px auto;
  padding-right: px;
  justify-content: center;
  align-content: center;
  border-top: 4px dashed white;
  position: relative;
  transition: height .5s;
  height: ${props=>(props.active? `200px` : `0px`)};
`;

const ActionCard = styled.button`
  text-align: center;
  width: 25%;
  padding: 0 1%;
  color: rgba(255,255,255,.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all .3s;
  border: none;
  outline: none;
  font-size:  1em; 
  background: none;
  p {
    font-family: var(--font-main);
    font-size: ${props=>(props.myWidth>500? '1em' : '.8em')};
    text-shadow: 0 0 8px black;
    display: block;
  }
  .icon {
    display: block;
    margin: 0 auto;
    margin-top: 15%;
    transition: font-size: .2s;
    font-size: ${props=>(props.myWidth>500? '48px' : '32px')};
    transition: transform 1s;
  }
  &:hover, &:focus {
    cursor: pointer;
    background-color: rgba(255,255,255,.2);
    color: rgba(255,255,255,1);
    .icon {
      transform: scale(1.4);
    }
  }
`;

const appear_step1 = keyframes`
  0% {opacity: 0;}
  100% {opacity: 1;}
`;
const appear_step2 = keyframes`
  0% {opacity: 0;}
  50% {opacity: 0;}
  100% {opacity: 1;}
`;

const TitleMain = styled.div`
  animation: 1s ${appear_step1} ease-in;
`;
const TitleAction = styled.div`
  animation: 2s ${appear_step2} ease-in;
`;

const DiscoverBar = styled.div`
  .discoverButton {
    margin: 0 auto;
    display: block;
    background: none;
    outline: none;
    color: white;
    font-family: var(--font-header);
    font-size: 32px;
    border: none;
    p {
      margin: 0;
      transition: all 1s;
    }
    .icon {
      transform: scale(1) rotate(${props=> (props.active? `180deg` : `0`)});
      transition: transform .2s;
      transition-timing-function: cubic-bezier(.17,.67,.67,1.59);
    }
    &:hover {
      cursor: pointer;
      .icon {
        transform: scale(1.5) rotate(${props=> (props.active? `180deg` : `0`)});
      }
      p {
        transform: scale(1.2);
      }
    }
  }
`;

//>> This data populates the "discover more" bar, but the actual actions are handled on click
const actionData = [
  {action: 'utility', text: `View other energy programs near you`, short: 'Other Programs', icon: faScroll},
  {action: 'about', text: `Discover Green Energy's Impact`, short: 'FAQ', icon: faSeedling},
  {action: 'report', text: `Report a problem with this energy program`, short: 'Report Problem', icon: faExclamation},
  {action: 'contribute', text: `Discover how you can contribute`, short: 'Contribute', icon: faHandsHelping}
];

//-----< Component Function >-----\\
export default function DetailsPage() {

  const details = useSelector(state => state.programDetails)
  const history = useHistory();
  const dispatch = useDispatch();
  const {id, zip} = useParams(); 
  let [discoverActive, setDiscoverActive] = useState(false);  
  let [width, setWidth] = useState(window.innerWidth);

  useEffect(()=>{
    dispatch({type: 'GET_PROGRAM_DETAILS', payload: id});
    window.addEventListener('resize', ()=>setWidth(window.innerWidth));
  }, [id, dispatch]);

  // This is used for blurring the 'discover more' buttons while tabbing through
  function blurActions(event) {
    event.target.blur();
  }

  // This is what happens on clicking the 'discover more' buttons
  // These cases are determined by the actionData array defined outside the component function
  function clickAction(action) {
    switch(action) {
      case 'utility': history.push(`/utility/${zip}`); break;
      case 'about': history.push('/about'); break;
      case 'report': history.push(`/report/${zip}/${details.eia_state}/${details.id}`); break;
      case 'contribute': history.push('/contribute'); break;
      default: /* Always remember: keep React happy with default cases. */ break;
    }
  }

  function renderActions() {
    return actionData.map( (item,i)=>{
      return (
        <ActionCard key={i} onMouseLeave={blurActions} onClick={()=>clickAction(item.action)} myWidth={width}>
          <FontAwesomeIcon className="icon" icon={item.icon}/>
          <p>{(width<500? item.short : item.text)}</p>
        </ActionCard>
      )
    });
  }
  
  return(
    <Container>

      <HomeButton />
      
      <TitleDiv>
        <TitleMain>
          <h2>{details.utility_name} - {details.eiaid}</h2>
          <h1>{details.program_name}</h1>
          <h3>You're one step closer to green energy.</h3>
        </TitleMain>
        <TitleAction>
          <p>Continue to the program website to sign up!</p>
          <a href = {details.sign_up_url} target="_blank" rel="noopener noreferrer">
            <button className= "button-primary">{details.sign_up_text || 'Go!'} </button>
          </a>
        </TitleAction>
      </TitleDiv>
      
      <DiscoverBar active={discoverActive}>
        <button className="discoverButton" onClick={()=>setDiscoverActive(!discoverActive)}>
          <p>Discover More</p>
          <FontAwesomeIcon className="icon" icon={faCaretUp} />
        </button>
        <BottomDisplay active={discoverActive} className="blur-background">
          {renderActions()}
        </BottomDisplay> 
      </DiscoverBar>

    </Container>
  )
}