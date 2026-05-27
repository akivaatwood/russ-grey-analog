# Russ Grey Analog

A Pebble/Rebble Rocky.js watchface with:

- an analog dial with hour and minute hands
- 60 tick marks with emphasized quarter numerals
- date text at the bottom
- a `Russ Grey` background (`#547588`)

## Files

- `package.json` - Pebble app metadata
- `src/rocky/index.js` - Rocky.js analog watchface code that runs on the watch
- `src/pkjs/index.js` - phone-side PebbleKit JS stub

## Notes

This project now follows the Rocky.js JavaScript watchface structure from the official Rebble docs:

- Rocky.js overview: https://developer.rebble.io/guides/rocky-js/rocky-js-overview/
- JS watchface tutorial: https://developer.rebble.io/tutorials/js-watchface-tutorial/part1/

Rocky.js watchfaces are JavaScript-only and do not use native C source files.

## CloudPebble note

Your current CloudPebble project is an Embedded JS / Moddable project, which is why the analog outline approach failed there. To run this Rocky.js watchface in CloudPebble, it needs to live in a Rocky.js project rather than the existing Moddable project.
