UdemyのNext.js フルスタック講座で扱ったサンプルコードになります。

## ダウンロード方法

git clone git@github.com:aokitashipro/next-udemy-blog.git

cd next-udemy-blog

.envファイルを作成

ローカルで扱う場合は下記3つの情報が必要です。
講座内のprismaの箇所をご確認ください。

```
DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_USE_SUPABASE_STORAGE=false  # ローカルでは false
```

## インストール・ビルド関連

npm install  // 必要なライブラリをインストール

npm run dev // 開発サーバー起動

npm run build // ビルド

## DBマイグレーション関連

npx prisma migrate dev --name init // マイグレーション・テーブル作成

npx prisma db seed // シード実行(ダミーデータ)

## 認証

npx auth secret // シークレットキー作成 .env.localに生成されるので.envに統合する

