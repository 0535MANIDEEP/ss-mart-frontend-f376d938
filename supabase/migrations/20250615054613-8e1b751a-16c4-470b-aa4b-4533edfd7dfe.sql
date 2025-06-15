
-- 1. Create wishlists table
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can see only their own wishlist entries
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlists
  FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Policy: Users can add to their own wishlist
CREATE POLICY "Users can insert their own wishlist"
  ON public.wishlists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Users can remove their own wishlist entries
CREATE POLICY "Users can delete their own wishlist"
  ON public.wishlists
  FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Policy: Users can update wishlist (not required, but added for future-proofing)
CREATE POLICY "Users can update their own wishlist"
  ON public.wishlists
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 7. Make sure unique wishlist entry per user and product
CREATE UNIQUE INDEX unique_wishlist_user_product ON public.wishlists(user_id, product_id);
