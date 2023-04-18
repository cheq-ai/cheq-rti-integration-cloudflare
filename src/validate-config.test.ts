import { config } from './config';
import { validateConfig } from 'cheq-rti-client-core-js';
import { describe, it } from 'vitest';

describe('Validate config', function () {
    it('verifies config is valid', () => {
        const errors = validateConfig(config);
        if (errors.length !== 0) {
            throw new Error(`invalid config: ${JSON.stringify(errors)}`);
        }
    });
});
