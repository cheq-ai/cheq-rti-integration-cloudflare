import { Config, Mode, RTIResponse } from 'cheq-rti-client-core-js';

export type CloudflareConfig = Config & {
    challenge?: (request: Request, response: RTIResponse) => Promise<Response>;
};

export const config: CloudflareConfig = {
    mode: Mode.MONITORING,
    apiKey: 'REPLACE_ME',
    tagHash: 'REPLACE_ME',
    blockRedirectCodes: [2, 3, 6, 7, 10, 11, 16, 18],
};
