import React, {useState, useEffect, useCallback} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import styled from 'styled-components';

//-----< Resource Imports >-----\\
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons'
import EnergyBar from '../EnergyBar/EnergyBar';


//-----< Styling >-----\\

// '80' in the height accounts for the header height.
// The other two heights are calculated on mount and window resize.
const ProgramCardBody = styled.div`
  margin: 8px 0 32px 0;
  h5 {
    margin: 0 8px;
    font-size: 18px;
  }
  height: ${props=>(props.detailsActive? `${80+props.h_main+props.h_details}` : `${80+props.h_main}`)}px;
  overflow: hidden;
  transition: height .5s;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,.2);
  font-family: var(--font-main);
`;

const ProgramCardHeader = styled.div`
  background-color: white;
  color: var(--color-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  position: relative;
  z-index: 2;
  height: 80px;
  border-bottom: 3px dashed #DDD;
  box-sizing: border-box;
`;

const ProgramCardMain = styled.div`
  background-color: white;
  box-shadow: 0 2px 4px 2px rgba(0,0,0,.5);
  position: relative;
  box-sizing: border-box;
  z-index: 1;
  height: auto;
  padding: 8px;
  padding-bottom: 16px;
  text-align: center;
  p {
    margin: 8px auto;
    display: block;
    color: #333;
  }
`;

const ProgramCardDetails = styled.div`
  background-color: var(--color-primary);
  text-align: center;
  box-sizing: border-box;
  padding: 8px;
  color: white;
  p {
    margin: 8px auto;
    display: block;
  }
`;

const SelectButton = styled.button `
  margin: 0;
`;

const BarBox = styled.div`
  border-radius: 16px;
  overflow: hidden;
  margin: 0 16px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.5);
  margin-top: 8px;
  width: 100%;
`;

const DetailsButton = styled.button`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  outline: none;
  border: none;
  color: gray;
  transition: all .2s;
  background-color: white;
  font-size: 16px;
  &:hover {
    cursor: pointer;
    color: #333;
    background-color: #EEE;
  }
  .icon {
    transition: transform .5s;
    transform: rotate(${props=>(props.detailsActive? 180 : 0)}deg);
  }
`;

