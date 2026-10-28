<?php

namespace Database\Seeders;

use App\Models\Quote;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with a demo account and Arabic cybersecurity quotes.
     */
    public function run(): void
    {
        $users = [
            'demo@quoteit.com' => 'خالد العتيبي',
            'sara@quoteit.com' => 'سارة الحربي',
            'abdullah@quoteit.com' => 'عبدالله القحطاني',
            'noura@quoteit.com' => 'نورة الشهري',
            'mohammed@quoteit.com' => 'محمد العتيبي',
            'raghad@quoteit.com' => 'رغد الزهراني',
            'fatimah@quoteit.com' => 'فاطمة الدوسري',
            'yousef@quoteit.com' => 'يوسف المطيري',
        ];

        foreach ($users as $email => $name) {
            User::firstOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => 'password123']
            );
        }

        $quotes = [
            [
                'content' => 'كلمة المرور القوية هي خط الدفاع الأول عن بياناتك.',
                'author' => 'demo@quoteit.com',
                'date' => '2023-02-14 09:15:00',
                'likes' => ['sara@quoteit.com', 'abdullah@quoteit.com', 'noura@quoteit.com', 'yousef@quoteit.com'],
            ],
            [
                'content' => 'فكّر قبل أن تنقر؛ فالتصيّد الإلكتروني يستغل العجلة.',
                'author' => 'sara@quoteit.com',
                'date' => '2023-11-03 14:40:00',
                'likes' => ['demo@quoteit.com', 'mohammed@quoteit.com', 'raghad@quoteit.com'],
            ],
            [
                'content' => 'التشفير يحوّل البيانات المسروقة إلى ضجيج لا قيمة له.',
                'author' => 'abdullah@quoteit.com',
                'date' => '2024-04-22 08:05:00',
                'likes' => ['demo@quoteit.com', 'sara@quoteit.com', 'noura@quoteit.com', 'fatimah@quoteit.com'],
            ],
            [
                'content' => 'حدّث أنظمتك فورًا؛ فالمهاجمون يستغلون ما تتجاهله.',
                'author' => 'noura@quoteit.com',
                'date' => '2024-09-17 19:30:00',
                'likes' => ['demo@quoteit.com', 'abdullah@quoteit.com', 'yousef@quoteit.com'],
            ],
            [
                'content' => 'الثقة الصفرية تعني التحقق أولًا، ثم الثقة بحذر.',
                'author' => 'mohammed@quoteit.com',
                'date' => '2025-01-08 11:20:00',
                'likes' => ['sara@quoteit.com', 'raghad@quoteit.com', 'fatimah@quoteit.com', 'yousef@quoteit.com'],
            ],
            [
                'content' => 'النسخ الاحتياطي المُختبر درعك في وجه برامج الفدية.',
                'author' => 'raghad@quoteit.com',
                'date' => '2025-06-26 16:55:00',
                'likes' => ['demo@quoteit.com', 'mohammed@quoteit.com'],
            ],
            [
                'content' => 'التحقق بخطوتين يجعل كلمات المرور المسروقة أقل فائدة.',
                'author' => 'fatimah@quoteit.com',
                'date' => '2025-12-11 07:45:00',
                'likes' => ['demo@quoteit.com', 'sara@quoteit.com', 'noura@quoteit.com', 'abdullah@quoteit.com'],
            ],
            [
                'content' => 'الخصوصية ليست سرية؛ بل سيطرة كاملة على بياناتك.',
                'author' => 'yousef@quoteit.com',
                'date' => '2026-03-05 21:10:00',
                'likes' => ['demo@quoteit.com', 'raghad@quoteit.com', 'fatimah@quoteit.com'],
            ],
        ];

        foreach ($quotes as $data) {
            $quote = Quote::firstOrCreate(
                ['content' => $data['content']],
                ['user_id' => User::where('email', $data['author'])->value('id')]
            );

            $quote->forceFill([
                'created_at' => Carbon::parse($data['date']),
                'updated_at' => Carbon::parse($data['date']),
            ])->saveQuietly();

            $quote->likes()->syncWithoutDetaching(
                User::whereIn('email', $data['likes'])->pluck('id')->all()
            );
        }
    }
}
