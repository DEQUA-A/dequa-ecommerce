import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const dbUrl = `file:///${path.resolve("dev.db").replace(/\\/g, "/")}`;
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

const productSeedData = [
  {
    name: "هدفون بی‌سیم سونی",
    slug: "sony-wireless-headphones",
    description: "کیفیت صدای عالی با قابلیت حذف نویز فعال. باتری با دوام ۳۰ ساعت.",
    price: 8500000,
    discountPrice: 7990000,
    stock: 15,
    featured: true,
    categorySlug: "electronics",
    brandSlug: "sony",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  },
  {
    name: "ساعت هوشمند سامسونگ",
    slug: "samsung-smart-watch",
    description: "مانیتورینگ سلامت، ضربان قلب، اکسیژن خون و خواب. مقاوم در برابر آب.",
    price: 12500000,
    stock: 10,
    featured: true,
    categorySlug: "electronics",
    brandSlug: "samsung",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  },
  {
    name: "کفش ورزشی نایکی",
    slug: "nike-running-shoes",
    description: "کفی نرم و تنفس‌پذیر. مناسب برای دویدن و ورزش روزانه.",
    price: 4500000,
    stock: 20,
    featured: true,
    categorySlug: "sport",
    brandSlug: "nike",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  },
  {
    name: "کیف چرم دست‌دوز",
    slug: "leather-handbag",
    description: "چرم طبیعی با دوخت سنتی و طراحی مدرن. مناسب برای استفاده روزانه.",
    price: 3200000,
    discountPrice: 2890000,
    stock: 8,
    featured: true,
    categorySlug: "fashion",
    brandSlug: "samsung",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  },
  {
    name: "جاروبرقی رباتیک",
    slug: "robot-vacuum",
    description: "تمیزکننده هوشمند با قابلیت برنامه‌ریزی و نقشه‌برداری از محیط.",
    price: 18500000,
    stock: 5,
    featured: false,
    categorySlug: "home",
    brandSlug: "samsung",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
  },
  {
    name: "پاوربانک ۲۰۰۰۰ میلی‌آمپر",
    slug: "powerbank-20000",
    description: "شارژ سریع با ظرفیت بالا. قابلیت شارژ همزمان دو دستگاه.",
    price: 1850000,
    stock: 25,
    featured: false,
    categorySlug: "electronics",
    brandSlug: "sony",
    image: "https://images.unsplash.com/photo-1609592425055-2c1e8cf4d273?w=600&q=80",
  },
  {
    name: "عینک آفتابی شیک",
    slug: "stylish-sunglasses",
    description: "عدسی پلاریزه با فریم سبک و مقاوم. محافظت کامل در برابر اشعه UV.",
    price: 2500000,
    discountPrice: 1990000,
    stock: 12,
    featured: false,
    categorySlug: "fashion",
    brandSlug: "apple",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
  },
  {
    name: "کتابخوان الکترونیکی",
    slug: "e-reader",
    description: "صفحه نمایش E-Ink با نور داخلی. مناسب برای مطالعه طولانی مدت.",
    price: 9500000,
    stock: 7,
    featured: true,
    categorySlug: "electronics",
    brandSlug: "samsung",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@shop.com" },
    update: {},
    create: { name: "مدیر سایت", email: "admin@shop.com", password: hashedPassword, role: "ADMIN" },
  });

  await prisma.user.upsert({
    where: { email: "user@shop.com" },
    update: {},
    create: {
      name: "کاربر آزمایشی", email: "user@shop.com",
      phone: "۰۹۱۲۱۲۳۴۵۶۷", address: "تهران، خیابان آزادی",
      password: hashedPassword, role: "USER",
    },
  });

  const categories = [
    { name: "الکترونیک", slug: "electronics", description: "محصولات الکترونیکی و دیجیتال" },
    { name: "مد و پوشاک", slug: "fashion", description: "لباس، کیف، کفش و اکسسوری" },
    { name: "خانه و آشپزخانه", slug: "home", description: "لوازم خانگی و آشپزخانه" },
    { name: "ورزش و سفر", slug: "sport", description: "تجهیزات ورزشی و سفر" },
  ];
  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug }, update: {}, create: c,
    });
    catMap[c.slug] = created.id;
  }

  const brands = [
    { name: "سامسونگ", slug: "samsung" },
    { name: "اپل", slug: "apple" },
    { name: "نایکی", slug: "nike" },
    { name: "سونی", slug: "sony" },
  ];
  const brandMap: Record<string, string> = {};
  for (const b of brands) {
    const created = await prisma.brand.upsert({
      where: { slug: b.slug }, update: {}, create: b,
    });
    brandMap[b.slug] = created.id;
  }

  for (const p of productSeedData) {
    const { image, categorySlug, brandSlug, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        categoryId: catMap[categorySlug],
        brandId: brandMap[brandSlug],
        status: "ACTIVE",
      },
    });

    const existingImages = await prisma.productImage.count({ where: { productId: product.id } });
    if (existingImages === 0) {
      await prisma.productImage.create({
        data: { url: image, alt: productData.name, productId: product.id },
      });
    }
  }

  await prisma.discount.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", percent: 10, active: true, expiresAt: new Date("2027-01-01") },
  });

  console.log("Seed completed successfully");
  console.log(`  - ${await prisma.user.count()} users`);
  console.log(`  - ${await prisma.category.count()} categories`);
  console.log(`  - ${await prisma.brand.count()} brands`);
  console.log(`  - ${await prisma.product.count()} products`);
  console.log(`  - ${await prisma.productImage.count()} product images`);
  console.log(`  - ${await prisma.discount.count()} discounts`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
