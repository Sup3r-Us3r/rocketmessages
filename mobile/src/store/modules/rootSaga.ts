import {all} from 'redux-saga/effects';

import refreshRoom from './refreshRoom/saga';

export default function* rootSaga() {
  return yield all([refreshRoom]);
}
