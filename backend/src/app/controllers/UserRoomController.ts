import { Request, Response } from 'express';
import knex from '../../database/connection';

interface IBodyData {
  user_id: number;
  nickname: string;
  user_admin: boolean;
}

interface IUserData {
  id: number;
  user_admin: boolean;
  username: string;
  photo: string;
  status: string;
}

export default new class UserRoomController {
  async insertUserInRoom(req: Request, res: Response) {
    const { user_id, nickname, user_admin } = req.body as IBodyData;

    try {
      const roomExists = await knex('tb_room as R')
        .where('R.nickname', String(nickname))
        .select('R.id')
        .first();

      if (!roomExists) {
        return res.status(400).json({ error: 'Room does not exists.' });
      }

      const userInRoomExists = await knex('tb_user_room as UR')
        .where('UR.user_id', Number(user_id))
        .andWhere('UR.room_id', Number(roomExists.id))
        .first();

      if (userInRoomExists) {
        return res.status(409)
          .json({ error: 'Error inserting user inside the room.' });
      }

      const userInRoom = await knex('tb_user_room').insert({
        user_id,
        room_id: roomExists?.id,
        user_admin,
      });

      if (!userInRoom) {
        return res.status(400)
          .json({ error: 'Error inserting user inside the room.' });
      }

      return res.json(userInRoom);
    } catch (err) {
      return res.status(500)
        .json({ error: 'Error inserting user inside the room.' });
    }
  }

  async listUsersInRoom(req: Request, res: Response) {
    const { user_id, nickname } = req.query;

    try {
      const usersInRooms = await knex('tb_user_room as UR')
        .join('tb_user as U', 'UR.user_id', 'U.id')
        .join('tb_room as R', 'UR.room_id', 'R.id')
        .where('R.nickname', String(nickname))
        .orderBy('UR.user_admin', 'desc')
        .select(
          'U.id',
          'UR.user_admin',
          'U.username',
          'U.photo',
          'U.status',
        );

      if (!usersInRooms) {
        return res.status(500)
          .json({ error: 'Error listing users inside the room.' });
      }

      const allAdmin = usersInRooms.filter(
        (user: IUserData) => user.user_admin
      )
      .sort((user: IUserData) => {
        if (user.id === Number(user_id)) return -1;
        if (user.id !== Number(user_id)) return 1;

        return 0;
      });

      const usersInRoomFiltered = usersInRooms.filter(
        (user: IUserData) => !allAdmin.includes(user)
      );

      usersInRoomFiltered.unshift(...allAdmin);

      return res.json(usersInRoomFiltered);
    } catch (err) {

      return res.status(500)
        .json({ error: 'Error listing users inside the room.' });
    }
  }

  async makeOrUnmakeUserAdminInRoom(req: Request, res: Response) {
    const { user_id, room_id } = req.params;
    const { user_admin } = req.body as IBodyData;
    
    try {
      const userExists = await knex('tb_user_room as UR')
        .where('UR.user_id', Number(user_id))
        .andWhere('UR.room_id', Number(room_id))
        .first();

      if (!userExists) {
        return res.status(400).json({ error: 'User not exists in room.' });
      }

      const makeOrUnmakeUserAdmin = await knex('tb_user_room as UR')
        .where('UR.user_id', Number(user_id))
        .andWhere('UR.room_id', Number(room_id))
        .update({
          user_admin,
        });

      if (!makeOrUnmakeUserAdmin) {
        return res.status(500).json({
          error: 'Error changing user permissions.'
        });
      }

      return res.json(makeOrUnmakeUserAdmin);
    } catch (err) {
      return res.status(500).json({
        error: 'Error changing user permissions.'
      });
    }
  }

  async deleteUserFromRoom(req: Request, res: Response) {
    const { user_id, room_id } = req.params;
    
    try {
      const userExists = await knex('tb_user_room as UR')
        .where('UR.user_id', Number(user_id))
        .andWhere('UR.room_id', Number(room_id))
        .first();

      if (!userExists) {
        return res.status(400).json({ error: 'User not exists in room.' });
      }

      const removeUser = await knex('tb_user_room as UR')
        .where('UR.user_id', Number(user_id))
        .andWhere('UR.room_id', Number(room_id))
        .del();

      if (!removeUser) {
        return res.status(500).json({ error: 'Error removing user from room.' });
      }

      return res.json(removeUser);
    } catch (err) {
      return res.status(500).json({ error: 'Error removing user from room.' });
    }
  }

  async getOutOfTheRoom(req: Request, res: Response) {
    // Method to check if the user is in the room,
    // to validate whether the user will be able to send a message or not.

    const { user_id, room_id } = req.params;
    
    try {
      const user = await knex('tb_user_room as UR')
        .where('UR.user_id', Number(user_id))
        .andWhere('UR.room_id', Number(room_id))
        .first();

      if (!user) {
        return res.sendStatus(403);
      }

      return res.sendStatus(200);
    } catch (err) {
      return res.status(500).json({ error: 'Error checking user in room.' });
    }
  }
}
