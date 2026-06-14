-- ============================================================================
--  Villa Elbling — Full Database Setup Script
-- ============================================================================
--  Purpose: Recreate the complete `villa_elbling` database on a fresh machine.
--  Usage  : Create an empty database first, then run this whole file against it.
--
--           In pgAdmin:
--             1. Right-click "Databases" -> Create -> Database...
--                Name it:  villa_elbling   (then Save)
--             2. Click the new villa_elbling DB, open the Query Tool
--             3. Open this file (or paste it) and Execute (F5)
--
--           In psql / PowerShell:
--             createdb -U postgres villa_elbling
--             psql -U postgres -d villa_elbling -f villa_elbling_setup.sql
--
--  Notes:
--    * Generated columns (price_with_breakfast, nights, net_revenue) are
--      computed automatically by Postgres and are NOT inserted.
--    * Transactional tables (bookings, guests, blocked_dates, channels,
--      channel_bookings, audit_log, sessions) start empty — they fill as the
--      app is used.
--    * Seed data is provided for `rooms` (the 7 rooms) and `users` (the admin
--      login) so the app is usable immediately after setup.
-- ============================================================================

-- Run everything in one transaction so a failure rolls back cleanly.
BEGIN;

-- Requires the pgcrypto extension for gen_random_uuid().
-- (Built in on PostgreSQL 13+, but create explicitly to be safe.)
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ----------------------------------------------------------------------------
--  1. ENUM TYPES
-- ----------------------------------------------------------------------------

CREATE TYPE public.audit_action AS ENUM (
    'create', 'update', 'delete', 'login', 'logout', 'sync'
);

CREATE TYPE public.booking_source AS ENUM (
    'website', 'booking_com', 'phone', 'email', 'walk_in'
);

CREATE TYPE public.booking_status AS ENUM (
    'pending', 'confirmed', 'cancelled', 'no_show', 'completed'
);

CREATE TYPE public.channel_name AS ENUM (
    'booking_com', 'expedia', 'airbnb', 'direct'
);

CREATE TYPE public.channel_sync_status AS ENUM (
    'synced', 'pending', 'failed', 'cancelled'
);

CREATE TYPE public.extra_bed_tier AS ENUM (
    'none', 'child_0_5', 'child_6_15', 'adult_16'
);

CREATE TYPE public.room_status AS ENUM (
    'active', 'inactive', 'maintenance'
);

CREATE TYPE public.room_type AS ENUM (
    'suite', 'double', 'single', 'family'
);

CREATE TYPE public.sync_status AS ENUM (
    'connected', 'disconnected', 'error', 'pending'
);

CREATE TYPE public.user_role AS ENUM (
    'admin', 'staff'
);


-- ----------------------------------------------------------------------------
--  2. TRIGGER FUNCTION (auto-updates updated_at on row changes)
-- ----------------------------------------------------------------------------

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- ----------------------------------------------------------------------------
--  3. TABLES
-- ----------------------------------------------------------------------------

-- users -----------------------------------------------------------------------
CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(150) NOT NULL,
    role public.user_role DEFAULT 'staff'::public.user_role NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username)
);

-- rooms -----------------------------------------------------------------------
CREATE TABLE public.rooms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    room_number smallint NOT NULL,
    name character varying(100) NOT NULL,
    type public.room_type NOT NULL,
    standard_occupancy smallint NOT NULL,
    occupancy_note character varying(100),
    max_guests smallint NOT NULL,
    price_without_breakfast numeric(10,2) NOT NULL,
    breakfast_price numeric(10,2) NOT NULL,
    price_with_breakfast numeric(10,2) GENERATED ALWAYS AS ((price_without_breakfast + breakfast_price)) STORED,
    extra_bed_allowed boolean DEFAULT false NOT NULL,
    description text,
    status public.room_status DEFAULT 'active'::public.room_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT rooms_pkey PRIMARY KEY (id),
    CONSTRAINT rooms_room_number_key UNIQUE (room_number)
);

