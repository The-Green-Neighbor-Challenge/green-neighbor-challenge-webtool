import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// type: GET_PROGRAMS, payload: string of the zip code you want to get programs for
function* getAdminLandingData(action) {
  try{
    const response = yield axios.get(`/api/admin/overview`);
    yield put({type: 'SET_ADMIN_LANDING_DATA', payload: response.data});
  } catch (error) {
      console.log(error);
  }
}

function* adminLandingSaga() {
  yield takeLatest('GET_ADMIN_LANDING_DATA', getAdminLandingData);
}

export default adminLandingSaga;