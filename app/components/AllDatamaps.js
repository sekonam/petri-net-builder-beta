import React from 'react';
import * as d3 from 'd3';
import DatamapSample from '../containers/DatamapSample';

const colors = d3.scaleOrdinal(d3.schemeCategory10);

const DatamapDatas = [
  {
    title: 'ArcsExample',
    storage: {
      scope: 'usa',
      fills: {
        defaultFill: '#abdda4',
        win: '#0fa0fa',
      },
      data: {
        TX: { fillKey: 'win' },
        FL: { fillKey: 'win' },
        NC: { fillKey: 'win' },
        CA: { fillKey: 'win' },
        NY: { fillKey: 'win' },
        CO: { fillKey: 'win' },
      },
      arc: [
        {
          origin: {
            latitude: 40.639722,
            longitude: -73.778889,
          },
          destination: {
            latitude: 37.618889,
            longitude: -122.375,
          },
        },
        {
          origin: {
            latitude: 30.19444,
            longitude: -97.67,
          },
          destination: {
            latitude: 25.793333,
            longitude: -80.290556,
          },
          options: {
            strokeWidth: 2,
            strokeColor: 'rgba(100, 10, 200, 0.4)',
            greatArc: true,
          },
        },
        {
          origin: {
            latitude: 39.861667,
            longitude: -104.673056,
          },
          destination: {
            latitude: 35.877778,
            longitude: -78.7875,
          },
        },
      ],
      arcOptions: {
        strokeWidth: 1,
        arcSharpness: 1.4,
      },
    },
  },
  {
    title: 'Bubbles',
    storage: {
      geographyConfig: {
        popupOnHover: false,
        highlightOnHover: false,
      },
      fills: {
        defaultFill: '#abdda4',
        USA: 'blue',
        RUS: 'red',
      },
      bubbles: [
        {
          name: 'Not a bomb, but centered on Brazil',
          radius: 23,
          centered: 'BRA',
          country: 'USA',
          yeild: 0,
          fillKey: 'USA',
          date: '1954-03-01',
        },
        {
          name: 'Castle Bravo',
          radius: 25,
          yeild: 15000,
          country: 'USA',
          significance: 'First dry fusion fuel "staged" thermonuclear weapon;' +
            ' a serious nuclear fallout accident occurred',
          fillKey: 'USA',
          date: '1954-03-01',
          latitude: 11.415,
          longitude: 165.1619,
        },
        {
          name: 'Tsar Bomba',
          radius: 70,
          yeild: 50000,
          country: 'USSR',
          fillKey: 'RUS',
          significance: 'Largest thermonuclear weapon ever tested-scaled down from its initial 100Mt design by 50%',
          date: '1961-10-31',
          latitude: 73.482,
          longitude: 54.5854,
        },
      ],
      bubbleOptions: {
        popupTemplate: (geo, data) =>
          `<div class="hoverinfo">Yield: ${data.yeild}\nExploded on ${data.date} by the ${data.country}`,
      },
    },
  },
  {
    title: 'Projections & Graticules',
    storage: {
      scope: 'world',
      projection: 'orthographic',
      fills: {
        defaultFill: '#abdda4',
        gt50: colors(Math.random() * 20),
        eq50: colors(Math.random() * 20),
        lt25: colors(Math.random() * 10),
        gt75: colors(Math.random() * 200),
        lt50: colors(Math.random() * 20),
        eq0: colors(Math.random() * 1),
        pink: '#0fa0fa',
        gt500: colors(Math.random() * 1),
      },
      projectionConfig: {
        rotation: [97, -30],
      },
      data: {
        USA: { fillKey: 'lt50' },
        MEX: { fillKey: 'lt25' },
        CAN: { fillKey: 'gt50' },
        GTM: { fillKey: 'gt500' },
        HND: { fillKey: 'eq50' },
        BLZ: { fillKey: 'pink' },
        GRL: { fillKey: 'eq0' },
      },
      arc: [
        {
          origin: {
            latitude: 61,
            longitude: -149,
          },
          destination: {
            latitude: -22,
            longitude: -43,
          },
        },
      ],
      arcOptions: {
        greatArc: true,
        animationSPeed: 2000,
      },
      style: {
        height: '500px',
      },
    },
  },
  {
    title: 'United States Political Preferences',
    storage: {
      scope: 'usa',
      geographyConfig: {
        highlightBorderColor: '#bada55',
        popupTemplate: (geography, data) =>
          `<div class='hoverinfo'>${geography.properties.name}\nElectoral Votes: ${data.electoralVotes}`,
        highlightBorderWidth: 3,
      },
      fills: {
        Republican: '#cc4731',
        Democrat: '#306596',
        'Heavy Democrat': '#667faf',
        'Light Democrat': '#a9c0de',
        'Heavy Republican': '#ca5e5b',
        'Light Republican': '#eaa9a8',
        defaultFill: '#eddc4e',
      },
      data: {
        AZ: {
          fillKey: 'Republican',
          electoralVotes: 5,
        },
        CO: {
          fillKey: 'Light Democrat',
          electoralVotes: 5,
        },
        DE: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        FL: {
          fillKey: 'UNDECIDED',
          electoralVotes: 29,
        },
        GA: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        HI: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        ID: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        IL: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        IN: {
          fillKey: 'Republican',
          electoralVotes: 11,
        },
        IA: {
          fillKey: 'Light Democrat',
          electoralVotes: 11,
        },
        KS: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        KY: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        LA: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        MD: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        ME: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        MA: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        MN: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        MI: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        MS: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        MO: {
          fillKey: 'Republican',
          electoralVotes: 13,
        },
        MT: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        NC: {
          fillKey: 'Light Republican',
          electoralVotes: 32,
        },
        NE: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        NV: {
          fillKey: 'Heavy Democrat',
          electoralVotes: 32,
        },
        NH: {
          fillKey: 'Light Democrat',
          electoralVotes: 32,
        },
        NJ: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        NY: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        ND: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        NM: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        OH: {
          fillKey: 'UNDECIDED',
          electoralVotes: 32,
        },
        OK: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        OR: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        PA: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        RI: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        SC: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        SD: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        TN: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        TX: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        UT: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        WI: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        VA: {
          fillKey: 'Light Democrat',
          electoralVotes: 32,
        },
        VT: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        WA: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        WV: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        WY: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        CA: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        CT: {
          fillKey: 'Democrat',
          electoralVotes: 32,
        },
        AK: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        AR: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
        AL: {
          fillKey: 'Republican',
          electoralVotes: 32,
        },
      },
      labels: null,
    },
  },
  {
    title: 'Zoom example',
    storage: {
      scope: 'world',
      fills: {
        defaultFill: '#abdda4',
        gt50: colors(Math.random() * 20),
        eq50: colors(Math.random() * 20),
        lt25: colors(Math.random() * 10),
        gt75: colors(Math.random() * 200),
        lt50: colors(Math.random() * 20),
        eq0: colors(Math.random() * 1),
        pink: '#0fa0fa',
        gt500: colors(Math.random() * 1),
      },
      data: {
        ZAF: { fillKey: 'gt50' },
        ZWE: { fillKey: 'lt25' },
        NGA: { fillKey: 'lt50' },
        MOZ: { fillKey: 'eq50' },
        MDG: { fillKey: 'eq50' },
        EGY: { fillKey: 'gt75' },
        TZA: { fillKey: 'gt75' },
        LBY: { fillKey: 'eq0' },
        DZA: { fillKey: 'gt500' },
        SSD: { fillKey: 'pink' },
        SOM: { fillKey: 'gt50' },
        GIB: { fillKey: 'eq50' },
        AGO: { fillKey: 'lt50' },
      },
      bubbles: [
        {
          name: 'Bubble 1',
          latitude: 21.32,
          longitude: -7.32,
          radius: 45,
          fillKey: 'gt500',
        },
        {
          name: 'Bubble 2',
          latitude: 12.32,
          longitude: 27.32,
          radius: 25,
          fillKey: 'eq0',
        },
        {
          name: 'Bubble 3',
          latitude: 0.32,
          longitude: 23.32,
          radius: 35,
          fillKey: 'lt25',
        },
        {
          name: 'Bubble 4',
          latitude: -31.32,
          longitude: 23.32,
          radius: 55,
          fillKey: 'eq50',
        },
      ],
      bubbleOptions: {
        popupTemplate: (geo, data) =>
          `<div class="hoverinfo">Bubble for ${data.name}`,
      },
      style: {
        height: '500px',
      },
    },
    callbacks: {
      setProjection: (element) => {
        const projection = d3.geo.equirectangular()
          .center([23, -3])
          .rotate([4.4, 0])
          .scale(400)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        const path = d3.geo.path()
          .projection(projection);

        return { path, projection };
      },
    },
  },
];

const AllDatamaps = () => (
  <div>
    {DatamapDatas.map(
      (data, key) => (
        <div key={key}>
          <h1>{data.title}</h1>
          <DatamapSample storage={data.storage} callbacks={data.callbacks} />
        </div>
      )
    )}
  </div>
);

export default AllDatamaps;
