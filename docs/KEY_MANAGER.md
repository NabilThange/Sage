# API Key Manager Documentation

## Overview

The Key Manager provides automatic API key rotation and failover for both Groq and Hindsight APIs. This ensures high availability and helps manage rate limits across multiple API keys.

## Features

### 🔄 Automatic Rotation
- Round-robin distribution across all available keys
- Load balancing for better rate limit management
- Seamless switching between keys

### 🛡️ Automatic Failover
- Detects failed API calls
- Temporarily blocks keys after 3 consecutive failures
- Automatically unblocks keys after 1-minute cooldown
- Retries with different keys on failure

### 📊 Monitoring
- Real-time key status tracking
- Failure count per key
- Block status and last failure timestamp
- Admin endpoint for monitoring

### ⚡ Smart Retry Logic
- Exponential backoff (1s, 2s, 4s)
- Maximum 3 retry attempts per request
- Automatic key switching between retries

## Configuration

### Environment Variables

**Single Key (Backward Compatible):**
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
HINDSIGHT_API_KEY=hsk_xxxxxxxxxxxxx
```

**Multiple Keys (Recommended):**
```env
# Groq API Keys
GROQ_API_KEY_1=gsk_key_one
GROQ_API_KEY_2=gsk_key_two
GROQ_API_KEY_3=gsk_key_three
GROQ_API_KEY_4=gsk_key_four

# Hindsight API Keys
HINDSIGHT_API_KEY_1=hsk_key_one
HINDSIGHT_API_KEY_2=hsk_key_two
HINDSIGHT_API_KEY_3=hsk_key_three
```

**Naming Convention:**
- Base key: `{SERVICE}_API_KEY`
- Numbered keys: `{SERVICE}_API_KEY_1`, `{SERVICE}_API_KEY_2`, etc.
- No gaps in numbering (stops at first missing number)

## Usage

### In Your Code

The key manager is automatically used by `lib/groq.ts` and `lib/hindsight.ts`. No changes needed in your application code.

```typescript
// This automatically uses key rotation
import { chatCompletion } from '@/lib/groq'
import { retain, recall, reflect } from '@/lib/hindsight'

// Just call the functions normally
const response = await chatCompletion([
  { role: 'user', content: 'Hello!' }
])

await retain('user_123', 'test', 'Test event')
const memories = await recall('user_123', 'what happened?')
const insight = await reflect('user_123', 'what should I focus on?')
```

### Manual Usage (Advanced)

If you need direct access to the key manager:

```typescript
import { 
  getGroqKeyManager, 
  getHindsightKeyManager,
  executeWithKeyRotation 
} from '@/lib/key-manager'

// Get manager instance
const groqManager = getGroqKeyManager()

// Check status
console.log('Total keys:', groqManager.getKeyCount())
console.log('Has available keys:', groqManager.hasAvailableKeys())
console.log('Status:', groqManager.getStatus())

// Execute with automatic rotation
const result = await executeWithKeyRotation(
  groqManager,
  async (apiKey) => {
    // Your API call here
    const response = await fetch('https://api.example.com', {
      headers: { Authorization: `Bearer ${apiKey}` }
    })
    return response.json()
  },
  3 // max retries
)
```

## Monitoring

### Admin Endpoint

**GET** `/api/admin/key-status`

Returns real-time status of all API keys:

```bash
curl http://localhost:3000/api/admin/key-status
```

**Response:**
```json
{
  "groq": {
    "totalKeys": 3,
    "hasAvailableKeys": true,
    "keyStatus": [
      {
        "index": 1,
        "failures": 0,
        "isBlocked": false,
        "lastFailure": null
      },
      {
        "index": 2,
        "failures": 2,
        "isBlocked": false,
        "lastFailure": "2024-03-20T10:30:00.000Z"
      },
      {
        "index": 3,
        "failures": 3,
        "isBlocked": true,
        "lastFailure": "2024-03-20T10:31:00.000Z"
      }
    ]
  },
  "hindsight": {
    "totalKeys": 2,
    "hasAvailableKeys": true,
    "keyStatus": [...]
  },
  "timestamp": "2024-03-20T10:32:00.000Z"
}
```

### Console Logs

The key manager logs important events:

```
[KeyManager] Loaded 3 API key(s) for GROQ
[KeyManager] Key failure 1/3: Rate limit exceeded
[KeyManager] Key failure 2/3: Rate limit exceeded
[KeyManager] Key failure 3/3: Rate limit exceeded
[KeyManager] Key blocked after 3 failures. Will retry after 60s
[KeyManager] Unblocked key after cooldown period
```

## How It Works

### Key Selection Algorithm

1. **Load keys** from environment variables on startup
2. **Round-robin selection** - each request uses the next key in sequence
3. **Skip blocked keys** - automatically skips keys that are temporarily blocked
4. **Unblock after cooldown** - keys are unblocked after 60 seconds

### Failure Handling

1. **API call fails** → increment failure count for that key
2. **3 failures reached** → block the key for 60 seconds
3. **Retry with next key** → automatically try the next available key
4. **Exponential backoff** → wait 1s, 2s, 4s between retries
5. **All keys blocked** → return error to caller

### Success Handling

When an API call succeeds:
- Reset failure count to 0
- Unblock the key if it was blocked
- Continue normal rotation

## Best Practices

### For Development
- Use a single key for simplicity
- Monitor console logs for issues

### For Production
- Use at least 3 keys per service
- Monitor the `/api/admin/key-status` endpoint
- Set up alerts for when all keys are blocked
- Rotate keys periodically for security

### Rate Limit Management
- Groq free tier: 30 requests/minute per key
- With 3 keys: 90 requests/minute total
- With 5 keys: 150 requests/minute total

### Key Rotation Strategy
```
Request 1 → Key 1
Request 2 → Key 2
Request 3 → Key 3
Request 4 → Key 1 (back to start)
Request 5 → Key 2
...
```

If Key 2 fails 3 times:
```
Request 1 → Key 1
Request 2 → Key 3 (skip blocked Key 2)
Request 3 → Key 1
Request 4 → Key 3
...
(After 60 seconds, Key 2 becomes available again)
```

## Configuration Examples

### Minimal Setup (1 key each)
```env
GROQ_API_KEY=gsk_xxxxx
HINDSIGHT_API_KEY=hsk_xxxxx
```

### Recommended Setup (3 keys each)
```env
GROQ_API_KEY_1=gsk_key_one
GROQ_API_KEY_2=gsk_key_two
GROQ_API_KEY_3=gsk_key_three

