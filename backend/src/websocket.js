import socketio from 'socket.io';
import parserStringAsArray from './utils/parseStringAsArray';
import calculateDistance from './utils/calculateDistance';

const connections = [];
let io;

export function setupWebsocket(server) {
  io = socketio(server);

  io.on('connection', socket => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parserStringAsArray(techs),
    });
  });
}

export function findConnections(coordinates, techs) {
  return connections.filter(connection => {
    return (
      calculateDistance(coordinates, connection.coordinates) < 10 &&
      connection.techs.some(tech => techs.includes(tech))
    );
  });
}

export function sendMessage(to, message, data) {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
}
