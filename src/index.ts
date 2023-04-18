import { config } from './config';
import { RTILoggerFetch, RTIServiceFetch } from 'cheq-rti-client-fetch';
import { Action, HeadersMap, RTICore, RTIResponse } from 'cheq-rti-client-core-js';
import { name, version } from '../package.json';

const logger = new RTILoggerFetch(config.apiKey, config.tagHash, `${name}-${version}`);
const rtiCore = new RTICore(config);
const rtiService = new RTIServiceFetch();

export default {
    async fetch(request: Request, env: unknown, context: ExecutionContext) {
        try {
            // prevent runtime error responses, fail open to origin
            context.passThroughOnException();
            const requestURL = new URL(request.url);
            if (rtiCore.shouldIgnore(requestURL.pathname)) {
                const originResponse = await fetch(request);
                return originResponse;
            }
            const headersMap = getHeaders(request.headers);
            const startRTI = Date.now();
            const payload = {
                url: requestURL.href,
                headers: headersMap,
                method: request.method,
                ip: request.headers.get('x-real-ip')!,
                eventType: rtiCore.getEventType(requestURL.pathname, request.method),
                ja3: request.cf?.botManagement.ja3Hash,
            };
            if (config.debug) {
                console.log(`payload: ${JSON.stringify(payload)}`);
            }
            const rtiResponse = await rtiService.callRTI(payload, config);
            if (config.debug) {
                console.log(`rtiResponse: ${JSON.stringify(rtiResponse)}`);
            }
            const endRTI = Date.now();
            const duration = endRTI - startRTI;
            if (config.telemetry) {
                context.waitUntil(log(duration));
            }
            const action = rtiCore.getAction(rtiResponse);
            if (config.debug) {
                console.log(`action: ${action}`);
            }
            if (action === Action.CHALLENGE && config.challenge) {
                try {
                    const challengeResult = await config.challenge(request, rtiResponse);
                    return challengeResult;
                } catch (e) {
                    const err: Error = e as Error;
                    console.error('challenge error', err);
                    context.waitUntil(logger.error(`challenge error: ${err.message}`));
                    const originResponse = await fetch(request);
                    return originResponse;
                }
            } else if (action === Action.BLOCK) {
                const headers = new Headers();
                headers.append('set-cookie', rtiResponse.setCookie);
                return new Response(null, { status: 403, headers });
            } else if (action === Action.REDIRECT) {
                const headers = new Headers();
                headers.append('set-cookie', rtiResponse.setCookie);
                headers.append('location', config.redirectLocation!);
                return new Response(null, { status: 302, headers });
            }
            // pass headers to origin request
            const originRequest = new Request(request);
            setHeaders(originRequest.headers, rtiResponse);
            const originResponse = await fetch(originRequest);

            // set headers on viewer response
            const newResponse = new Response(originResponse.body, originResponse);
            newResponse.headers.append('set-cookie', rtiResponse.setCookie);
            return newResponse;
        } catch (e) {
            const err: Error = e as Error;
            console.error('error', err);
            context.waitUntil(logger.error(`error: ${err.message}`));
            const originResponse = await fetch(request);
            return originResponse;
        }
    },
};

function getHeaders(headers: Headers): HeadersMap {
    const result: HeadersMap = {};
    for (const pair of headers.entries()) {
        result[pair[0]] = pair[1];
    }
    return result;
}

function setHeaders(headers: Headers, rtiResponse: RTIResponse) {
    const result = [
        `version=${rtiResponse.version}`,
        `is-invalid=${rtiResponse.isInvalid}`,
        `threat-type-code=${rtiResponse.threatTypeCode}`,
        `request-id=${rtiResponse.requestId}`,
    ].join(';');
    headers.set('x-cheq-rti-result', result);
    headers.set('x-cheq-rti-set-cookie', rtiResponse.setCookie);
}

function log(duration: number) {
    return logger.info(`rti_duration: ${duration}`);
}
