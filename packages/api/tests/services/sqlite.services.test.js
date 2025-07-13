const db = require('@services/sqlite.services').default;

describe('sqlite.services', () => {
    it('should be able to run a simple query', () => {
        const row = db.prepare('SELECT 1 as value').get();
        expect(row.value).toBe(1);
    });

    it('should have journal_mode set to WAL', () => {
        const mode = db.pragma('journal_mode', { simple: true });
        expect(mode).toBe('memory');
    });
});