HINDSIGHT_API_KEY_1=hsk_key_one
HINDSIGHT_API_KEY_2=hsk_key_two
HINDSIGHT_API_KEY_3=hsk_key_three
```

### High-Availability Setup (5+ keys)
```env
GROQ_API_KEY_1=gsk_key_one
GROQ_API_KEY_2=gsk_key_two
GROQ_API_KEY_3=gsk_key_three
GROQ_API_KEY_4=gsk_key_four
GROQ_API_KEY_5=gsk_key_five

HINDSIGHT_API_KEY_1=hsk_key_one
HINDSIGHT_API_KEY_2=hsk_key_two
HINDSIGHT_API_KEY_3=hsk_key_three
HINDSIGHT_API_KEY_4=hsk_key_four
HINDSIGHT_API_KEY_5=hsk_key_five
```

## Troubleshooting

### "No API keys available"
- Check that at least one key is configured in `.env.local`
- Verify key naming follows the pattern: `GROQ_API_KEY_1`, `GROQ_API_KEY_2`, etc.
- Check for typos in environment variable names

### "All API keys are currently blocked"
- All keys have failed 3+ times recently
- Wait 60 seconds for automatic unblocking
- Check API key validity
- Verify you haven't exceeded rate limits on all keys

### Keys not rotating
- Ensure keys are numbered sequentially (1, 2, 3, not 1, 3, 5)
- Check console logs for "Loaded X API key(s)" message
- Verify `.env.local` is in the project root

### High failure rate
- Check API key validity (expired or invalid keys)
- Verify API endpoint URLs are correct
- Check network connectivity
- Review rate limits for your API tier

## Advanced Configuration

### Custom Block Duration

Edit `lib/key-manager.ts`:

```typescript
private readonly BLOCK_DURATION = 120000 // 2 minutes instead of 1
```

### Custom Failure Threshold

Edit `lib/key-manager.ts`:

```typescript
private readonly MAX_FAILURES = 5 // 5 failures instead of 3
```

### Custom Retry Logic

Edit `lib/key-manager.ts`:

```typescript
// In executeWithKeyRotation function
const delay = Math.min(2000 * Math.pow(2, attempt), 10000)
// 2s, 4s, 8s, max 10s instead of 1s, 2s, 4s, max 5s
```

## Security Notes

- Never commit `.env.local` to version control
- Rotate API keys periodically
- Use different keys for development and production
- Monitor the admin endpoint for suspicious activity
- Consider adding authentication to `/api/admin/key-status` in production

## Performance Impact

- **Negligible overhead** - key selection is O(n) where n = number of keys
- **No database calls** - all state is in-memory
- **Minimal memory usage** - ~100 bytes per key
- **Fast failover** - switches to next key in <1ms

## Future Enhancements

Potential improvements for future versions:
- [ ] Persistent key status across server restarts
- [ ] Weighted key selection (prioritize certain keys)
- [ ] Per-endpoint key pools
- [ ] Metrics export (Prometheus, DataDog)
- [ ] Dynamic key addition/removal without restart
- [ ] Key health scoring based on latency
