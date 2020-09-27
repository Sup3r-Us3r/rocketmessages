import {produce} from 'immer';

const INITIAL_STATE = {
  newContact: '',
  newMessage: 0,
};

export default function refreshPrivate(
  state = INITIAL_STATE,
  action: {type: string; payload: object},
) {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@refreshPrivate/UPDATE_PRIVATE_MAIN_PAGE_REQUEST': {
        const {contactName} = action.payload as {contactName: string};

        draft.newContact = contactName;
        break;
      }
      case '@refreshPrivate/MESSAGE_PRIVATE_REFRESH_REQUEST': {
        draft.newMessage += 1;

        break;
      }
      default:
        state;
    }
  });
}
