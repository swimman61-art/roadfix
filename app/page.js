import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          عربيتك عطلت؟
        </h1>

        <p className="text-gray-300 text-lg">
          RoadFix جاي لك لحد عندك في أي مكان في القاهرة
        </p>
      </div>

      {/* زرار الطلب */}
      <div className="flex justify-center mb-10">
        <Link
           href="/request"
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-lg font-bold inline-block"
        >
         اطلب مساعدة الآن 
        </Link>
      </div>

      {/* الخدمات */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link
          href="/request?service=بطارية"
          className="bg-gray-900 p-4 rounded-xl text-center block hover:bg-gray-800"
        >
          🔋
          <p>بطارية</p>
        </Link>

        <Link
          href="/request?service=كاوتش"
          className="bg-gray-900 p-4 rounded-xl text-center block hover:bg-gray-800"
        >
          🛞
          <p>كاوتش</p>
        </Link>

        <Link
          href="/request?service=بنزين"
          className="bg-gray-900 p-4 rounded-xl text-center block hover:bg-gray-800"
        >
          ⛽
          <p>بنزين</p>
        </Link>

        <Link
          href="/request?service=كهرباء"
          className="bg-gray-900 p-4 rounded-xl text-center block hover:bg-gray-800"
        >
         ⚡
         <p>كهرباء</p>
        </Link>

        <Link
          href="/request?service=عطل"
          className="bg-gray-900 p-4 rounded-xl text-center block hover:bg-gray-800"
        >
          🚨
          <p>عطل مفاجئ</p>
        </Link>
       </div>
    </main>
  );
}
