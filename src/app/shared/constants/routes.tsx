export const ROUTES = {
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    RESTORE: '/auth/restore',
    REGISTRATION: '/auth/registration',
    REGISTRATION_CONFIRM: '/auth/registration_confirm',
    SET_PASSWORD: '/auth/set_password',
    PROGRESS: '/auth/progress',
  },
  ASSETS: {
    BASE: '/assets',
    DETAIL: '/assets/:id',
    INFO: '/assets/info/:id',
  },
  WALLET: {
    BASE: '/activity',
    PROFILE: '/activity/profile',
    SEND: '/activity/send',
    SEND_CONFIRM: '/activity/send_confirm',
    RECEIVE: '/activity/receive',
    UTXO: '/activity/utxo',
    MANAGE: '/activity/manage',
  },
  TRANSACTIONS: {
    BASE: '/transactions',
    DETAIL: '/transactions/:id',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    CONNECT: '/notifications/connect',
    APPROVE_INVOKE: '/notifications/approve_invoke',
    APPROVE_SEND: '/notifications/approve_send',
  },
  SETTINGS: {
    BASE: '/settings',
    SETTINGS_REPORT: '/settings/report',
    SETTINGS_CONNECTED: '/settings/connected',
  },
};

export const ROUTES_PATH = {
  AUTH: {
    BASE: '/',
    AUTH: '/auth',
    LOGIN: '/login',
    RESTORE: '/restore',
    REGISTRATION: '/registration',
    REGISTRATION_CONFIRM: '/registration_confirm',
    SET_PASSWORD: '/set_password',
    PROGRESS: '/progress',
  },
  WALLET: {
    BASE: '/',
    PROFILE: '/profile',
    SEND: '/send',
    SEND_CONFIRM: '/send_confirm',
    RECEIVE: '/receive',
    UTXO: '/utxo',
    MANAGE: '/manage',
  },
  TRANSACTIONS: {
    BASE: '/',
    DETAIL: '/:id',
  },
  ASSETS: {
    BASE: '/',
    DETAIL: '/:id',
    INFO: '/info/:id',
  },
  NOTIFICATIONS: {
    CONNECT: '/connect',
    APPROVE_INVOKE: '/approve_invoke',
    APPROVE_SEND: '/approve_send',
  },
  SETTINGS: {
    BASE: '/settings',
    SETTINGS_REPORT: '/report',
    SETTINGS_CONNECTED: '/connected',
  },
};
