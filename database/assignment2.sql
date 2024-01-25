--Insert Tony stark Data
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
--Make Tony Stark an Admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
--Delete Tony Stark
DELETE FROM public.account
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
--GM Hummer Huge interior
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
--Inner Join
SELECT inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM public.inventory
    INNER JOIN public.classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sports';
--Vehicles File Path
UPDATE public.inventory
SET inv_image = CONCAT(
        '/images/vehicles/',
        SUBSTRING(
            inv_image
            FROM 9
        )
    ),
    inv_thumbnail = CONCAT(
        '/images/vehicles/',
        SUBSTRING(
            inv_thumbnail
            FROM 9
        )
    );