-- guests ----------------------------------------------------------------------
CREATE TABLE public.guests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    address text,
    notes text,
    total_stays smallint DEFAULT 0 NOT NULL,
    first_booking_at timestamp with time zone,
    last_booking_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT guests_pkey PRIMARY KEY (id),
    CONSTRAINT guests_email_key UNIQUE (email)
);

-- bookings --------------------------------------------------------------------
CREATE TABLE public.bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_reference character varying(20) NOT NULL,
    room_id uuid NOT NULL,
    guest_id uuid NOT NULL,
    check_in date NOT NULL,
    check_out date NOT NULL,
    nights smallint GENERATED ALWAYS AS ((check_out - check_in)) STORED,
    adults smallint DEFAULT 1 NOT NULL,
    children smallint DEFAULT 0 NOT NULL,
    price_per_night numeric(10,2) NOT NULL,
    breakfast_included boolean DEFAULT false NOT NULL,
    breakfast_price numeric(10,2) DEFAULT 0.00 NOT NULL,
    total_price numeric(10,2) NOT NULL,
    commission numeric(5,2) DEFAULT 0.00 NOT NULL,
    net_revenue numeric(10,2) GENERATED ALWAYS AS ((total_price - ((total_price * commission) / (100)::numeric))) STORED,
    source public.booking_source DEFAULT 'website'::public.booking_source NOT NULL,
    status public.booking_status DEFAULT 'pending'::public.booking_status NOT NULL,
    special_requests text,
    internal_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    extra_bed_tier public.extra_bed_tier DEFAULT 'none'::public.extra_bed_tier NOT NULL,
    extra_bed_price numeric(10,2) DEFAULT 0.00 NOT NULL,
    CONSTRAINT bookings_pkey PRIMARY KEY (id),
    CONSTRAINT bookings_booking_reference_key UNIQUE (booking_reference),
    CONSTRAINT chk_adults_positive CHECK ((adults >= 1)),
    CONSTRAINT chk_checkout_after_checkin CHECK ((check_out > check_in)),
    CONSTRAINT chk_children_non_negative CHECK ((children >= 0)),
    CONSTRAINT chk_commission_range CHECK (((commission >= (0)::numeric) AND (commission <= (100)::numeric))),
    CONSTRAINT chk_price_non_negative CHECK (((price_per_night >= (0)::numeric) AND (total_price >= (0)::numeric))),
    CONSTRAINT bookings_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id),
    CONSTRAINT bookings_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES public.guests(id)
);

-- blocked_dates ---------------------------------------------------------------
CREATE TABLE public.blocked_dates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    room_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    reason character varying(255),
    blocked_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT blocked_dates_pkey PRIMARY KEY (id),
    CONSTRAINT chk_blocked_end_after_start CHECK ((end_date > start_date)),
    CONSTRAINT blocked_dates_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id),
    CONSTRAINT fk_blocked_dates_user FOREIGN KEY (blocked_by) REFERENCES public.users(id) ON DELETE SET NULL
);

-- channels --------------------------------------------------------------------
CREATE TABLE public.channels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name public.channel_name NOT NULL,
    display_name character varying(100) NOT NULL,
    api_key text,
    property_id character varying(100),
    is_active boolean DEFAULT false NOT NULL,
    sync_status public.sync_status DEFAULT 'disconnected'::public.sync_status NOT NULL,
    last_synced_at timestamp with time zone,
    sync_error text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT channels_pkey PRIMARY KEY (id),
    CONSTRAINT channels_name_key UNIQUE (name)
);

-- channel_bookings ------------------------------------------------------------
CREATE TABLE public.channel_bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    channel_id uuid NOT NULL,
    external_booking_id character varying(100) NOT NULL,
    raw_payload jsonb,
    sync_status public.channel_sync_status DEFAULT 'pending'::public.channel_sync_status NOT NULL,
    last_synced_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT channel_bookings_pkey PRIMARY KEY (id),
    CONSTRAINT uq_channel_external UNIQUE (channel_id, external_booking_id),
    CONSTRAINT channel_bookings_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id),
    CONSTRAINT channel_bookings_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id)
);

