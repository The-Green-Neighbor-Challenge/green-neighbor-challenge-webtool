import styled from 'styled-components';

export const Container = styled.div`
  margin: 5%;
  h1 {
    text-align: center;
  }
  
`;

export const ManageBox = styled.div`
  min-height: 500px;
  display: grid;
  grid-template-columns: 200px  1fr;
  grid-template-rows: max-content max-content auto;
  grid-template-areas:
    "search filter"
    "search header"
    "search main";
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 8px 8px 0 rgba(0,0,0,.5);
`;

export const SearchBox = styled.div`
  background-color: var(--color-primary);
  grid-area: search;
  padding: 8px;
  box-sizing: border-box;
  input {
    display: block;
    width: 100%;
    border: none;
    outline: none;
    margin: 0 0 16px 0;
    padding: 4px;
    box-sizing: border-box;
  }
  button {
    display: block;
    margin: 0 auto;
  }
  box-shadow: 0 0 8px 0 rgba(0,0,0,.5);
  z-index: 1;
`;

export const FilterBox = styled.div`
  background-color: var(--color-primary);
  grid-area: filter;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
`;

export const FilterOption = styled.div`
  margin: 8px;
  display: flex;
  align-items: center;
`;

export const MainBox = styled.div`
  grid-area: main;
  overflow-x: scroll;
`;

export const MainHeader = styled.div`
  background-color: var(--color-bkg-dark);
  padding: 8px;
  box-sizing: border-box;
  grid-area: header;
  
  .addButton  {
    display: block;
    margin: 0 auto;
  }
  p {
    text-align: center;
    color: white;
  }
`;

export const MainTable = styled.table`
  font-family: var(--font-main);
  width: 100%;
  border-collapse: collapse;
`;

export const MainTableBody = styled.tbody`
  tr:${props=>props.doubleLines ?
    `nth-child(4n)`:'nth-child(odd)'
  }{
    background-color: #DDDDDD;
    1px solid #CCCCCC;
  }
  ${props=>props.doubleLines ? `
    tr:nth-child(4n-1){background-color: #DDDDDD;}
  ` : ''}
  tr, th {
    background-color: white;
    ${props=>props.doubleLines ? 
      '' : 'border-bottom: 1px solid #CCCCCC;'};
    ${props=>props.hoverable && `
      &:hover {
        background-color: #DDEEFF;
      }
    `}

    td, th {
      padding: 8px;
    }
  }
`;

export const MainTableHead = styled.thead`
  background-color: var(--color-primary);
  text-align: left;
  font-weight: bold;
  font-size: 1rem;
  border-bottom: 1px solid #ddd;
  box-shadow: 0px, 8px, 4px, #555555;
  th {
    padding: 10px 8px;
    color: white;
  }
`;

export const PageButton = styled.button`
  display: inline;
  font-family: var(--font-main);
  font-size: 1em;
  background: none;
  border: none;
  outline: none;
  color: ${props=>(props.page===props.index? 'white' : 'rgba(255,255,255,.6)')};
  transition: transform .2s;
  &:hover {
    cursor: pointer;
    color: white;
    transform: scale(1.2);
  }
`;

export const PageBar = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px 0;
`;
