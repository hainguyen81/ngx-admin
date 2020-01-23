import {LoggerConfig, NgxLoggerLevel} from 'ngx-logger';

export const LogConfig: LoggerConfig = {
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.OFF,
    disableConsoleLogging: false,
};
