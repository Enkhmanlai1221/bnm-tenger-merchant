"use client";

type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: "Эрэгтэй" | "Эмэгтэй";
  role: string;
  duty: string;
  startedAt: string;
  status: "Идэвхтэй" | "Амралттай" | "Чөлөөтэй";
  image: string;
};

const STAFFS: Staff[] = [
  {
    id: "1",
    firstName: "Бат",
    lastName: "Эрдэнэ",
    phone: "99112233",
    email: "bat.erdene@camp.mn",
    gender: "Эрэгтэй",
    role: "Менежер",
    duty: "Баазын өдөр тутмын үйл ажиллагаа хариуцна",
    startedAt: "2024-05-12",
    status: "Идэвхтэй",
    image: "https://i.pravatar.cc/300?img=11",
  },
  {
    id: "2",
    firstName: "Саруул",
    lastName: "Отгон",
    phone: "88114455",
    email: "saruul.otgon@camp.mn",
    gender: "Эмэгтэй",
    role: "Ресепшн",
    duty: "Зочин хүлээн авах, бүртгэл хөтлөх",
    startedAt: "2024-06-01",
    status: "Идэвхтэй",
    image: "https://i.pravatar.cc/300?img=32",
  },
  {
    id: "3",
    firstName: "Тэмүүжин",
    lastName: "Ганзориг",
    phone: "99118877",
    email: "temuujin.g@camp.mn",
    gender: "Эрэгтэй",
    role: "Жолооч",
    duty: "Тээвэр, хүргэлт, зочны шилжилт хөдөлгөөн",
    startedAt: "2023-09-15",
    status: "Идэвхтэй",
    image: "https://i.pravatar.cc/300?img=15",
  },
  {
    id: "4",
    firstName: "Номин",
    lastName: "Мөнхзул",
    phone: "86112244",
    email: "nomin.m@camp.mn",
    gender: "Эмэгтэй",
    role: "Тогооч",
    duty: "Гал тогоо, хоол үйлдвэрлэл хариуцна",
    startedAt: "2024-04-10",
    status: "Амралттай",
    image: "https://i.pravatar.cc/300?img=44",
  },
  {
    id: "5",
    firstName: "Алтангэрэл",
    lastName: "Баярсайхан",
    phone: "95117766",
    email: "altangerel.b@camp.mn",
    gender: "Эрэгтэй",
    role: "Аж ахуй",
    duty: "Засвар үйлчилгээ, тоног төхөөрөмж хянана",
    startedAt: "2023-11-20",
    status: "Идэвхтэй",
    image: "https://i.pravatar.cc/300?img=18",
  },
  {
    id: "6",
    firstName: "Оюунаа",
    lastName: "Энхчимэг",
    phone: "80113322",
    email: "oyuanaa.e@camp.mn",
    gender: "Эмэгтэй",
    role: "Үйлчлэгч",
    duty: "Өрөө, гэр, нийтийн хэсгийн цэвэрлэгээ",
    startedAt: "2024-07-03",
    status: "Чөлөөтэй",
    image: "https://i.pravatar.cc/300?img=48",
  },
];

function getStatusClass(status: Staff["status"]) {
  switch (status) {
    case "Идэвхтэй":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "Амралттай":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "Чөлөөтэй":
      return "bg-slate-100 text-slate-700 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Ажилчид
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Тус баазад ажиллаж буй ажилтнуудын мэдээлэл
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                Нийт: {STAFFS.length} ажилтан
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {STAFFS.map((staff) => (
            <div
              key={staff.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="h-24 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />

              <div className="relative px-5 pb-5">
                <div className="-mt-12 flex items-end justify-between gap-3">
                  <img
                    src={staff.image}
                    alt={`${staff.firstName} ${staff.lastName}`}
                    className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-sm"
                  />

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusClass(
                      staff.status
                    )}`}
                  >
                    {staff.status}
                  </span>
                </div>

                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {staff.lastName} {staff.firstName}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-primary-600">
                    {staff.role}
                  </p>
                </div>

                <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Утас
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{staff.phone}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      И-мэйл
                    </p>
                    <p className="mt-1 text-sm text-slate-700 break-all">
                      {staff.email}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Хүйс
                      </p>
                      <p className="mt-1 text-sm text-slate-700">{staff.gender}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Эхэлсэн огноо
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        {staff.startedAt}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Үүрэг
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {staff.duty}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}