const ProgramCardTitleBox = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
`;

//-----< Component Function >-----\\
export default function ProgramCard(props) {

  const history = useHistory();
  const {zip} = useParams(); 

  let [detailsActive, setDetailsActive] = useState(false);
  let [blockActive] = useState(( (props.program.blocks_available==='No' || props.program.blocks_available===null)? false : true));
  let [h_main, setH_main] = useState(0);
  let [h_details, setH_details] = useState(0);
  
  const [energy] = useState([
    {name: 'Wind', value: props.program.wind}, 
    {name: 'Solar', value: props.program.solar}, 
    {name: 'Bio', value: props.program.bio}, 
    {name: 'Hydro', value: props.program.hydro}, 
    {name: 'Geo', value: props.program.geo}, 
    {name: 'Other', value: props.program.other}]);
  const [attributes] = useState([
    {text: 'is Green-e Certified', value: (props.program.green_e==='Yes'? true : false)},
    {text: 'uses Retired Recs', value: (props.program.recs_retired==='Yes'? true : false)},
    {text: 'is Revenue Neutral', value: (props.program.revenue_neutral==='Yes'? true : false)},
  ]);

  // This calculates the size of the individual card based on their content + size of the window
  const cardHeightCallback = useCallback(
    () => {
      let mainHeight = document.getElementsByClassName('program-card-main')[props.index];
      let detailsHeight = document.getElementsByClassName('program-card-details')[props.index];
      if (mainHeight) {
        setH_main(mainHeight.clientHeight);
      }
      if (detailsHeight) {
        setH_details(detailsHeight.clientHeight);
      }
    },
    [props.index]
  );

  useEffect(()=>{
    cardHeightCallback();
    window.addEventListener('resize', cardHeightCallback);
    return () => {
      window.removeEventListener('resize', cardHeightCallback);
    }
  },[cardHeightCallback])

  // This function rearranged the energy sources values from highest to lowest, ignoring empty values
  function sortEnergy() {
    let copy = [];
    for (let i=0; i<energy.length; i++) {
      if (energy[i].value) {
        //Pushing to the start when it is the first source
        if (copy.length===0) {
          copy.push(energy[i]);
        } else {
          //Sort by comparing values and splicing into place
          for (let j=0; j<copy.length; j++) {
            if (copy[j].value<energy[i].value) {
              copy.splice(j,0,energy[i]);
              break;
            } else if(j===copy.length-1) {
              copy.push(energy[i]);
              break;
            }
          }
        } //END splicing in new values
      } //END check for value
    } //END looping through energy values
    return copy;
  }

  // Creates the text describing where a program is sourced from. (Solar, wind, etc.)
  function renderSourceText() {
    let sourceString = 'Generated from '
    const sourceList = sortEnergy();

    let sourceCount = 0;
    for (let i=0; i<sourceList.length; i++) {
      if (i===sourceList.length-1 && sourceCount>0) {sourceString += ' and '}
      sourceString += `${sourceList[i].value*100}% ${sourceList[i].name}`;
      sourceCount++;
      if (i<sourceList.length-1) {if (sourceList.length>2) {sourceString += ', ';} } else {sourceString += ' power'}
    }
    return sourceString;
    
  }

  // Creates text describing what certifications a program has
  function renderAttributeText() {
    let attributeString = '';
    for (let i=0; i<attributes.length; i++) {
      if (attributes[i].value!==null) {
        if (attributeString.length===0) {
          attributeString += 'This program '
        } else if (i<attributes.length) {
          if (attributes.length>2) {
            attributeString += ', '
          }                    
          if (i===attributes.length-1) {
            attributeString += 'and ' 
          }
        }
        attributeString += attributes[i].text;
      }
    }
    return attributeString;
  }

  // Returns text describing the pricing model of a program
  function renderBlockActive() {
    switch(blockActive) {
      case false: return 'Priced by Kilowatt-hour';
      default: return 'Priced by Block';
    }
  }

  // Returns text describing the cost of a program (for either block or c/kwh models)
  function renderPricing() {
    let priceString = 'The price ';
    if (blockActive && props.program.block_cost) {
      let blockCostArray = props.program.block_cost.split(';');
      if (blockCostArray.length>1) {priceString += `starts at $${Number(blockCostArray[0]*.01).toFixed(4)} per Kilowatt-hour`}
      else {priceString += `is $${Number(blockCostArray[0]*.01).toFixed(4)} per Kilwatt-hour`}
    } else {
      priceString += `is $${Number(props.program.cost_kwh*.01).toFixed(4)} per Kilwatt-hour`;
    }
    return priceString
  }

  // Renders text about the sizes of blocks (if blocks are being used)
  function renderBlockSize() {
    if (blockActive) {
      let blockString = '';
      let blockSizeArray = props.program.block_size_kwh.split(';');
      if (blockSizeArray.length>1) {blockString += `with block sizes starting at ${props.program.block_size_kwh.split(';')[0]} Kilowatt-hours`}
      else {blockString += `with ${props.program.block_size_kwh.split(';')[0]} Kilwatt-hours blocks`}
      return blockString
    }
  }

  // Renders text about the credits for enrollment - text is rendered if there are no credits
  function renderCredit() {
    switch(props.program.credit_yn) {
      case 'Yes': return <p>This program offers credit {(props.program.credit_kwh? <span>at ${(props.program.credit_kwh*.01).toFixed(4)} </span> : <></>)}per Kilwatt-hour</p>;
      case 'Included': return `This program offers credit included in the price`;
      default: return ``
    }
  }

  // Renders text about how much % of energy usage a program will cover
  function renderPercentOptions() {
    if (props.program.percentage_options) {
      const optionArray = props.program.percentage_options.split(';');      
      if (optionArray.length===1) {
        return <p>Covers {optionArray[0]}% of energy usage</p>
      } else {
        return <p>Coverage percentage options range from {optionArray[0]}% to {optionArray[optionArray.length-1]}% of energy usage</p>
      }
    }
  }

  // Render tex tabout whether or not a program charges fees upon contract termination
  // Note: does NOT render the amount charged upon termination
  function renderTermination() {
    switch(props.program.termination_fee) {
      case 'Yes': return <p>Charges fee upon termination</p>;
      case 'No': return <p>Does not charge fees upon termination</p>
      default: return '';
    }
  }


  return (
    <ProgramCardBody detailsActive={detailsActive} h_main={h_main} h_details={h_details}>

      <ProgramCardHeader>
        <ProgramCardTitleBox>
          <h5>{props.program.program_name}</h5>
          <SelectButton className="button-primary" onClick={()=>history.push(`/details/${props.program.id}/${zip}`)}>Select</SelectButton>
        </ProgramCardTitleBox>
        <BarBox><EnergyBar program={props.program}/></BarBox>
        
      </ProgramCardHeader>

      <ProgramCardMain className="program-card-main">
          <p>{renderSourceText()}</p>
          <p>{renderPricing()} {renderBlockSize()}</p>
          {renderPercentOptions()}
          <p>{renderBlockActive()}</p>
          <DetailsButton detailsActive={detailsActive} onClick={()=>setDetailsActive(!detailsActive)}>Details <FontAwesomeIcon className="icon" icon={faCaretUp} /></DetailsButton>
      </ProgramCardMain>

      <ProgramCardDetails className="program-card-details">
        <p>{renderAttributeText()}</p>
        {renderCredit()}
        
        {renderTermination()}
      </ProgramCardDetails>
      
    </ProgramCardBody>
  )
}