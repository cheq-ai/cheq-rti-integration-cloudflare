# cheq-rti-integration-cloudflare

Modify the `src/config.ts`, set `apiKey`, `tagHash`
```
export const config: CloudflareConfig = {
    mode: Mode.BLOCKING,
    apiKey: 'REPLACE_ME',
    tagHash: 'REPLACE_ME',
};
```

Verify config
```bash
npm install
npm run test
```

Test locally
```bash
npm install
npm run start
```

Deploy
```bash
npm run deploy
```

Output
```
Current Deployment ID: 2874786b-81d1-4f73-973e-8ec5a8305b6c
```
