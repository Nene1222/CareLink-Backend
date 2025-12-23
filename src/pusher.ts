import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '2090049',
  key: process.env.PUSHER_KEY || '5d9c90a6a40de168e4b8',
  secret: process.env.PUSHER_SECRET || 'caba4d8470b95c5ae7a5',
  cluster: process.env.PUSHER_CLUSTER || 'ap1', 
  useTLS: true,
});

export default pusher;