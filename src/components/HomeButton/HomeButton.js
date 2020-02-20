import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon}  from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';


//-----< Styling >-----\\
const Container = styled.div`
  width: 100%;
  font-size: 4em;
  color: white;
  display: flex;
  align-items: flex-end;
  text-shadow: 0 0 8px black;
  padding: 16px;
  box-sizing: border-box;

  .icon {

    transition: transform .2s;
    transition-timing-function: cubic-bezier(.17,.67,.67,2);
    &:hover {
      transform: scale(1.2);
      cursor: pointer;
    }
  }
  h1 {
    display: inline;
    font-size: .5em;
    margin: 0;
    margin-left: 16px;
    font-family: var(--font-header);
  }
`;

//-----< Component Function >-----\\
export default function HomeButton() {
  const history = useHistory();
  return (
    <Container>
      <FontAwesomeIcon className="icon" icon={faHome} onClick={()=>history.push('/intro')}/>
      <h1>The Green Neighbor Challenge</h1>
    </Container>
  )
}