import {HttpClient} from '@angular/common/http';
import {ConsoleLogger, LogLevel} from '@angular/compiler-cli/ngcc';

export abstract class AbstractService {

  private readonly http: HttpClient;
  private readonly logger: ConsoleLogger;

  protected constructor(http: HttpClient) {
    this.http = http;
    this.logger = new ConsoleLogger(LogLevel.debug);
  }

  protected getLogger(): ConsoleLogger {
    return this.logger;
  }

  protected getHttp(): HttpClient {
    return this.http;
  }
}
