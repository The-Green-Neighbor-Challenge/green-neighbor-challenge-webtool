import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';

const ProductionButton = styled.button`
    color: ${props=>(props.live? 'var(--color-primary)' : '#A53535')};
    background-color: rgba(0, 0, 0, 0);
    border: none;
    outline: none;
    font-size: 1rem;
    transition: all .2s;
    &:hover {
        color: ${props=>(props.live? 'var(--color-primary-bright)' : '#333')};
        transform: scale(1.05);
        cursor: pointer;
    }
`;

const Container = styled.tr`
  .production {
    color: ${props=>(props.production? 'green' : '#CCC')};
    &:hover {
      transform: scale(1.1);
      cursor: pointer;
    }
  }
  text-align: center;

  td:first-child {
    text-align: left;
    padding-left: 8px;
  }

`;

export default function UtilityRow(props) {

  const dispatch = useDispatch();


  const {utility_name, utility_id, state, program_count} = props.utility;
  const [production, setProduction] = useState(props.utility.production);
  

  useEffect(()=>{
    setProduction(props.utility.production);
    
  }, [props.utility.production, dispatch]);

  function toggleProduction() {
    dispatch({
      type: 'SET_UTILITY_PRODUCTION',
      payload: {
        id: utility_id,
        production: !production,
        page: props.page,
        search: props.search
      }
    });
    setProduction(!production);
  }

  function openModal() {
    dispatch({type: 'GET_UTILITY_DETAILS', payload: { id: props.utility.utility_id }});
  }

  function clickEdit() {
    dispatch({type: 'GET_EDIT_INFO_UTILITY', payload: utility_id});
  }

  return (
    <Container className="utility-row" production={production}>
      <td>{utility_name}</td>
      <td>{state}</td>
      <td>{program_count} {(program_count===1? 'program' : 'programs')}</td>
      <td>
        <ProductionButton
          onClick={toggleProduction}
          live={production}
        >
          {production ? 'Active' : 'Inactive'}
        </ProductionButton>
      </td>
      <td>
        <button
          className="button-default"
          onClick={openModal}
        >Details</button>
      </td>
      <td>
        <button className="button-default" onClick={clickEdit}>Edit</button>
      </td>
    </Container>
  )
}

