import {produce} from 'immer';

const INITIAL_STATE = {
  loading: true,
};

export default function refreshRoom(
  state = INITIAL_STATE,
  action: {type: string; payload: object},
) {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@refreshRoom/UPDATE_ROOM_MAIN_PAGE_REQUEST': {
        const {} = action.payload;

        draft.loading = false;
        break;
      }
      default:
        state;
    }
  });
}
