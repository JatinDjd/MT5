import { Injectable } from '@nestjs/common';
import { Feed } from './entities/feed.entity';

@Injectable()
export class FeedsService {
  feeds: Feed[] = [
    {
      "symbol": "EUR/USD",
      "ts": "1694076457697",
      "bid": 2.34567,
      "ask": 2.34568,
      "mid": 2.345675
    },
    {
      "symbol": "USD/JPY",
      "ts": "1694076457700",  // New timestamp
      "bid": 3.45678,
      "ask": 3.45679,
      "mid": 3.456785
    },
    {
      "symbol": "GBP/USD",
      "ts": "1694076457703",  // New timestamp
      "bid": 1.23456,
      "ask": 1.23457,
      "mid": 1.234565
    },
    {
      "symbol": "AUD/USD",
      "ts": "1694076457706",  // New timestamp
      "bid": 2.56789,
      "ask": 2.56790,
      "mid": 2.567895
    },
    {
      "symbol": "USD/CAD",
      "ts": "1694076457709",  // New timestamp
      "bid": 74.56789,
      "ask": 74.56790,
      "mid": 74.567895
    },
    {
      "symbol": "NZD/USD",
      "ts": "1694076457712",  // New timestamp
      "bid": 0.98765,
      "ask": 0.98766,
      "mid": 0.987655
    },
    {
      "symbol": "USD/CHF",
      "ts": "1694076457715",  // New timestamp
      "bid": 0.76543,
      "ask": 0.76544,
      "mid": 0.765445
    },
    {
      "symbol": "EUR/GBP",
      "ts": "1694076457718",  // New timestamp
      "bid": 1.12345,
      "ask": 1.12346,
      "mid": 1.123455
    },
    {
      "symbol": "EUR/JPY",
      "ts": "1694076457721",  // New timestamp
      "bid": 8.87654,
      "ask": 8.87655,
      "mid": 8.876555
    },
    {
      "symbol": "GBP/JPY",
      "ts": "1694076457724",  // New timestamp
      "bid": 7.65432,
      "ask": 7.65433,
      "mid": 7.654335
    }
  ];

  clientToUser = {};


  findAll() {
    let generatedFeeds = this.generateUniqueForexData(this.feeds);
    const randomIndex = Math.floor(Math.random() * generatedFeeds.length);
    return generatedFeeds[randomIndex];
  }


  generateUniqueForexData(originalData) {
    const replicas = 2; // Number of replicas for each object
    const generatedData = [];

    for (const originalObject of originalData) {
      // Generate two replicas for each original object
      for (let i = 0; i < replicas; i++) {
        const ts = Date.now() + i; // Generate a unique timestamp
        const bid = originalObject.bid + (i * 0.001); // Generate a unique bid value
        const ask = originalObject.ask + (i * 0.001); // Generate a unique ask value
        const mid = (bid + ask) / 2; // Calculate mid value

        generatedData.push({
          symbol: originalObject.symbol,
          ts: ts.toString(),
          bid,
          ask,
          mid,
        });
      }
    }

    return generatedData;
  }




}
