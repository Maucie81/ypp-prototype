This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Opening the prototype

**Reliable way (recommended):** From the project folder, run:

```bash
cd ~/Documents/Cursor/ypp-prototype
npm run open
```

Then open **http://127.0.0.1:3000**. The first run does a full build (~1 min); after that the server stays up until you Ctrl+C. No hot reload—refresh the browser to see changes.

**Why `npm run dev` is flaky:** Next.js 16’s dev server in this setup can hit: port/lock conflicts if a previous run didn’t exit cleanly; timeouts (e.g. telemetry); Turbopack 404s or webpack “stuck on Starting.” Running from the wrong folder (`~` instead of the project) also causes “Missing script” errors. The `open` script avoids the dev server and runs a production build so the app just works.

**If you want dev + hot reload:** Run `npm run dev:clean` from the project folder (it kills anything on 3000/3001 and clears `.next`). If it hangs or errors, use `npm run open` instead.

## Getting Started (dev server)

To run the development server (faster refresh, but see above for known issues):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or [http://127.0.0.1:3000](http://127.0.0.1:3000) with your browser.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
