import { Config, Mode, RTIResponse } from 'cheq-rti-client-core-js';

/**
 * See {@link https://cheq-ai.github.io/cheq-rti-client-core-js/interfaces/Config.html | Config}
 */
export interface CloudflareConfig extends Config {
    /**
     * Enable telemetry logging
     */
    telemetry: boolean;

    /**
     * Called when {@link https://cheq-ai.github.io/cheq-rti-client-core-js/interfaces/Config.html#challengeCodes | challengeCodes } are configured
     * @param request
     * @param response
     */
    challenge?: (request: Request, response: RTIResponse) => Promise<Response>;

    /**
     * Enables local debug logging
     */
    debug?: boolean;
}

export const config: CloudflareConfig = {
    mode: Mode.MONITORING,
    apiKey: 'REPLACE_ME',
    tagHash: 'REPLACE_ME',
    blockRedirectCodes: [2, 3, 6, 7, 10, 11, 16, 18],
    timeout: 300,
    telemetry: true,
};
