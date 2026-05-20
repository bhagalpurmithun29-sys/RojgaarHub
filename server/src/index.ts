import http from 'http';
import app from './app';
import setupSockets from './sockets';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

setupSockets(server);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
