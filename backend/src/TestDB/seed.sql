-- ================================================================
-- SEED: SistemaAutoStock — datos de demostración
-- Tema: refaccionaria / autopartes automotrices
--
-- Orden de ejecución (sin romper FKs):
--   1. roles
--   2. users           → roles
--   3. warehouses      (sin dependencias)
--   4. providers       → users (created_by)
--   5. products_brands → users (created_by)
--   6. categories      → categories (parent_id, en dos pasos)
--   7. products        → providers, categories, products_brands, warehouses, users
--   8. products_movements → products, users
--
-- Idempotente: cada INSERT usa WHERE NOT EXISTS; seguro de re-ejecutar.
-- ================================================================


-- 1. ROLES
INSERT INTO roles (roles_id, name, description)
SELECT 1, 'Administrador', 'Acceso total al sistema'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE roles_id = 1);

INSERT INTO roles (roles_id, name, description)
SELECT 2, 'Operador', 'Registra movimientos de inventario'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE roles_id = 2);

INSERT INTO roles (roles_id, name, description)
SELECT 3, 'Consulta', 'Solo lectura del inventario'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE roles_id = 3);


-- 2. USUARIOS DEMO
--    admin@autostock.com    / admin123  → Administrador
--    operador@autostock.com / oper123   → Operador
--    consulta@autostock.com / cons123   → Consulta
INSERT INTO users (name, last_name, email, password, roles_id, active, created_at)
SELECT 'Miguel', 'Torres', 'admin@autostock.com', 'admin123', 1, true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@autostock.com');

INSERT INTO users (name, last_name, email, password, roles_id, active, created_at)
SELECT 'Carlos', 'Ramírez', 'operador@autostock.com', 'oper123', 2, true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'operador@autostock.com');

INSERT INTO users (name, last_name, email, password, roles_id, active, created_at)
SELECT 'Ana', 'Gutiérrez', 'consulta@autostock.com', 'cons123', 3, true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'consulta@autostock.com');


-- 3. ALMACENES (sin dependencias externas)
INSERT INTO warehouses (name, location)
SELECT 'Almacén Principal', 'CDMX — Bodega Central'
WHERE NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'Almacén Principal');

INSERT INTO warehouses (name, location)
SELECT 'Almacén Sucursal Sur', 'Puebla — Sucursal Sur'
WHERE NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'Almacén Sucursal Sur');


-- 4. PROVEEDORES (created_by → users)
INSERT INTO providers (name, description, active, created_by, created_at)
SELECT 'Autopartes del Norte S.A.', 'Mayorista de refacciones originales y alternativas', true,
       (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM providers WHERE name = 'Autopartes del Norte S.A.');

INSERT INTO providers (name, description, active, created_by, created_at)
SELECT 'Distribuidora Mexicana de Refacciones', 'Distribuidor regional con cobertura nacional', true,
       (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM providers WHERE name = 'Distribuidora Mexicana de Refacciones');

INSERT INTO providers (name, description, active, created_by, created_at)
SELECT 'Importaciones AutoPro', 'Importador de marcas europeas y japonesas', true,
       (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM providers WHERE name = 'Importaciones AutoPro');

INSERT INTO providers (name, description, active, created_by, created_at)
SELECT 'Grupo Refaccionario Central', 'Especialista en frenos, suspensión y transmisión', true,
       (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM providers WHERE name = 'Grupo Refaccionario Central');


-- 5. MARCAS (created_by → users)
INSERT INTO products_brands (brand_name, created_by, created_at)
SELECT 'Bosch', (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products_brands WHERE brand_name = 'Bosch');

INSERT INTO products_brands (brand_name, created_by, created_at)
SELECT 'NGK', (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products_brands WHERE brand_name = 'NGK');

INSERT INTO products_brands (brand_name, created_by, created_at)
SELECT 'Monroe', (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products_brands WHERE brand_name = 'Monroe');

INSERT INTO products_brands (brand_name, created_by, created_at)
SELECT 'ACDelco', (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products_brands WHERE brand_name = 'ACDelco');

INSERT INTO products_brands (brand_name, created_by, created_at)
SELECT 'Bendix', (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products_brands WHERE brand_name = 'Bendix');

INSERT INTO products_brands (brand_name, created_by, created_at)
SELECT 'Castrol', (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products_brands WHERE brand_name = 'Castrol');


-- 6a. CATEGORÍAS PADRE (primero, sin parent_id)
INSERT INTO categories (name, description)
SELECT 'Motor', 'Componentes del motor y sistema de lubricación'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Motor');

INSERT INTO categories (name, description)
SELECT 'Frenos', 'Sistema de frenado completo'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Frenos');

INSERT INTO categories (name, description)
SELECT 'Suspensión', 'Amortiguadores, resortes y dirección'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Suspensión');

INSERT INTO categories (name, description)
SELECT 'Electricidad', 'Batería, alternador, bujías y sensores'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Electricidad');

-- 6b. SUBCATEGORÍAS (después de las padre)
INSERT INTO categories (name, description, parent_id)
SELECT 'Filtros', 'Filtros de aceite, aire y combustible',
       (SELECT categories_id FROM categories WHERE name = 'Motor' AND parent_id IS NULL)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Filtros');

