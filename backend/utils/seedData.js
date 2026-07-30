function seedAttendance(seed) {
  const arr = [];
  for (let i = 0; i < 28; i++) {
    const v = (seed * (i + 3) * 7) % 23;
    arr.push(v < 15 ? "P" : v < 17 ? "WFH" : v < 19 ? "L" : v < 21 ? "H" : "A");
  }
  return arr;
}

const EMPLOYEES_SEED = [
  // ADMIN
  {
    empId: "EMP-1001",
    name: "Aman Verma",
    email: "adminpeoplepulse@gmail.com",
    password: "admin123",
    role: "Admin",
    designation: "Engineering Head & Admin",
    department: "Engineering",
    experience: "9 Years",
    manager: "—",
    phone: "+91 98200 11234",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Jan 2018",
  },

  // 5 DEPARTMENT MANAGERS
  {
    empId: "EMP-1002",
    name: "Rahul Sharma",
    email: "managerpeoplepulse@gmail.com",
    password: "manager123",
    role: "Manager",
    designation: "Senior Engineering Manager",
    department: "Engineering",
    experience: "8 Years",
    manager: "Aman Verma",
    phone: "+91 99770 44120",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Jul 2020",
  },
  {
    empId: "EMP-1003",
    name: "Priya Nair",
    email: "priya.nair@peoplepulse.co",
    password: "manager123",
    role: "Manager",
    designation: "Product Head",
    department: "Product",
    experience: "7 Years",
    manager: "Aman Verma",
    phone: "+91 96541 22310",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Apr 2017",
  },
  {
    empId: "EMP-1004",
    name: "Sneha Gupta",
    email: "sneha.gupta@peoplepulse.co",
    password: "manager123",
    role: "Manager",
    designation: "HR Director",
    department: "HR",
    experience: "8.5 Years",
    manager: "Aman Verma",
    phone: "+91 98112 33445",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "May 2019",
  },
  {
    empId: "EMP-1005",
    name: "Rohan Kapoor",
    email: "rohan.kapoor@peoplepulse.co",
    password: "manager123",
    role: "Manager",
    designation: "Finance Director",
    department: "Finance",
    experience: "10 Years",
    manager: "Aman Verma",
    phone: "+91 97223 44556",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Jan 2017",
  },
  {
    empId: "EMP-1006",
    name: "Ananya Sen",
    email: "ananya.sen@peoplepulse.co",
    password: "manager123",
    role: "Manager",
    designation: "Marketing Director",
    department: "Marketing",
    experience: "7.5 Years",
    manager: "Aman Verma",
    phone: "+91 96334 55667",
    location: "Indore HQ",
    type: "Full-time",
    status: "Active",
    joined: "Aug 2019",
  },

  // 10 EMPLOYEES - ENGINEERING
  { empId: "EMP-2001", name: "Vanshika Tripathi", email: "vanshikapeoplepulse@gmail.com", password: "password123", role: "Employee", designation: "Frontend Developer", department: "Engineering", experience: "2 Years", manager: "Rahul Sharma", phone: "+91 90212 55810", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Mar 2024" },
  { empId: "EMP-2002", name: "Aditi Tripathi", email: "aditi.t@peoplepulse.co", password: "password123", role: "Employee", designation: "Backend Developer", department: "Engineering", experience: "5 Years", manager: "Rahul Sharma", phone: "+91 98330 93380", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jan 2021" },
  { empId: "EMP-2003", name: "Ishita Rao", email: "ishita.r@peoplepulse.co", password: "password123", role: "Employee", designation: "UI Developer", department: "Engineering", experience: "3 Years", manager: "Rahul Sharma", phone: "+91 98111 22334", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jun 2022" },
  { empId: "EMP-2004", name: "Devansh Patil", email: "devansh.p@peoplepulse.co", password: "password123", role: "Employee", designation: "DevOps Engineer", department: "Engineering", experience: "4 Years", manager: "Rahul Sharma", phone: "+91 97222 33445", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Feb 2022" },
  { empId: "EMP-2005", name: "Siddharth Jain", email: "siddharth.j@peoplepulse.co", password: "password123", role: "Employee", designation: "Cloud Architect", department: "Engineering", experience: "6 Years", manager: "Rahul Sharma", phone: "+91 96333 44556", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Oct 2020" },
  { empId: "EMP-2006", name: "Vikram Singh", email: "vikram.s@peoplepulse.co", password: "password123", role: "Employee", designation: "Full Stack Engineer", department: "Engineering", experience: "3.5 Years", manager: "Rahul Sharma", phone: "+91 95444 55667", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Nov 2022" },
  { empId: "EMP-2007", name: "Neha Sharma", email: "neha.s@peoplepulse.co", password: "password123", role: "Employee", designation: "QA Engineer", department: "Engineering", experience: "2.5 Years", manager: "Rahul Sharma", phone: "+91 94555 66778", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jan 2023" },
  { empId: "EMP-2008", name: "Arjun Reddy", email: "arjun.r@peoplepulse.co", password: "password123", role: "Employee", designation: "Systems Engineer", department: "Engineering", experience: "4 Years", manager: "Rahul Sharma", phone: "+91 93666 77889", location: "Indore HQ", type: "Full-time", status: "Active", joined: "May 2021" },
  { empId: "EMP-2009", name: "Manish Joshi", email: "manish.j@peoplepulse.co", password: "password123", role: "Employee", designation: "Mobile App Developer", department: "Engineering", experience: "3 Years", manager: "Rahul Sharma", phone: "+91 92777 88990", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Aug 2023" },
  { empId: "EMP-2010", name: "Ritu Verma", email: "ritu.v@peoplepulse.co", password: "password123", role: "Employee", designation: "Database Engineer", department: "Engineering", experience: "5 Years", manager: "Rahul Sharma", phone: "+91 91888 99001", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Sep 2020" },

  // 10 EMPLOYEES - PRODUCT
  { empId: "EMP-3001", name: "Kavya Menon", email: "kavya.m@peoplepulse.co", password: "password123", role: "Employee", designation: "Senior Product Manager", department: "Product", experience: "5 Years", manager: "Priya Nair", phone: "+91 90111 22334", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Feb 2021" },
  { empId: "EMP-3002", name: "Tanvi Shah", email: "tanvi.s@peoplepulse.co", password: "password123", role: "Employee", designation: "UI/UX Designer", department: "Product", experience: "4 Years", manager: "Priya Nair", phone: "+91 90222 33445", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jul 2021" },
  { empId: "EMP-3003", name: "Aarav Mehta", email: "aarav.m@peoplepulse.co", password: "password123", role: "Employee", designation: "Product Designer", department: "Product", experience: "3 Years", manager: "Priya Nair", phone: "+91 90333 44556", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jan 2023" },
  { empId: "EMP-3004", name: "Pooja Bhatia", email: "pooja.b@peoplepulse.co", password: "password123", role: "Employee", designation: "UX Researcher", department: "Product", experience: "4.5 Years", manager: "Priya Nair", phone: "+91 90444 55667", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Nov 2021" },
  { empId: "EMP-3005", name: "Rohan Saxena", email: "rohan.s@peoplepulse.co", password: "password123", role: "Employee", designation: "Product Analyst", department: "Product", experience: "3 Years", manager: "Priya Nair", phone: "+91 90555 66778", location: "Indore HQ", type: "Full-time", status: "Active", joined: "May 2022" },
  { empId: "EMP-3006", name: "Snehal Deshmukh", email: "snehal.d@peoplepulse.co", password: "password123", role: "Employee", designation: "Product Owner", department: "Product", experience: "6 Years", manager: "Priya Nair", phone: "+91 90666 77889", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Apr 2020" },
  { empId: "EMP-3007", name: "Deepak Nair", email: "deepak.n@peoplepulse.co", password: "password123", role: "Employee", designation: "Associate Product Manager", department: "Product", experience: "2 Years", manager: "Priya Nair", phone: "+91 90777 88990", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jun 2024" },
  { empId: "EMP-3008", name: "Swati Malhotra", email: "swati.m@peoplepulse.co", password: "password123", role: "Employee", designation: "Interaction Designer", department: "Product", experience: "3.5 Years", manager: "Priya Nair", phone: "+91 90888 99001", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Dec 2022" },
  { empId: "EMP-3009", name: "Varun Grover", email: "varun.g@peoplepulse.co", password: "password123", role: "Employee", designation: "Technical Product Manager", department: "Product", experience: "5.5 Years", manager: "Priya Nair", phone: "+91 90999 00112", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Mar 2021" },
  { empId: "EMP-3010", name: "Divya Agarwal", email: "divya.a@peoplepulse.co", password: "password123", role: "Employee", designation: "Visual Designer", department: "Product", experience: "3 Years", manager: "Priya Nair", phone: "+91 91000 11223", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Aug 2022" },

  // 10 EMPLOYEES - HR
  { empId: "EMP-4001", name: "Nidhi Rathi", email: "nidhi.r@peoplepulse.co", password: "password123", role: "Employee", designation: "Senior HR Specialist", department: "HR", experience: "4 Years", manager: "Sneha Gupta", phone: "+91 91111 22334", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jan 2022" },
  { empId: "EMP-4002", name: "Shreya Das", email: "shreya.d@peoplepulse.co", password: "password123", role: "Employee", designation: "Talent Acquisition Lead", department: "HR", experience: "5 Years", manager: "Sneha Gupta", phone: "+91 91222 33445", location: "Indore HQ", type: "Full-time", status: "Active", joined: "May 2021" },
  { empId: "EMP-4003", name: "Amit Trivedi", email: "amit.t@peoplepulse.co", password: "password123", role: "Employee", designation: "HR Business Partner", department: "HR", experience: "6 Years", manager: "Sneha Gupta", phone: "+91 91333 44556", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Feb 2020" },
  { empId: "EMP-4004", name: "Riya Kapoor", email: "riya.k@peoplepulse.co", password: "password123", role: "Employee", designation: "Payroll Specialist", department: "HR", experience: "3.5 Years", manager: "Sneha Gupta", phone: "+91 91444 55667", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Oct 2022" },
  { empId: "EMP-4005", name: "Kunal Ahuja", email: "kunal.a@peoplepulse.co", password: "password123", role: "Employee", designation: "Employee Engagement Lead", department: "HR", experience: "4 Years", manager: "Sneha Gupta", phone: "+91 91555 66778", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jul 2022" },
  { empId: "EMP-4006", name: "Megha Singhal", email: "megha.s@peoplepulse.co", password: "password123", role: "Employee", designation: "HR Operations Associate", department: "HR", experience: "2 Years", manager: "Sneha Gupta", phone: "+91 91666 77889", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Mar 2024" },
  { empId: "EMP-4007", name: "Prateek Vyas", email: "prateek.v@peoplepulse.co", password: "password123", role: "Employee", designation: "Technical Recruiter", department: "HR", experience: "3 Years", manager: "Sneha Gupta", phone: "+91 91777 88990", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Nov 2023" },
  { empId: "EMP-4008", name: "Simran Kaur", email: "simran.k@peoplepulse.co", password: "password123", role: "Employee", designation: "Learning & Development Manager", department: "HR", experience: "5.5 Years", manager: "Sneha Gupta", phone: "+91 91888 99001", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Aug 2021" },
  { empId: "EMP-4009", name: "Tarun Chawla", email: "tarun.c@peoplepulse.co", password: "password123", role: "Employee", designation: "HR Generalist", department: "HR", experience: "3 Years", manager: "Sneha Gupta", phone: "+91 91999 00112", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Apr 2023" },
  { empId: "EMP-4010", name: "Priyanka Paul", email: "priyanka.p@peoplepulse.co", password: "password123", role: "Employee", designation: "Compensation & Benefits Specialist", department: "HR", experience: "4.5 Years", manager: "Sneha Gupta", phone: "+91 92000 11223", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Dec 2021" },

  // 10 EMPLOYEES - FINANCE
  { empId: "EMP-5001", name: "Alok Verma", email: "alok.v@peoplepulse.co", password: "password123", role: "Employee", designation: "Senior Financial Analyst", department: "Finance", experience: "6 Years", manager: "Rohan Kapoor", phone: "+91 92111 22334", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Mar 2020" },
  { empId: "EMP-5002", name: "Meera Nambiar", email: "meera.n@peoplepulse.co", password: "password123", role: "Employee", designation: "Accounts Manager", department: "Finance", experience: "7 Years", manager: "Rohan Kapoor", phone: "+91 92222 33445", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Nov 2019" },
  { empId: "EMP-5003", name: "Gaurav Rastogi", email: "gaurav.r@peoplepulse.co", password: "password123", role: "Employee", designation: "Tax Specialist", department: "Finance", experience: "5 Years", manager: "Rohan Kapoor", phone: "+91 92333 44556", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jan 2021" },
  { empId: "EMP-5004", name: "Kriti Sharma", email: "kriti.s@peoplepulse.co", password: "password123", role: "Employee", designation: "Internal Auditor", department: "Finance", experience: "4 Years", manager: "Rohan Kapoor", phone: "+91 92444 55667", location: "Indore HQ", type: "Full-time", status: "Active", joined: "May 2022" },
  { empId: "EMP-5005", name: "Harsh Vardhan", email: "harsh.v@peoplepulse.co", password: "password123", role: "Employee", designation: "Payroll Accountant", department: "Finance", experience: "3.5 Years", manager: "Rohan Kapoor", phone: "+91 92555 66778", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Sep 2022" },
  { empId: "EMP-5006", name: "Anjali Misra", email: "anjali.m@peoplepulse.co", password: "password123", role: "Employee", designation: "Financial Controller", department: "Finance", experience: "8 Years", manager: "Rohan Kapoor", phone: "+91 92666 77889", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jul 2018" },
  { empId: "EMP-5007", name: "Naveen Kumar", email: "naveen.k@peoplepulse.co", password: "password123", role: "Employee", designation: "Treasury Analyst", department: "Finance", experience: "3 Years", manager: "Rohan Kapoor", phone: "+91 92777 88990", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Feb 2023" },
  { empId: "EMP-5008", name: "Pallavi Joshi", email: "pallavi.j@peoplepulse.co", password: "password123", role: "Employee", designation: "Billing Operations Lead", department: "Finance", experience: "4 Years", manager: "Rohan Kapoor", phone: "+91 92888 99001", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Oct 2021" },
  { empId: "EMP-5009", name: "Suresh Menon", email: "suresh.m@peoplepulse.co", password: "password123", role: "Employee", designation: "Senior Accountant", department: "Finance", experience: "6.5 Years", manager: "Rohan Kapoor", phone: "+91 92999 00112", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jun 2019" },
  { empId: "EMP-5010", name: "Charu Saxena", email: "charu.s@peoplepulse.co", password: "password123", role: "Employee", designation: "Finance Associate", department: "Finance", experience: "2 Years", manager: "Rohan Kapoor", phone: "+91 93000 11223", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Apr 2024" },

  // 10 EMPLOYEES - MARKETING
  { empId: "EMP-6001", name: "Vikram Mehta", email: "vikram.m@peoplepulse.co", password: "password123", role: "Employee", designation: "Growth Marketing Lead", department: "Marketing", experience: "5 Years", manager: "Ananya Sen", phone: "+91 93111 22334", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jan 2021" },
  { empId: "EMP-6002", name: "Sonali Sen", email: "sonali.s@peoplepulse.co", password: "password123", role: "Employee", designation: "Content Strategist", department: "Marketing", experience: "4 Years", manager: "Ananya Sen", phone: "+91 93222 33445", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Aug 2021" },
  { empId: "EMP-6003", name: "Abhishek Pandey", email: "abhishek.p@peoplepulse.co", password: "password123", role: "Employee", designation: "SEO & Digital Lead", department: "Marketing", experience: "4.5 Years", manager: "Ananya Sen", phone: "+91 93333 44556", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Mar 2022" },
  { empId: "EMP-6004", name: "Natasha Roy", email: "natasha.r@peoplepulse.co", password: "password123", role: "Employee", designation: "Brand Manager", department: "Marketing", experience: "6 Years", manager: "Ananya Sen", phone: "+91 93444 55667", location: "Indore HQ", type: "Full-time", status: "Active", joined: "May 2020" },
  { empId: "EMP-6005", name: "Mohit Khanna", email: "mohit.k@peoplepulse.co", password: "password123", role: "Employee", designation: "Performance Marketer", department: "Marketing", experience: "3.5 Years", manager: "Ananya Sen", phone: "+91 93555 66778", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Oct 2022" },
  { empId: "EMP-6006", name: "Radhika Merchant", email: "radhika.m@peoplepulse.co", password: "password123", role: "Employee", designation: "Social Media Manager", department: "Marketing", experience: "3 Years", manager: "Ananya Sen", phone: "+91 93666 77889", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Nov 2022" },
  { empId: "EMP-6007", name: "Sameer Kulkarni", email: "sameer.k@peoplepulse.co", password: "password123", role: "Employee", designation: "Copywriter", department: "Marketing", experience: "2.5 Years", manager: "Ananya Sen", phone: "+91 93777 88990", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Feb 2023" },
  { empId: "EMP-6008", name: "Isha Aggarwal", email: "isha.a@peoplepulse.co", password: "password123", role: "Employee", designation: "Events & PR Specialist", department: "Marketing", experience: "4 Years", manager: "Ananya Sen", phone: "+91 93888 99001", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jun 2022" },
  { empId: "EMP-6009", name: "Rohit Bose", email: "rohit.b@peoplepulse.co", password: "password123", role: "Employee", designation: "Email Marketing Specialist", department: "Marketing", experience: "3 Years", manager: "Ananya Sen", phone: "+91 93999 00112", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Sep 2023" },
  { empId: "EMP-6010", name: "Akanksha Thakur", email: "akanksha.t@peoplepulse.co", password: "password123", role: "Employee", designation: "Marketing Operations Associate", department: "Marketing", experience: "2 Years", manager: "Ananya Sen", phone: "+91 94000 11223", location: "Indore HQ", type: "Full-time", status: "Active", joined: "Jan 2024" },
];

EMPLOYEES_SEED.forEach((e, i) => {
  e.attendance = seedAttendance(i + 1);
  e.skills = [
    { name: e.department === "Engineering" ? "React" : e.department === "Product" ? "Product Strategy" : e.department === "HR" ? "Talent Mgmt" : e.department === "Finance" ? "Financial Analysis" : "Growth Marketing", level: 3 + (i % 3) },
    { name: "Communication", level: 4 },
    { name: "Problem Solving", level: 3 + (i % 2) },
  ];
  e.perf = {
    Technical: 6 + (i % 4),
    Communication: 6 + ((i + 2) % 4),
    Leadership: 5 + ((i + 1) % 5),
    "Problem Solving": 6 + ((i + 3) % 4),
    Teamwork: 7 + (i % 3),
  };
  e.salary = {
    gross: 55000 + i * 2200,
    tax: 6200 + i * 180,
    pf: 2100 + i * 60,
    bonus: 2000 + (i % 4) * 400,
    net: 48700 + i * 1960,
  };
  e.birthdayToday = i === 3 || i === 1;
});

const DEPARTMENTS_SEED = [
  { name: "Engineering", head: "Rahul Sharma", count: 10, avgExp: "4.5 Years", projects: 18 },
  { name: "Product", head: "Priya Nair", count: 10, avgExp: "4.2 Years", projects: 12 },
  { name: "HR", head: "Sneha Gupta", count: 10, avgExp: "4.8 Years", projects: 6 },
  { name: "Finance", head: "Rohan Kapoor", count: 10, avgExp: "5.5 Years", projects: 8 },
  { name: "Marketing", head: "Ananya Sen", count: 10, avgExp: "4.0 Years", projects: 10 },
];

const LEAVES_SEED = [
  { employee: "Vanshika Tripathi", type: "Medical", days: 3, start: "28 Jul", end: "30 Jul", reason: "Medical leave", status: "Approved" },
  { employee: "Devansh Patil", type: "Casual", days: 1, start: "26 Jul", end: "26 Jul", reason: "Personal work", status: "Pending" },
  { employee: "Ishita Rao", type: "Earned", days: 5, start: "01 Aug", end: "05 Aug", reason: "Family trip", status: "Approved" },
];

const TASKS_SEED = [
  { title: "Design System Tokens", priority: "High", assignedDate: "20 Jul", deadline: "28 Jul", assignee: "Vanshika Tripathi" },
  { title: "Refactor API Gateway", priority: "Medium", assignedDate: "22 Jul", deadline: "30 Jul", assignee: "Aditi Tripathi" },
];

module.exports = {
  EMPLOYEES_SEED,
  DEPARTMENTS_SEED,
  LEAVES_SEED,
  TASKS_SEED,
};
