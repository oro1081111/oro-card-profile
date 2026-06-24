# 手機專屬互動式個人卡牌介紹頁

這是一個手機優先的個人介紹網站，用卡牌翻面、Bottom Sheet 詳細內容與後台草稿發布流程，呈現周允成 / 奧羅的 AI、產品、數學與桌遊設計背景。

## 技術架構

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Supabase Auth / Database / Storage
- Vercel 部署

## 安裝

```bash
npm install
```

## 環境變數

複製 `.env.example` 成 `.env.local`，填入 Supabase 專案設定：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

初版不需要把 service role key 放進專案。後台操作透過 Supabase Auth 搭配 RLS 控制權限。

## 啟動本機開發

```bash
npm run dev
```

預設頁面：

- `/`：公開卡牌頁，只讀取 `published`
- `/admin/login`：後台登入
- `/admin`：草稿編輯
- `/admin/preview`：草稿預覽，只讀取 `draft`

若尚未設定 Supabase，公開頁會使用 `lib/content/defaultContent.ts` 的 fallback 內容。

## Supabase SQL

到 Supabase SQL Editor 執行：

```sql
-- 請使用 supabase/schema.sql 內容
```

檔案位置：`supabase/schema.sql`

這份 SQL 會建立：

- `site_content`：儲存 `draft` 與 `published`
- `site_admins`：管理員 email 白名單
- `updated_at` trigger
- RLS policies
- `profile-assets` Storage bucket 與基本權限
- 初始 seed 內容

## 新增管理員

1. 在 Supabase Auth 建立一個使用者。
   - Email：`chubby0520@gmail.com`
   - Password：請在 Supabase Auth 後台設定，不要提交到 GitHub。
2. 到 SQL Editor 執行：

```sql
insert into site_admins (email)
values ('chubby0520@gmail.com')
on conflict (email) do nothing;
```

3. 後台登入只接受 Supabase Auth。尚未設定 Supabase 時，公開頁仍可用 fallback 資料預覽，但後台無法登入。

## 編輯內容

登入 `/admin` 後可以編輯：

- 基本資料與聯絡連結
- 卡牌新增、複製、刪除、排序、顯示/隱藏
- 卡牌圖片 URL、標籤、顏色、簡短介紹、詳細介紹與按鈕
- 全站主題色、卡牌圓角、陰影與字體風格

按「儲存草稿」只會更新 `draft`，公開頁仍維持 `published`。

## 預覽與發布

1. 在 `/admin` 編輯後按「儲存草稿」。
2. 開啟 `/admin/preview` 檢查草稿。
3. 確認後按「發布到公開頁面」。
4. 系統會把 `draft` 複製到 `published`，並更新 `published_at`。

核心資料流：

```text
後台編輯 -> draft
草稿預覽 -> draft
公開頁面 -> published
發布按鈕 -> draft 複製到 published
```

## 圖片與 Storage

第一版後台支援直接輸入圖片 URL。Supabase Storage 已預留 bucket：

```text
profile-assets
```

用途包含頭像、卡牌圖片、背景圖與作品圖片。未來可以在 `components/admin/ImageField.tsx` 接入上傳流程。

## 部署到 Vercel

1. 將專案推到 GitHub。
2. 在 Vercel 匯入專案。
3. 到 Vercel Project Settings 新增環境變數：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

4. 部署後，到 `/admin/login` 登入並編輯內容。

## 驗收重點

- 公開頁手機寬度閱讀正常
- 卡牌依 `order` 排序
- `visible=false` 不顯示
- 點擊卡牌可翻面，一次只保留一張翻面
- 點擊詳細介紹開啟 Bottom Sheet
- 外部連結空白時不顯示
- 後台修改草稿不影響公開頁
- 發布後公開頁更新
- 非管理員受 RLS 限制，不能讀取草稿或修改內容
