# kaleido

# 実行手順
※`.env`を貰ってプロジェクトのrootに配置してください

```
yarn
docker compose db up
npx prisma migrate dev
npx prisma generate
yarn start
