import React, {useState} from 'react';
import styled from 'styled-components';

//-----< Resource Imports >-----\\
import Background from '../../images/bkg-forest-top.jpg';
import HomeButton from '../HomeButton/HomeButton';


//-----< Styling >-----\\
const BackgroundBox = styled.div`
  background-image: url(${Background});
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  min-height: 100vh;
`;

const Container = styled.div`
  min-height: 600px;
  max-width: 70%;
  margin: 0 auto;
  display: grid;
  grid-template-areas: "menu content";
  grid-template-columns: 225px 1fr;
  grid-template-rows: 1fr;

  @media only screen and (max-width: 850px) {
    grid-template-areas: "menu" "content";
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;   
  color: white;
  text-shadow: 0 0 4px black;
  text-align: center;
  h1 {
    font-family: var(--font-header);
    font-size: 64px;
    margin: 0;
  }
`;

const Content = styled.div`
  grid-area: content;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Menu = styled.div`
  grid-area: menu;
  display: flex;
  flex-direction: column;
  border: 1px solid white;
  border-radius: 32px 0 0 32px;
  margin-bottom: 32px;
  height: 100%;

  @media only screen and (max-width: 850px) {
    border-radius: 0;
  }
`;

const MenuItem = styled.button`

  color: white;
  font-family: var(--font-main);
  font-size: 1em;
  border: none;
  outline: none;
  height: ${props=>props.myHeight}%;

  position: relative;
  z-index: 1;
  cursor: pointer;
  transition: border-right .3s;
  border-top: 1px solid white;
  border-right: ${props=>(props.index===props.select? '16px solid white' : '0px solid white')};

  text-shadow: 0 0 4px black;

  &:first-child {
    border-radius: 32px 0 0 0;
    border-top: none;
  }
  &:last-child {
    border-radius: 0 0 0 32px;
  }

  @media only screen and (max-width: 850px) {
    &:first-child {
      border-radius: 0;
      border-top: none;
    }
    &:last-child {
      border-radius: 0;
    }
  }
`;

const TextBox = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 8px 0 rgba(0,0,0,.5);
  width: 90%;
  position: relative;
  overflow: hidden;

  @media only screen and (max-width: 850px) {
    margin-top: 32px;
  }
  
  h2 {
    font-family: var(--font-header);
    font-size: 48px;
    color: white;    
    margin: 0;
  }
  p {
    font-size: 1.2em;
    color: black;
    line-height: 130%;
    text-indent: 25px;
  }
`;

const TextBoxHeader = styled.div`
  background-color: var(--color-primary);
  box-sizing: border-box;
  padding: 16px;
  box-shadow: 0 -4px 16px 8px rgba(0,0,0,.3);
`;

const TextBoxContent = styled.div`
  padding: 16px;
  box-sizing: border-box;
`;

//-----< Component Function >-----\\
export default function AboutPage() {

  //Tracks which FAQ page the user is currently viewing
  const [select, setSelect] = useState(0);

  const faq = [
    {
      Q: 'What is this?',
      H: 'THERE IS A FUTURE BEYOND POLLUTION',
      A: <div>
          <p>The Green Neighbor Challenge is a campaign and tool to help get us there. Air Pollution caused over 100,000 American deaths and cost the economy $1495/person in 2015. We don’t have to keep polluting in our backyards. Most Americans can choose clean energy today, for less than the cost of Netflix.</p>
          <p>When we choose one another, we create hope. When we do it together, a new future is born. Will you join us?</p>
        </div>
    },
    {
      Q: 'Am I Eligible?',
      H: 'IF YOU HAVE AN ELECTRIC BILL, YOU’RE IN!',  
      A: <div>
          <p>We did some homework. Nearly 7 out of 10 homes have access to a Green Energy Program. For everyone else, we aim to help you lobby your utility, your public utility commission, and your elected representatives to make choosing green an option for everyone.</p>
          <p>Also, we still have some pretty cool ideas about how you can help spread The Green Neighbor Challenge just like everyone else! #WontYouBeMine?</p>
        </div>
    }, 
    {
      Q: 'Why Should I Sign Up?',
      H: 'MORE THAN I, THERE IS POWER IN "US"',
      A: <div>
          <p>Our elected representatives are not representing ‘We The People.’ Our lifespans are falling. Inequality is rising. We don’t need jobs where the side effect is cancer.</p>
          <p>Over the last 20 years, for every $1 spent preventing air pollution, there were $30 in social benefits. Despite this, billions are given to fossil fuel companies. We can stop this. We can choose us. Together, we will breathe easy again.</p>
        </div>
    },
    {
      Q: 'What Does It Cost?',
      H: 'FAR LESS THAN A TRIP TO THE DOCTOR',
      A: <div>
          <p>Right now, the average home on the average program would pay under $10 /month for 100% clean energy. That’s about $4/person and is often much less for folks in apartments. The annual cost of healthcare is now over $10,000/person.</p>
          <p>Not only can wind turbines and solar panels improve our health, but over their lifespan, will actually drive down program and energy costs until we all have affordable, clean energy.</p>
        </div>
    },
    {
      Q: 'How Does This Work?',
      H: 'ELECTRICITY IS MAGICAL. RECs ARE NOT',
      A: <div>
          <p>Your utility can measure how much energy is put on the grid, in the same way it measures how much you take off. When a unit of green energy is produced, a supplier receives a “Renewable Energy Certificate” or REC.</p>
          <p>When your utility buys your energy, they can also buy RECs to certify that it was green. So when you buy green energy, your utility “retires” RECs on your behalf. Every REC is unique and can be used only once.</p>
        </div>
    },
    {
      Q: 'Who Benefits?',
      H: 'EVERYONE EXCEPT FOSSIL FUEL TYCOONS',
      A: <div>
          <p>We won’t pull punches. Developers and competitive green utilities stand to gain. But so do communities and farmers who lease land in exchange for a reliable source of clean income.</p>
          <p>Clean energy means clean jobs. No lung cancer required.</p>
          <p>Prairies, bees, and butterflies can be restored, pollinating nearby farms and purifying our water. Plus we all benefit from clean air, fewer doctor visits, and fewer climate disasters.</p>
        </div>
    },
    {
      Q: 'Can I Trust You?',
      H: 'LET US BE AS TRANSPARENT AS CLEAR AIR',
      A: <div>
          <p>We care about clean water and air. We love our neighbors. We collect no personal information. We sell no products. We are a certified non-profit. We are powered by the forceful (foolish) will of ordinary people who would rather hustle for grants than become another middleman looking for a slice of your pie.</p>
          <p>We owe a debt to those who came before us, we aim to pay forward to those who come after.</p>
        </div>
    },
  ];

  //Height of menu item is determined by the FAQ array length and passed into the styled-component via myHeight
  function renderMenu() {
    return faq.map( (item,i)=>{
      return (
        <MenuItem 
          key={i} 
          className="blur-background"
          myHeight={ (1/faq.length)*100 } 
          select={select} 
          index={i}
          onClick={()=>setSelect(i)}>
          {item.Q}
        </MenuItem>
      )
    });
  }

  return(
    <BackgroundBox>

      <HomeButton />
      <Header>
          <h1>Frequently Asked Questions</h1>
      </Header>
    
      <Container>

        <Menu>
          {renderMenu()}
        </Menu>

        <Content>
          <TextBox>
            <TextBoxHeader>
              <h2>{faq[select].H}</h2>
            </TextBoxHeader>
            <TextBoxContent>
              {faq[select].A}
            </TextBoxContent>
          </TextBox>
        </Content>

      </Container>
    
    </BackgroundBox>
  )
}