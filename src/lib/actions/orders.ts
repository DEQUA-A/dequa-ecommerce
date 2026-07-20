"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "نام الزامی است"),
  phone: z.string().min(10, "شماره تماس معتبر نیست"),
  address: z.string().min(5, "آدرس الزامی است"),
  city: z.string().min(2, "شهر الزامی است"),
  postalCode: z.string().min(5, "کد پستی معتبر نیست"),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

interface CartItemInput {
  productId: string;
  qty: number;
  price: number;
  name: string;
  image?: string;
}

export async function createOrder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "لطفا ابتدا وارد حساب خود شوید" };

  const raw: Record<string, string> = {};
  const cartItemsJson = formData.get("cartItems");
  if (!cartItemsJson || typeof cartItemsJson !== "string") return { error: "سبد خرید خالی است" };

  let cartItems: CartItemInput[];
  try {
    cartItems = JSON.parse(cartItemsJson);
  } catch {
    return { error: "خطا در داده‌های سبد خرید" };
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) return { error: "سبد خرید خالی است" };

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") raw[key] = value;
  }

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join("، ") };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    const order = await prisma.order.create({
      data: {
        total,
        status: "PENDING",
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        address: parsed.data.address,
        city: parsed.data.city,
        postalCode: parsed.data.postalCode,
        notes: parsed.data.notes,
        userId: session.user.id,
        items: {
          create: cartItems.map((item) => ({
            qty: item.qty,
            price: item.price,
            name: item.name,
            image: item.image,
            productId: item.productId,
          })),
        },
      },
    });

    for (const item of cartItems) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (product) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: Math.max(0, product.stock - item.qty) },
        });
      }
    }

    revalidatePath("/account/orders");
    return { success: true, orderId: order.id };
  } catch (e) {
    console.error("Order creation error:", e);
    return { error: "خطا در ثبت سفارش. لطفا دوباره تلاش کنید." };
  }
}
