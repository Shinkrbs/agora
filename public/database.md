-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.candidates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  position_id uuid NOT NULL,
  partylist_id uuid,
  first_name text NOT NULL DEFAULT ''::text,
  last_name text NOT NULL DEFAULT ''::text,
  middle_name text,
  suffix text,
  image_url text NOT NULL DEFAULT ''::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  platform json,
  CONSTRAINT candidates_pkey PRIMARY KEY (id),
  CONSTRAINT candidates_partylist_id_fkey FOREIGN KEY (partylist_id) REFERENCES public.partylists(id),
  CONSTRAINT candidates_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(id)
);
CREATE TABLE public.election_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  election_id uuid NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  receipt_url text NOT NULL DEFAULT ''::text,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text])),
  verified_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT election_payments_pkey PRIMARY KEY (id),
  CONSTRAINT election_payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT election_payments_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT election_payments_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.election_sessions(id),
  CONSTRAINT election_payments_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id)
);
CREATE TABLE public.election_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT ''::text,
  organization_id uuid NOT NULL,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  status text NOT NULL DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'scheduled'::text, 'active'::text, 'completed'::text, 'cancelled'::text, 'archived'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT election_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT election_sessions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);
CREATE TABLE public.organization_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'owner'::text,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  kicked_at timestamp with time zone,
  CONSTRAINT organization_members_pkey PRIMARY KEY (id),
  CONSTRAINT organization_members_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT organization_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.organization_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  receipt_url text NOT NULL DEFAULT ''::text,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text])),
  verified_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT organization_payments_pkey PRIMARY KEY (id),
  CONSTRAINT organization_payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT organization_payments_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id),
  CONSTRAINT organization_payments_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id)
);
CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT ''::text,
  shorthand_name text NOT NULL DEFAULT ''::text,
  invite_code text NOT NULL DEFAULT ''::text UNIQUE,
  approval_status text NOT NULL DEFAULT 'pending'::text CHECK (approval_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  logo_url text NOT NULL DEFAULT ''::text,
  CONSTRAINT organizations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.partylists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  election_id uuid NOT NULL,
  name text NOT NULL DEFAULT ''::text,
  shorthand_name text NOT NULL DEFAULT ''::text,
  description text NOT NULL DEFAULT ''::text,
  logo_url text NOT NULL DEFAULT ''::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT partylists_pkey PRIMARY KEY (id),
  CONSTRAINT partylists_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.election_sessions(id)
);
CREATE TABLE public.positions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  election_id uuid NOT NULL,
  name text NOT NULL DEFAULT ''::text,
  seat_count bigint NOT NULL DEFAULT '1'::bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT positions_pkey PRIMARY KEY (id),
  CONSTRAINT positions_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.election_sessions(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  username text NOT NULL DEFAULT ''::text,
  email text NOT NULL DEFAULT ''::text,
  role text NOT NULL DEFAULT 'admin'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  first_name text NOT NULL DEFAULT ''::text,
  last_name text NOT NULL DEFAULT ''::text,
  middle_name text,
  suffix text,
  avatar_url text NOT NULL DEFAULT ''::text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.voters (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  election_id uuid NOT NULL,
  student_id text NOT NULL DEFAULT ''::text,
  email text NOT NULL DEFAULT ''::text,
  voting_code text NOT NULL DEFAULT ''::text UNIQUE,
  code_status text NOT NULL DEFAULT 'unused'::text CHECK (code_status = ANY (ARRAY['unused'::text, 'used'::text, 'revoked'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT voters_pkey PRIMARY KEY (id),
  CONSTRAINT voters_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.election_sessions(id)
);
CREATE TABLE public.votes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  voter_id uuid NOT NULL,
  candidate_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT votes_pkey PRIMARY KEY (id),
  CONSTRAINT votes_voter_id_fkey FOREIGN KEY (voter_id) REFERENCES public.voters(id),
  CONSTRAINT votes_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id)
);