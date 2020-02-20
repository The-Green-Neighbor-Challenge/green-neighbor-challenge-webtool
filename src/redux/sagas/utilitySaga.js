import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// type: GET_PROGRAMS, payload: string of the zip code you want to get programs for
function* getUtilityName(action) {
  try{
    const name = yield axios.get(
        `/api/utilities/getName/${action.payload.zip}/${action.payload.eia_state}`
    );
    yield put({type: 'SET_ERROR_UTILITY_INFO', payload: name.data});
  } catch (error) {
      console.log(error);
  }
}

function* getUtilityDetails(action){
  try{
    const response = yield axios.get(`/api/utilities/details/${action.payload.id}`);
    yield put({type: 'SET_RECORDS_MODAL_UTILITY', payload: response.data});
    yield put({type: 'SET_ADMIN_RECORDS_MODAL_OPEN', payload: true});
  } catch (error) {
      console.log(error);
  }
}

function* utilitySaga() {
  yield takeLatest('GET_UTILITY_NAME', getUtilityName);
  yield takeLatest('GET_UTILITY_DETAILS', getUtilityDetails);
}

export default utilitySaga;