import defaultConfigs from '../config/defaults';

export function log(message, ...args) {
  const { type = 'log' } = this;

  console[type](`[${defaultConfigs.componentName}]: ${message}`, ...args);
}

export const warn = log.bind({ type: 'warn' });

export const error = log.bind({ type: 'error' });