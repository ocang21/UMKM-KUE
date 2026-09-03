import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TRADITIONAL_CAKES = [
  {
    name: "Barongko Khas Bugis",
    price: 3500,
    imageUrl: "/uploads/cakes/barongko-khas-bugis.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Cantik Manis Mutiara",
    price: 2500,
    imageUrl: "/uploads/cakes/kue-cantik-manis-mutiara.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Klepon Gula Merah Lumer",
    price: 3000,
    imageUrl: "/uploads/cakes/kue-klepon-gula-merah-lumer.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Lapis Legit Spekoek",
    price: 65000,
    imageUrl: "/uploads/cakes/kue-lapis-legit-spekoek.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Cucur Pandan Wangi",
    price: 2500,
    imageUrl: "/uploads/cakes/kue-cucur-pandan-wangi.jpg",
    isAvailable: true,
  },
  {
    name: "Biji Salak Ubi Manis",
    price: 15000,
    imageUrl: "/uploads/cakes/biji-salak-ubi-manis.jpg",
    isAvailable: true,
  },
  {
    name: "Bolu Gulung Pandan Keju",
    price: 35000,
    imageUrl: "/uploads/cakes/bolu-gulung-pandan-keju.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Dadar Gulung Kelapa",
    price: 3000,
    imageUrl: "/uploads/cakes/kue-dadar-gulung-kelapa.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Putu Ayu Kelapa Parut",
    price: 2500,
    imageUrl: "/uploads/cakes/kue-putu-ayu-kelapa-parut.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Lapis Beras Pelangi",
    price: 3000,
    imageUrl: "/uploads/cakes/kue-lapis-beras-pelangi.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Lemper Ayam Gurih",
    price: 4000,
    imageUrl: "/uploads/cakes/kue-lemper-ayam-gurih.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Lumpur Kentang Kismis",
    price: 3500,
    imageUrl: "/uploads/cakes/kue-lumpur-kentang-kismis.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Onde-Onde Wijen Kacang Hijau",
    price: 3000,
    imageUrl: "/uploads/cakes/kue-onde-onde-wijen-kacang-hijau.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Bika Ambon Medan",
    price: 45000,
    imageUrl: "/uploads/cakes/kue-bika-ambon-medan.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Pastel Goreng Renyah",
    price: 3500,
    imageUrl: "/uploads/cakes/kue-pastel-goreng-renyah.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Risoles Ragout Ayam",
    price: 4000,
    imageUrl: "/uploads/cakes/kue-risoles-ragout-ayam.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Nagasari Pisang",
    price: 2500,
    imageUrl: "/uploads/cakes/kue-nagasari-pisang.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Semar Mendem",
    price: 4000,
    imageUrl: "/uploads/cakes/kue-semar-mendem.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Wajik Ketan Gula Merah",
    price: 3000,
    imageUrl: "/uploads/cakes/kue-wajik-ketan-gula-merah.jpg",
    isAvailable: true,
  },
  {
    name: "Kue Carabikang Mekar",
    price: 3000,
    imageUrl: "/uploads/cakes/kue-carabikang-mekar.jpg",
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
