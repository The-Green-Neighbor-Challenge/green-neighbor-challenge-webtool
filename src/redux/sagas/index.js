import { all } from 'redux-saga/effects';
import loginSaga from './loginSaga';
import registrationSaga from './registrationSaga';
import userSaga from './userSaga';
import programsSaga from './programsSaga';
import programDetailsSaga from './programDetailsSaga';
import utilitySaga from './utilitySaga';
import adminLandingSaga from './adminLandingSaga';
import reportSaga from './reportSaga';
import adminUserSaga from './adminUserSaga';
import ticketsSaga from './ticketsSaga';
import submissionSaga from './submissionSaga';


// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    utilitySaga(),
    programDetailsSaga(),
    programsSaga(),
    reportSaga(),
    loginSaga(),
    registrationSaga(),
    userSaga(),
    adminLandingSaga(),
    adminUserSaga(),
    ticketsSaga(),
    submissionSaga(),
  ]);
}