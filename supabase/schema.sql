create table if not exists site_content (
  id text primary key check (id in ('draft', 'published')),
  content jsonb not null,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists site_admins (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_site_content_updated_at on site_content;

create trigger update_site_content_updated_at
before update on site_content
for each row
execute function update_updated_at_column();

alter table site_content enable row level security;
alter table site_admins enable row level security;

create or replace function is_site_admin()
returns boolean as $$
  select exists (
    select 1
    from site_admins
    where email = auth.jwt() ->> 'email'
  );
$$ language sql stable security definer;

drop policy if exists "public can read published content" on site_content;
create policy "public can read published content"
on site_content
for select
using (id = 'published');

drop policy if exists "admins can read all content" on site_content;
create policy "admins can read all content"
on site_content
for select
to authenticated
using (is_site_admin());

drop policy if exists "admins can insert content" on site_content;
create policy "admins can insert content"
on site_content
for insert
to authenticated
with check (is_site_admin());

drop policy if exists "admins can update content" on site_content;
create policy "admins can update content"
on site_content
for update
to authenticated
using (is_site_admin())
with check (is_site_admin());

drop policy if exists "admins can read admin list" on site_admins;
create policy "admins can read admin list"
on site_admins
for select
to authenticated
using (is_site_admin());

-- Create this user in Supabase Auth, then set a strong password in the Supabase dashboard.
insert into site_admins (email)
values ('chubby0520@gmail.com')
on conflict (email) do nothing;

insert into site_content (id, content, published_at)
values
  (
    'draft',
    '{
      "profile": {
        "displayNameZh": "周允成 / 奧羅",
        "displayNameEn": "Yun-Cheng Chou / ORO",
        "headline": "AI Product PM × Generative AI Engineer × Board Game Designer",
        "subheadline": "把 AI Agent、產品設計與遊戲機制放在一起思考的人",
        "shortBio": "現任中華數位科技股份有限公司 AI 產品部門 PM，曾任生成式 AI 工程師，畢業於國立陽明交通大學應用數學研究所，副業經營創意奧羅桌遊設計工作室。",
        "avatarUrl": "",
        "links": [
          { "label": "Email", "type": "email", "url": "mailto:your-email@example.com" },
          { "label": "LinkedIn", "type": "link", "url": "" },
          { "label": "工作室網站", "type": "link", "url": "" },
          { "label": "Instagram", "type": "social", "url": "" },
          { "label": "Facebook", "type": "social", "url": "" }
        ]
      },
      "theme": {
        "backgroundColor": "#0F172A",
        "textColor": "#F8FAFC",
        "primaryColor": "#8B5CF6",
        "accentColor": "#22D3EE",
        "cardRadius": "24px",
        "cardShadow": true,
        "fontStyle": "modern"
      },
      "cards": [
        {
          "id": "ai-product-pm",
          "order": 1,
          "visible": true,
          "title": "AI Product PM",
          "subtitle": "企業 AI 產品與 Agent 落地",
          "imageUrl": "",
          "tags": ["AI產品", "B2B", "Agent"],
          "frontColor": "#111827",
          "backColor": "#1F2937",
          "accentColor": "#8B5CF6",
          "textColor": "#FFFFFF",
          "shortDescription": "目前任職於中華數位科技股份有限公司，擔任 AI 產品部門 PM。",
          "detail": "我關注 AI 產品規劃、需求整合、流程設計與企業場景落地。對我來說，AI 產品不應該只停留在展示功能，而是要能真正進入使用者的工作流程，並被持續採用。",
          "buttons": [
            { "label": "查看詳細介紹", "type": "modal", "target": "detail" },
            { "label": "想聊 AI 產品", "type": "link", "target": "mailto:your-email@example.com" }
          ]
        },
        {
          "id": "generative-ai-engineer",
          "order": 2,
          "visible": true,
          "title": "Generative AI Engineer",
          "subtitle": "從技術實作理解生成式 AI",
          "imageUrl": "",
          "tags": ["生成式AI", "LLM", "AI工程"],
          "frontColor": "#1E1B4B",
          "backColor": "#312E81",
          "accentColor": "#A78BFA",
          "textColor": "#FFFFFF",
          "shortDescription": "曾於台灣智慧技術研發股份有限公司擔任生成式 AI 工程師。",
          "detail": "我曾負責生成式 AI 相關應用與技術實作，能從工程角度理解模型能力、資料流程、工具串接與產品限制，也能與 PM、設計、業務需求進行轉譯與協作。",
          "buttons": [
            { "label": "查看技術背景", "type": "modal", "target": "detail" },
            { "label": "AI 主題交流", "type": "link", "target": "mailto:your-email@example.com" }
          ]
        },
        {
          "id": "applied-mathematics",
          "order": 3,
          "visible": true,
          "title": "Applied Mathematics",
          "subtitle": "結構、規則與推理訓練",
          "imageUrl": "",
          "tags": ["應用數學", "邏輯思維", "問題解構"],
          "frontColor": "#064E3B",
          "backColor": "#065F46",
          "accentColor": "#34D399",
          "textColor": "#FFFFFF",
          "shortDescription": "畢業於國立陽明交通大學應用數學研究所。",
          "detail": "應用數學訓練讓我習慣從結構、規則、推理與抽象模型的角度思考問題。這也影響我在 AI 產品、知識系統與遊戲設計上的方法。",
          "buttons": [
            { "label": "我的思考方式", "type": "modal", "target": "detail" }
          ]
        }
      ]
    }'::jsonb,
    null
  ),
  (
    'published',
    '{
      "profile": {
        "displayNameZh": "周允成 / 奧羅",
        "displayNameEn": "Yun-Cheng Chou / ORO",
        "headline": "AI Product PM × Generative AI Engineer × Board Game Designer",
        "subheadline": "把 AI Agent、產品設計與遊戲機制放在一起思考的人",
        "shortBio": "現任中華數位科技股份有限公司 AI 產品部門 PM，曾任生成式 AI 工程師，畢業於國立陽明交通大學應用數學研究所，副業經營創意奧羅桌遊設計工作室。",
        "avatarUrl": "",
        "links": [
          { "label": "Email", "type": "email", "url": "mailto:your-email@example.com" },
          { "label": "LinkedIn", "type": "link", "url": "" },
          { "label": "工作室網站", "type": "link", "url": "" },
          { "label": "Instagram", "type": "social", "url": "" },
          { "label": "Facebook", "type": "social", "url": "" }
        ]
      },
      "theme": {
        "backgroundColor": "#0F172A",
        "textColor": "#F8FAFC",
        "primaryColor": "#8B5CF6",
        "accentColor": "#22D3EE",
        "cardRadius": "24px",
        "cardShadow": true,
        "fontStyle": "modern"
      },
      "cards": [
        {
          "id": "ai-product-pm",
          "order": 1,
          "visible": true,
          "title": "AI Product PM",
          "subtitle": "企業 AI 產品與 Agent 落地",
          "imageUrl": "",
          "tags": ["AI產品", "B2B", "Agent"],
          "frontColor": "#111827",
          "backColor": "#1F2937",
          "accentColor": "#8B5CF6",
          "textColor": "#FFFFFF",
          "shortDescription": "目前任職於中華數位科技股份有限公司，擔任 AI 產品部門 PM。",
          "detail": "我關注 AI 產品規劃、需求整合、流程設計與企業場景落地。對我來說，AI 產品不應該只停留在展示功能，而是要能真正進入使用者的工作流程，並被持續採用。",
          "buttons": [
            { "label": "查看詳細介紹", "type": "modal", "target": "detail" },
            { "label": "想聊 AI 產品", "type": "link", "target": "mailto:your-email@example.com" }
          ]
        },
        {
          "id": "generative-ai-engineer",
          "order": 2,
          "visible": true,
          "title": "Generative AI Engineer",
          "subtitle": "從技術實作理解生成式 AI",
          "imageUrl": "",
          "tags": ["生成式AI", "LLM", "AI工程"],
          "frontColor": "#1E1B4B",
          "backColor": "#312E81",
          "accentColor": "#A78BFA",
          "textColor": "#FFFFFF",
          "shortDescription": "曾於台灣智慧技術研發股份有限公司擔任生成式 AI 工程師。",
          "detail": "我曾負責生成式 AI 相關應用與技術實作，能從工程角度理解模型能力、資料流程、工具串接與產品限制，也能與 PM、設計、業務需求進行轉譯與協作。",
          "buttons": [
            { "label": "查看技術背景", "type": "modal", "target": "detail" },
            { "label": "AI 主題交流", "type": "link", "target": "mailto:your-email@example.com" }
          ]
        },
        {
          "id": "applied-mathematics",
          "order": 3,
          "visible": true,
          "title": "Applied Mathematics",
          "subtitle": "結構、規則與推理訓練",
          "imageUrl": "",
          "tags": ["應用數學", "邏輯思維", "問題解構"],
          "frontColor": "#064E3B",
          "backColor": "#065F46",
          "accentColor": "#34D399",
          "textColor": "#FFFFFF",
          "shortDescription": "畢業於國立陽明交通大學應用數學研究所。",
          "detail": "應用數學訓練讓我習慣從結構、規則、推理與抽象模型的角度思考問題。這也影響我在 AI 產品、知識系統與遊戲設計上的方法。",
          "buttons": [
            { "label": "我的思考方式", "type": "modal", "target": "detail" }
          ]
        }
      ]
    }'::jsonb,
    now()
  )
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('profile-assets', 'profile-assets', true)
on conflict (id) do nothing;

drop policy if exists "public can read profile assets" on storage.objects;
create policy "public can read profile assets"
on storage.objects
for select
using (bucket_id = 'profile-assets');

drop policy if exists "admins can manage profile assets" on storage.objects;
create policy "admins can manage profile assets"
on storage.objects
for all
to authenticated
using (bucket_id = 'profile-assets' and is_site_admin())
with check (bucket_id = 'profile-assets' and is_site_admin());
