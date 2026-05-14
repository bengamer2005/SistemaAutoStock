SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'vw_products_movements'
ORDER BY ordinal_position;