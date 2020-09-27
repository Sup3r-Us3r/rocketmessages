import {combineReducers} from 'redux';

import refreshPrivate from './refreshPrivate/reducer';
import refreshRoom from './refreshRoom/reducer';

export default combineReducers({
  refreshPrivate,
  refreshRoom,
});