-- sessions --------------------------------------------------------------------
CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token character varying(255) NOT NULL,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    last_used_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (id),
    CONSTRAINT sessions_token_key UNIQUE (token),
    CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- audit_log -------------------------------------------------------------------
CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    action public.audit_action NOT NULL,
    table_name character varying(50) NOT NULL,
    record_id uuid,
    old_values jsonb,
    new_values jsonb,
    performed_by uuid,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT audit_log_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.users(id) ON DELETE SET NULL
);


-- ----------------------------------------------------------------------------
--  4. VIEW: availability (computed from bookings + blocked_dates)
-- ----------------------------------------------------------------------------

CREATE VIEW public.availability AS
 SELECT b.room_id,
    (d.date)::date AS blocked_date,
    'booking'::text AS block_type,
    b.id AS reference_id,
    b.booking_reference AS reference_label
   FROM (public.bookings b
     CROSS JOIN LATERAL generate_series((b.check_in)::timestamp without time zone, (b.check_out - '1 day'::interval), '1 day'::interval) d(date))
  WHERE (b.status = ANY (ARRAY['confirmed'::public.booking_status, 'pending'::public.booking_status]))
UNION ALL
 SELECT bd.room_id,
    (d.date)::date AS blocked_date,
    'blocked'::text AS block_type,
    bd.id AS reference_id,
    COALESCE(bd.reason, 'Blocked'::character varying) AS reference_label
   FROM (public.blocked_dates bd
     CROSS JOIN LATERAL generate_series((bd.start_date)::timestamp without time zone, (bd.end_date - '1 day'::interval), '1 day'::interval) d(date));


-- ----------------------------------------------------------------------------
--  5. INDEXES
-- ----------------------------------------------------------------------------

CREATE INDEX idx_audit_log_created_at ON public.audit_log USING btree (created_at DESC);
CREATE INDEX idx_audit_log_performed_by ON public.audit_log USING btree (performed_by);
CREATE INDEX idx_audit_log_record_id ON public.audit_log USING btree (record_id);
CREATE INDEX idx_audit_log_table_name ON public.audit_log USING btree (table_name);

CREATE INDEX idx_blocked_dates_date_range ON public.blocked_dates USING btree (room_id, start_date, end_date);
CREATE INDEX idx_blocked_dates_room_id ON public.blocked_dates USING btree (room_id);
CREATE INDEX idx_blocked_dates_start_end ON public.blocked_dates USING btree (start_date, end_date);

CREATE INDEX idx_bookings_booking_reference ON public.bookings USING btree (booking_reference);
CREATE INDEX idx_bookings_check_in ON public.bookings USING btree (check_in);
CREATE INDEX idx_bookings_check_out ON public.bookings USING btree (check_out);
CREATE INDEX idx_bookings_checkin_checkout ON public.bookings USING btree (check_in, check_out) WHERE (status = ANY (ARRAY['confirmed'::public.booking_status, 'pending'::public.booking_status]));
CREATE INDEX idx_bookings_date_range ON public.bookings USING btree (room_id, check_in, check_out) WHERE (status <> 'cancelled'::public.booking_status);
CREATE INDEX idx_bookings_guest_id ON public.bookings USING btree (guest_id);
CREATE INDEX idx_bookings_room_id ON public.bookings USING btree (room_id);
CREATE INDEX idx_bookings_source ON public.bookings USING btree (source);
CREATE INDEX idx_bookings_status ON public.bookings USING btree (status);

CREATE INDEX idx_channel_bookings_booking_id ON public.channel_bookings USING btree (booking_id);
CREATE INDEX idx_channel_bookings_channel_id ON public.channel_bookings USING btree (channel_id);
CREATE INDEX idx_channel_bookings_external_booking_id ON public.channel_bookings USING btree (external_booking_id);
CREATE INDEX idx_channel_bookings_sync_status ON public.channel_bookings USING btree (sync_status);

CREATE INDEX idx_guests_email ON public.guests USING btree (email);
CREATE INDEX idx_guests_full_name ON public.guests USING btree (full_name);

