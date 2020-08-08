import { Request, Response, NextFunction, request } from 'express';

import knex from '../../database/connection';

interface IBodyData {
  name: string;
  nickname: string;
  avatar?: string;
  created_at: Date;
}

export default new class RoomController {
  async createRoom(req: Request, res: Response, next: NextFunction) {
    const { name, nickname } = req.body as IBodyData;

    try {
      const roomExists = await knex('tb_room')
        .where('nickname', String(nickname))
        .first();

      if (roomExists) {
        return res.status(409).json({ error: 'Room already exists.' });
      }

      const room = await knex('tb_room').insert({
        name,
        nickname,
        avatar: req.file?.filename
          ? `${process.env.BASE_URL}/uploads/${req.file?.filename}`
          : process.env.ROOM_DEFAULT_AVATAR_URL,
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

  async updateRoomData(req: Request, res: Response) {
    const { id } = req.params;
    const { name, nickname } = req.body as IBodyData;
    
    try {
      const roomExists = await knex('tb_room as R')
        .where('R.id', Number(id))
        .first();

      if (!roomExists) {
        return res.status(400).json({ error: 'Room does not exist.' });
      }

      const serializedRoomInfo = {
        avatar: req.file?.filename ?
          `${process.env.BASE_URL}/uploads/${req.file?.filename}`
          : roomExists?.avatar,
        name: name ? name : roomExists?.name,
        nickname: nickname ? nickname : roomExists?.nickname,
      }

      const updateInfo = await knex('tb_room as R')
        .update(serializedRoomInfo)
        .where('R.id', Number(id));

      if (!updateInfo) {
        return res.status(500).json({ error: 'Error on updating room.' });
      }

      return res.json(updateInfo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error on updating room.' });
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

  async listFrequentContactsForAddRoom(req: Request, res: Response) {
    const { from } = req.params;
    
    try {
      const frequentContacts = await knex.with('CTE_RN', knex.raw(
        `
          SELECT
            *,
            ROW_NUMBER() OVER(
              PARTITION BY CASE WHEN M."from" = ${from}
              THEN M."to_user" ELSE M."from" END
              ORDER BY M."created_at" DESC) AS RN
          FROM tb_message as M
          WHERE M."to_user" IS NOT NULL AND
          M."from" = ${from} OR M."to_user" = ${from}
        `
      ))
      .select(
        'U.id',
        'U.username',
        'U.email',
        'U.photo',
        'U.status',
      )
      .from('CTE_RN')
      .join(knex.raw(
        `
          tb_user AS U ON CASE
          WHEN CTE_RN."from" = ${from} THEN CTE_RN."to_user" = U.id
          WHEN CTE_RN."to_user" = ${from} THEN CTE_RN."from" = U.id
          END
        `
      ))
      .where('RN', 1);

      if (!frequentContacts) {
        return res.status(500)
          .json({ error: 'Error on listing frequent contacts.' });
      }

      return res.json(frequentContacts);
    } catch (err) {
      return res.status(500)
        .json({ error: 'Error on listing frequent contacts.' });
    }
  }
}
