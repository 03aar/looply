# 🚀 Production Operations Guide

**Complete guide for running Looply at scale with thousands of users**

---

## Table of Contents

1. [Security Checklist](#security-checklist)
2. [Database Strategy](#database-strategy)
3. [Monitoring & Logging](#monitoring--logging)
4. [Performance Optimization](#performance-optimization)
5. [Scaling Strategy](#scaling-strategy)
6. [Backup & Disaster Recovery](#backup--disaster-recovery)
7. [Email Configuration](#email-configuration)
8. [Rate Limiting Configuration](#rate-limiting-configuration)
9. [Incident Response](#incident-response)

---

## Security Checklist

### ✅ Before Going Live

- [ ] **Environment Variables**: All secrets in environment variables, not in code
- [ ] **HTTPS Only**: Enable HTTPS and HSTS headers (automatic on Vercel/Railway)
- [ ] **Rate Limiting**: Enabled on all API routes
- [ ] **Input Sanitization**: All user input sanitized (already implemented)
- [ ] **SQL Injection**: Using Prisma ORM (protected by default)
- [ ] **XSS Protection**: Input sanitization + CSP headers enabled
- [ ] **CORS**: Configured for allowed origins only
- [ ] **Authentication**: NextAuth.js configured with secure providers
- [ ] **Session Security**: Secure session cookies with httpOnly flag
- [ ] **File Uploads**: Validated file types and size limits
- [ ] **Database Access**: Limited to application only, not public
- [ ] **API Keys**: Rotated regularly, never committed to git
- [ ] **Dependency Scanning**: Run `npm audit` regularly
- [ ] **Security Headers**: All headers configured in middleware.ts

### 🔒 Security Headers (Already Implemented)

```typescript
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: [configured]
```

---

## Database Strategy

### PostgreSQL for Production

**Do NOT use SQLite in production**. Switch to PostgreSQL:

#### Option 1: Supabase (Recommended)

```bash
# 1. Create account at supabase.com
# 2. Create new project
# 3. Get connection string from Settings → Database

# 4. Update prisma/schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 5. Update .env:
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"

# 6. Push schema:
npx prisma db push
```

#### Option 2: Railway PostgreSQL

```bash
# 1. In Railway dashboard, add PostgreSQL service
# 2. Copy DATABASE_URL from variables
# 3. Update .env and push schema
```

### Connection Pooling

For high traffic, use connection pooling:

```typescript
// lib/prisma.ts (update)
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Connection pool settings
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Database Indexes (Already Optimized)

Current indexes in schema.prisma:
- `Form.userId` - Fast user form lookups
- `Form.shareId` - Fast public form access
- `FormField.formId` - Efficient field queries
- `FormResponse.formId` - Quick response retrieval
- `FormResponse.submittedAt` - Time-based queries
- `FormFieldResponse.responseId` - Response joins
- `FormFieldResponse.fieldId` - Field analysis

### Query Optimization

✅ **Already implemented**:
- Selective field fetching (not `select *`)
- Parallel queries with `Promise.all()`
- Indexed queries
- Pagination on all list endpoints

---

## Monitoring & Logging

### Health Check Endpoint

Monitor application health:

```bash
GET /api/health

Response:
{
  "status": "healthy",
  "database": { "status": "connected", "responseTime": "15ms" },
  "stats": { "totalForms": 1234, "totalResponses": 5678 }
}
```

### Logging System

✅ **Already configured** with Winston:

```bash
# Logs are written to:
logs/error-2024-01-15.log     # Error logs (14 days retention)
logs/combined-2024-01-15.log  # All logs (7 days retention)
logs/exceptions-2024-01-15.log # Uncaught exceptions
```

### Monitor These Metrics

1. **API Response Times**: Check logs for slow queries (>1s)
2. **Error Rate**: Monitor `logs/error-*.log`
3. **Database Connection**: `/api/health` endpoint
4. **Rate Limit Hits**: Check security events in logs
5. **Spam Submissions**: Flagged responses in metadata
6. **Memory Usage**: Use platform metrics (Vercel/Railway)
7. **CPU Usage**: Monitor during peak traffic

### Recommended Monitoring Tools

#### Free Options:
- **Vercel Analytics** (if deployed on Vercel)
- **Railway Metrics** (if deployed on Railway)
- **Better Stack** (free tier) - Log aggregation
- **Uptime Robot** - Health check monitoring

#### Paid Options (worth it at scale):
- **Sentry** - Error tracking ($26/month)
- **DataDog** - Full observability
- **New Relic** - APM monitoring

### Set Up Alerts

```javascript
// Example: Sentry Integration
// npm install @sentry/nextjs

// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

---

## Performance Optimization

### Current Optimizations ✅

1. **Database Queries**: Optimized with indexes and selective fields
2. **API Routes**: Rate limited to prevent abuse
3. **Pagination**: All list endpoints paginated (10-100 items)
4. **Parallel Queries**: Using `Promise.all()` where possible

### Additional Optimizations for Scale

#### 1. Caching Layer (Redis)

```bash
# Install Redis
npm install ioredis

# Add to .env:
REDIS_URL="redis://localhost:6379"
```

```typescript
// lib/cache.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export async function getCached<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached) : null
}

export async function setCache(key: string, value: any, ttl: number = 3600) {
  await redis.setex(key, ttl, JSON.stringify(value))
}

// Usage in API routes:
const cacheKey = `form:${formId}`
let form = await getCached(cacheKey)

if (!form) {
  form = await prisma.form.findUnique(...)
  await setCache(cacheKey, form, 300) // Cache for 5 minutes
}
```

#### 2. CDN for Static Assets

- ✅ Next.js automatically optimizes images
- ✅ Vercel serves assets via global CDN
- For self-hosted: Use Cloudflare CDN

#### 3. Database Read Replicas

For 10,000+ users:

```bash
# Use Supabase read replicas
DATABASE_URL="postgresql://...?connection_limit=20"
DATABASE_READ_URL="postgresql://read-replica...?connection_limit=50"
```

#### 4. Background Jobs

Move heavy tasks to background:

```bash
npm install bullmq

# For email sending, analytics processing, etc.
```

---

## Scaling Strategy

### Traffic Levels

#### 0-1,000 Users
- ✅ Current setup handles this easily
- Single server deployment (Vercel/Railway)
- Basic PostgreSQL database
- No caching needed

#### 1,000-10,000 Users
- ✅ Add Redis caching
- ✅ Enable database connection pooling
- ✅ Use CDN for assets
- Monitor database query performance
- Consider upgrading database plan

#### 10,000-100,000 Users
- Enable database read replicas
- Horizontal scaling (multiple servers)
- Background job processing
- Advanced monitoring (DataDog/New Relic)
- Dedicated database server

#### 100,000+ Users
- Microservices architecture
- Database sharding
- Multi-region deployment
- Load balancer
- Auto-scaling

### Deployment Platforms at Scale

| Users | Platform | Cost/Month | Notes |
|-------|----------|------------|-------|
| 0-1K | Vercel Hobby | $0 | Perfect for MVP |
| 1K-10K | Vercel Pro | $20 | Easy scaling |
| 10K-100K | Railway/AWS | $50-200 | More control |
| 100K+ | AWS/GCP | $500+ | Full infrastructure |

---

## Backup & Disaster Recovery

### Database Backups

#### Automated Backups (Supabase)

```bash
# Supabase automatically backs up daily
# Retention: 7 days (free), 30 days (pro)

# Manual backup:
pg_dump DATABASE_URL > backup-$(date +%Y%m%d).sql
```

#### Backup Script

```bash
#!/bin/bash
# scripts/backup-db.sh

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="backups"
FILENAME="looply-backup-$DATE.sql"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump $DATABASE_URL > "$BACKUP_DIR/$FILENAME"

# Compress
gzip "$BACKUP_DIR/$FILENAME"

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/$FILENAME.gz" s3://your-bucket/backups/

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "✅ Backup completed: $FILENAME.gz"
```

#### Schedule Daily Backups

```bash
# On Railway/VPS, use cron:
crontab -e

# Add:
0 2 * * * /app/scripts/backup-db.sh >> /app/logs/backup.log 2>&1
```

### Disaster Recovery Plan

1. **Database Failure**:
   ```bash
   # Restore from latest backup
   gunzip -c backup-20240115.sql.gz | psql $NEW_DATABASE_URL
   ```

2. **Server Failure**:
   - Vercel/Railway auto-restart
   - Keep infrastructure as code (vercel.json)
   - Document all environment variables

3. **Data Corruption**:
   - Point-in-time recovery (Supabase Pro)
   - Use database migrations, never manual schema changes

### Backup Checklist

- [ ] Daily automated database backups
- [ ] Weekly full system backups
- [ ] Backups stored in different location (S3, etc.)
- [ ] Tested recovery process monthly
- [ ] Document recovery procedures
- [ ] Monitor backup success/failure
- [ ] Encrypt backup files

---

## Email Configuration

### Recommended Email Services

#### Option 1: Resend (Easiest)

```bash
# 1. Sign up at resend.com
# 2. Get API key
# 3. Add to .env:
RESEND_API_KEY="re_xxx"
EMAIL_FROM="noreply@yourdomain.com"
```

#### Option 2: SendGrid

```bash
SENDGRID_API_KEY="SG.xxx"
EMAIL_FROM="noreply@yourdomain.com"
```

#### Option 3: Custom SMTP

```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_SECURE="false"
EMAIL_FROM="noreply@yourdomain.com"
```

### Email Templates

✅ Already implemented:
- Form response notification (to form owner)
- Submission confirmation (to submitter)

### Email Best Practices

1. **SPF/DKIM**: Configure DNS records for deliverability
2. **Rate Limits**: Don't send more than 100 emails/hour initially
3. **Unsubscribe**: Add unsubscribe link to notifications
4. **Templates**: Use HTML + plain text fallback (already done)
5. **Testing**: Test all email flows before launch

---

## Rate Limiting Configuration

### Current Limits ✅

```typescript
API General: 100 requests/minute
Form Submission: 10 submissions/minute
Form Creation: 5 forms/minute
```

### Adjust for Your Needs

Edit `lib/rate-limit.ts`:

```typescript
// For higher traffic:
const apiLimiter = new RateLimiterMemory({
  points: 500, // Increase to 500
  duration: 60,
})

// For stricter spam protection:
const formSubmissionLimiter = new RateLimiterMemory({
  points: 5, // Decrease to 5
  duration: 60,
})
```

### Redis-based Rate Limiting (for multiple servers)

```typescript
import { RateLimiterRedis } from 'rate-limiter-flexible'
import Redis from 'ioredis'

const redisClient = new Redis(process.env.REDIS_URL!)

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 100,
  duration: 60,
})
```

---

## Incident Response

### If Site Goes Down

1. **Check Health Endpoint**: `https://yourapp.com/api/health`
2. **Check Logs**: Look at error logs
3. **Check Database**: Verify connection
4. **Check Platform Status**: Vercel/Railway status page
5. **Rollback**: Deploy previous working version

### Common Issues & Solutions

#### High CPU Usage
```bash
# Check slow queries:
# Look in logs for queries >1s
# Add indexes if needed
# Enable query caching
```

#### Out of Memory
```bash
# Increase server memory (platform settings)
# Check for memory leaks in logs
# Optimize large data queries with pagination
```

#### Database Connection Errors
```bash
# Check connection limit
# Enable connection pooling
# Scale database plan
```

#### Too Many Rate Limit Errors
```bash
# Check if under DDoS attack
# Adjust rate limits if legitimate traffic
# Block malicious IPs
```

### Emergency Contacts Template

```markdown
## Emergency Contacts

**Database Issues**: Supabase Support (support@supabase.com)
**Hosting Issues**: Vercel Support (support@vercel.com)
**Team Lead**: your-email@company.com
**On-Call Developer**: +1-xxx-xxx-xxxx

## Critical Environment Variables

Keep a secure backup of all environment variables!
```

---

## Deployment Checklist

### Before Every Deployment

- [ ] Run tests: `npm test` (add tests!)
- [ ] Check build: `npm run build`
- [ ] Review changes: `git diff main`
- [ ] Update CHANGELOG.md
- [ ] Database migrations tested
- [ ] Environment variables updated
- [ ] Backup database
- [ ] Monitor logs after deployment

### Post-Deployment

- [ ] Check `/api/health` returns 200
- [ ] Test critical user flows
- [ ] Monitor error logs for 30 minutes
- [ ] Check performance metrics
- [ ] Verify email sending works
- [ ] Test form submission

---

## Performance Benchmarks

### Target Metrics

- **API Response Time**: <200ms (p95)
- **Database Queries**: <50ms (p95)
- **Page Load**: <1s (LCP)
- **Uptime**: 99.9%+ (3.65 hours downtime/year max)
- **Error Rate**: <0.1%

### Load Testing

```bash
# Install Apache Bench
brew install httpd  # Mac
apt install apache2-utils  # Linux

# Test API endpoint:
ab -n 1000 -c 10 https://yourapp.com/api/health

# Test form submission:
ab -n 100 -c 5 -p payload.json -T application/json \
   https://yourapp.com/api/responses
```

---

## Security Maintenance

### Monthly Tasks

- [ ] Review access logs for suspicious activity
- [ ] Rotate API keys and secrets
- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit fix`
- [ ] Review rate limit logs
- [ ] Check for failed login attempts (when auth added)
- [ ] Review user feedback for security concerns

### Quarterly Tasks

- [ ] Full security audit
- [ ] Penetration testing
- [ ] Review and update security policies
- [ ] Backup recovery test
- [ ] Update documentation

---

## Cost Optimization

### Free Tier Limits

**Vercel**: 100GB bandwidth/month, 100 hours serverless
**Supabase**: 500MB database, 2GB bandwidth
**Resend**: 3,000 emails/month

### When to Upgrade

- Bandwidth: When exceeding 80% of free tier
- Database: When storage >400MB or need better performance
- Emails: When sending >2,500/month

### Cost Estimates

| Users | Monthly Cost | Breakdown |
|-------|-------------|-----------|
| 0-1K | $0-20 | Vercel Hobby + Supabase Free |
| 1K-5K | $20-50 | Vercel Pro + Supabase Pro |
| 5K-20K | $50-200 | Vercel Pro + Dedicated DB + Email service |
| 20K+ | $200+ | Custom infrastructure |

---

## Summary

✅ **What's Already Production-Ready**:
- Rate limiting on all endpoints
- Input sanitization (XSS protection)
- Comprehensive validation
- Error logging
- Security headers
- Spam protection
- Optimized database queries
- Pagination
- Email system
- Analytics tracking
- Health monitoring

🚀 **To Do Before Launch**:
1. Switch SQLite → PostgreSQL
2. Configure email service (Resend/SendGrid)
3. Set up monitoring (Sentry/Better Stack)
4. Configure automated backups
5. Add NextAuth providers
6. Test all critical flows
7. Load testing
8. Review and update environment variables

---

**Questions? Check the other docs:**
- `README.md` - Feature overview
- `DEPLOYMENT.md` - Deployment guides
- `VSCODE_SETUP_GUIDE.md` - Local development

Built for scale. Ready for thousands of users. 🎯
