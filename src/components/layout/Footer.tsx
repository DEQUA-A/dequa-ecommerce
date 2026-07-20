export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">فروشگاه من</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              بهترین محصولات با بهترین قیمت‌ها. تضمین اصالت و کیفیت.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">خانه</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">محصولات</a></li>
              <li><a href="/cart" className="hover:text-white transition-colors">سبد خرید</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">حساب کاربری</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/account" className="hover:text-white transition-colors">پروفایل</a></li>
              <li><a href="/account/orders" className="hover:text-white transition-colors">سفارشات</a></li>
              <li><a href="/account/wishlist" className="hover:text-white transition-colors">علاقه‌مندی‌ها</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">تماس با ما</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>ایمیل: info@example.com</li>
              <li>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          © ۲۰۲۶ فروشگاه من. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
