import { Request, Response } from 'express';
import knex from '../../database/connection';

interface IMessageData {
  from: number;
  to_user?: number;
  to_room?: number;
  message: string;
  image?: string;
  created_at: Date;
}

interface IWhichRoom {
  room_id: number;
}

export default new class MessageController {
  async createMessage(req: Request, res: Response) {
    const {
      from,
      to_user,
      to_room,
      message,
      image,
    } = req.body as IMessageData;

    try {
      if (to_user) {
        const userExists = await knex('tb_user as U')
          .where('U.id', Number(to_user))
          .first();

        if (!userExists) {
          return res.status(409).json({ error: 'Recipient does not exist.' });
        }
      }

      if (to_room) {
        const roomExists = await knex('tb_room as R')
          .where('R.id', Number(to_room))
          .first();

        if (!roomExists) {
          return res.status(409).json({ error: 'Room does not exist.' });
        }
      }

      const messageSent = await knex('tb_message').insert({
        from,
        to_user: !to_user || undefined ? null : to_user,
        to_room: !to_room || undefined ? null : to_room,
        message,
        image: image === '' || undefined ? null : image,
        created_at: new Date(),
      });
  
      if (!messageSent) {
        return res.status(400).json({ error: 'Error on creating message.' });
      }
  
      return res.json(messageSent);
    } catch (err) {
      return res.status(500).json({ error: 'Error on creating message.' });
    }
  }

  async listLatestMessageOfContact(req: Request, res: Response) {
    const { from } = req.params;

    try {
      const messages = await knex.with('CTE_RN', knex.raw(
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
        'CTE_RN.from',
        'CTE_RN.to_user',
        'CTE_RN.message',
        'CTE_RN.image',
        'CTE_RN.created_at',
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

    if (!messages) {
      return res.status(500).json({ error: 'Error on listing messages.' });
    }

    return res.json(messages);
    } catch (err) {
      return res.status(500).json({ error: 'Error on listing messages.' });
    }
  }

  async listPrivateMessages(req: Request, res: Response) {
    const { from, to_user } = req.params;

    try {
      const messages = await knex('tb_message as M')
        .join('tb_user as U', 'M.to_user', '=', 'U.id')
        .whereIn('M.from', [Number(from), Number(to_user)])
        .whereIn('M.to_user', [Number(to_user), Number(from)])
        .orderBy('M.id', 'asc')
        .select(
          'U.id',
          'M.message',
          'M.image',
          'M.created_at',
        );

    if (!messages) {
      return res.status(500).json({ error: 'Error on listing messages.' });
    }

    return res.json(messages);
    } catch (err) {
      return res.status(500).json({ error: 'Error on listing messages.' });
    }
  }

  async listRoomMessages(req: Request, res: Response) {
    const { nickname } = req.query;

    try {
      const messages = await knex('tb_message as M')
        .join('tb_room as R', 'M.to_room', 'R.id')
        .join('tb_user as U', 'M.from', 'U.id')
        .where('R.nickname', String(nickname))
        .select(
          'U.id',
          'U.username',
          'M.message',
          'M.image',
          'M.created_at',
        );

    if (!messages) {
      return res.status(500).json({ error: 'Error on listing messages.' });
    }

    return res.json(messages);
    } catch (err) {
      return res.status(500).json({ error: 'Error on listing messages.' });
    }
  }

  async listLatestMessageOfRoom(req: Request, res: Response) {
    const { from } = req.params;

    try {
      const whichRooms = await knex('tb_user_room as UR')
        .where('UR.user_id', String(from))
        .select('UR.room_id');

      const whichRoomsValuesToSingleArray = whichRooms
        .map((room: IWhichRoom) => room.room_id);

      const messages = await knex.with('CTE_RN', knex.raw(
        `
          SELECT
            *,
            ROW_NUMBER() OVER(
              PARTITION BY M."to_room"
              ORDER BY M."created_at" DESC) AS RN
          FROM tb_message AS M
          WHERE M."to_room" IS NOT NULL AND
          M."to_room" IN (${whichRoomsValuesToSingleArray.toString()})
        `
      ))
      .select(
        'R.id',
        'R.name',
        'R.nickname',
        'R.avatar',
        'CTE_RN.from',
        'CTE_RN.to_user',
        'CTE_RN.to_room',
        'CTE_RN.message',
        'CTE_RN.image',
        'CTE_RN.created_at',
      )
      .from('CTE_RN')
      .join('tb_room as R', 'CTE_RN.to_room', 'R.id')
      .where('RN', 1);

      if (!messages) {
        return res.status(500).json({ error: 'Error on listing messages.' });
      }

      return res.json(messages);
    } catch (err) {
      return res.status(500).json({ error: 'Error on listing messages.' });
    }
  }
}
