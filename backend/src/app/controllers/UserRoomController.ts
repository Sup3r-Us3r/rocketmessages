import { Request, Response } from 'express';
import knex from '../../database/connection';

interface IBodyData {
  user_id: number;
  room_id: number;
}

interface IUserInRoomData {
  username: string;
  login: string;
  status?: string;
  photo?: string;
  name: string;
  nickname: string;
  avatar: string;
  created_at: Date;
}

export default new class UserRoomController {
  async insertUserInRoom(req: Request, res: Response) {
    const { user_id, room_id } = req.body as IBodyData;

    console.log(user_id, room_id);

    try {
      const userInRoomExists = await knex('tb_user_room as UR')
        .where('UR.user_id', user_id)
        .andWhere('UR.room_id', room_id)
        .first();

      if (userInRoomExists) {
        return res.status(409)
          .json({ error: 'Error inserting user inside the room.' });
      }

      const userInRoom = await knex('tb_user_room').insert({
        user_id,
        room_id,
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

  async listUserInRoom(req: Request, res: Response) {
    // const { nickname } = req.query;

    try {
      const usersInRooms = await knex('tb_user_room as UR')
        .join('tb_user as U', 'UR.user_id', '=', 'U.id')
        .join('tb_room as R', 'UR.room_id', '=', 'R.id')
        .select(
          'U.username',
          'U.login',
          'U.photo',
          'R.name',
          'R.nickname',
          'R.avatar',
        );

      if (!usersInRooms) {
        return res.status(500)
          .json({ error: 'Error listing users inside the room.' });
      }

      const serializedUsersInRooms = usersInRooms
        .map((item: IUserInRoomData) => ({
          user: {
            username: item.username,
            login: item.login,
            status: item.status,
            photo: item.photo,
          },
          room: {
            name: item.name,
            nickname: item.nickname,
            avatar: item.avatar,
            created_at: item.created_at,
          },
        }));

      return res.json(serializedUsersInRooms);
    } catch (err) {
      return res.status(500)
        .json({ error: 'Error listing users inside the room.' });
    }
  }
}
