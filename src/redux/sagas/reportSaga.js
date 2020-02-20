import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* postReportTicket(action) {
    try{
        console.log(action.payload);
        yield axios.post('/api/tickets', action.payload);
        yield put({ type:'SET_TICKET', payload: action.payload });
    } catch (error) {
        console.log('error posting ticket info', error);
    }
};

function* reportSaga() {
    yield takeLatest('POST_TICKET', postReportTicket);
}

export default reportSaga;