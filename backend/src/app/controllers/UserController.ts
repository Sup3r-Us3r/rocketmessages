import { Request, Response } from 'express';
import knex from '../../database/connection';
import { hashSync, compareSync } from 'bcryptjs';

interface IBodyData {
  username: string;
  email: string;
  password: string;
  photo?: string;
  status?: string;
}

export default new class UserController {
  async createUser(req: Request, res: Response) {
    const { username, email, password, photo, status } = req.body as IBodyData;

    try {
      const userExists = await knex('tb_user')
        .where('email', email)
        .first();

      if (userExists) {
        return res.status(409).json({ error: 'Account already exists.' });
      }

      const user = await knex('tb_user').insert({
        username,
        email,
        password: hashSync(password, 8),
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

  async loginRocketMessages(req: Request, res: Response) {
    const { email, password } = req.body as IBodyData;

    try {
      const accountExists = await knex('tb_user as U')
        .where('U.email', String(email))
        .first();

      if (!accountExists) {
        return res.status(409).json({ error: 'Email not found' });
      }

      const passwordCompare = compareSync(password, accountExists.password);

      if (!passwordCompare) {
        return res.status(400).json({ error: 'Password wrong.' });
      }

      // Exclude passworld field
      accountExists.password = undefined;

      return res.json(accountExists);
    } catch(err) {
      return res.status(500).json({ error: 'Error logging in user.' });
    }
  }

  async listUsers(req: Request, res: Response) {
    try {
      const users = await knex('tb_user as U')
        .select(
          'U.id',
          'U.username',
          'U.email',
          'U.photo',
          'U.status',
          'U.created_at',
        );

      console.log(users);

      if (!users) {
        return res.status(500).json({ error: 'Error on listing users.' });
      }

      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Error on listing users.' });
    }
  }
}

