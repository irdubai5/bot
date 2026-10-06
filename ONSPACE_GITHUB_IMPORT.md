# Importing this project into OnSpace via GitHub

This repository is prepared as a source-code repository for OnSpace.

## Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Express backend
- Supabase integration

## Important
Do not commit real secrets. Configure environment variables inside the target environment using `.env.example` and `backend/.env.example` as references.

## Recommended import
1. Create a new GitHub repository.
2. Upload the contents of this folder to the repository root (not the containing folder itself).
3. Connect GitHub to OnSpace.
4. Select this repository/branch and import or sync the project.
5. If OnSpace asks for the app type, use a Vite/React web app.

The `dist/` and `.wrangler/` directories are intentionally excluded because they are generated/deployment artifacts.
