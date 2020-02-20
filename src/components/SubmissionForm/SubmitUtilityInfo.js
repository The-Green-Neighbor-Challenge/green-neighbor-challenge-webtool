import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  input {
    text-align: center;
  }

  label {
    text-align: center;
  }

  select {
    max-width: 100px;
  }
`;

const BasicBox = styled.div`
  min-width: 50%;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 16px;
  box-sizing: border-box;
  .rate-title {
    text-align: center;
  }
`;

const ZipBox = styled.div`
  min-width: 50%;
  text-align: center;
  border-left: 2px dashed #DDD;
  box-sizing: border-box;
  padding: 16px;
  


  ul {
    list-style: none;
    text-align: left;
    display: inline-block;
    padding: 0;
    height: 300px;

    background-color: #DDD;
    border-radius: 8px;
    box-shadow: inset 0 1px 0px 1px rgba(0,0,0,.1);
    padding: 8px 16px;
    width: 200px;

    overflow-y: scroll;

    button {
      border: none;
      outline: none;
      cursor: pointer;
      background: none;
      color: gray;
      &:hover {
        color: red;
      }
    }
  }
  
`;

const RateBox = styled.div`
  display: grid;
  grid-template-areas: "t1 t2" "f1 f2";
  text-align: center;
  margin-bottom: 16px;
  background-color: #DDD;
  border-radius: 8px;
  box-shadow: inset 0 1px 0px 1px rgba(0,0,0,.1);
  padding: 8px 0;

  input {
    margin: 0 8px;
    
  }
  

  label:first-child {
    grid-area: t1;
  }
  label:nth-child(2) {
    grid-area: t2;
  }
  input:first-child {
    grid-area: f1;
  }
  input:nth-child(2) {
    grid-area: f2;
  }
`;

const LocationBox = styled.div`
  margin: 16px 0;
`;

const EiaBox = styled.div`
  display: inline-block;
`;

const PopUpContent = styled.div`
  max-width: 500px;
  width: 100%;
