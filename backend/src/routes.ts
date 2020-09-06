import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import RoomController from './app/controllers/RoomController';
import UserRoomController from './app/controllers/UserRoomController';
import MessageController from './app/controllers/MessageControler';

const routes = Router();

// User
routes.get('/user/:id', UserController.listUser);
routes.get('/users', UserController.listUsers);
routes.get('/forgotpassword/:email', UserController.forgotPassword);
routes.post('/createuser', UserController.createUser);
routes.post('/login', UserController.loginRocketMessages);
routes.post('/recoverpassword/:email', UserController.recoverPassword);
routes.put(
  '/updateuser/:id',
  multer(multerConfig).single('userphoto'),
  UserController.updateUserData
);
routes.delete('/deleteuser/:id', UserController.deleteUser);

// Room
routes.get('/rooms', RoomController.listRooms);
routes.get(
  '/listfrequentcontactsforaddroom/:from',
  RoomController.listFrequentContactsForAddRoom
);
routes.post(
  '/createroom',
  multer(multerConfig).single('avatarphoto'),
  RoomController.createRoom
);
routes.put(
  '/updateroom/:id',
  multer(multerConfig).single('avatarphoto'),
  RoomController.updateRoomData
);

// User - Room
routes.get('/usersinroom', UserRoomController.listUsersInRoom);
routes.get(
  '/getoutoftheroom/:user_id/:room_id',
  UserRoomController.getOutOfTheRoom
);
routes.post('/insertuserinroom', UserRoomController.insertUserInRoom);
routes.put(
  '/makeorunmakeuseradmin/:user_id/:room_id',
  UserRoomController.makeOrUnmakeUserAdminInRoom
);
routes.delete(
  '/deleteuserfromroom/:user_id/:room_id',
  UserRoomController.deleteUserFromRoom
);

// Message
routes.get(
  '/latestmessageofcontact/:from',
  MessageController.listLatestMessageOfContact
);
routes.get(
  '/privatemessages/:from/:to_user',
  MessageController.listPrivateMessages
);
routes.get(
  '/latestmessageofroom/:from',
  MessageController.listLatestMessageOfRoom
);
routes.get('/roommessages', MessageController.listRoomMessages);
routes.post('/message', MessageController.createMessage);

export default routes;
