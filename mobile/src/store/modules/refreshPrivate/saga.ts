// import {call, select, put, all, takeLatest} from 'redux-saga/effects';

// import api from '../../../services/api';

// import {updateRoomMainPageSuccess} from './actions';

// function* handleUpdateRoom({payload}: object) {
//   const {isUpdating} = payload as {isUpdating: boolean};

//   if (isUpdating) {
//   }

//   const latestMessage = select((state) => state.refreshRoom);

//   const response = yield call(api.get, '/rooms');

//   // On success
//   return yield put(updateRoomMainPageSuccess(true));
// }

// export default all([
//   takeLatest('@refreshRoom/UPDATE_ROOM_MAIN_PAGE_REQUEST', handleUpdateRoom),
// ]);
