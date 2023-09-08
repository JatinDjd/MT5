import { Body, Controller, Delete, Get, Query, Param, Post, Put } from '@nestjs/common';
import { MiscellaneousService } from './miscellaneous.service';
import { FeedbackDto } from './dto/feedback.dto';
import { faq } from './entity/faq.entity';
import { faqDto } from './dto/faq.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Miscellaneous')
@Controller('miscellaneous')
export class MiscellaneousController {


  constructor(
    private readonly miscellaneousService: MiscellaneousService
  ) { }



  @Post('create-feedback')
  async createFeedbackRoute(@Body() feedback: FeedbackDto) {

    return await this.miscellaneousService.createFeedback(feedback)
  }

  @Get('get-feedback')
  async getFeedback() {
    return await this.miscellaneousService.getFeedbackreport()
  }

  @Post('create-faq')
  async createFaq(@Body() faqDto: faqDto): Promise<faq> {
    return this.miscellaneousService.createFaq(faqDto);
  }

  @Get('get-all-faq')
  async findAllFaq(): Promise<faq[]> {
    return this.miscellaneousService.findAllFaq();
  }

  @Get('get-faq:id')
  async findOneFaq(@Param('id') id: string): Promise<faq> {
    return this.miscellaneousService.findOneFaq(id);
  }

  @Put('update-faq:id')
  async updateFaq(@Param('id') id: string, @Body() faqDto: faqDto): Promise<faq> {
    return this.miscellaneousService.updateFaq(id, faqDto);
  }

  @Delete('remove-faq:id')
  async removeFaq(@Param('id') id: string): Promise<void> {
    return this.miscellaneousService.removeFaq(id);
  }

  @Get('Jaali')
  jaaliFunc() {
    return "Jaali Bnda Abinash"
  }

  @Get('symbols')
  getSymbols(@Query('type') type: number) {
    // 0=>forex, 1=> Indices, 2=>Metals
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
    return getSymbolsByType(type);

  }

}
