import React, {useEffect, useState} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';


//-----< Styling >-----\\
const Container = styled.div`
  height: 50px;
  background-color: var(--color-primary);
  display: grid;
  grid-template-areas: "buttons logout";
  grid-template-columns: 1fr auto;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 8px 2px rgba(0,0,0,.25);
  z-index: 100;
`;

// NOTE: The menu does not actually wrap for some reason. Might need updating later to be responsive.
const ButtonBox = styled.div`
  grid-area: buttons;
  display: flex;
  flex-wrap: wrap;
`;

const LogOutButton = styled.button`
  grid-area: logout;
  background: none;
  outline: none;
  border: none;
  color: white;
  font-size: 1em;
  width: 100px;
  transition: all .2s;
  &:hover{
    background-color: var(--color-primary-light);
    cursor: pointer;
  }
`;

const NavButton = styled.button`
  width: 100%;
  max-width: 100px;
  background: none;
  border: none;
  outline: none;
  color: white;
  font-size: 1em;
  transition: all .2s;
  border-bottom: ${props=>(props.select===props.index? '4px solid var(--color-primary-light)': '0px solid var(--color-primary-light)')};
  &:hover{
    background-color: var(--color-primary-light);
    cursor: pointer;
  }
`;


//-----< Component Function >-----\\
export default function NavBar() {

  const [value, setValue] = useState(0);
  const {pathname: currentURL} = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  // Stores menu options and their links - continue this array to add more options
  const tabs = [
    {name: 'Home', link: '/admin/home'},
    {name: 'Tickets', link: '/admin/tickets'},
    {name: 'Records', link: '/admin/records'},
    {name: 'Users', link: '/admin/manageAdmins'},
  ];

  // Setting the selected menu position based on URL
  useEffect(()=>{
    let i = 0;
    for(; i < tabs.length; i++){
      if(currentURL === tabs[i].link){
        setValue(i);
        break;
      }
    }
    if(i === tabs.length) setValue(0);
  }, [currentURL, tabs]);


  function renderTabs() {
    return tabs.map( (item,i)=>{
      return <NavButton key={i} onClick={()=>history.push(item.link)} select={value} index={i}>{item.name}</NavButton>
    })
  }

  // Does not render menu if no user is logged in (aka, login / registration page)
  const user = useSelector(state => state.user);
  if(!user.id){
    return null;
  }

  return (
    <Container>
      <ButtonBox>
        {renderTabs()}
      </ButtonBox>
      <LogOutButton onClick={() => dispatch({ type: 'LOGOUT' })}>Log Out</LogOutButton>
    </Container>
  )
}