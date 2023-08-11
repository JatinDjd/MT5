import { Injectable } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { Feed } from './entities/feed.entity';

@Injectable()
export class FeedsService {  
  feeds: Feed[] = [{
    "ticker": "USD/CHF",
    "bid": 0.87776,
    "ask": 0.87776,
    "open": 0.87510,
    "low": 0.87174,
    "high": 0.87855,
    "changes": 0.0026599999999999957,
    "date": "2023-08-02 07:19:07"
  },
  {
    "ticker": "EUR/JPY",
    "bid": 0.37776,
    "ask": 0.47776,
    "open": 0.67510,
    "low": 0.87174,
    "high": 0.17855,
    "changes": 0.0026577999999999957,
    "date": "2023-08-02 07:19:07"
  }];

  clientToUser = {};


  create(createFeedDto: CreateFeedDto) {
    const feed = { ...createFeedDto }
    this.feeds.push(feed);
    return feed;
  }

  findAll() {
    return this.feeds;
  }



}
