import axios from 'axios';
import parseStringAsArray from '../../utils/parseStringAsArray';
import Dev from '../schemas/Dev';
import { findConnections, sendMessage } from '../../websocket';

class UserController {
  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (dev) {
      return res.status(400).json({ error: 'Dev already exist' });
    }

    const { data } = await axios.get(
      `https://api.github.com/users/${github_username}`
    );

    const { name = login, avatar_url, bio } = data; // eslint-disable-line

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    dev = await Dev.create({
      name,
      github_username,
      avatar_url,
      bio,
      techs: techsArray,
      location,
    });

    // Filter connections with distance max 10 km
    const sendSocketMessageTo = findConnections(
      { latitude, longitude },
      techsArray
    );

    sendMessage(sendSocketMessageTo, 'new-dev', dev);

    return res.status(201).json(dev);
  }

  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  }
}

export default new UserController();
