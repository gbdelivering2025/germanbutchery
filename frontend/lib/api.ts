import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getImageUrl = (url?: string) => {
  if (!url) return '/placeholder.png';
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
};
