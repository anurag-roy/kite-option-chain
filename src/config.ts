// Groups and stocks to monitor when that group is selected
export const GROUPS = {
  'Adani & Tata, Heavy Industries (Private)': [
    'AMBUJACEM',
    'ACC',
    'TATAMOTORS',
    'TATASTEEL',
    'ADANIENT',
    'VEDL',
    'RAIN',
    'PETRONET',
    'DIXON',
    'ASIANPAINT',
  ],
  'Heavy Industries (Public)': [
    'BHEL',
    'BEL',
    'COALINDIA',
    'GAIL',
    'HINDCOPPER',
    'IEX',
    'IOC',
    'NATIONALUM',
    'NMDC',
    'PFC',
    'SAIL',
    'NTPC',
    'RECLTD',
  ],
  'Banking & Finance, Automotive & Spares': [
    'IBULHSGFIN',
    'ICICIGI',
    'L&TFH',
    'MANAPPURAM',
    'SBIN',
    'CUB',
    'FEDERALBNK',
    'IDFCFIRSTB',
    'PFC',
    'RBLBANK',
    'BANDHANBNK',
    'MOTHERSON',
    'MRF',
    'MARUTI'
  ],
  'Basic Commodities, Hospital Labs': [
    'OFSS',
    'DELTACORP',
    'BRITANNIA',
    'ITC',
    'BATAINDIA',
    'LAURUSLABS',
    'VOLTAS',
    'AUROPHARMA',
    'DIVISLAB',
    'DRREDDY',
    'IPCALAB',
  ],
};

// Number of months to show in the expiry dropdown
export const EXPIRY_OPTION_LENGTH = 3;

// Percentage of LTP to ignore strike prices on both sides
// e.g. if DIFF_PERCENT is 20% and LTP of the equity instrument is 100,
// ignore all strikes ranging from 100 - 20% = 80 to 100 + 20% = 120.
export const DIFF_PERCENT = 33;
