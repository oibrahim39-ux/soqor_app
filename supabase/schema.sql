-- ============================================
-- صقور الغد — قاعدة البيانات (Supabase / Postgres)
-- شغّل الملف ده كامل في Supabase SQL Editor
-- ============================================

-- 1) جدول أدوار المستخدمين (مرتبط بـ auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin','employee')) default 'employee',
  created_at timestamptz default now()
);

-- 2) المنصات (هنقرستيشن، كيتا، ...)
create table if not exists platforms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);
insert into platforms (name) values ('هنقرستيشن'), ('كيتا')
  on conflict (name) do nothing;

-- 3) العقود (بين صقور الغد والمنصة)
create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  platform_id uuid references platforms(id) on delete restrict,
  contract_number text not null,
  start_date date not null,
  end_date date,
  commission_rate numeric(5,2), -- نسبة العمولة %
  status text not null check (status in ('active','expired','pending')) default 'active',
  notes text,
  created_at timestamptz default now()
);

-- 4) السيارات
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  plate_number text not null unique,
  make text,
  model text,
  year int,
  status text not null check (status in ('available','in_use','maintenance')) default 'available',
  created_at timestamptz default now()
);

-- 5) المناديب
create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  national_id text,
  platform_id uuid references platforms(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  status text not null check (status in ('active','inactive')) default 'active',
  join_date date default current_date,
  created_at timestamptz default now()
);

-- 6) المخالفات
create table if not exists violations (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  violation_date date not null default current_date,
  amount numeric(10,2) not null default 0,
  description text,
  payment_status text not null check (payment_status in ('paid','unpaid')) default 'unpaid',
  created_at timestamptz default now()
);

-- ============================================
-- Row Level Security
-- ============================================
alter table profiles enable row level security;
alter table platforms enable row level security;
alter table contracts enable row level security;
alter table vehicles enable row level security;
alter table drivers enable row level security;
alter table violations enable row level security;

-- Helper: هل المستخدم الحالي admin؟
create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- profiles: كل مستخدم يشوف بروفايله، الادمن يشوف الكل
create policy "profiles_select" on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles_update_self" on profiles for update using (id = auth.uid());

-- platforms: قراءة للجميع المسجلين، تعديل للادمن بس
create policy "platforms_select" on platforms for select using (auth.role() = 'authenticated');
create policy "platforms_write" on platforms for all using (is_admin());

-- contracts: الادمن بس (بيانات مالية حساسة)
create policy "contracts_select" on contracts for select using (is_admin());
create policy "contracts_write" on contracts for all using (is_admin());

-- vehicles: قراءة للجميع، تعديل للادمن
create policy "vehicles_select" on vehicles for select using (auth.role() = 'authenticated');
create policy "vehicles_write" on vehicles for all using (is_admin());

-- drivers: قراءة للجميع، تعديل للادمن
create policy "drivers_select" on drivers for select using (auth.role() = 'authenticated');
create policy "drivers_write" on drivers for all using (is_admin());

-- violations: قراءة للجميع، الموظف يقدر يضيف مخالفة، الادمن يعدل كل حاجة (زي حالة السداد)
create policy "violations_select" on violations for select using (auth.role() = 'authenticated');
create policy "violations_insert" on violations for insert with check (auth.role() = 'authenticated');
create policy "violations_update" on violations for update using (is_admin());
create policy "violations_delete" on violations for delete using (is_admin());

-- ============================================
-- ملاحظة: أول ما تسوي حساب مستخدم عبر Supabase Auth،
-- لازم تضيف صف ليهو في profiles يدويًا وتحدد role = 'admin' لنفسك:
--
-- insert into profiles (id, full_name, role)
-- values ('USER_UUID_FROM_AUTH', 'اسمك', 'admin');
-- ============================================
