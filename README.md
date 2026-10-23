# NextWave Build — Cinematic Next.js website

## Run locally
Requires Node.js 20.9+ (Node 22 or 24 LTS recommended).

```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Production
```bash
npm run build
npm start
```
For Vercel: import the project, choose Next.js, and deploy. No environment variables required. Upload the extracted project contents to your Git repository, not the ZIP itself.

## Components
Each section has its own file in `src/components/home/`:
Header.tsx, Hero.tsx, Ticker.tsx, Flagships.tsx, Method.tsx,
WhyNextWave.tsx, Contact.tsx, Footer.tsx.
`src/app/page.tsx` assembles them. Layout metadata lives in
`src/app/layout.tsx`; all original responsive styles are in `src/app/globals.css`.
Only Header and Hero use client-side React state. Other sections are server components.

## Editing
Edit section copy and links in the corresponding component. Hero slides are in Hero.tsx.
Replace files in public/assets to change the illustrations or logo.
Colours and font families are CSS variables at the top of globals.css.
Google Fonts loads via CSS with system fallbacks; no font download is required during build.

## Included interactions
Mobile menu with aria-expanded and closing on selection; flagship selector and
previous/next controls; CSS ticker; hover effects; reduced-motion support;
keyboard focus indicators and skip navigation. Section content stays visible without JavaScript.

## Assets and scope
The supplied HTML referenced assets/ but those original files were not included in the attachments.
The bundled SVG illustrations and logo are recreated replacements, not the original artwork.
Replace them with your originals for an exact artwork match. Layout and responsive styles
are carried over from the supplied Cinematic HTML. All assets used by the page are included.

Registration and sign-in link to the existing portal.nextwavebuild.com service.
Contact uses mailto:support@nextwavebuild.com. Privacy/terms link to the existing PDFs.
This project is the public landing website; authentication, payments, registration and email
processing remain in your existing portal. No backend configuration is needed here.
