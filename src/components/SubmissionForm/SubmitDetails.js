import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    h2 {
    text-align: center;
    }
    div {
        justify-content: left;
        text-align: left;
        padding-top: 0px
        flush: left;        
    }
`;

const DetailsBox = styled.div`
    display: block;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    margin-top: 0px;
    vertical-align: left;
`;

const CheckboxForm = styled.form`
    margin: 10px 0;
    float: left
    label {
        padding: 10px;
    }
    input {
        margin: 10px 10px 10px 0px;
        width:
    }
`

export default function SubmitDetails() {

    const form = useSelector(state => state.submissionFormReducer);
    const isYes = str => str === 'Yes' ? 'Yes' : 'No';
    // List of values declared for state of form
    const [greenE, setGreenE] = useState(isYes(form.green_e));
    const [recsRetired, setRecsRetired] = useState(isYes(form.recs_retired));
    const [revsNeutral, setRevsNeutral] = useState(isYes(form.revenue_neutral));
    const [retail, setRetail] = useState(isYes(form.retail));
    const [waitlist, setWaitlist] = useState(isYes(form.waitlist));
    const [urlLink, setUrlLink] = useState(form.sign_up_url || '');
    const [urlText, setUrlText] = useState(form.sign_up_text || '');
    const [programName, setProgramName] = useState(form.program_name || '');
    const dispatch = useDispatch();
    // Stores state from this step's inputs in the reducer.
    const updateSubmissionForm = obj => {
        dispatch({ type: 'UPDATE_SUBMISSION_FORM', payload: obj })
    }

    function renderDetails() {
        
            return(
                <CheckboxForm>
                    <h2>Overview</h2>
                    <div>
                        <label>Program Name<span className="required">*</span></label>
                        <input 
                            type="text" 
                            placeholder="Enter Program Name"
                            value={programName}
                            onChange={e=>setProgramName(e.target.value)}
                            onBlur={e=>updateSubmissionForm({program_name: programName})}
                            >
                        </input> 
                    </div>
                    <div>
                        <input 
                            type="checkbox" 
                            checked={greenE === 'Yes'}
                            onChange={e=>setGreenE(e.target.checked ? 'Yes' : 'No')}
                            onBlur={e=>updateSubmissionForm({green_e: greenE})}
                            >
                        </input>
                        <label>Green-e Certified</label>
                    </div>
                    <div>
                        <input 
                            type="checkbox" 
                            checked={recsRetired === 'Yes'}
                            onChange={e=>setRecsRetired(e.target.checked ? 'Yes' : 'No')}
                            onBlur={e=>updateSubmissionForm({recs_retired: recsRetired})}
                            >
                        </input>
                        <label>Recs Retired</label>
                    </div>
                    <div>
                        <input 
                            type="checkbox" 
                            checked={revsNeutral === 'Yes'}
                            onChange={e=>setRevsNeutral(e.target.checked ? 'Yes' : 'No')}
                            onBlur={e=>updateSubmissionForm({revenue_neutral: revsNeutral})}
                            >
                        </input>
                        <label>Revenue Neutral</label>
                    </div>
                    <div>
                        <input 
                            type="checkbox" 
                            checked={retail === "Yes"}
                            onChange={e=>setRetail(e.target.checked ? 'Yes' : 'No')}
                            onBlur={e=>updateSubmissionForm({retail: retail})}
                            >
                        </input>
                        <label>Retail</label>
                    </div>
                    <div>
                        <input 
                            type="checkbox" 
                            checked={waitlist === "Yes"}
                            onChange={e=>setWaitlist(e.target.checked ? 'Yes' : 'No')}
                            onBlur={e=>updateSubmissionForm({waitlist: waitlist})}
                            >
                        </input>
                        <label>Waitlist Available</label>
                    </div>
                    
                    <div>
                        <label>Sign Up or Enroll Link<span className="required">*</span></label>
                        <input 
                            type="text"
                            placeholder="sign-up-here.com"
                            value={urlLink}
                            onChange={e=>setUrlLink(e.target.value)}
                            onBlur={e=>updateSubmissionForm({sign_up_url: urlLink})}
                        >
                        </input>
                    </div>
                    <div>
                        <label>Sign Up or Enroll Text</label>
                        <input 
                            type="text" 
                            placeholder="Sign-Up, Enroll Now"
                            value={urlText}
                            onChange={e=>setUrlText(e.target.value)}
                            onBlur={e=>updateSubmissionForm({sign_up_text: urlText})}
                            >
                        </input> 
                    </div>
                </CheckboxForm>    
            )
    }

    return (
        <Container>
          <DetailsBox>
              {renderDetails()}
          </DetailsBox>
        </Container>
      )
}