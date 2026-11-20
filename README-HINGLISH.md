# Satyanand Dubey — Video Editing Portfolio

A responsive creator portfolio with a classic editorial look, modern motion, a visual editing-suite/timeline hero, video project playback, and a separate local Content Studio for maintaining the work library.

## Website mein kya hai

- Hero section with the editor identity and animated editing-interface/timeline visual.
- Work library with category filters for Short-form, Long-form, Short Films, and any categories you add later.
- Six starter project slots (2 short-film slots included). These are clearly placeholders until you add your real edits.
- In-page video player for direct MP4, YouTube and Vimeo projects.
- About, editing tools, Quinreach Creative Marketing Agency collaboration, services, process and contact sections.
- Smooth scroll reveals, moving playhead, marquee, hover motion, mobile navigation and responsive layouts.
- Contact buttons for email, phone, WhatsApp and Instagram.
- `studio.html`: a local content manager to add/edit/delete projects, update profile details, import/export content and edit the full data JSON.

## 1. Website run kaise karni hai

1. ZIP extract karo.
2. Folder ko VS Code mein open karo.
3. VS Code mein **Live Server** extension install karo (recommended).
4. `index.html` par right-click karke **Open with Live Server** select karo.
5. Local website browser mein open ho jayegi. Content manager ke liye browser address ke end mein `/studio.html` open karo.

> `index.html` ko double-click karke bhi preview kar sakte ho, lekin `studio.html` ke localStorage, data import aur kuch browser features ke liye Live Server recommended hai.

## 2. Apni edited reel ya video kaise lagani hai

### Recommended: MP4 file website ke assets folder mein rakho

1. Apni final exported video ko `assets/reels/` folder mein copy karo. Example: `assets/reels/travel-film-01.mp4`.
2. Ek thumbnail/poster image ho to use `assets/posters/` mein rakho. Example: `assets/posters/travel-film-01.jpg`.
3. Browser mein `studio.html` open karo.
4. **Add or Update a Video Project** form mein title, category, format, year, description fill karo.
5. Source type `MP4 / Direct video URL` select karo.
6. Video path mein `assets/reels/travel-film-01.mp4` likho. Poster path mein `assets/posters/travel-film-01.jpg` likho.
7. **ADD PROJECT** click karo. Main portfolio same browser mein reload karne par updated draft dikha dega.

### Online hosted video

Bade video files ko Cloudinary ya kisi reliable video CDN par host karke direct MP4 delivery URL paste kar sakte ho. YouTube/Vimeo project ke liye form mein matching source type choose karke share URL paste karo.

Instagram Reel ka normal share link direct MP4 file nahi hota. Website player mein reliable playback ke liye original exported MP4 (ya direct video URL) use karo. YouTube/Vimeo embeds bhi supported hain.

## 3. 5–6 ya aur zyada videos add karna

Koi fixed limit nahi hai. `studio.html` mein projects ek-ek karke add karte jao. Work grid category filters ko projects ke categories se automatically banata hai. Project order `data/portfolio.js` ke `projects` array ke order ke hisaab se rahega.

## 4. Existing project change ya delete kaise karna hai

- `studio.html` → Project Library → **EDIT**. Form update karo, phir **UPDATE PROJECT**.
- Project remove karna ho to **DELETE** click karo.
- Thumbnail, title, category, year, video source, description — sab change ho sakte hain.
- Advanced Data Editor mein full JSON edit karke stats, services, project order aur additional content update kar sakte ho.

## 5. Profile / contact details update kaise karna hai

`studio.html` → Your Profile section se name, Instagram, email, phone, WhatsApp, location, agency details, intro, about text aur editing tools update ho sakte hain.

Current details configured:
- Email: `dubeysatyam222201@gmail.com`
- Instagram: `https://www.instagram.com/visualssatyam/`
- Phone / WhatsApp: `+91 63899 44594`
- Agency collaboration: Quinreach Creative Marketing Agency, Prayagraj
- Tools: CapCut, DaVinci Resolve, Premiere Pro, After Effects, Storytelling, Sound Design

## 6. Changes public/live website par kaise jayengi — important

Static website security ke liye browser se seedha hosting ke files overwrite nahi kar sakti. Isliye Content Studio mein **Save** karne ke baad changes pehle us browser ke local draft mein store hote hain. Sab website visitors ko update dikhane ke liye:

1. `studio.html` mein **EXPORT portfolio.js** click karo.
2. Download hui `portfolio.js` file ko apne project ke `data/` folder mein purani `portfolio.js` ke upar replace karo.
3. Updated project GitHub par push/upload karo.
4. Vercel (ya GitHub Pages) par redeploy/auto-deploy hone do.

Iske baad live website par sab visitors ko updated reels aur profile dikhengi. Local draft ko doosre browser/device par automatically sync nahi kiya jata. `EXPORT JSON` ek backup hai, aur `IMPORT JSON` se backup wapas load kar sakte ho.

## 7. Website ka theme ya layout change karna

- `styles.css` — colors, fonts, spacing, responsive layout, hover effects and animations.
- `index.html` — page ke main sections and structure.
- `script.js` — video modal, filters, navigation and scroll interactions.
- `data/portfolio.js` — initial profile, stats, tools, services and projects.
- `studio.html` / `studio.js` — local content manager.

## 8. Publishing

Project ko GitHub repository mein upload karke Vercel par import kar sakte ho. Framework preset **Other** / static site choose karo; build command ki zaroorat nahi hai aur output directory project root rahegi. Deploy hone ke baad Vercel URL mil jayega. Apna custom domain baad mein connect kar sakte ho.

## Important notes

- Six initial cards empty placeholders hain, real client work ke claims nahi. Apne actual edited videos and thumbnails add karke unhe replace karo.
- `150+` short-form reels, `70+` long-form videos, and `02` short films user-provided experience numbers ke hisaab se show kiye gaye hain.
- Agar video files website ke andar rakhe hain, to unhe GitHub par upload karne se repository ka size badhega. Long video ke liye CDN/video hosting better rahegi.
