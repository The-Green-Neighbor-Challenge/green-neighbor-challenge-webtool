import styled from 'styled-components';

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  align-text: center;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
`;

const Header = styled.h1`
  text-align: center;
`;

const margin = {
  margin: '0.5rem'
};

export {Page, Form, Header, margin};