CREATE INDEX idx_rooms_status ON public.rooms USING btree (status);
CREATE INDEX idx_rooms_type ON public.rooms USING btree (type);

CREATE INDEX idx_sessions_expires ON public.sessions USING btree (expires_at);
CREATE INDEX idx_sessions_token ON public.sessions USING btree (token);
CREATE INDEX idx_sessions_user_id ON public.sessions USING btree (user_id);

CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_username ON public.users USING btree (username);


-- ----------------------------------------------------------------------------
--  6. TRIGGERS (auto-update updated_at)
-- ----------------------------------------------------------------------------

CREATE TRIGGER trg_blocked_dates_updated_at BEFORE UPDATE ON public.blocked_dates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_channel_bookings_updated_at BEFORE UPDATE ON public.channel_bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_channels_updated_at BEFORE UPDATE ON public.channels FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_guests_updated_at BEFORE UPDATE ON public.guests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ----------------------------------------------------------------------------
--  7. SEED DATA
-- ----------------------------------------------------------------------------
--  price_with_breakfast is generated and intentionally omitted.
--  created_at / updated_at are left to their defaults (now()).

-- Admin user ------------------------------------------------------------------
-- Login: username "gundel". The password_hash below is a bcrypt hash; it lets
-- teammates log in with the same password the owner uses. (The plaintext
-- password is not stored here — only the one-way hash.)
INSERT INTO public.users (id, username, email, password_hash, full_name, role, is_active) VALUES
  ('c280e741-6b67-4958-a59f-5c87c472e575', 'gundel', 'info@hotel-villa-elbling.de', '$2a$10$vAt9IdGfWTTVXoGA8/20r.pyp7o0DqKwDGIMBUrO1GQ7swMU2BkWS', 'Gundel Woite', 'admin', true);

-- Rooms (7) -------------------------------------------------------------------
INSERT INTO public.rooms
  (id, room_number, name, type, standard_occupancy, occupancy_note, max_guests, price_without_breakfast, breakfast_price, extra_bed_allowed, description, status) VALUES
  ('29984446-a42d-4636-94b1-250cc0fad9a6', 1, 'Hochzeitssuite Gutedel',     'suite',  2, NULL,              2, 150.00, 26.00, false, NULL,                                  'active'),
  ('9056d794-5fc5-4d2d-b851-2f31ddb5801a', 3, 'Doppelzimmer Bacchus',       'double', 2, NULL,              2, 150.00, 26.00, false, 'Cozy double room with vineyard views.', 'active'),
  ('facc9a89-689b-4599-a459-3a63af82c279', 4, 'Suite Riesling',             'suite',  2, NULL,              3, 134.00, 26.00, true,  NULL,                                  'active'),
  ('623f96f4-3d2a-4ef9-b99c-f57c3eee48f5', 5, 'Doppelzimmer Scheurebe',     'double', 2, NULL,              2, 109.00, 26.00, false, NULL,                                  'active'),
  ('86850af7-e194-4128-b798-38b8a328e07e', 6, 'Familiensuite Burgunder',    'suite',  3, '2 Adults, 1 Kid', 4, 134.00, 39.00, true,  NULL,                                  'active'),
  ('553650f7-f8e6-4710-89ce-261cd131c04b', 7, 'Einzelzimmer Rivaner',       'single', 1, NULL,              1,  76.00, 13.00, false, NULL,                                  'active'),
  ('dc32e4e3-a2b4-4c10-88b5-ec56c17df753', 8, 'Suite Regent',               'suite',  2, NULL,              3, 134.00, 26.00, true,  NULL,                                  'active');


COMMIT;

-- ============================================================================
--  Done. Verify with:
--    SELECT room_number, name, price_without_breakfast, breakfast_price,
--           price_with_breakfast FROM public.rooms ORDER BY room_number;
--    SELECT username, role FROM public.users;
--  Expected: 7 rooms (price_with_breakfast auto-computed), 1 admin user.
-- ============================================================================
