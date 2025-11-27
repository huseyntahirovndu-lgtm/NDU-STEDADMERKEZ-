import { students } from '@/lib/placeholder-data';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://istedadmerkezi.net';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Static pages
  const routes = ['', '/search', '/rankings', '/xeberler', '/telebe-teskilatlari'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const studentUrls = students
    .filter(user => user.status === 'təsdiqlənmiş')
    .map((student) => ({
      url: `${BASE_URL}/profile/${student.id}`,
      lastModified: new Date().toISOString(), 
  }));

  return [...routes, ...studentUrls];
}
