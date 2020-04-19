import {LoggerConfig, NgxLoggerLevel} from 'ngx-logger';

export const LogConfig: LoggerConfig = {
    level: NgxLoggerLevel.ERROR,
    serverLogLevel: NgxLoggerLevel.OFF,
    disableConsoleLogging: false,
};
