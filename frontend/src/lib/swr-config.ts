// SWR configuration and hooks

import { SWRConfiguration } from 'swr';
import { apiClient } from './api-client';

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  dedupingInterval: 2000,
  fetcher: (url: string) => apiClient.get(url),
};
