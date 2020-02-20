import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

const ContractBox = styled.div`
    display: block;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    margin-top: 0px;
    vertical-align: left;
`;

const ContractForm = styled.form`
    margin: 10px 0;
    float: left
    label {
        padding: 10px;
    }
    input, select {
        margin: 10px 10px 10px 0px;
    }
    select {
        padding: 10px;
    }
`;


export default function PricingForm(props){

    const dispatch = useDispatch();
    const form = useSelector(state => state.submissionFormReducer);

    const [length, setLength] = useState(form.contract_length || '');
    const [minYesNo, setminYesNo] = useState(form.monthly_min || '');
    const [minimum, setMinimum] = useState(form.monthly_min || '');
    const [
        termination, 
        setTermination
    ] = useState(form.termination_fee === 'Yes' ? 'Yes' : 'No');
    const [termination_cost, setTermination_cost] = useState(form.termination_cost || '');

    const updateSubmissionForm = obj => {
        dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: obj});
    }

    function renderContractDetails() {

        return(
            <ContractForm>
                <h2>Contract</h2>
                    <div>
                        <label>Length: </label>
                            <input
                                type="text"
                                value={length}
                                placeholder="12-month"
                                onChange={e=>setLength(e.target.value)}
                                onBlur={e=>updateSubmissionForm({contract_length: length})}
                            />
                        </div>
                        <div>
                            <label>Is there a Monthly Minimum? </label>
                            <select 
                            value={minYesNo}
                            onChange={e=>setminYesNo(e.target.value)}
                            onBlur={e=>updateSubmissionForm({monthly_min: minYesNo})}
                            >
                                <option>Pick One</option>
                                <option value={'No'}>No</option>
                                <option value={'Yes'}>Yes</option>
                            </select>
                        </div>
                        <div>    
                            {minYesNo === 'Yes' &&
                            <>
                                <label> Monthly Minimum: </label>
                                <input
                                    type="text"
                                    value={minimum}
                                    placeholder="12-month"
                                    onChange={e=>setMinimum(e.target.value)}
                                    onBlur={e=>updateSubmissionForm({monthly_min: minimum})}
                                />
                            </>
                        }
                        </div>
                        
                        <div>
                            <label>Is there a Termination Fee? </label>
                            <select
                                value={termination}
                                onChange={e=>setTermination(e.target.value)}
                                onBlur={e=>updateSubmissionForm({termination_fee: termination})}
                            >
                                <option>Pick One</option>
                                <option value={'No'}>No</option>
                                <option value={'Yes'}>Yes</option>
                            </select>
                        </div> 
                        <div>   
                            {termination === 'Yes' &&
                            <>
                                <label> Termination Cost: </label>
                                <input
                                    type="text"
                                    value={termination_cost}
                                    placeholder="150"
                                    onChange={e=>setTermination_cost(e.target.value)}
                                    onBlur={e=>updateSubmissionForm({termination_cost: termination_cost})}
                                />
                            </>
                        }
                        </div>
            </ContractForm>    
        )
    }


    return (
        <Container>
            <ContractBox>
                {renderContractDetails()}
            </ContractBox>
        </Container>
    )
}