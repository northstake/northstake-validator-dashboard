'use client'
import { useForm } from 'react-hook-form';
import { useApi } from '../context/ApiContext';

interface FormData {
  apiKey: string;
  privateKey: string;
  server: string;
}

const ApiCredentialsForm = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { setApi } = useApi();

  const onSubmit = (data: FormData) => {
    //set server to test
    data.server = 'test'
    setApi(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg'>
      <div>
        <label className='block text-sm font-medium text-gray-300'>API Key</label>
        <input
          {...register('apiKey')}
          required
          className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50'
        />
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-300'>Private Key</label>
        <textarea
          {...register('privateKey')}
          required
          className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50'
          style={{ height: '150px' }}
        />
      </div>
      <button
        type='submit'
        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      >
        Login
      </button>
    </form>
  )
};

export default ApiCredentialsForm;