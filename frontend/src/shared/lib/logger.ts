import log from 'loglevel';

type Loggable = string | number | boolean | object;

log.setLevel(process.env.NODE_ENV === 'production' ? 'warn' : 'debug');

const Logger = {
    log: (level: 'debug' | 'info' | 'warn' | 'error', prefix: string, message: string, args: Loggable[]) => {
        log[level](`[${prefix}] ${message}`, ...args);
    },

    debug: (message: string, ...args: Loggable[]) => {
        Logger.log('debug', 'DEBUG', message, args);
    },

    info: (message: string, ...args: Loggable[]) => {
        Logger.log('info', 'INFO', message, args);
    },

    warn: (message: string, ...args: Loggable[]) => {
        Logger.log('warn', 'WARN', message, args);
    },

    error: (message: string, ...args: Loggable[]) => {
        Logger.log('error', 'ERROR', message, args);
    },
};

export default Logger;
