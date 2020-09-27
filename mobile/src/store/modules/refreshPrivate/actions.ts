export function updatePrivateMainPageRequest(contactName: string) {
  return {
    type: '@refreshPrivate/UPDATE_PRIVATE_MAIN_PAGE_REQUEST',
    payload: {contactName},
  };
}

export function messagePrivateRefreshRequest() {
  return {
    type: '@refreshPrivate/MESSAGE_PRIVATE_REFRESH_REQUEST',
    payload: {},
  };
}
