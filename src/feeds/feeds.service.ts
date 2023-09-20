import { Injectable } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { Feed } from './entities/feed.entity';

@Injectable()
export class FeedsService {
  feeds: Feed[] = [{
    "symbol": "GBPUSD",
    "ts": "1694076447697",
    "bid": 1.24695,
    "ask": 1.24699,
    "mid": 1.2469699
  }];

  clientToUser = {};


  findAll() {
    return this.feeds;
  }



}