INSERT INTO categories (name, description, parent_id)
SELECT 'Transmisión y Embrague', 'Correas, kits de clutch y transmisión',
       (SELECT categories_id FROM categories WHERE name = 'Motor' AND parent_id IS NULL)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Transmisión y Embrague');

INSERT INTO categories (name, description, parent_id)
SELECT 'Pastillas y Discos', 'Pastillas de freno y discos de freno',
       (SELECT categories_id FROM categories WHERE name = 'Frenos' AND parent_id IS NULL)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Pastillas y Discos');


-- 7. PRODUCTOS (15 en total)
--    3 agotados  (stock = 0):          Disco de freno, Amortiguador, Kit de clutch
--    3 bajo mínimo (0 < stock <= min): Pastillas delanteras, Correa, Bomba de agua
--    9 con stock saludable

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Filtro de aceite Bosch Premium', 'Filtro de aceite motor gasolina y diésel, compatibilidad amplia',
  (SELECT providers_id FROM providers WHERE name = 'Autopartes del Norte S.A.'),
  (SELECT categories_id FROM categories WHERE name = 'Filtros'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'Bosch'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Principal'),
  42, 15, 95.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Filtro de aceite Bosch Premium');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Filtro de aire NGK', 'Filtro de alto flujo para carburador e inyección',
  (SELECT providers_id FROM providers WHERE name = 'Distribuidora Mexicana de Refacciones'),
  (SELECT categories_id FROM categories WHERE name = 'Filtros'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'NGK'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Principal'),
  28, 10, 110.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Filtro de aire NGK');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Pastillas de freno delanteras Bendix', 'Juego delantero de alto rendimiento, incluye sensor de desgaste',
  (SELECT providers_id FROM providers WHERE name = 'Importaciones AutoPro'),
  (SELECT categories_id FROM categories WHERE name = 'Pastillas y Discos'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'Bendix'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Principal'),
  3, 8, 380.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pastillas de freno delanteras Bendix');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Disco de freno delantero Monroe', 'Disco ventilado 280mm, par delantero',
  (SELECT providers_id FROM providers WHERE name = 'Importaciones AutoPro'),
  (SELECT categories_id FROM categories WHERE name = 'Pastillas y Discos'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'Monroe'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Principal'),
  0, 4, 650.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Disco de freno delantero Monroe');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Bujías NGK BKR6E (set x4)', 'Bujías de iridio larga duración, set de 4 piezas',
  (SELECT providers_id FROM providers WHERE name = 'Distribuidora Mexicana de Refacciones'),
  (SELECT categories_id FROM categories WHERE name = 'Electricidad'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'NGK'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Principal'),
  35, 12, 320.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bujías NGK BKR6E (set x4)');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Batería ACDelco 12V 60Ah', 'Batería libre de mantenimiento, garantía 18 meses',
  (SELECT providers_id FROM providers WHERE name = 'Autopartes del Norte S.A.'),
  (SELECT categories_id FROM categories WHERE name = 'Electricidad'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'ACDelco'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Principal'),
  14, 5, 1850.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Batería ACDelco 12V 60Ah');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Aceite motor Castrol GTX 20W-50 1L', 'Aceite mineral para motores gasolina alta millaje',
  (SELECT providers_id FROM providers WHERE name = 'Distribuidora Mexicana de Refacciones'),
  (SELECT categories_id FROM categories WHERE name = 'Motor'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'Castrol'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Sucursal Sur'),
  75, 25, 85.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Aceite motor Castrol GTX 20W-50 1L');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Correa de distribución Bosch', 'Correa dentada motor 4 cilindros, incluye tensor',
  (SELECT providers_id FROM providers WHERE name = 'Importaciones AutoPro'),
  (SELECT categories_id FROM categories WHERE name = 'Transmisión y Embrague'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'Bosch'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Principal'),
  2, 5, 420.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Correa de distribución Bosch');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Amortiguador trasero Monroe Gas-Magnum', 'Amortiguador de gas eje trasero, venta por pieza',
  (SELECT providers_id FROM providers WHERE name = 'Grupo Refaccionario Central'),
  (SELECT categories_id FROM categories WHERE name = 'Suspensión'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'Monroe'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Sucursal Sur'),
  0, 6, 780.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Amortiguador trasero Monroe Gas-Magnum');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Bomba de agua ACDelco', 'Bomba de agua original motor gasolina 1.6-2.0L',
  (SELECT providers_id FROM providers WHERE name = 'Grupo Refaccionario Central'),
  (SELECT categories_id FROM categories WHERE name = 'Motor'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'ACDelco'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Principal'),
  1, 4, 690.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bomba de agua ACDelco');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Pastillas de freno traseras Bendix', 'Juego trasero para freno de tambor y disco',
  (SELECT providers_id FROM providers WHERE name = 'Importaciones AutoPro'),
  (SELECT categories_id FROM categories WHERE name = 'Pastillas y Discos'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'Bendix'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Sucursal Sur'),
  18, 6, 310.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pastillas de freno traseras Bendix');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Kit de clutch completo Bosch', 'Disco, prensa y collarín para motor 1.4-1.8L',
  (SELECT providers_id FROM providers WHERE name = 'Grupo Refaccionario Central'),
  (SELECT categories_id FROM categories WHERE name = 'Transmisión y Embrague'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'Bosch'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Principal'),
  0, 3, 2200.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kit de clutch completo Bosch');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Sensor de oxígeno Bosch', 'Sensor lambda universal 4 cables, rosca M18 x 1.5',
  (SELECT providers_id FROM providers WHERE name = 'Autopartes del Norte S.A.'),
  (SELECT categories_id FROM categories WHERE name = 'Electricidad'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'Bosch'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Principal'),
  11, 4, 560.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sensor de oxígeno Bosch');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Líquido de frenos Castrol DOT4 500ml', 'Líquido de frenos alta temperatura, envase 500ml',
  (SELECT providers_id FROM providers WHERE name = 'Distribuidora Mexicana de Refacciones'),
  (SELECT categories_id FROM categories WHERE name = 'Frenos'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'Castrol'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Sucursal Sur'),
  50, 20, 75.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Líquido de frenos Castrol DOT4 500ml');

INSERT INTO products (name, description, providers_id, categories_id, products_brands_id, warehouses_id, stock, min_stock, unit_price, active, created_by, created_at)
SELECT 'Alternador remanufacturado Bosch 70A', 'Alternador remanufacturado garantía 12 meses, 12V 70A',
  (SELECT providers_id FROM providers WHERE name = 'Autopartes del Norte S.A.'),
  (SELECT categories_id FROM categories WHERE name = 'Electricidad'),
  (SELECT products_brands_id FROM products_brands WHERE brand_name = 'Bosch'),
  (SELECT warehouses_id FROM warehouses WHERE name = 'Almacén Sucursal Sur'),
  6, 2, 1450.00, true,
  (SELECT users_id FROM users WHERE email = 'admin@autostock.com'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Alternador remanufacturado Bosch 70A');


-- 8. MOVIMIENTOS (20 registros, últimos 60 días, registrados por Carlos el Operador)

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Filtro de aceite Bosch Premium'),
       50, 'ENTRY', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '58 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Filtro de aceite Bosch Premium');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Filtro de aceite Bosch Premium'),
       8, 'EXIT', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '12 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Filtro de aceite Bosch Premium');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Bujías NGK BKR6E (set x4)'),
       40, 'ENTRY', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '50 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Bujías NGK BKR6E (set x4)');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Bujías NGK BKR6E (set x4)'),
       5, 'EXIT', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '9 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Bujías NGK BKR6E (set x4)');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Pastillas de freno delanteras Bendix'),
       12, 'ENTRY', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '45 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Pastillas de freno delanteras Bendix');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Pastillas de freno delanteras Bendix'),
       9, 'EXIT', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '6 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Pastillas de freno delanteras Bendix');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Disco de freno delantero Monroe'),
       6, 'ENTRY', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '55 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Disco de freno delantero Monroe');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Disco de freno delantero Monroe'),
       6, 'EXIT', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '4 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Disco de freno delantero Monroe');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Batería ACDelco 12V 60Ah'),
       18, 'ENTRY', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '40 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Batería ACDelco 12V 60Ah');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Batería ACDelco 12V 60Ah'),
       4, 'EXIT', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '15 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Batería ACDelco 12V 60Ah');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Aceite motor Castrol GTX 20W-50 1L'),
       100, 'ENTRY', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '35 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Aceite motor Castrol GTX 20W-50 1L');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Aceite motor Castrol GTX 20W-50 1L'),
       25, 'EXIT', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '5 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Aceite motor Castrol GTX 20W-50 1L');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Amortiguador trasero Monroe Gas-Magnum'),
       8, 'ENTRY', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '60 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Amortiguador trasero Monroe Gas-Magnum');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Amortiguador trasero Monroe Gas-Magnum'),
       8, 'EXIT', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '3 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Amortiguador trasero Monroe Gas-Magnum');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Sensor de oxígeno Bosch'),
       15, 'ENTRY', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '28 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Sensor de oxígeno Bosch');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Sensor de oxígeno Bosch'),
       4, 'EXIT', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '7 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Sensor de oxígeno Bosch');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Líquido de frenos Castrol DOT4 500ml'),
       60, 'ENTRY', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '22 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Líquido de frenos Castrol DOT4 500ml');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Líquido de frenos Castrol DOT4 500ml'),
       10, 'EXIT', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Líquido de frenos Castrol DOT4 500ml');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Filtro de aire NGK'),
       30, 'ENTRY', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '18 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Filtro de aire NGK');

INSERT INTO products_movements (products_id, quantity, movement_type, created_by, created_at)
SELECT (SELECT products_id FROM products WHERE name = 'Filtro de aire NGK'),
       2, 'EXIT', (SELECT users_id FROM users WHERE email = 'operador@autostock.com'), NOW() - INTERVAL '1 days'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Filtro de aire NGK');
