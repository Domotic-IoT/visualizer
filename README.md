# Visualizer
Visualization tool for the IoT system.

## Overview
IoT Visualizer is a client application for visualizing data gathered by the [IoT Connector](https://github.com/Domotic-IoT/connector).

Visualizer allows to pick a room and a time interval from two lists, and shows data for that room by querying the connector.

Visualizer will use request polling to keep graphs always up-to-date as new measures arrives to the connector.

## Requirements
- [NodeJS](https://nodejs.org)

Other dependencies will be installed automatically by `npm`.

## Installation
Clone this repository, then run `npm install` to install necessary dependencies. Visualizer can be run directly through `npm`, or it can be complied and packaged with `npm make`:

```bash
git clone git@github.com:Domotic-IoT/visualizer.git
cd visualizer
npm install
npm run # or npm make
```