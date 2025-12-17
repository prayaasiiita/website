## Development

### Run locally

```bash
npm install
npm run dev
```

## Cloudinary Setup

This project can store and serve images via Cloudinary.

1) Create a Cloudinary account and note your credentials.

2) Create `.env.local` in the repo root with:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Optional: default folder for organization
CLOUDINARY_FOLDER=prayaas
```

3) Ensure Next/Image allows Cloudinary domain in `next.config.ts` (we add this in the next step).

4) Use the API routes under `src/app/api/media` for secure uploads/deletes from the admin UI.

Endpoints
- POST `/api/media/upload` – Body: FormData with `file` and optional `folder`. Returns `{ url, publicId, width, height }`.
- DELETE `/api/media` – Body JSON: `{ publicId }` to delete an asset.

Best practices
- Call media routes only from authenticated admin pages.
- Persist both `url` and `publicId` in your DB (e.g., Gallery model) to support later deletion.

