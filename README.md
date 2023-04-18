# cheq-rti-integration-cloudflare

This repository provides the components to invoke RTI from Cloudflare.

### Documentation

[Cloudflare Integration](https://cheq-ai.github.io/cheq-rti-integration-cloudflare)

Built with [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/) 

### Prerequisites:

Modify the [configuration](https://cheq-ai.github.io/cheq-rti-integration-cloudflare/interfaces/CloudflareConfig.html)
at `src/config.ts` to set your `apiKey` and `tagHash`

### Verify config

```bash
npm install
npm run test
```

### Test locally
```bash
npm install
npm run start
```

### Deploy
```bash
npm run deploy
```

### Output
```
Current Deployment ID: 2874786b-81d1-4f73-973e-8ec5a8305b6c
```

### Cloudflare Configuration
Set up routes in `wrangler.toml` or using Cloudflare Dashboard

https://developers.cloudflare.com/workers/wrangler/configuration/

https://developers.cloudflare.com/workers/platform/triggers/routes/