`;

const states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];



export default function SubmitUtilityInfo() {

  const dispatch = useDispatch();
  const submissionData = useSelector(state=>state.submissionFormReducer);

  const [zipInput, setZipInput] = useState('');
  const [zips, setZips] = useState(submissionData.zips? submissionData.zips : [] );
  const [state,setState] = useState(submissionData.state || 'State');
  const [utility_name, setUtility_name] = useState(submissionData.utility_name || '');
  const [eiaid,setEiaid] = useState(submissionData.eiaid || '');

  const [deleteZip, setDeleteZip] = useState(-1);

  const [
    bundled_avg_comm_rate,
    setComm_bundled
  ] = useState(submissionData.bundled_avg_comm_rate || '');
  const [
    delivery_avg_comm_rate,
    setComm_delivery
  ] = useState(submissionData.delivery_avg_comm_rate || '');

  const [
    bundled_avg_ind_rate,
    setInd_bundled
  ] = useState(submissionData.bundled_avg_ind_rate || '');
  const [
    delivery_avg_ind_rate,
    setInd_delivery
  ] = useState(submissionData.delivery_avg_ind_rate || '');

  const [
    bundled_avg_res_rate,
    setRes_bundled
  ] = useState(submissionData.bundled_avg_res_rate || '');
  const [
    delivery_avg_res_rate,
    setRes_delivery
  ] = useState(submissionData.delivery_avg_res_rate || '');

  function renderStates() {
    return states.map( (item,i)=>{
      return (
        <option value={item} key={i}>
          {item}
        </option>
      )
    });
  }

  function renderZips() {
    return zips.map( (zip, i)=>{
      return (
        <li key={i}>
          <button onClick={()=>setDeleteZip(i)}>
            <FontAwesomeIcon icon={faTimes}/>
          </button>
          {zip} 
        </li>
      );
    })
  }

  function submitZip(event) {
    event.preventDefault();
    //New zips need to contain a database id value even though it does not exist yet. -1 signifies it is a new zip.
    const newZips = [...zips,zipInput];
    setZips(newZips);
    dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: {zips: newZips}});
    setZipInput('');
  }

  function removeZip() {
    let copy = [...zips];
    copy.splice(deleteZip, 1);
    setZips(copy);
    setDeleteZip(-1);
    dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: {zips: copy}})
  }

  return (
    <Container>
      <BasicBox>
        <h3>Basic Info</h3>
        <label>Utility Name<span className="required">*</span></label>
        <input 
          type="text" 
          placeholder="Enter the name of the utility company"
          value={utility_name}
          onChange={event=>setUtility_name(event.target.value)}
          onBlur={()=>dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: {utility_name} })}
          />
        
        
        <LocationBox>
          <EiaBox>
            <label>EIA ID<span className="required">*</span></label>
            <input 
              type="number" 
              placeholder="Enter the EIA ID"
              value={eiaid}
              onChange={event=>setEiaid(event.target.value)}
              onBlur={()=>dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: {eiaid} })}
              />
              
          </EiaBox>

          <select 
            value={state} 
            onChange={event=>setState(event.target.value)}
            onBlur={()=>dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: {state} })}>
            <option disabled>State</option>
            {renderStates()}
          </select>
          <span className="required">*</span>
        </LocationBox>
        

        <label className="rate-title">Commercial Rates</label>
        <RateBox>
          <label>Bundled</label>
          <input type="number" value={bundled_avg_comm_rate} onChange={event=>setComm_bundled(event.target.value)} onBlur={()=>dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: {bundled_avg_comm_rate} })}/>
          <label>Delivery</label>
          <input type="number" value={delivery_avg_comm_rate} onChange={event=>setComm_delivery(event.target.value)} onBlur={()=>dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: {delivery_avg_comm_rate} })}/>
        </RateBox>

        <label className="rate-title">Individual Rates</label>
        <RateBox>
          <label>Bundled</label>
          <input type="number" value={bundled_avg_ind_rate} onChange={event=>setInd_bundled(event.target.value)} onBlur={()=>dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: {bundled_avg_ind_rate} })}/>
          <label>Delivery</label>
          <input type="number" value={delivery_avg_ind_rate} onChange={event=>setInd_delivery(event.target.value)} onBlur={()=>dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: {delivery_avg_ind_rate} })}/>
        </RateBox>

        <label className="rate-title">Residential Rates</label>
        <RateBox>
          <label>Bundled</label>
          <input type="number" value={bundled_avg_res_rate} onChange={event=>setRes_bundled(event.target.value)} onBlur={()=>dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: {bundled_avg_res_rate} })}/>
          <label>Delivery</label>
          <input type="number" value={delivery_avg_res_rate} onChange={event=>setRes_delivery(event.target.value)} onBlur={()=>dispatch({type: 'UPDATE_SUBMISSION_FORM', payload: {delivery_avg_res_rate} })}/>
        </RateBox>
      </BasicBox>

      <ZipBox>
        <h3>Zip Codes</h3>
        <form onSubmit={submitZip}>
          <input
            type="number"
            placeholder="Enter zip code"
            value={zipInput}
            onChange={event=>setZipInput(event.target.value)}
          />
          <button>Add Zip</button>
        </form>

        <ul>
          {renderZips()}
        </ul>
      </ZipBox>

      <Dialog open={(deleteZip!==-1)} onBackdropClick={()=>setDeleteZip(-1)}>
        <PopUpContent>
          <DialogTitle>{(deleteZip!==-1? <span>Delete ZIP {zips[deleteZip].zip}?</span> : <span>Delete ZIP</span>)}</DialogTitle>
        
          <button className="button-negative" onClick={removeZip}>Delete</button>
          <button
            className="button-default"
            onClick={()=>setDeleteZip(-1)}
          >Cancel</button>
        </PopUpContent>
      </Dialog>

    </Container>
  )
}