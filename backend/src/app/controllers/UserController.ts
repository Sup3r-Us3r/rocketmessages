import { Request, Response } from 'express';
import knex from '../../database/connection';

interface IBodyData {
  username: string;
  login: string;
  photo?: string;
  status?: string;
}

export default new class UserController {
  async createUser(req: Request, res: Response) {
    const { username, login, photo, status } = req.body as IBodyData;

    try {
      const userExists = await knex('tb_user').where('login', login).first();

      if (userExists) {
        return res.status(409).json({ error: 'Login already exists.' });
      }

      const user = await knex('tb_user').insert({
        username,
        login,
        photo: photo ? photo : process.env.PROFILE_DEFAULT_PHOTO_URL,
        status: status ? status : 'Hey there, im using Rocket Messages!',
        created_at: new Date(),
      });
  
      if (!user) {
        return res.status(400).json({ error: 'Error on creating user.' });
      }

      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: 'Error on creating user.' });
    }
  }

  async listUsers(req: Request, res: Response) {
    try {
      const users = await knex('tb_user').select('*');

      if (!users) {
        return res.status(500).json({ error: 'Error on listing users.' });
      }

      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Error on listing users.' });
    }
  }
}

