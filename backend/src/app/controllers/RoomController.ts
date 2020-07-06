import { Request, Response } from 'express';

import knex from '../../database/connection';

interface IBodyData {
  name: string;
  nickname: string;
  avatar?: string;
  created_at: Date;
}

export default new class RoomController {
  async createRoom(req: Request, res: Response) {
    const { name, nickname, avatar } = req.body as IBodyData;
    
    try {
      const roomExists = await knex('tb_room')
        .where('nickname', nickname)
        .first();

      if (roomExists) {
        return res.status(409).json({ error: 'Room already exists.' });
      }

      const room = await knex('tb_room').insert({
        name,
        nickname,
        avatar: avatar ? avatar : process.env.ROOM_DEFAULT_AVATAR_URL,
        created_at: new Date(),
      });

      if (!room) {
        return res.status(400).json({ error: 'Error on creating room.' });
      }

      return res.json(room);
    } catch (err) {
      return res.status(500).json({ error: 'Error on creating room.' });
    }
  }
  
  async listRooms(req: Request, res: Response) {
    try {
      const rooms = await knex('tb_room').select('*');

      if (!rooms) {
        return res.status(500).json({ error: 'Error on listing rooms.' });
      }

      return res.json(rooms);
    } catch (err) {
      return res.status(500).json({ error: 'Error on listing rooms.' });
    }
  }
}
