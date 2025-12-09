const { Presensi } = require('./models');

async function fixImagePaths() {
  try {
    // Cari semua record yang memiliki buktiFoto dengan backslash
    const records = await Presensi.findAll({
      where: {
        buktiFoto: {
          [require('sequelize').Op.like]: '%\\%'
        }
      }
    });

    console.log(`Found ${records.length} records with backslash in buktiFoto`);

    for (const record of records) {
      const fixedPath = record.buktiFoto.replace(/\\/g, '/');
      await record.update({ buktiFoto: fixedPath });
      console.log(`Updated record ${record.id}: ${record.buktiFoto} -> ${fixedPath}`);
    }

    console.log('Image paths fixed successfully');
  } catch (error) {
    console.error('Error fixing image paths:', error);
  } finally {
    process.exit();
  }
}

fixImagePaths();
