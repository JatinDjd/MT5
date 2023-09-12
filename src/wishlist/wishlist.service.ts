import { Injectable, NotFoundException, UnprocessableEntityException, } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) { }


  async create(createWishlistDto: CreateWishlistDto, userId: any) {
    // Check if an item with the same symbol already exists
    const existingItem = await this.wishlistRepository.findOne({
      where: { symbol: createWishlistDto.symbol, user: { id: userId } },
    });

    if (existingItem) {
      throw await new UnprocessableEntityException('A wishlist item with this symbol already exists.');
    }

    const newItem = await this.wishlistRepository.create(createWishlistDto);
    newItem.user = userId;
    return await this.wishlistRepository.save(newItem);
  }

  findAll() {
    return this.wishlistRepository.find();
  }

  async remove(id: string) {
    await this.wishlistRepository.delete(id);
  }

  async getSymbols(type, userId) {
    const symbolLists = {
      0: [
        { symbol: "EUR/USD", fullPairName: "Euro/US Dollar" },
        { symbol: "USD/JPY", fullPairName: "US Dollar/Japanese Yen" },
        { symbol: "GBP/USD", fullPairName: "British Pound/US Dollar" },
        { symbol: "AUD/USD", fullPairName: "Australian Dollar/US Dollar" },
        { symbol: "USD/CAD", fullPairName: "US Dollar/Canadian Dollar" },
        { symbol: "NZD/USD", fullPairName: "New Zealand Dollar/US Dollar" },
        { symbol: "USD/CHF", fullPairName: "US Dollar/Swiss Franc" },
        { symbol: "EUR/GBP", fullPairName: "Euro/British Pound" },
        { symbol: "EUR/JPY", fullPairName: "Euro/Japanese Yen" },
        { symbol: "GBP/JPY", fullPairName: "British Pound/Japanese Yen" },
        { symbol: "AUD/JPY", fullPairName: "Australian Dollar/Japanese Yen" },
        { symbol: "EUR/AUD", fullPairName: "Euro/Australian Dollar" },
        { symbol: "USD/SGD", fullPairName: "US Dollar/Singapore Dollar" },
        { symbol: "USD/HKD", fullPairName: "US Dollar/Hong Kong Dollar" },
        { symbol: "GBP/CHF", fullPairName: "British Pound/Swiss Franc" },
        { symbol: "EUR/CAD", fullPairName: "Euro/Canadian Dollar" },
        { symbol: "AUD/NZD", fullPairName: "Australian Dollar/New Zealand Dollar" },
      ],
      1: [
        { symbol: "DJI", fullPairName: "Dow Jones Industrial Average (DJIA)" },
        { symbol: "SPX", fullPairName: "S&P 500" },
        { symbol: "IXIC", fullPairName: "Nasdaq Composite" },
        { symbol: "FTSE", fullPairName: "FTSE 100" },
        { symbol: "DAX", fullPairName: "DAX 30" },
        { symbol: "CAC", fullPairName: "CAC 40" },
        { symbol: "NKY", fullPairName: "Nikkei 225" },
        { symbol: "HSI", fullPairName: "Hang Seng" },
        { symbol: "SSEC", fullPairName: "Shanghai Composite" },
        { symbol: "BSESN", fullPairName: "BSE Sensex" },
        { symbol: "NSEI", fullPairName: "Nifty 50" },
        { symbol: "ASX", fullPairName: "ASX 200" },
        { symbol: "GSPTSE", fullPairName: "S&P/TSX Composite" },
        { symbol: "IBEX", fullPairName: "IBEX 35" },
        { symbol: "FTSEMIB", fullPairName: "FTSE MIB" },
        { symbol: "000001.SS", fullPairName: "SSE Composite Index" },
        { symbol: "KS11", fullPairName: "KOSPI" },
        { symbol: "TASI", fullPairName: "Tadawul All Share Index" },
      ],
      2: [
        { symbol: "XAUUSD", fullPairName: "Gold (XAU/USD)" },
        { symbol: "XAGUSD", fullPairName: "Silver (XAG/USD)" },
        { symbol: "XPTUSD", fullPairName: "Platinum (XPT/USD)" },
        { symbol: "XPDUSD", fullPairName: "Palladium (XPD/USD)" },
        { symbol: "XPTXAG", fullPairName: "Platinum/Silver Ratio (XPT/XAG)" },
        { symbol: "XAUXAG", fullPairName: "Gold/Silver Ratio (XAU/XAG)" },
        { symbol: "HG", fullPairName: "Copper (HG)" },
        { symbol: "PA", fullPairName: "Palladium (PA)" },
        { symbol: "PL", fullPairName: "Platinum (PL)" },
        { symbol: "SI", fullPairName: "Silver (SI)" },
        { symbol: "GC", fullPairName: "Gold (GC)" },
        { symbol: "HG", fullPairName: "Copper (HG)" },
      ],
    };
    const getSymbolsByType = (type) => symbolLists[type] || [];
    const sortedSymbolList = getSymbolsByType(type);
    const userSymbols = await this.wishlistRepository.find({ where: { user: { id: userId } }, select: ['symbol'] });
    const filteredSymbolList = sortedSymbolList.filter((symbolItem) => {
      return !userSymbols.some((userSymbol) => userSymbol.symbol === symbolItem.symbol);
    });

    return filteredSymbolList;
  }
}
