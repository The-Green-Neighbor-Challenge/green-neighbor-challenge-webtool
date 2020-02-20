import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useHistory} from 'react-router-dom';
import styled from 'styled-components';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import SubmitSources from './SubmitSources';
import PricingForm from './PricingForm';
import ContractForm from './ContractForm';
import SubmitDetails from './SubmitDetails';
import SubmitUtilityInfo from './SubmitUtilityInfo';

const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
`;

const Stepper = styled.div`
  height: 50px;
`;

const StepBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`;

const Step = styled.button`
  width: ${props=>(1/props.num)*100}%;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  height: 100%;
  position: relative;
  font-size: 1em;
  color: ${props=>(props.currentStep===props.index? 'white' : 'black')};
  background-color: ${props=>(props.currentStep===props.index? '#1662BF' : 'white')};
  transition: all .2s;
  &:hover {
    cursor: pointer;
    background-color: ${props=>(props.currentStep===props.index? '#196BD1' : '#EEE')};;
  }
`;

const StepBubble = styled.div`
  width: ${props=>(props.currentStep===props.index? '24':'16')}px;
  height: ${props=>(props.currentStep===props.index? '24':'16')}px;
  background-color: ${props=>(props.currentStep>props.index? 'limegreen' : 'dodgerblue')};
  border-radius: 50%;
  position: absolute;
  left: 50%;
  bottom: 0;
  transition: all, .3s;
  transition-timing-function: cubic-bezier(.17,.67,.57,2);
  transform: ${props=>(props.currentStep===props.index? 'translate(-12px, 14px)':'translate(-8px, 10px)')};
  z-index: 1;
`;

const ProgressBox = styled.div`
  height: 4px;
  background-color: #1662BF;
  position: relative;
  left: ${props=> (.5/props.num)*100}%;
  width: ${props=> 100-((1/props.num)*100)}%;
`;

const ProgressBar = styled.div`
  background-color: limegreen;
  width: ${props=> (props.currentStep/(props.num-1))*100}%;
  height: 100%;
  transition: all .5s;
`;

const FormBox = styled.div`
  display: grid;
  box-sizing: border-box;
  padding: 0 5%;
  grid-template-areas: "header" "main" "buttons";
  grid-template-rows: auto 1fr auto;
  h1 {
    grid-area: header;
    text-align: center;
  }
`;

const FormArea = styled.div`
  background-color: white;
  grid-area: main;
  border-radius: 16px;
  box-shadow: 0 8px 8px -4px rgba(0,0,0,.5);
`;

const FormButtons = styled.div`
  padding: 16px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  p {
    text-align: center;
  }
`;

const TitleBox = styled.div``;

const Subtitle = styled.p`
  padding: 0px;
  text-align: center;
`;

const steps = [
  {name: 'Details', component: <SubmitDetails />},
  {name: 'Source', component: <SubmitSources />},
  {name: 'Pricing', component: <PricingForm /> },
  {name: 'Contract', component: <ContractForm />},
];

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function SubmissionForm() {

  const [currentStep, setCurrentStep] = useState(0);
  const submissionData = useSelector(state=>state.submissionFormReducer);
  const dispatch = useDispatch();
  const history = useHistory();

  const [requiredAlert, setRequiredAlert] = useState(false);
  const [cancelAlert, setCancelAlert] = useState(false);

  const { action, subject } = useParams();

  function renderSteps() {
    return steps.map( (item,i)=>{
      return (
        <Step key={i} num={steps.length} onClick={()=>setCurrentStep(i)} currentStep={currentStep} index={i}>
          {item.name}
          <StepBubble currentStep={currentStep} index={i}/>
        </Step>
      )
    });
  }

  function clickSubmit() {
    switch(subject) {
      case 'utility':
        if (submissionData.utility_name && submissionData.state && submissionData.eiaid) {
          dispatch({type: `${action.toUpperCase()}_${subject.toUpperCase()}`, payload: submissionData})
          history.goBack();
        } else {
          setRequiredAlert(true);
        }
        break;
      case 'program':
        if (submissionData.program_name && submissionData.sign_up_url) {
          dispatch({type: `${action.toUpperCase()}_${subject.toUpperCase()}`, payload: submissionData})
          history.goBack();
        } else {
          setRequiredAlert(true);
        }
        break;
      default: /* No default */ return;
    }
  }

  function renderButtons() {
    switch(subject) {
      case 'program':
        if (currentStep===0) {
          if (currentStep===steps.length-1) {
            return <button onClick={clickSubmit} className="button-primary">Submit</button>
          } else {
            return <button onClick={()=>setCurrentStep(currentStep+1)} className="button-default">Next</button>
          }
        } else {
          if (currentStep===steps.length-1) {
            return <>
              <button onClick={()=>setCurrentStep(currentStep-1)} className="button-default">Back</button>
              <button onClick={clickSubmit} className="button-primary">Submit</button>
              </>
          } else {
            return <>
              <button onClick={()=>setCurrentStep(currentStep-1)} className="button-default">Back</button>
              <button onClick={()=>setCurrentStep(currentStep+1)} className="button-default">Next</button>
              </>
          }
        }
      case 'utility':
        return (
          <button onClick={clickSubmit} className="button-primary">Submit</button>
        )
      default: /* No default */ return;
    }
  }

  function renderStepper() {
    if (subject==='program') {
      return (
        <>
          <StepBox>
          {renderSteps()}
          </StepBox>
          <ProgressBox num={steps.length}>
            <ProgressBar num={steps.length} currentStep={currentStep}/>
          </ProgressBox>
        </>
      )
    }
  }


  return (
    <Container>
      <Stepper>
        {renderStepper()}
      </Stepper>
      <FormBox>
        <TitleBox>
          <h1>{capitalize(action)} {capitalize(subject)}</h1>
          {subject === 'program' && submissionData.utility_name &&
          <Subtitle>{submissionData.utility_name}, {submissionData.state}</Subtitle>}
        </TitleBox>
        <FormArea>
          {(subject==='program'? steps[currentStep].component : <SubmitUtilityInfo />)}  
        </FormArea>
        <FormButtons>
          <button className="button-negative" onClick={()=>setCancelAlert(true)} >Cancel Submission</button>
          <p><span className="required">*</span> = required field</p>
          <div>
            {renderButtons()}
          </div>
        </FormButtons>
      </FormBox>

      <Dialog
        aria-labelledby="simple-dialog-title"
        open={requiredAlert}
        onBackdropClick={()=>setRequiredAlert(false)}
      >
        <DialogTitle id="simple-dialog-title">Missing Information</DialogTitle>
        <DialogContent>Please fill out all of the required fields.</DialogContent>
        <button className="button-cancel" onClick={()=>setRequiredAlert(false)}>Close</button>
      </Dialog>

      <Dialog
        aria-labelledby="simple-dialog-title"
        open={cancelAlert}
        onBackdropClick={()=>setCancelAlert(false)}
      >
        <DialogTitle id="simple-dialog-title">Leave this form?</DialogTitle>
        <DialogContent>Changes you have made will not be saved.</DialogContent>
        <button className="button-default" onClick={()=>setCancelAlert(false)}>Back to Form</button>
        <button className="button-negative" onClick={()=>history.goBack()}>Quit Submission</button>
      </Dialog>

    </Container>
  )
}