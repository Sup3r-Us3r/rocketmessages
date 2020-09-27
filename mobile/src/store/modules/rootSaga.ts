import {all} from 'redux-saga/effects';

import refreshPrivate from './refreshPrivate/saga';
import refreshRoom from './refreshRoom/saga';

export default function* rootSaga() {
  return yield all([refreshPrivate, refreshRoom]);
}
