import { combineReducers } from 'redux';
import errors from './errorsReducer';
import loginMode from './loginModeReducer';
import user from './userReducer';
import submissionFormReducer from './submissionFormReducer';
// import geocode from './geocodeReducer';

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// creates a reducer that, when string is sent, sets state to action.payload.
// The parameter str sets the correct string, and type sets the starting state. Type defaults to [].
const createReducer = (str, type=[]) => {
  return (state=type, action) => {
    if(action.type === str && action.hasOwnProperty('payload')) return action.payload;
    else if(action.type === 'DELETE_ALL') return type;
    else return state;
  }
}

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  programs: createReducer('SET_PROGRAMS'),
  programDetails: createReducer('SET_PROGRAM_DETAILS'),
  utilityDataForReportPage: createReducer('SET_ERROR_UTILITY_INFO', {}),
  utilities: createReducer('SET_UTILITIES', []),
  utilitiesCount: createReducer('SET_UTILITIES_COUNT'),
  utilitiesSearch: createReducer('SET_UTILITIES_SEARCH', {}),
  errors, // contains registrationMessage and loginMessage
  loginMode, // will have a value of 'login' or 'registration' to control which screen is shown
  user, // will have an id and username if someone is logged in
  geocode: createReducer('SET_GEOCODE_DATA'),
  adminLandingPageData: createReducer('SET_ADMIN_LANDING_DATA', {}),
  adminUsers: createReducer('SET_ADMIN_USERS'),
  tickets: createReducer('SET_TICKETS', {}),
  adminTicketsDisplayDetails: createReducer('SET_TICKETS_DISPLAY', false),
  adminTicketsModalOpen: createReducer('SET_TICKET_MODAL_OPEN', false),
  ticketsUpdateFlag: createReducer('SET_TICKETS_UPDATE_FLAG', 0),
  adminTicketsModalTicket: createReducer('SET_TICKET_MODAL_TICKET', {}),
  submissionFormReducer,
  editWatcher: createReducer('SET_EDIT_READY', false),
  adminRecordsModalUtility: createReducer('SET_RECORDS_MODAL_UTILITY', {}),
  adminRecordsModalOpen: createReducer('SET_ADMIN_RECORDS_MODAL_OPEN', false)
});

export default rootReducer;
