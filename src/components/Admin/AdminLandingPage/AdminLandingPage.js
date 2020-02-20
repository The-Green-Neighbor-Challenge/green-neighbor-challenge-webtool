import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const Page = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: max-content;
  padding: 25vh 15% 0% 15%;
`;

const Box = styled.div`
  text-align: center;
  display: flex;
  flex-flow: column nowrap;
  margin: 8px;
  justify-content: space-between;
`;

const Entry = styled.p`
  margin: 0px;
`;

function Card({headerText, body, link, ...otherProps}){
  const history = useHistory();

  return (
    <Box className='container' {...otherProps}>
      <h2>{headerText}</h2>
      {body && body.map((entry, i) => <Entry key={i}>{entry}</Entry>)}
      <button
        className='button-primary'
        onClick={()=>history.push(link)}
      >
        Go
      </button>
    </Box>
  )
}

export default function AdminLandingPage() {
  const {
    tickets_active: activeTickets,
    tickets_resolved: resolvedTickets,
    programs_live: liveRecords,
    programs_draft: draftRecords,
    adminCount
  } = useSelector(state => state.adminLandingPageData);
  const state = useSelector(state => state.adminLandingPageData);
  console.log(state);
  const dispatch = useCallback(useDispatch(), []);

  useEffect(()=>{
    dispatch({type: 'GET_ADMIN_LANDING_DATA'});
  },[dispatch]);

  return(
    <Page>
      <Card
        headerText="Tickets"
        link='/admin/tickets'
        body={[`${activeTickets || 0} Active`, `${resolvedTickets || 0} Resolved`]}
      />
      <Card
        headerText="Records"
        link='/admin/records'
        body={[`${liveRecords || 0} Live`, `${draftRecords || 0} Drafts`]}
      />
      <Card
        headerText="Users"
        link='/admin/manageAdmins'
        body={[<>&nbsp;</>, `${adminCount || 1} Admin Account${adminCount > 1 ? 's':''}`]}
      />
    </Page>
  );
}