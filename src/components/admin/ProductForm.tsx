"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AlertCircle } from "lucide-react";

type Category = { id: string; name: string };
type Brand = { id: string; name: string };
type ProductImage = { id: string; url: string; alt: string };

interface ProductFormProps {
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialState: any;
  categories: Category[];
  brands: Brand[];
  product?: {
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    status: string;
    featured: boolean;
    categoryId: string;
    brandId: string;
    images: ProductImage[];
  };
}

export function ProductForm({ action, initialState, categories, brands, product }: ProductFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, initialState);

  const getError = (field: string) => (state as any)?.errors?.[field]?.[0];

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state && !(state as any).success && (state as any).message && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {(state as any).message}
        </div>
      )}

      <Input label="نام محصول" name="name" defaultValue={product?.name} error={getError("name")} required />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="اسلاگ" name="slug" defaultValue={product?.slug} error={getError("slug")} required dir="ltr" />
        <Input label="قیمت (تومان)" name="price" type="number" defaultValue={product?.price} error={getError("price")} required dir="ltr" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="قیمت تخفیف‌خورده (اختیاری)" name="discountPrice" type="number" defaultValue={product?.discountPrice ?? ""} error={getError("discountPrice")} dir="ltr" />
        <Input label="موجودی" name="stock" type="number" defaultValue={product?.stock} error={getError("stock")} required dir="ltr" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">توضیحات</label>
        <textarea
          name="description"
          defaultValue={product?.description}
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          required
        />
        {getError("description") && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-500" />{getError("description")}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">دسته‌بندی</label>
          <select
            name="categoryId"
            defaultValue={product?.categoryId}
            className="w-full px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            required
          >
            <option value="">انتخاب کنید</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {getError("categoryId") && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-500" />{getError("categoryId")}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">برند</label>
          <select
            name="brandId"
            defaultValue={product?.brandId}
            className="w-full px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
            required
          >
            <option value="">انتخاب کنید</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {getError("brandId") && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-500" />{getError("brandId")}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">وضعیت</label>
          <select
            name="status"
            defaultValue={product?.status || "ACTIVE"}
            className="w-full px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="ACTIVE">فعال</option>
            <option value="DRAFT">پیش‌نویس</option>
            <option value="OUT_OF_STOCK">ناموجود</option>
            <option value="DISCONTINUED">متوقف شده</option>
          </select>
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" name="featured" defaultChecked={product?.featured} className="w-4 h-4 accent-primary" />
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">محصول ویژه</span>
          </label>
        </div>
      </div>

      <ImageUpload existingImages={product?.images} />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isPending}>
          {product ? "بروزرسانی محصول" : "ایجاد محصول"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
