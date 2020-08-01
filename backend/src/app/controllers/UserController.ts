import { Request, Response, NextFunction } from 'express';
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

  async updateUserData(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { username, status } = req.body as IBodyData;

    try {
      const userExists = await knex('tb_user')
        .where('id', Number(id))
        .first();

      if (!userExists) {
        return res.status(400).json({ error: 'User does not exist.' });
      }
      
      const serializedUserInfo = {
        photo: req.file?.filename
          ? `${process.env.BASE_URL}/uploads/${req.file?.filename}`
          : userExists.photo,
        username: username ? username : userExists.username,
        status: status ? status : userExists.status,
      };

      const updateInfo = await knex('tb_user')
        .update(serializedUserInfo)
        .where('id', Number(id));

      if (!updateInfo) {
        return res.status(400).json({ error: 'Error updating data.' });
      }

      return res.json(updateInfo);
    } catch (err) {
      return res.status(500).json({ error: 'Error on updating user.' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const userExists = await knex('tb_user')
        .where('id', Number(id))
        .first();

      if (!userExists) {
        return res.status(400).json({ error: 'User does not exist.' });
      }

      const user = await knex('tb_user')
        .where('id', Number(id))
        .del();

      if (!user) {
        return res.status(400).json({ error: 'Error deleting user.' });
      }

      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: 'Error on updating user.' });
    }
  }

  async loginRocketMessages(req: Request, res: Response) {
    const { email, password } = req.body as IBodyData;

    try {
      const accountExists = await knex('tb_user as U')
        .where('U.email', String(email))
        .first();

      if (!accountExists) {
        return res.status(409).json({ error: 'Email not found.' });
      }

      const passwordCompare = compareSync(password, accountExists.password);

      if (!passwordCompare) {
        return res.status(400).json({ error: 'Password wrong.' });
      }

      // Exclude passworld field
      accountExists.password = undefined;

      return res.json(accountExists);
    } catch (err) {
      return res.status(500).json({ error: 'Error logging in user.' });
    }
  }

  async listUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await knex('tb_user as U')
        .where('U.id', Number(id))
        .first();

      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }
      
      // Exclude passworld field
      user.password = undefined;

      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: 'Error on listing user.' });
    }
  }

  async listUsers(req: Request, res: Response) {
    try {
      const { search } = req.query;

      // This query finds a record by username or email, if it does not find returns all data.
      const users = await knex('tb_user as U')
        .select(
          'U.id',
          'U.username',
          'U.email',
          'U.photo',
          'U.status',
          'U.created_at',
        )
        .whereNotExists(
          knex
            .select(
              'U.id',
              'U.username',
              'U.email',
              'U.photo',
              'U.status',
              'U.created_at',
            )
            .from('tb_user as U')
            .where('U.email', 'like', `%${String(search)}%`)
            .orWhere('U.username', 'like', `%${String(search)}%`)
        )
        .where('U.email', 'like', `%${String(search)}%`)
        .orWhere('U.username', 'like', `%${String(search)}%`);

      if (!users) {
        return res.status(500).json({ error: 'Error on listing users.' });
      }

      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Error on listing users.' });
    }
  }
}
