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
      const userOrRoomExists = await knex('tb_user_room as UR')
        .where('UR.user_id', Number(to_user))
        .orWhere('UR.room_id', Number(to_room))
        .first();

      if (!userOrRoomExists) {
        return res.status(409).json({ error: 'Error on creating message.' });
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

  async listPrivateMessages(req: Request, res: Response) {
    const { from } = req.params;

    try {
      const messages = await knex('tb_message as M')
        .join('tb_user as U', 'M.to_user', '=', 'U.id')
        .where('M.from', String(from))
        .orderBy('M.created_at', 'desc')
        .select(
          'U.id',
          'U.username',
          'U.email',
          'U.photo',
          'U.status',
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
    const { from } = req.params;

    try {
      const messages = await knex('tb_message as M')
        .join('tb_room as R', 'M.to_room', '=', 'R.id')
        .where('M.from', String(from))
        .select(
          'R.id',
          'R.name',
          'R.nickname',
          'R.avatar',
          'M.message',
          'M.image',
        );

    if (!messages) {
      return res.status(500).json({ error: 'Error on listing messages.' });
    }

    return res.json(messages);
    } catch (err) {
      return res.status(500).json({ error: 'Error on listing messages.' });
    }
  }
}
