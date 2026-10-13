/* بيانات العرض التجريبية — غيّر هذا الملف لتحديث معلومات النشاط والقائمة والأسعار. */
window.SUGAR_HOUSE_DATA = {
  business: {
    name: "SUGAR HOUSE",
    arabicName: "سكر هاوس للحلويات",
    tagline: "كل قطعة حكاية من السعادة",
    type: "حلويات شرقية وغربية، كيك، شوكولاتة، ومخبوزات.",
    address: "شارع الجمهورية، المنصورة، الدقهلية، مصر.",
    phone: "01108342262",
    whatsapp: "01108342262",
    hours: "يوميًا من 10 صباحًا إلى 12 منتصف الليل",
    email: "mw2092008mw@gmail.com",
    currency: "EGP",
    mapUrl: "https://maps.app.goo.gl/Pxa2n2uRfsf79HWe7",
    demo: true
  },
  images: {
    cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80",
    chocolateCake: "https://images.unsplash.com/photo-1572897305554-9b38c937edba?auto=format&fit=crop&w=900&q=78",
    cheesecake: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?auto=format&fit=crop&w=900&q=78",
    macarons: "https://images.unsplash.com/photo-1746993286825-50f47e81d9bd?auto=format&fit=crop&w=900&q=78",
    dessert: "https://images.unsplash.com/photo-1762704742839-84192b556296?auto=format&fit=crop&w=900&q=78",
    cookies: "https://images.unsplash.com/photo-1590080874088-eec64895b423?auto=format&fit=crop&w=900&q=78",
    tart: "https://images.unsplash.com/photo-1746003262617-6034c98b90d0?auto=format&fit=crop&w=900&q=78",
    pastry: "https://images.unsplash.com/photo-1567020244917-f416ed88bdd7?auto=format&fit=crop&w=900&q=78",
    oriental: "https://images.unsplash.com/photo-1786174045066-72297be6e9f4?auto=format&fit=crop&w=900&q=78",
    baklava: "https://images.unsplash.com/photo-1778448806128-18e8354356e1?auto=format&fit=crop&w=900&q=78",
    strawberryCake: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=80",
    cakeSlice: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=78",
    brownie: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=78"
  },
  categories: [
    { id: "cakes", name: "الكيك والتورت", image: "cakeSlice", note: "لحظات تستاهل احتفال" },
    { id: "oriental", name: "الحلويات الشرقية", image: "oriental", note: "أصالة بطعم الحكاية" },
    { id: "cheesecake", name: "التشيز كيك", image: "cheesecake", note: "قوام ناعم ومذاق غني" },
    { id: "chocolate", name: "الشوكولاتة", image: "chocolateCake", note: "اختيار عشّاق الكاكاو" },
    { id: "macarons", name: "الماكارون", image: "macarons", note: "ألوان ونكهات فرنسية" },
    { id: "cookies", name: "الكوكيز والبراونيز", image: "cookies", note: "لقمة صغيرة ومزاج كبير" }
  ],
  products: [
    { id: "chocolate-torte", name: "تورتة شوكولاتة فاخرة", category: "cakes", categories: ["cakes", "chocolate"], categoryLabel: "كيك وتورت", description: "طبقات كاكاو غنية مع كريمة ناعمة ولمسة شوكولاتة لامعة.", price: 650, image: "cake", popular: true },
    { id: "strawberry-cheesecake", name: "تشيز كيك فراولة", category: "cheesecake", categoryLabel: "تشيز كيك", description: "قوام كريمي مع طبقة فراولة بطعم منعش ومتوازن.", price: 180, image: "cheesecake", popular: true },
    { id: "french-macarons", name: "بوكس ماكارون فرنسي", category: "macarons", categoryLabel: "ماكارون", description: "حبات ملونة بحشوات ناعمة، اختيار لطيف للهدايا.", price: 220, image: "macarons", popular: true },
    { id: "chocolate-brownies", name: "براونيز بالشوكولاتة", category: "chocolate", categories: ["chocolate", "cookies"], categoryLabel: "شوكولاتة", description: "قطع فادج غنية بملمس طري وطبقة كاكاو مكثفة.", price: 95, image: "brownie", popular: true },
    { id: "oriental-box", name: "علبة شرقية مشكلة", category: "oriental", categoryLabel: "حلويات شرقية", description: "تشكيلة متنوعة من القطع الشرقية في علبة أنيقة.", price: 300, image: "baklava", popular: false },
    { id: "italian-tiramisu", name: "تيراميسو إيطالي", category: "cakes", categoryLabel: "حلويات غربية", description: "طبقات بطعم القهوة والكريمة مع لمسة كاكاو.", price: 160, image: "dessert", popular: false },
    { id: "chocolate-cookies", name: "كوكيز شوكولاتة", category: "cookies", categoryLabel: "كوكيز وبراونيز", description: "كوكيز مخبوزة بلطف وقطع شوكولاتة في كل قضمة.", price: 75, image: "cookies", popular: false },
    { id: "fruit-tart", name: "ميني تارت فواكه", category: "cakes", categoryLabel: "مخبوزات", description: "قاعدة هشة وكريمة خفيفة مع فواكه ملونة.", price: 140, image: "tart", popular: false }
  ],
  offers: [
    { id: "joy-box", kicker: "بوكس السعادة", title: "6 قطع متنوعة", detail: "تشكيلة حلوة للمشاركة في أي وقت.", price: 250, oldPrice: 300, image: "oriental", label: "وفّر 50 جنيه", cta: "اطلب بوكس السعادة" },
    { id: "celebration-cake", kicker: "لحظتك تستاهل", title: "تورتة المناسبات", detail: "خصم تجريبي 15% على تورت المناسبات.", price: null, oldPrice: null, image: "strawberryCake", label: "خصم 15%", cta: "اسأل عن التورتة" }
  ],
  features: [
    { icon: "✧", title: "مكونات مختارة بعناية", text: "اهتمام بالتفاصيل من أول اختيار." },
    { icon: "❋", title: "تنوع في النكهات", text: "شرقي وغربي… كل يوم بمذاق." },
    { icon: "♧", title: "تغليف أنيق للهدايا", text: "تفاصيل حلوة قبل أول لقمة." },
    { icon: "♡", title: "اهتمام بكل طلب", text: "لأن مناسبتك تستحق لمسة خاصة." }
  ],
  reviews: [
    { name: "مريم أحمد", text: "البوكس كان مرتب وطعمه جميل، خلّى جمعتنا أحلى.", initials: "مأ" },
    { name: "يوسف محمود", text: "التورتة كانت اختيار موفق للمناسبة، شكلها مميز.", initials: "يم" },
    { name: "سارة خالد", text: "الماكارون ألوانه مبهجة وطعمه لطيف جدًا.", initials: "سك" }
  ]
};
