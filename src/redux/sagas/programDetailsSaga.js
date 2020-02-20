import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// type: GET_PROGRAMS, payload: string of the zip code you want to get programs for
function* getProgramDetails(action) {
  try{
    const details = yield axios.get(`/api/programs/details/${action.payload}`);
    yield put({type: 'SET_PROGRAM_DETAILS', payload: details.data});
  } catch (error) {
      console.log(error);
  }
}

function* programDetailsSaga() {
  yield takeLatest('GET_PROGRAM_DETAILS', getProgramDetails);
}

export default programDetailsSaga;