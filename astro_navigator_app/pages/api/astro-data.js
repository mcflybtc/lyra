
import { Observer,-
    Sol,
    Lua,
    Mercúrio,
    Vênus,
    Marte,
    Júpiter,
    Saturno,
    Urano,
    Netuno,
    Plutão,
    Nascer,
    Ocaso,
    Culminação,
    Anticulminação
} from 'astronomy-engine';

export default function handler(req, res) {
  const { lat, lon, date } = req.query;

  if (!lat || !lon || !date) {
    return res.status(400).json({ error: 'Latitude, longitude, and date are required.' });
  }

  const observer = new Observer(parseFloat(lat), parseFloat(lon), 0);
  const time = new Date(date);

  const bodies = [
    { name: 'Sol', body: Sol },
    { name: 'Lua', body: Lua },
    { name: 'Mercúrio', body: Mercúrio },
    { name: 'Vênus', body: Vênus },
    { name: 'Marte', body: Marte },
    { name: 'Júpiter', body: Júpiter },
    { name: 'Saturno', body: Saturno },
    { name: 'Urano', body: Urano },
    { name: 'Netuno', body: Netuno },
    { name: 'Plutão', body: Plutão },
  ];

  const astroData = bodies.map(({ name, body }) => {
    try {
      const rise = Nascer(body, observer, time);
      const set = Ocaso(body, observer, time);
      const culmination = Culminação(body, observer, time);
      const anticulmination = Anticulminação(body, observer, time);

      return {
        name,
        rise: rise ? rise.toISOString() : null,
        set: set ? set.toISOString() : null,
        culmination: culmination ? culmination.toISOString() : null,
        anticulmination: anticulmination ? anticulmination.toISOString() : null,
      };
    } catch (error) {
      return {
        name,
        error: 'Could not calculate data for this body.'
      };
    }
  });

  res.status(200).json(astroData);
}
