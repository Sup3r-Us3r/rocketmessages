import { Request, Response, NextFunction } from 'express';
import knex from '../../database/connection';
import { hashSync, compareSync } from 'bcryptjs';
import { randomBytes } from 'crypto';

import Mail from '../../services/Mail';

interface IBodyData {
  username: string;
  email: string;
  password: string;
  photo?: string;
  status?: string;
  recoverycode?: string;
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
        password: hashSync(String(password), 8),
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
      const userExists = await knex('tb_user as U')
        .where('U.id', Number(id))
        .first();

      if (!userExists) {
        return res.status(400).json({ error: 'User does not exist.' });
      }
      
      const serializedUserInfo = {
        photo: req.file?.filename
          ? `${process.env.BASE_URL}/uploads/${req.file?.filename}`
          : userExists?.photo,
        username: username ? username : userExists?.username,
        status: status ? status : userExists?.status,
      };

      const updateInfo = await knex('tb_user as U')
        .where('U.id', Number(id))
        .update(serializedUserInfo);

      if (!updateInfo) {
        return res.status(500).json({ error: 'Error updating user data.' });
      }

      return res.json(updateInfo);
    } catch (err) {
      return res.status(500).json({ error: 'Error updating user data.' });
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
      return res.status(500).json({ error: 'Error deleting user.' });
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

      const passwordCompare = compareSync(
        String(password), accountExists.password
      );

      if (!passwordCompare) {
        return res.status(400).json({ error: 'Password wrong.' });
      }

      // Exclude fields
      accountExists.recoverycode = undefined;
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

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.params;

    function randomNumbers(min: number = 10000, max: number = 99999): number {
      return Math.round(Math.random() * (max - min) + min);
    }

    try {
      const user = await knex('tb_user as U')
        .where('U.email', String(email))
        .first();

      if (!user) {
        return res.status(400).json({ error: 'User does not exists.' });
      }

      const generateCode = String(randomNumbers());

      const addCodeForRecovery = await knex('tb_user as U')
        .where('U.email', String(email))
        .update({
          recoverycode: generateCode,
        });

      if (!addCodeForRecovery) {
        return res.status(500).json({ error: 'Error sending recovery email.' });
      }

      Mail.sendMail({
        from: '78c268dca2f9eb',
        to: user.email,
        subject: 'Password recovery code',
        html: Mail.templateMail(generateCode)
      });

      return res.json({
        email,
        recoverycode: generateCode,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error retrieving password.' });
    }
  }

  async recoverPassword(req: Request, res: Response) {
    const { email } = req.params;
    const { recoverycode, password } = req.body as IBodyData;

    try {
      const user = await knex('tb_user as U')
        .where('U.email', String(email))
        .first();

      if (!user) {
        return res.status(400).json({ error: 'User does not exists.' });
      }

      const verifyCode = Boolean(String(recoverycode) === user.recoverycode);

      if (verifyCode) {
        const passwordHash = hashSync(String(password), 8);

        const updatePassword = await knex('tb_user as U')
          .where('U.email', String(email))
          .update({
            password: passwordHash,
          });

        if (!updatePassword) {
          return res.status(500).json({ error: 'Error on updating password.' });
        }
      }

      if (!verifyCode) {
        return res.status(400).json({ error: 'Invalid code.' });
      }

      return res.sendStatus(200);
    } catch (err) {
      return res.status(500).json({ error: 'Error on updating password.' });
    }
  }
}
