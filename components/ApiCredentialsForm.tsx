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
    setApi(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700'>API Key</label>
        <input
          {...register('apiKey')}
          required
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700'>Private Key</label>
        <textarea
          {...register('privateKey')}
          required
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        />
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700'>Server</label>
        <select
          {...register('server')}
          required
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        >
          <option value='test'>Test</option>
          <option value='localhost'>Localhost</option>
          <option value='production'>Production</option>
        </select>
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