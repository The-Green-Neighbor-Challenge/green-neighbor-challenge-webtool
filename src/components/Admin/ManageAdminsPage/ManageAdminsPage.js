import React from 'react';
import styled from 'styled-components';

import NewAdmin from '../ManageAdminsPage/NewAdmin';
import CurrentAdmin from'../ManageAdminsPage/CurrentAdmins';




const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0px 0px 0px 0px;
  .component-box {
    width: 400px;
  }
`;

export default function ManageAdminsPage() {

  return(
    <Container>
        <NewAdmin className="component-box" />
        <CurrentAdmin  className="component-box"/>
    </Container> 

  )
}