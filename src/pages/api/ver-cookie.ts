import { parse } from 'cookie';

export async function GET({ request} : any ) {
  const cookies = parse(request.headers.get('cookie') || '');
  return new Response(JSON.stringify(cookies, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}
