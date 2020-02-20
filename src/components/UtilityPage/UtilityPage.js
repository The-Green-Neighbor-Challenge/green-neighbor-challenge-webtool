import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useHistory} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';

import Background from '../../images/bkg-forest-top.jpg';

//-----< Component Imports >-----\\
import UtilityList from './UtilityList';
import HomeButton from '../HomeButton/HomeButton';


const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-areas: "title" "programs";
  grid-template-rows: auto auto;

  background-image: url(${Background});
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
`;

const appear = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const TitleBox = styled.div`
  
  position: relative;
  z-index: 1;
  grid-area: title;
  display: grid;
  grid-template-areas: "home" "main" "help";
  grid-template-rows: auto 1fr 80px;
  align-items: center;

  text-align: center;
  text-shadow: 0px 0px 4px black;
  color: var(--color-text-light);

  p {
    animation: 2s ${appear} ease-in-out;
    margin: 0;
    font-size: 1.5em;
    font-family: var(--font-main);
  }
  h2 {
    animation: 2s ${appear} ease-in-out;
    margin: 8px 0;
    font-family: var(--font-header);
    font-size: 6em;
  }
`;

const TitleBoxMain = styled.div`
  grid-area: main;
  
`;

const HelpBox = styled.div`
  grid-area: help;
  animation: 2s ${appear} ease-in-out;
`;

export default function UtilityPage(props) {

  const history = useHistory();
  const dispatch = useDispatch();
  const {zip} = useParams(); 
  const geocode = useSelector(state=>state.geocode);
  const programs = useSelector(state=>state.programs);

  useEffect(()=>{
    if (zip) {
      dispatch({type: 'GET_PROGRAMS', payload: zip});
    }
  },[zip, dispatch]);

  function countPrograms() {
    let programList = [];
    for (let program of programs) {
      programList = [...programList, ...program.programs];
    }
    return programList.length;
  }

  return(
    <Container>
      
      <TitleBox>
        <HomeButton />
        <TitleBoxMain>
          <p>Showing results for</p>
          <h2>{geocode || zip}</h2>
          <p>We found {programs.length} {(programs.length===1? 'company' : 'companies')} and {countPrograms()} energy {(countPrograms()===1? 'program' : 'programs')}.</p>
        </TitleBoxMain>

        <HelpBox>
          <button className="button-wire" onClick={()=>history.push(`/report/${zip}`)}>My utility company isn't listed!</button>
        </HelpBox>

      </TitleBox>


      <UtilityList />

    </Container>
  )
}