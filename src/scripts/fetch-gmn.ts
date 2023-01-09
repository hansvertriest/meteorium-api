// Node
import * as dateFns from 'date-fns';
import fetch from 'node-fetch';

// Classes
import Config from '../services/config/Config.js';
import DataBase from '../services/database/Postgres.js';

// Types
import { IConfig } from '../services/config/config.types.js';
import { ObservationType } from '../services/database/models/Observation.js';
import { Source } from '../sources/d.types.js';
import { Network } from '../types/Observation.js';

const config: IConfig = new Config();

const db = new DataBase(config.postgres);

function stringIsNetwork(str: string): asserts str is Network {
  if (!(Object.values(Network) as string[]).includes(str)) {
    throw new Error('string is not a network');
  }
}

const stationToNetworkMapping: Record<Network, string[]> = {
  [Network.africa]: ['ZA'],
  [Network.asia]: ['MY'],
  [Network.australia]: ['AU', 'NZ', ''],
  [Network.europe]: ['BE', 'CH', 'CZ', 'DE', 'DK', 'ES', 'FI', 'FR', 'GB', 'HR', 'IE', 'IT', 'LU', 'NL', 'PL', 'PT', 'RU', 'SI', 'SK'],
  [Network.middleEast]: ['IL'],
  [Network.southAmerica]: ['BR', 'MX'],
  [Network.northAmerica]: ['CA', 'US'],
  [Network.unknown]: [],
};

const getNetworkFromStation = (stationCodes: string[]) => {
  const networks: { [key in Network]?: number } = {};
  for (const code of stationCodes) {
    const countryCode = code.slice(0, 2);
    let network: string;
    Object.entries(stationToNetworkMapping).forEach(([key, countryCodes]) => {
      if (countryCodes.includes(countryCode)) {
        network = key;
      }
    });

    if (!network) {
      return Network.unknown;
    }

    stringIsNetwork(network);

    if (!networks[network]) {
      networks[network] = 1;
    }
    networks[network] += 1;
  }

  const network = Object.entries(networks).sort(([, a], [, b]) => a - b)[0][0];

  return network as Network;
};

const mapGmnLineToObservation = (line: string): ObservationType => {
  const columns = line.split('; ');

  const resp = {
    time: new Date(columns[2]),
    date: new Date(columns[2]),
    t_begin: 0,
    lat_begin: Number(columns[63]),
    lon_begin: Number(columns[65]),
    h_begin: Number(columns[67]),
    t_end: Number(columns[75]),
    lat_end: Number(columns[69]),
    lon_end: Number(columns[71]),
    h_end: Number(columns[73]),
    iau_no: Number(columns[3]),
    stations: columns[85],
    network: getNetworkFromStation(columns[85].split(',')),
    source: Source.GlobalMeteorNetwork,
  };

  return resp;
};

const run = async () => {
  // get latest date in of GMN observation
  const latestDate = await db.models.observation.getLatestDate();
  let dateToFetch = dateFns.add(latestDate, { months: 1 });
  if (dateFns.isBefore(dateToFetch, new Date('2018-12-01'))) {
    dateToFetch = new Date('2018-12-01');
  }
  // fetch GMN observation after latest date
  let statusCode: number | undefined;
  while (statusCode === 200 || statusCode === undefined) {
    const year = dateFns.getYear(dateToFetch);
    const month = (dateFns.getMonth(dateToFetch) + 1).toString().padStart(2, '0');
    const monthlyUrl = `https://globalmeteornetwork.org/data/traj_summary_data/monthly/traj_summary_monthly_${year}${month}.txt`;
    const response = await fetch(monthlyUrl);

    const text = await response.text();
    const lines = text
      .split('\n')
      .map((l) => l.replace(/^\r/, ''))
      .filter((l) => !/^#/g.test(l))
      .filter((l) => l);

    const records = lines.map(mapGmnLineToObservation);

    for (const r of records) {
      try {
        await db.models.observation.createMultiple([r]);
      } catch (e) {
        console.log(e);
        break;
      }
    }

    statusCode = response.status;
    dateToFetch = dateFns.add(dateToFetch, { months: 1 });

    console.log(`Imported ${year}${month}`);
  }
};

run();
