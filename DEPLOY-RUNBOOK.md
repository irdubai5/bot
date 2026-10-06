# Smart Money Radar — Release Runbook

## هدف
این پروژه تا زمان تأیید نهایی روی دامنه فعلی دست‌نخورده می‌ماند. انتشار باید از یک artifact مشخص و checksumدار انجام شود.

## مرحله آماده‌سازی
```bash
chmod +x scripts/prepare-release.sh
./scripts/prepare-release.sh
```

اسکریپت:
- workspace ایزوله می‌سازد؛
- `.env` و credentialها را وارد release نمی‌کند؛
- backupها و dependencyهای محلی را حذف می‌کند؛
- `npm ci` اجرا می‌کند؛
- TypeScript و Vite production build را اجرا می‌کند؛
- backend را با `npm ci --omit=dev` آماده می‌کند؛
- syntax-check انجام می‌دهد؛
- archive و SHA-256 می‌سازد؛
- هیچ DNS/server/deployment operation انجام نمی‌دهد.

## قبل از انتشار
1. مقادیر واقعی `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` را فقط در build environment قرار دهید.
2. مقادیر backend را از `backend/.env.example` روی سرور تنظیم کنید.
3. اگر credentialهای داخل ZIP واقعی هستند، آنها را rotate کنید.
4. health endpoint را بررسی کنید:
   `https://api.irdubai20.ir/api/health`
5. release archive را با SHA-256 تطبیق دهید.

## انتشار
فعلاً command نهایی deploy عمداً در پروژه hard-code نشده است؛ چون از فایل‌های فعلی مشخص نیست backend روی چه سرویس/سروری مدیریت می‌شود و نباید با حدس، production را تغییر دهیم.

بعد از تأیید شما، فقط adapter مربوط به hosting واقعی اضافه می‌شود و همان artifact منتشر خواهد شد.

## Rollback
نسخه فعلی سایت تا قبل از deploy جدید مرجع rollback است. releaseهای جدید باید timestamp و SHA-256 مستقل داشته باشند.
