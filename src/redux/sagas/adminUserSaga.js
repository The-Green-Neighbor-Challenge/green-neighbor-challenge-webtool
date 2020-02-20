import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// type: GET_PROGRAMS, payload: string of the zip code you want to get programs for
function* getAdminUsers() {
    try{
      const response = yield axios.get(`/api/user/admins`);
      yield put({type: 'SET_ADMIN_USERS', payload: response.data});
    } catch (error) {
        console.log(error);
    }
  }

  function* postAdminUser(action) {
    try{
      yield axios.post('/api/user/admin', action.payload);
      yield put({ type: 'GET_ADMIN_USERS', payload: action.payload});
    } catch (error) {
      console.log('error posting new admin', error);
    }
  }

  //type: DELETE
  function* deleteAdminSaga (action) {
    try{
        yield axios.delete(`/api/user/admin/${action.payload}`);
        console.log('Inside deleteAdminSaga');
        yield put({ type: 'GET_ADMIN_USERS'});
    }catch(error){
        console.log('error deleting game in saga', error);    
    }
}

// type: UPDATE
function* updateAdminInfo (action) {
  try {
    console.log('inside updateAdminInfo saga');
    yield axios.put(`/api/user/admin`, action.payload);
    yield put({type: `GET_ADMIN_USERS`});
  }catch(error){
    console.log('error updating admin user info', error);
  }
}
 // root 
  function* adminUserSaga() {
    yield takeLatest('GET_ADMIN_USERS', getAdminUsers);
    yield takeLatest('POST_NEW_ADMIN', postAdminUser);
    yield takeLatest('DELETE_ADMIN', deleteAdminSaga);
    yield takeLatest('UPDATE_ADMIN_INFO', updateAdminInfo);
  }

  

export default adminUserSaga;