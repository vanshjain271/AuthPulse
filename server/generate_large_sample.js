const XLSX = require('xlsx');
const path = require('path');

const domains = [
  'Full Stack Development',
  'Data Science',
  'UI/UX Design',
  'Digital Marketing',
  'Machine Learning',
  'Artificial Intelligence',
  'Cybersecurity',
  'Cloud Computing'
];

const students = [
  'Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas', 'Benjamin', 'Theodore',
  'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Mia', 'Evelyn', 'Harper', 'Luna', 'Camila', 'Gianna',
  'Arav', 'Vihaan', 'Aditya', 'Arjun', 'Sai', 'Ishaan', 'Krishna', 'Aryan', 'Shaurya', 'Atharv',
  'Ananya', 'Diya', 'Saanvi', 'Aditi', 'Myra', 'Kyra', 'Anika', 'Prisha', 'Vanya', 'Zoya'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Sharma', 'Verma', 'Gupta', 'Malhotra', 'Jain', 'Singhania', 'Reddy', 'Patel', 'Desai', 'Chopra'
];

const generateData = (count) => {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const firstName = students[Math.floor(Math.random() * students.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    // Random dates in 2024
    const startMonth = Math.floor(Math.random() * 6) + 1;
    const endMonth = startMonth + 2;
    
    data.push({
      'Certificate ID': `CERT-2024-${String(i).padStart(3, '0')}`,
      'Student Name': `${firstName} ${lastName}`,
      'Internship Domain': domain,
      'Start Date': `2024-0${startMonth}-01`,
      'End Date': `2024-0${endMonth}-01`
    });
  }
  return data;
};

const createExcel = () => {
  const data = generateData(100);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Certificates');
  
  const filePath = path.join(__dirname, 'large_sample_certificates.xlsx');
  XLSX.writeFile(workbook, filePath);
  console.log(`Successfully created: ${filePath}`);
};

createExcel();
