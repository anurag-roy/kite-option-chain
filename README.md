<div align="center">

# Option Chain

Live Option Chain for Equity Derivatives using Zerodha Kite APIs and Next.js

<img width="1412" alt="option-chain" src="https://user-images.githubusercontent.com/53750093/219455211-6384c214-0aae-461b-a020-30f3039794d7.png">
  
</div>

## Features

- Grouped stocks for easily monitoring relevant stocks
- Connect from multiple tabs to monitor different groups of upto 3000 stocks (KiteTicker limit)
- Vertically resizable and scrollable tables to adjust views when needed
- Prices displayed - First Bid and First Ask for options and LTP for equities along with change from previous day's close
- Options displayed
  - CE: Only Call options with strikes lesser than the LTP
  - PE: Only Put options with strikes greater than the LTP
  - A percentage of options close to the LTP on both sides are ignored. See [`DIFF_PERCENT`](#configts)

## Setup

Install dependencies. (npm or yarn is recommended)[^1]

```sh
npm install
```

Setup environment secrets in an `env.json` file by copying the `example.env.json` file. For further customisation, see [configuration](#configuration).

```sh
cd src
cp example.env.json env.json
# Populate env.json secrets
```

Start the app to login for the first time to get and cache your access token. We need to do that before fetching instrument data and setting up the database, because Kite requires you to be authenticated.

```sh
npm run dev
```

Now you can close the server and setup your DB.

```sh
# After stopping the dev server
npm run data:prepare
```

## Usage

Start in development mode

```
npm run dev
```

Build and start production server.

```sh
npm run build
npm start
```

## Configuration

### Port

The default port is `8000`. To change it, update the `dev` and `start` scripts in `package.json`.

### config.ts

Edit `src/config.ts` to:

- `GROUPS` - Update stock dropdown options and relevant grouping
- `EXPIRY_OPTION_LENGTH` - Expiry dropdown options
- `DIFF_PERCENT` - Control the range of strikes to ignore (depending on the LTP of the equity instrument).

## Scopes of improvement

There are definitely some optimisations that can be made, but were not made because I did not experience any slowdon or lagging so I don't see a good ROI for the effort it will take. But anyway, just jotting them down if I ever feel tackling on any one:

- Custom ticker parser to parse only `instrument_token`, ltp (for equity) and first bid and first ask (for options). Gist [here](https://gist.github.com/anurag-roy/6df7f3cc6eef6b299a9140aa94c16548).
- On the frontend, granular update of each instrument object instead of the whole array.

## Related

- [KiteConnect TypeScript Library](https://github.com/anurag-roy/kiteconnect-ts)
- [5paisa Live Ticker](https://github.com/anurag-roy/5paisa-live-ticker)

## Contact

- [Twitter](https://twitter.com/anurag__roy)
- [Email](mailto:anuragroy@duck.com)

## License

[MIT © 2023 Anurag Roy](/LICENSE)

[^1]: The app uses this [Next.js plugin](https://www.npmjs.com/package/next-plugin-websocket) to maintain a WebSocket Server, which patches some files in `node_modules`. I have tried using `pnpm` but it does not work reliably. See other caveats [here](https://github.com/sam3d/next-plugin-websocket#caveats).
