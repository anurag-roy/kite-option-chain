import { readFileSync, writeFileSync } from "node:fs";

interface ExpiryListItem {
  instrumentName: string;
  expiry: string;
}

export const createExpiryList = (data: any[], fileName: string = 'expiries.json'): ExpiryListItem[] => {
    const expiryList: Record<string, string> = {};
  
    for (const item of data) {
      const { name, expiry } = item;
  
      if (name && expiry instanceof Date) {
        const expiryDate = expiry.toISOString().split('T')[0];
  
        if (!expiryList[name] || expiryDate < expiryList[name]) {
          expiryList[name] = expiryDate;
        }
      }
    }
  
    const result: ExpiryListItem[] = Object.entries(expiryList).map(([instrumentName, expiryDate]) => ({
      instrumentName,
      expiry: expiryDate,
    }));
  
    writeFileSync(fileName, JSON.stringify(result));
    return result;
};

export const mapIndexOptionsExpiry = (name: string, expiry: string) => {
    let obj = {
        mappedName: name,
        mappedExpiry: expiry,
    }

    if("NIFTY MID SELECT" === name){
        obj['mappedName'] = "MIDCPNIFTY";
        obj['mappedExpiry'] = findExpiryByInstrumentName("MIDCPNIFTY");
    }

    if("NIFTY FIN SERVICE" === name){
        obj['mappedName'] = "FINNIFTY";
        obj['mappedExpiry'] = findExpiryByInstrumentName("FINNIFTY");
    }

    if("NIFTY BANK" === name){
        obj['mappedName'] = "BANKNIFTY";
        obj['mappedExpiry'] = findExpiryByInstrumentName("BANKNIFTY");
    }

    if("NIFTY 50" === name){
        obj['mappedName'] = "NIFTY";
        obj['mappedExpiry'] = findExpiryByInstrumentName("NIFTY");
    }
    
    return obj;
}

function findExpiryByInstrumentName(instrumentName: string): string {
    const instrument = JSON.parse(readFileSync('expiries.json','utf-8')).find((item: { instrumentName: string; }) => item.instrumentName === instrumentName);
  
    return instrument ? instrument.expiry : 'undefined';
  }

