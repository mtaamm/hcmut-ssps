import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create 20 students
  const students = await Promise.all(
    Array.from({ length: 20 }).map((_, index) =>
      prisma.user.create({
        data: {
          username: `student${index + 1}`,
          password: faker.internet.password(),
          role: 'student',
          mssv: 2213020 + index,
        },
      })
    )
  );

  // Add page sizes for each student
  for (const student of students) {
    for (const pageSize of ['A3', 'A4', 'A5']) {
      await prisma.student_page_size.create({
        data: {
          student_id: student.uid,
          page_size: pageSize,
          current_page: faker.number.int({ min: 0, max: 1000 }),
        },
      });
    }
  }

  // Create a user with role 'spso'
  const spsoUser = await prisma.user.create({
    data: {
      username: 'spso',
      password: faker.internet.password(),
      role: 'spso',
      mssv: null,
    },
  });

  // Create 20 printers
  const printers = await Promise.all(
    Array.from({ length: 100 }).map(() =>
      prisma.printer.create({
        data: {
          name: faker.company.name(),
          machine_type: faker.word.adjective() + ' Printer',
          two_side: faker.datatype.boolean(),
          color: faker.datatype.boolean(),
          floor: faker.number.int({ min: 0, max: 8 }),
          building: faker.helpers.arrayElement(['H1', 'H2', 'H3', 'H6']),
          status: faker.helpers.arrayElement(['enable', 'disable']),
        },
      })
    )
  );

  // Add page sizes to printers
  for (const printer of printers) {
    const pageSizes = faker.helpers.shuffle(['A3', 'A4', 'A5']).slice(0, faker.number.int({ min: 1, max: 3 }));
    for (const pageSize of pageSizes) {
      await prisma.printer_page_size.create({
        data: {
          printer_id: printer.id,
          page_size: pageSize,
          current_page: faker.number.int({ min: 200, max: 1000 }),
        },
      });
    }
  }

  // Create 500 print jobs
  const statuses = ['progress', 'success', 'fail'];
const fileTypes = ['.docx', '.pdf', '.xlsx', '.csv'];

for (let i = 0; i < 1000; i++) {
  const student = faker.helpers.arrayElement(students);
  const printer = faker.helpers.arrayElement(printers);

  // Ensure the page_size is valid for the chosen printer
  const pageSize = await prisma.printer_page_size.findFirst({
    where: { printer_id: printer.id },
  });

  if (pageSize) {
    const randomFileType = faker.helpers.arrayElement(fileTypes); // Chọn định dạng ngẫu nhiên
    const randomName = faker.lorem.words(3).replace(/\s+/g, '_'); // Tạo tên tệp ngẫu nhiên với 3 từ và thay thế khoảng trắng bằng dấu gạch dưới
    const filename = randomName + randomFileType; // Ghép tên với phần mở rộng ngẫu nhiên

    await prisma.print_job.create({
      data: {
        printer_id: printer.id,
        student_id: student.uid,
        filename: filename,
        time: new Date(),
        page: faker.number.int({ min: 1, max: 200 }),
        copy: faker.number.int({ min: 1, max: 10 }),
        page_size: pageSize.page_size,
        two_side: faker.datatype.boolean(),
        color: faker.datatype.boolean(),
        status: faker.helpers.arrayElement(statuses),
      },
    });
  }
}


  console.log('Seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
