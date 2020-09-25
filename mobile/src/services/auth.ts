import * as Yup from 'yup';

import api from './api';

import Toast from '../config/toastStyles';

interface IUserSentData {
  username?: string;
  email: string;
  password: string;
}

export interface ISignInResponse {
  id: number;
  username: string;
  email: string;
  photo: string;
  status: string;
  created_at: Date;
}

async function handleFieldsValidation(fields: IUserSentData): Promise<boolean> {
  const validation = Yup.object().shape({
    username: fields.username ? Yup.string().required() : Yup.string(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  return validation.isValid(fields);
}

export async function signIn(
  userSentData: IUserSentData,
): Promise<ISignInResponse | any> {
  try {
    const validation = await handleFieldsValidation(userSentData);

    if (!validation) {
      return Toast.error('Preenchimento incorreto.');
    }

    const login = await api.post<ISignInResponse>('/login', userSentData);

    if (!login) {
      return Toast.error('Erro ao fazer login.');
    }

    return login.data;
  } catch (err) {
    const {error} = err.response.data;

    return Toast.error(error);
  }
}

export async function signUp(userSentData: IUserSentData) {
  try {
    const validation = await handleFieldsValidation(userSentData);

    if (!validation) {
      Toast.error('Preenchimento incorreto.');

      return false;
    }

    const create = await api.post('/createuser', userSentData);

    if (!create) {
      return Toast.error('Erro ao fazer cadastro.');
    }

    Toast.success('Conta criada com sucesso.');

    return true;
  } catch (err) {
    const {error} = err.response.data;

    return Toast.error(error);
  }
}
