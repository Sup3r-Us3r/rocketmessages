import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import RoomController from './app/controllers/RoomController';
import UserRoomController from './app/controllers/UserRoomController';
import MessageController from './app/controllers/MessageControler';

const routes = Router();

routes.get('/users', UserController.listUsers);
routes.post('/createuser', UserController.createUser);
routes.post('/login', UserController.loginRocketMessages);
routes.put('/updateuser/:id', UserController.updateUserData);
routes.delete('/deleteuser/:id', UserController.deleteUser);

routes.get('/rooms', RoomController.listRooms);
routes.post('/createroom', RoomController.createRoom);

routes.get('/userinroom', UserRoomController.listUserInRoom);
routes.post('/insertuserinroom', UserRoomController.insertUserInRoom);

routes.get(
  '/latestmessageofcontact/:from',
  MessageController.listLatestMessageOfContact
);
routes.get(
  '/privatemessages/:from/:to_user',
  MessageController.listPrivateMessages
);
routes.get('/roommessages/:from', MessageController.listRoomMessages);
routes.post('/message', MessageController.createMessage);

export default routes;
