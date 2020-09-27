import Reactotron from 'reactotron-react-native';
import {produce} from 'immer';

const INITIAL_STATE = {
  newRoom: '',
  updateParticipant: '',
};

export default function refreshRoom(
  state = INITIAL_STATE,
  action: {type: string; payload: object},
) {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@refreshRoom/UPDATE_ROOM_MAIN_PAGE_REQUEST': {
        const {nicknameRoom} = action.payload as {nicknameRoom: string};

        Reactotron.log!(nicknameRoom);

        draft.newRoom = nicknameRoom;

        Reactotron.log!(draft.newRoom);
        break;
      }
      case '@refreshRoom/UPDATE_PARTICIPANTS_IN_ROOM_REQUEST': {
        const {participant} = action.payload as {participant: string};

        draft.updateParticipant = participant;
        break;
      }
      default:
        state;
    }
  });
}
