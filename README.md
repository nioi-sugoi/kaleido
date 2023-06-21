# kaleido

# 実行手順

```
※`.env`を岩崎から貰ってプロジェクトのrootに配置してください

yarn
docker compose db up
npx prisma migrate dev
npx prisma generate
お好きな機種名を`pachinko_type`に追加する
yarn start

