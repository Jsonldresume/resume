import React, { createContext, useReducer } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import remove from 'lodash/remove';

import JsonldData from '../resume.json';
import { move } from '../utils';

const initialState = {
  data: {
    jsonld:{
      "@context": [
		"https://jsonldresume.github.io/skill/context.json",
		{
			"gender": {
				"@id": "schema:gender",
				"@type": "@vocab"
			},
			"skill:classOfAward": {
				"@id": "skill:classOfAward",
				"@type": "@vocab"
			},
			"skill:securityClearance": {
				"@id": "skill:securityClearance",
				"@type": "@vocab"
			},
			"category": {
				"@id": "schema:category",
				"@type": "@vocab"
			},
			"dayOfWeek": {
				"@id": "schema:dayOfWeek",
				"@type": "@vocab"
			}
		}
      ],
      '@graph': [
        {
          "@type": "skill:Resume",
        },
        {
          "@type": "Person",
          givenName:[{'@language': 'en', '@value':''}],
          familyName: [{'@language': 'en', '@value':''}],
          address: []
        }
      ]
    },
    profile: {
      heading: 'Profile',
      photo: '',
      firstName: '',
      lastName: '',
      subtitle: '',
      address: {
        line1: '',
        line2: '',
        line3: '',
      },
      phone: '',
      website: '',
      email: '',
    },
    contacts: {
      "enable": true,
      heading: "Contacts"
    },
    address: {
      "enable": true,
      heading: 'Address'
    },
    objective: {
      enable: true,
      heading: 'Objective',
      body: '',
    },
    work: {
      enable: true,
      heading: 'Work Experience',
      items: [],
    },
    education: {
      enable: true,
      heading: 'Education',
      items: [],
    },
    awards: {
      enable: true,
      heading: 'Honors & Awards',
      items: [],
    },
    certifications: {
      enable: true,
      heading: 'Certifications',
      items: [],
    },
    skills: {
      enable: true,
      heading: 'Skills',
      items: [],
    },
    memberships: {
      enable: true,
      heading: 'Memberships',
      items: [],
    },
    languages: {
      enable: true,
      heading: 'Languages',
      items: [],
    },
    references: {
      enable: true,
      heading: 'References',
      items: [],
    },
    extras: {
      enable: true,
      heading: 'Personal Information',
      items: [],
    },
  },
  theme: {
    layout: 'Onyx',
    font: {
      family: '',
    },
    colors: {
      background: '#ffffff',
      primary: '#212121',
      accent: '#f44336',
    },
  },
  settings: {
    language: 'en',
  },
};

const reducer = (state, { type, payload }) => {
  let items;
  const newState = JSON.parse(JSON.stringify(state));

  switch (type) {
    case 'migrate_section':
      return set({ ...newState }, `data.${payload.key}`, payload.value);
    case 'add_item':
      items = get({ ...newState }, `${payload.key}`, []);
      items.push(payload.value);
      return set({ ...newState }, `${payload.key}`, items);
    case 'delete_item':
      items = get({ ...newState }, `${payload.key}`, []);
      remove(items, x => x.id === payload.value.id);
      return set({ ...newState }, `${payload.key}`, items);
    case 'move_item_up':
      items = get({ ...newState }, `${payload.key}`, []);
      move(items, payload.value, -1);
      return set({ ...newState }, `${payload.key}`, items);
    case 'move_item_down':
      items = get({ ...newState }, `${payload.key}`, []);
      move(items, payload.value, 1);
      return set({ ...newState }, `${payload.key}`, items);
    case 'on_input':
      return set({ ...newState }, payload.key, payload.value);
    case 'save_data':
      localStorage.setItem('state', JSON.stringify(newState));
      return newState;
    case 'import_data':
      if (payload === null) return initialState;

      for (const section of Object.keys(initialState.data)) {
        if (!(section in payload.data)) {
          payload.data[section] = initialState.data[section];
        }
      }

      return {
        ...newState,
        ...payload,
      };
    case 'load_demo_data':
      return {
        ...newState,
        ...JsonldData,
      };
    case 'reset':
      return initialState;
    default:
      return newState;
  }
};

const AppContext = createContext(initialState);
const { Provider } = AppContext;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export const AppProvider = StateProvider;
export const AppConsumer = AppContext.Consumer;

export default AppContext;
