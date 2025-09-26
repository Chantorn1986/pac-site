'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    data.map(item => {
      item.id = uuidv4()
      item.created_at = new Date()
      item.updated_at = new Date()
    })
    await queryInterface.bulkInsert('departments', data, {});
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('departments', null, {});

  }
};

const { v4: uuidv4 } = require("uuid");

const data = [
  {
    "no": 1,
    "code": "MNM",
    "nameTH": "แผนกการจัดการ",
    "nameEN": "Management Dept.",
  },
  {
    "no": 2,
    "code": "SMT",
    "nameTH": "แผนกขายและการตลาด",
    "nameEN": "Sales & Marketing Dept.",
  },
  {
    "no": 3,
    "code": "PTS",
    "nameTH": "แผนกสนับสนุนผลิตภัณฑ์และเทคนิค",
    "nameEN": "Product & Technical Support Dept.",
  },
  {
    "no": 4,
    "code": "PCM",
    "nameTH": "แผนกจัดซื้อ",
    "nameEN": "Procurement Dept.",
  },
  {
    "no": 5,
    "code": "FNC",
    "nameTH": "แผนกการเงิน",
    "nameEN": "Financial Dept.",
  },
  {
    "no": 6,
    "code": "HR",
    "nameTH": "แผนกทรัพยากรบุคคล",
    "nameEN": "Human Resource Dept.",
  },
  {
    "no": 7,
    "code": "IT",
    "nameTH": "แผนกเทคโนโลยีสารสนเทศ",
    "nameEN": "Information Technology Dept.",
  }
]