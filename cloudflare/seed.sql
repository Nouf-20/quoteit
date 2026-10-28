-- Generated from database/database.sqlite
PRAGMA foreign_keys = ON;
DELETE FROM quote_likes;
DELETE FROM quotes;
DELETE FROM users;

INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (1, 'خالد العتيبي', 'demo@quoteit.com', 'pbkdf2$10000$PgvA6mA_1kLOIK4INhw5_A$mY3PztKKtE7W-YkmhtEnWaZqJAenYDJHlaxmRYgCrwc', '2026-10-27 09:59:29', '2026-10-27 09:59:29');
INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (2, 'سارة الحربي', 'sara@quoteit.com', 'pbkdf2$10000$Bw9ptzyWnLicBi9qh3TfPA$rKHi6jNaEZNRX1kDt3nnRHN85SNraxlB0M2IJWjeGl8', '2026-10-27 09:59:30', '2026-10-27 09:59:30');
INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (3, 'عبدالله القحطاني', 'abdullah@quoteit.com', 'pbkdf2$10000$8fwo9oj-Kz2wnMMPq9Aegw$T7cZmydwVy30Adj_DNMkBrma8va8EIK5dH4IJC9dtQo', '2026-10-27 09:59:30', '2026-10-27 09:59:30');
INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (4, 'نورة الشهري', 'noura@quoteit.com', 'pbkdf2$10000$w4L01hxyG9Xgkh6FIvfM-g$rvM95G0lzrJ1dRsC_ZnvkbBoKy9JsZm_YQ-cc0pkZSQ', '2026-10-27 09:59:30', '2026-10-27 09:59:30');
INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (5, 'محمد العتيبي', 'mohammed@quoteit.com', 'pbkdf2$10000$SpbPCu4xwllRwk73bD2IkQ$w5O_Ho2YyI3iTjGujqKSYqLD2F6irsABgHd3rb9IZDQ', '2026-10-27 09:59:31', '2026-10-27 09:59:31');
INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (6, 'رغد الزهراني', 'raghad@quoteit.com', 'pbkdf2$10000$ygcmY76yDmGXOiN6bJTcHw$nDKsLx6Zf7tgZaJ1zwPdRWFmLFmCmVM5AUCzkGoVOWs', '2026-10-27 09:59:31', '2026-10-27 09:59:31');
INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (7, 'فاطمة الدوسري', 'fatimah@quoteit.com', 'pbkdf2$10000$GZDEmYr8As_XtYEfdHeCIA$zU2n22I6cxVN2nHjCUjpHu_qWxIYHb4B-FpPE3sogI0', '2026-10-27 09:59:31', '2026-10-27 09:59:31');
INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (8, 'يوسف المطيري', 'yousef@quoteit.com', 'pbkdf2$10000$cSHy5YxKi1Fi7XTXEJtGew$6EnPSoTeS_lnNVdJHX2HdbUm_ldYdMXH7LIR1vBERAY', '2026-10-27 09:59:31', '2026-10-27 09:59:31');

INSERT INTO quotes (id, user_id, content, created_at, updated_at) VALUES (1, 1, 'كلمة المرور القوية هي خط الدفاع الأول عن بياناتك.', '2023-02-14 09:15:00', '2023-02-14 09:15:00');
INSERT INTO quotes (id, user_id, content, created_at, updated_at) VALUES (2, 2, 'فكّر قبل أن تنقر؛ فالتصيّد الإلكتروني يستغل العجلة.', '2023-11-03 14:40:00', '2023-11-03 14:40:00');
INSERT INTO quotes (id, user_id, content, created_at, updated_at) VALUES (3, 3, 'التشفير يحوّل البيانات المسروقة إلى ضجيج لا قيمة له.', '2024-04-22 08:05:00', '2024-04-22 08:05:00');
INSERT INTO quotes (id, user_id, content, created_at, updated_at) VALUES (4, 4, 'حدّث أنظمتك فورًا؛ فالمهاجمون يستغلون ما تتجاهله.', '2024-09-17 19:30:00', '2024-09-17 19:30:00');
INSERT INTO quotes (id, user_id, content, created_at, updated_at) VALUES (5, 5, 'الثقة الصفرية تعني التحقق أولًا، ثم الثقة بحذر.', '2025-01-08 11:20:00', '2025-01-08 11:20:00');
INSERT INTO quotes (id, user_id, content, created_at, updated_at) VALUES (6, 6, 'النسخ الاحتياطي المُختبر درعك في وجه برامج الفدية.', '2025-06-26 16:55:00', '2025-06-26 16:55:00');
INSERT INTO quotes (id, user_id, content, created_at, updated_at) VALUES (7, 7, 'التحقق بخطوتين يجعل كلمات المرور المسروقة أقل فائدة.', '2025-12-11 07:45:00', '2025-12-11 07:45:00');
INSERT INTO quotes (id, user_id, content, created_at, updated_at) VALUES (8, 8, 'الخصوصية ليست سرية؛ بل سيطرة كاملة على بياناتك.', '2026-03-05 21:10:00', '2026-03-05 21:10:00');

INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (1, 1, 3, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (2, 1, 4, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (3, 1, 2, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (4, 1, 8, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (5, 2, 1, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (6, 2, 5, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (7, 2, 6, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (8, 3, 1, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (9, 3, 7, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (10, 3, 4, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (11, 3, 2, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (12, 4, 3, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (13, 4, 1, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (14, 4, 8, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (15, 5, 7, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (16, 5, 6, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (17, 5, 2, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (18, 5, 8, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (19, 6, 1, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (20, 6, 5, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (21, 7, 3, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (22, 7, 1, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (23, 7, 4, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (24, 7, 2, '2026-10-27 09:59:31');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (25, 8, 1, '2026-10-27 09:59:32');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (26, 8, 7, '2026-10-27 09:59:32');
INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (27, 8, 6, '2026-10-27 09:59:32');

-- keep AUTOINCREMENT counters ahead of the imported ids
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence (name, seq) VALUES ('users', (SELECT MAX(id) FROM users));
INSERT INTO sqlite_sequence (name, seq) VALUES ('quotes', (SELECT MAX(id) FROM quotes));
INSERT INTO sqlite_sequence (name, seq) VALUES ('quote_likes', (SELECT MAX(id) FROM quote_likes));
