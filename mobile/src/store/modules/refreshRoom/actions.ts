export function updateRoomMainPageRequest(nicknameRoom: string) {
  return {
    type: '@refreshRoom/UPDATE_ROOM_MAIN_PAGE_REQUEST',
    payload: {nicknameRoom},
  };
}

export function updateRoomMainPageSuccess(response: boolean) {
  return {
    type: '@refreshRoom/UPDATE_ROOM_MAIN_PAGE_SUCCESS',
    payload: {response},
  };
}

export function updateParticipantsInRoomRequest(participant: string) {
  return {
    type: '@refreshRoom/UPDATE_PARTICIPANTS_IN_ROOM_REQUEST',
    payload: {participant},
  };
}
