# Vortiv.id storefront

Vite + React storefront deployed to GitHub Pages. Supabase is the optional backend for products, admin authentication and image storage.

## Frontend configuration

Create the GitHub Actions repository secrets:

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase publishable/anon key (never the service-role key)

The same values can be placed in a local `.env` file for development. `.env` is ignored by Git.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/202611240001_vortiv_storefront.sql` in the SQL Editor.
3. Create the intended admin user in Authentication.
4. Grant that user the server-managed app metadata role in the SQL Editor, replacing the email:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'YOUR_ADMIN_EMAIL';
   ```

   Do **not** set the role in user metadata; the database policies trust app metadata only. Use a unique, strong admin password and enable MFA in Supabase Auth for the admin account. MFA enforcement in the app/RLS is not yet configured.
5. Add the two GitHub Actions secrets above, then rerun the Pages workflow.
6. Open the website footer's **Admin** link and sign in with the admin account.

## Admin

- CRUD products and categories
- Publish/unpublish products
- Upload product photos to the public `product-images` bucket (JPEG, PNG, WebP; max 5 MB)
- Product rows and storage uploads are protected by Supabase RLS policies

## Stock photo note\n\nThe initial lifestyle photos use Pexels stock imagery of streetwear models photographed in Bandung. Replace these with Vortiv's own product/model photos when available.\n\n## Currency

The storefront supports USD and IDR. The conversion rate is fetched from Frankfurter's public endpoint. A fallback approximate rate is used if the endpoint is unavailable.

## Notes

Checkout/payment, orders, newsletter delivery, and customer accounts are not yet connected to production services. Product display and the admin catalog are ready once Supabase is configured.
