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
  getSymbols(@Query('type') type: string) {
    const indicesWorldwide = [
      { symbol: "DJI", name: "Dow Jones Industrial Average (DJIA)" },
      { symbol: "SPX", name: "S&P 500" },
      { symbol: "IXIC", name: "Nasdaq Composite" },
      { symbol: "FTSE", name: "FTSE 100" },
      { symbol: "DAX", name: "DAX 30" },
      { symbol: "CAC", name: "CAC 40" },
      { symbol: "NKY", name: "Nikkei 225" },
      { symbol: "HSI", name: "Hang Seng" },
      { symbol: "SSEC", name: "Shanghai Composite" },
      { symbol: "BSESN", name: "BSE Sensex" },
      { symbol: "NSEI", name: "Nifty 50" },
      { symbol: "ASX", name: "ASX 200" },
      { symbol: "GSPTSE", name: "S&P/TSX Composite" },
      { symbol: "IBEX", name: "IBEX 35" },
      { symbol: "FTSEMIB", name: "FTSE MIB" },
      { symbol: "000001.SS", name: "SSE Composite Index" },
      { symbol: "KS11", name: "KOSPI" },
      { symbol: "TASI", name: "Tadawul All Share Index" },
    ];


    const forexSymbols = [
      { symbol: "EUR/USD", name: "Euro/US Dollar" },
      { symbol: "USD/JPY", name: "US Dollar/Japanese Yen" },
      { symbol: "GBP/USD", name: "British Pound/US Dollar" },
      { symbol: "AUD/USD", name: "Australian Dollar/US Dollar" },
      { symbol: "USD/CAD", name: "US Dollar/Canadian Dollar" },
      { symbol: "NZD/USD", name: "New Zealand Dollar/US Dollar" },
      { symbol: "USD/CHF", name: "US Dollar/Swiss Franc" },
      { symbol: "EUR/GBP", name: "Euro/British Pound" },
      { symbol: "EUR/JPY", name: "Euro/Japanese Yen" },
      { symbol: "GBP/JPY", name: "British Pound/Japanese Yen" },
      { symbol: "AUD/JPY", name: "Australian Dollar/Japanese Yen" },
      { symbol: "EUR/AUD", name: "Euro/Australian Dollar" },
      { symbol: "USD/SGD", name: "US Dollar/Singapore Dollar" },
      { symbol: "USD/HKD", name: "US Dollar/Hong Kong Dollar" },
      { symbol: "GBP/CHF", name: "British Pound/Swiss Franc" },
      { symbol: "EUR/CAD", name: "Euro/Canadian Dollar" },
      { symbol: "AUD/NZD", name: "Australian Dollar/New Zealand Dollar" },
    ];

    const metalsWorldwide = [
      { symbol: "XAUUSD", name: "Gold (XAU/USD)" },
      { symbol: "XAGUSD", name: "Silver (XAG/USD)" },
      { symbol: "XPTUSD", name: "Platinum (XPT/USD)" },
      { symbol: "XPDUSD", name: "Palladium (XPD/USD)" },
      { symbol: "XPTXAG", name: "Platinum/Silver Ratio (XPT/XAG)" },
      { symbol: "XAUXAG", name: "Gold/Silver Ratio (XAU/XAG)" },
      { symbol: "HG", name: "Copper (HG)" },
      { symbol: "PA", name: "Palladium (PA)" },
      { symbol: "PL", name: "Platinum (PL)" },
      { symbol: "SI", name: "Silver (SI)" },
      { symbol: "GC", name: "Gold (GC)" },
      { symbol: "HG", name: "Copper (HG)" },
    ];

    if (type == 'indices') return indicesWorldwide;

    if (type == 'forex') return forexSymbols;

    if (type == 'metals') return metalsWorldwide;



  }

}
