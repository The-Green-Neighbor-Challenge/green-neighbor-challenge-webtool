import { put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import writeQueries from '../../modules/writeQueries';

// type: GET_PROGRAMS, payload: string of the zip code you want to get programs for
function* getTickets(action) {
  try{
    const response = yield axios.get(`/api/tickets${writeQueries(action.payload)}`);
    yield put({type: 'SET_TICKETS', payload: response.data});
  } catch (error) {
      console.log(error);
  }
}

function* setTicketResolve(action){
  try{
    yield axios.put(`/api/tickets/resolve/${action.payload.id}/${action.payload.value}`);
    const updateFlag = yield select(state => state.ticketsUpdateFlag);
    yield put({type: 'SET_TICKETS_UPDATE_FLAG', payload: updateFlag + 1});
  } catch (error) {
      console.log(error);
  }
}

function* ticketsSaga() {
  yield takeLatest('GET_TICKETS', getTickets);
  yield takeLatest('SET_TICKET_RESOLVE', setTicketResolve);
}

export default ticketsSaga;