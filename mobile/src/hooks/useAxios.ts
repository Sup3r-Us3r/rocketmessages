import useSWR from 'swr';

import api from '../services/api';

export default function useAxios<Data = any, Error = any>(
  url: string,
  params: object | undefined,
) {
  const {data, error} = useSWR<Data, Error>(url, async () => {
    const response = await api.get(url, params);

    if (response) {
      console.log('REQUISIÇÃO: ', response.data);
      return response.data;
    }
  });

  return {data, error};
}
