# Site AJED — Association des Jeunes Espoirs de Dougar

Next.js 15 · TypeScript · Tailwind CSS · PostgreSQL · Prisma

## Démarrage rapide

```bash
npm install
docker compose up -d        # PostgreSQL local (ou pointez DATABASE_URL vers votre base)
npm run db:push             # crée les tables


            # statistiques, paramètres et une action d'exemple
npm run dev                 # http://localhost:3000
```

Administration : http://localhost:3000/admin — mot de passe défini dans `.env` (`ADMIN_PASSWORD`).

## Logo officiel

Remplacez `public/logo-ajed.png` par le logo fourni (le fichier actuel est un simple espace réservé).
Le même fichier sert d'icône du site et d'image Open Graph.

## Sécurité

- `ADMIN_PASSWORD` n'existe que côté serveur : il est comparé dans une Server Action, jamais envoyé au navigateur.
- Session = cookie `httpOnly` signé (JWT, clé `AUTH_SECRET`) ; `/admin/*` est protégé par le middleware **et** chaque action serveur revérifie la session.
- En production : changez `ADMIN_PASSWORD` et générez un nouvel `AUTH_SECRET` (`openssl rand -hex 32`). Ne versionnez pas `.env`.

## Images

Par défaut, les images sont stockées sur disque (`UPLOAD_DIR`, servies par `/api/files/…`) :
parfait pour un VPS/Docker avec volume persistant. Sur un hébergeur serverless (Vercel…),
renseignez les variables `CLOUDINARY_*` (voir `.env.example`) : les images et vidéos sont alors envoyées sur Cloudinary
(le reste du code ne manipule que l'URL retournée).

Pour transférer les médias déjà enregistrés dans la base, configurez également `DATABASE_URL` et
`NEXT_PUBLIC_SITE_URL`, puis lancez d'abord une simulation et ensuite la migration réelle :

```bash
npx tsx --env-file=.env prisma/migrate-to-cloudinary.ts --dry-run
npx tsx --env-file=.env prisma/migrate-to-cloudinary.ts
```

La simulation n'envoie aucun fichier et ne modifie pas la base. Faites une sauvegarde de la base avant la migration réelle.

## Structure

```
prisma/              schéma + seed
src/app/(site)/      pages publiques (accueil, actions, galerie, actualités, à propos, contact)
src/app/admin/       administration (dashboard, actions, galerie, actualités, événements, stats, paramètres)
src/components/      ui · layout · site (carrousel, avant/après, galerie…) · admin
src/lib/             db, auth, storage, data (requêtes publiques), utils
```

Le contenu public est lu en base à chaque requête : une action publiée depuis `/admin` apparaît aussitôt
dans le carrousel, les cartes, `/actions` et (avec ses photos) la galerie.

## Notes

- Le modèle `Photo` joue le rôle de « Gallery » ; `Admin` est prévu pour un futur multi-comptes.
- Les photos d'une action supprimée sont supprimées en base (les fichiers restent sur le disque).
- Pas de shadcn/ui : les composants sont écrits à la main pour limiter les dépendances.
