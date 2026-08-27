import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TRADITIONAL_CAKES = [
  {
    name: "Barongko Khas Bugis",
    price: 3500,
    imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Cantik Manis Mutiara",
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Klepon Gula Merah Lumer",
    price: 3000,
    imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Lapis Legit Spekoek",
    price: 65000,
    imageUrl: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Cucur Pandan Wangi",
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Biji Salak Ubi Manis",
    price: 15000,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Bolu Gulung Pandan Keju",
    price: 35000,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Dadar Gulung Kelapa",
    price: 3000,
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Putu Ayu Kelapa Parut",
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Lapis Beras Pelangi",
    price: 3000,
    imageUrl: "https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Lemper Ayam Gurih",
    price: 4000,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Lumpur Kentang Kismis",
    price: 3500,
    imageUrl: "https://images.unsplash.com/photo-1587248720327-8eb72564be1e?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Onde-Onde Wijen Kacang Hijau",
    price: 3000,
    imageUrl: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Bika Ambon Medan",
    price: 45000,
    imageUrl: "https://images.unsplash.com/photo-1605698802008-8e6fa39f5068?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Pastel Goreng Renyah",
    price: 3500,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Risoles Ragout Ayam",
    price: 4000,
    imageUrl: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Nagasari Pisang",
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Semar Mendem",
    price: 4000,
    imageUrl: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Wajik Ketan Gula Merah",
    price: 3000,
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
  {
    name: "Kue Carabikang Mekar",
    price: 3000,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
  },
];

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'kuetradisional@penjual' }
  });

  if (!user) {
    console.error('User kuetradisional@penjual not found. Run seed first.');
    return;
  }

  // Preserve existing uploaded images if name matches
  const existingCakes = await prisma.cake.findMany({
    where: { userId: user.id }
  });

  for (const cakeData of TRADITIONAL_CAKES) {
    const existing = existingCakes.find(
      c => c.name.toLowerCase().includes(cakeData.name.toLowerCase()) ||
           cakeData.name.toLowerCase().includes(c.name.toLowerCase())
    );

    if (existing) {
      // Keep existing local upload image if available
      await prisma.cake.update({
        where: { id: existing.id },
        data: {
          name: cakeData.name,
          price: cakeData.price,
          isAvailable: true,
        }
      });
      console.log(`Updated existing cake: ${cakeData.name}`);
    } else {
      await prisma.cake.create({
        data: {
          name: cakeData.name,
          price: cakeData.price,
          imageUrl: cakeData.imageUrl,
          isAvailable: true,
          userId: user.id,
        }
      });
      console.log(`Created new cake: ${cakeData.name}`);
    }
  }

  console.log('✅ Berhasil memperbarui & menambahkan 20 menu kue tradisional ke database!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
