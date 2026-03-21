-- TONY STARK ACCOUNT -- 
-- 1) Insert new account
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- 2) Modify Tony Stark record to change account_type to 'Admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- 3) Delete Tony Stark record from db
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';
-- INVENTORY --
-- 4) Modify 'GM Hummer' record to read 'a huge interior' instead of 'small interiors'
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- 5) Select the make, model, and classification fields for "Sport" category
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- 6) Update all records in inventory table to add "/vehicles" to middle of file path
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');