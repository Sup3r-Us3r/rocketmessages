export function updateRoomMainPageRequest(isUpdate: boolean) {
  return {
    type: '@refreshRoom/UPDATE_ROOM_MAIN_PAGE_REQUEST',
    payload: {isUpdate},
  };
}

export function updateRoomMainPageSuccess(response: boolean) {
  return {
    type: '@refreshRoom/UPDATE_ROOM_MAIN_PAGE_SUCCESS',
    payload: {response},
  };
}
