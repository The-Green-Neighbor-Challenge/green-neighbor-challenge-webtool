import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// 014212442

const ProgramTitle = styled.span`
  display: block;
`;

const List = styled.div`
  margin: 1rem;
`;

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

const SubHeader = styled.h3`
    margin-bottom: 0px;
`;

const NoMargin = styled.p`
    margin: 0px;
    padding: 0px;
`;

function Program({program}){
  const {name, id} = program;
  const dispatch = useDispatch();
  const history = useHistory();
  const [production, setProduction] = useState(program.production);
  useEffect(()=>{
    setProduction(program.production);
  }, [program]);

  const onProductionClick = () => {
    dispatch({
      type: 'EDIT_PROGRAM',
      payload: { id, production: production ? 0 : 1 }
    });
    setProduction(!production);
  }

  const onEditClick = () => {
    dispatch({
      type: 'GET_PROGRAM_SUBMISSION_FORM_DATA',
      payload: { id, history }
    });
  }

  return(
    <NoMargin>
      {name || `Unnamed Program (ID #${id})`}
      <ProductionButton
        onClick={onProductionClick}
        live={production}
      >
        {production ? 'Active' : 'Inactive'}
      </ProductionButton>
      <button
        onClick={onEditClick}
        className='button-default'
      >Edit</button>
    </NoMargin>
  )
}

export default function UtilityModal(props){

  const dispatch = useDispatch();
  const history = useHistory();
  const utility = useSelector(state => state.adminRecordsModalUtility);
  const {
    eia_state, utility_name,
    zips, 
    programs, utility_id
  } = utility;
  const [production, setProduction] = useState(utility.production);
  useEffect(()=>{
    setProduction(utility.production);
  }, [utility.production]);

  const open = useSelector(state => state.adminRecordsModalOpen);

  const close = () => {
      dispatch({type: 'SET_ADMIN_RECORDS_MODAL_OPEN', payload: false});
  }

  const toggleProduction = () => {
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

  const openEdit = () => {
    dispatch({type: 'GET_EDIT_INFO_UTILITY', payload: utility_id});
  }

  const addProgram = () => {
    dispatch({
      type: 'SET_SUBMISSION_FORM',
      payload: {
        eia_state,
        utility_name,
        eiaid: eia_state.match(/[0-9]*/)[0],
        state: utility.state
      }
    });
    history.push('/admin/submit/create/program');
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog"
    >
      <DialogTitle id="alert-dialog-title">
        <ProgramTitle>
          Programs for {utility_name} -
          <ProductionButton
            live={production}
            onClick={toggleProduction}
          >
            {production ? 'Active' : 'Inactive'}
          </ProductionButton>
          -
          <button className='button-default' onClick={openEdit}>
            Edit
          </button>
        </ProgramTitle>
      </DialogTitle>
      <DialogContent>
        <NoMargin>EIA - State: {eia_state}</NoMargin>
        <SubHeader>Programs:</SubHeader>
        <List>
          {programs && programs.map(program =>
            <Program program={program} key={program.id} />
          )}
          <button className='button-default' onClick={addProgram}>
            Add Program
          </button>
        </List>
        <h3>Active Zips:</h3>
        <List>
          <NoMargin>
            {zips && zips.map(a => a.zip).join(', ')}
          </NoMargin>
        </List>
      </DialogContent>
      <DialogActions>
        <button className="button-default" onClick={close} >
          Close
        </button>
      </DialogActions>
    </Dialog>
  )
}