global.console = {
    ...console,
    log: jest.fn(), // Suppress console.log
    info: console.info,
    warn: console.warn,
    error: console.error,
};  