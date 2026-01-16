# SmartFlow API Documentation

## Overview

SmartFlow provides a comprehensive API for tracking smart money wallets, transactions, and alerts.

## Base URL

```
https://api.smartflow.app/v1
```

## Authentication

All API requests require an API key in the header:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Wallets

#### Get Leaderboard
```
GET /wallets/leaderboard
```

Query Parameters:
- `sortBy`: Sort field (`pnl`, `winRate`, `volume`, `trades`)
- `sortOrder`: `asc` or `desc`
- `timeRange`: `24h`, `7d`, `30d`, `all`
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20, max: 100)

Response:
```json
{
  "data": [
    {
      "address": "0x...",
      "name": "Whale 1",
      "rank": 1,
      "totalPnl": 245.5,
      "winRate": 78.3,
      "totalTrades": 156,
      "totalVolume": "$2.4M"
    }
  ],
  "total": 500,
  "page": 1,
  "pageSize": 20,
  "hasMore": true
}
```

#### Get Wallet Details
```
GET /wallets/:address
```

Response:
```json
{
  "address": "0x...",
  "name": "Smart Whale",
  "rank": 5,
  "totalPnl": 180.2,
  "winRate": 72.1,
  "totalTrades": 89,
  "totalVolume": "$1.2M",
  "recentTransactions": [...]
}
```

### Transactions

#### List Transactions
```
GET /transactions
```

Query Parameters:
- `address`: Filter by wallet address
- `type`: Transaction type filter
- `token`: Token address filter
- `minValue`: Minimum USD value
- `maxValue`: Maximum USD value
- `startTime`: Start timestamp
- `endTime`: End timestamp

### Alerts

#### Create Alert
```
POST /alerts
```

Request Body:
```json
{
  "name": "Large Transfer Alert",
  "type": "large_transfer",
  "conditions": [
    {
      "field": "value",
      "operator": "gt",
      "value": 100000
    }
  ],
  "actions": [
    {
      "type": "notification"
    }
  ]
}
```

#### List Alerts
```
GET /alerts
```

#### Update Alert
```
PATCH /alerts/:id
```

#### Delete Alert
```
DELETE /alerts/:id
```

## Rate Limiting

- 100 requests per minute for free tier
- 1000 requests per minute for pro tier
- Rate limit headers included in response

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

## Webhooks

Configure webhooks to receive real-time notifications for alerts.

```json
{
  "event": "alert.triggered",
  "data": {
    "alertId": "...",
    "triggeredAt": "2024-01-15T10:30:00Z",
    "details": {...}
  }
}
```
