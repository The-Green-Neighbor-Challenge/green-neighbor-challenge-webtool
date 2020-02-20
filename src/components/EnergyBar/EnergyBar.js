import React, {useState} from 'react';
import styled from 'styled-components';


//-----< Styling >-----\\
const Container = styled.div`
  width: 100%;
  height: 100%;
  color: red;
  display: flex;
`;

const Bar = styled.div`
  background-color: ${props=>props.bar.color};
  width: ${props=> ( props.select===-1? props.bar.value*100 : (props.select===props.index? 100 : 0) )}% ;
  color: ${props=> (props.select===props.index? `white` : (props.select===-1? (props.bar.value>.1? `white` : `rgba(255,255,255,0)`) : `rgba(255,255,255,0)`) )};
  transition: width .5s, filter .2s, color .7s;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
`;


//-----< Component Function >-----\\
export default function EnergyBar(props) {

  const [hover] = useState(-1);
  const [select,setSelect] = useState(-1);

  /*
    This function takes in the energy sources coming in on props and
    sorts them from largest to smallest in a new array.

    Energy sources with a value of 0 will not be added to this array.
  */
  function sortEnergy() {

    const energyStarter= [
      {name: 'Wind', value: props.program.wind, color: 'skyblue'}, 
      {name: 'Solar', value: props.program.solar, color: 'orange'}, 
      {name: 'Bio', value: props.program.bio, color: 'limegreen'}, 
      {name: 'Hydro', value: props.program.hydro, color: 'dodgerblue'}, 
      {name: 'Geo', value: props.program.geo, color: 'orangered'}, 
      {name: 'Other', value: props.program.other, color: 'rebeccapurple'}];
    
    let copy = [];
    
    for (let i=0; i<energyStarter.length; i++) {
      if (energyStarter[i].value) {
        //Pushing to the start when it is the first source
        if (copy.length===0) {
          copy.push(energyStarter[i]);
        } else {
          for (let j=0; j<copy.length; j++) {
            if (copy[j].value<energyStarter[i].value) {
              copy.splice(j,0,energyStarter[i]);
              break;
            } else if(j===copy.length-1) {
              copy.push(energyStarter[i]);
              break;
            }
          }
        }
      }
    }
    return copy;
  }

  /*
    Each element that comes out of the sortEnergy function is rendered
    as a div with its width being a percent stored in that items
    "value" property.
  */
  function renderBars() {
    return sortEnergy().map( (item,i)=>{
    return <Bar 
              bar={item} 
              key={i} 
              select={select} 
              index={i} 
              onClick={()=>setSelect(i)} 
              onMouseLeave={()=>setSelect(-1)}>
                {item.name} { parseInt((item.value*100).toString()) }%
            </Bar>
    })
  }

  return (
    <Container>
     {renderBars()}
    </Container>
  )
}