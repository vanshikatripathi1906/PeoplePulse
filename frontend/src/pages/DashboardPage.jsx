import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { DashboardModule } from "../components/modules/DashboardModule";
import { DirectoryModule } from "../components/modules/DirectoryModule";
import { ProfileModule } from "../components/modules/ProfileModule";
import { AttendanceModule } from "../components/modules/AttendanceModule";
import { LeaveModule } from "../components/modules/LeaveModule";
import { DepartmentsModule } from "../components/modules/DepartmentsModule";
import { TasksModule } from "../components/modules/TasksModule";
import { PerformanceModule } from "../components/modules/PerformanceModule";
import { OrgChartModule } from "../components/modules/OrgChartModule";
import { PayrollModule } from "../components/modules/PayrollModule";
import { AnalyticsModule } from "../components/modules/AnalyticsModule";
import { NotificationsModule } from "../components/modules/NotificationsModule";
import { AIResumeSearchModule } from "../components/modules/AIResumeSearchModule";
import { AssetsModule } from "../components/modules/AssetsModule";
import { MeetingRoomsModule } from "../components/modules/MeetingRoomsModule";

function generateMockAttendance(seedNumber) {
  const attendanceList = [];
  for (let dayIndex = 0; dayIndex < 28; dayIndex++) {
    const calculationValue = (seedNumber * (dayIndex + 3) * 7) % 23;
    if (calculationValue < 15) {
      attendanceList.push("P");
    } else if (calculationValue < 17) {
      attendanceList.push("WFH");
    } else if (calculationValue < 19) {
      attendanceList.push("L");
    } else if (calculationValue < 21) {
      attendanceList.push("H");
    } else {
      attendanceList.push("A");
    }
  }
  return attendanceList;
}

const INITIAL_EMPLOYEES_DATA = [
  { id: 1, empId: "EMP-1001", name: "Aman Verma", designation: "Engineering Head", department: "Engineering", experience: "9 Years", manager: "—", status: "Active", email: "aman.verma@peoplepulse.co", phone: "+91 98200 11234", location: "Indore HQ", type: "Full-time", joined: "Jan 2018" },
  { id: 2, empId: "EMP-1002", name: "Rahul Sharma", designation: "Senior Engineering Manager", department: "Engineering", experience: "8 Years", manager: "Aman Verma", status: "Active", email: "rahul.sharma@peoplepulse.co", phone: "+91 99770 44120", location: "Indore HQ", type: "Full-time", joined: "Jul 2020" },
  { id: 3, empId: "EMP-1003", name: "Priya Nair", designation: "Product Manager", department: "Product", experience: "7 Years", manager: "Aman Verma", status: "Active", email: "priya.nair@peoplepulse.co", phone: "+91 96541 22310", location: "Indore HQ", type: "Full-time", joined: "Apr 2017" },
  { id: 4, empId: "EMP-1004", name: "Vanshika Tripathi", designation: "Frontend Developer", department: "Engineering", experience: "2 Years", manager: "Rahul Sharma", status: "Active", email: "vanshika.t@peoplepulse.co", phone: "+91 90212 55810", location: "Indore HQ", type: "Full-time", joined: "Mar 2024" },
  { id: 5, empId: "EMP-1005", name: "Aditi Tripathi", designation: "Backend Developer", department: "Engineering", experience: "5 Years", manager: "Rahul Sharma", status: "Active", email: "aditi.t@peoplepulse.co", phone: "+91 98330 93380", location: "Indore HQ", type: "Full-time", joined: "Jan 2021" },
  { id: 6, empId: "EMP-1006", name: "Rohan Gupta", designation: "Full Stack Developer", department: "Engineering", experience: "4 Years", manager: "Rahul Sharma", status: "Active", email: "rohan.gupta@peoplepulse.co", phone: "+91 98210 44321", location: "Pune Office", type: "Full-time", joined: "Aug 2022" },
  { id: 7, empId: "EMP-1007", name: "Neha Singh", designation: "UI/UX Designer", department: "Design", experience: "3 Years", manager: "Priya Nair", status: "Active", email: "neha.singh@peoplepulse.co", phone: "+91 97110 55432", location: "Remote", type: "Full-time", joined: "May 2023" },
  { id: 8, empId: "EMP-1008", name: "Karan Malhotra", designation: "QA Engineer", department: "Engineering", experience: "3 Years", manager: "Rahul Sharma", status: "Active", email: "karan.m@peoplepulse.co", phone: "+91 97531 88120", location: "Pune Office", type: "Contract", joined: "Feb 2023" },
  { id: 9, empId: "EMP-1009", name: "Sneha Patel", designation: "DevOps Engineer", department: "Engineering", experience: "5 Years", manager: "Rahul Sharma", status: "Active", email: "sneha.patel@peoplepulse.co", phone: "+91 98450 11982", location: "Indore HQ", type: "Full-time", joined: "Oct 2021" },
  { id: 10, empId: "EMP-1010", name: "Arjun Mehta", designation: "Data Analyst", department: "Analytics", experience: "4 Years", manager: "Priya Nair", status: "Active", email: "arjun.mehta@peoplepulse.co", phone: "+91 98760 33412", location: "Indore HQ", type: "Full-time", joined: "Nov 2022" },
  { id: 11, empId: "EMP-1011", name: "Pooja Joshi", designation: "HR Manager", department: "Human Resources", experience: "8 Years", manager: "Aman Verma", status: "Active", email: "pooja.joshi@peoplepulse.co", phone: "+91 99110 22345", location: "Indore HQ", type: "Full-time", joined: "Jun 2018" },
  { id: 12, empId: "EMP-1012", name: "Nikhil Jain", designation: "Talent Acquisition Specialist", department: "Human Resources", experience: "3 Years", manager: "Pooja Joshi", status: "Active", email: "nikhil.jain@peoplepulse.co", phone: "+91 98230 44567", location: "Indore HQ", type: "Full-time", joined: "Mar 2023" },
  { id: 13, empId: "EMP-1013", name: "Meera Iyer", designation: "Finance Manager", department: "Finance", experience: "9 Years", manager: "Aman Verma", status: "Active", email: "meera.iyer@peoplepulse.co", phone: "+91 97340 55678", location: "Indore HQ", type: "Full-time", joined: "Jan 2017" },
  { id: 14, empId: "EMP-1014", name: "Siddharth Kapoor", designation: "Accountant", department: "Finance", experience: "4 Years", manager: "Meera Iyer", status: "Active", email: "siddharth.k@peoplepulse.co", phone: "+91 98450 66789", location: "Indore HQ", type: "Full-time", joined: "Apr 2022" },
  { id: 15, empId: "EMP-1015", name: "Anjali Deshmukh", designation: "Marketing Manager", department: "Marketing", experience: "6 Years", manager: "Aman Verma", status: "Active", email: "anjali.d@peoplepulse.co", phone: "+91 99560 77890", location: "Indore HQ", type: "Full-time", joined: "Sep 2020" },
  { id: 16, empId: "EMP-1016", name: "Vivek Mishra", designation: "Digital Marketing Executive", department: "Marketing", experience: "2 Years", manager: "Anjali Deshmukh", status: "Active", email: "vivek.mishra@peoplepulse.co", phone: "+91 98670 88901", location: "Remote", type: "Full-time", joined: "Feb 2024" },
  { id: 17, empId: "EMP-1017", name: "Ishita Roy", designation: "Business Analyst", department: "Product", experience: "3 Years", manager: "Priya Nair", status: "Active", email: "ishita.roy@peoplepulse.co", phone: "+91 97780 99012", location: "Indore HQ", type: "Full-time", joined: "Jul 2023" },
  { id: 18, empId: "EMP-1018", name: "Harsh Agrawal", designation: "Mobile App Developer", department: "Engineering", experience: "4 Years", manager: "Rahul Sharma", status: "Active", email: "harsh.a@peoplepulse.co", phone: "+91 98890 10123", location: "Pune Office", type: "Full-time", joined: "Nov 2022" },
  { id: 19, empId: "EMP-1019", name: "Kavya Reddy", designation: "React Developer", department: "Engineering", experience: "2 Years", manager: "Rahul Sharma", status: "Active", email: "kavya.reddy@peoplepulse.co", phone: "+91 99901 21234", location: "Indore HQ", type: "Full-time", joined: "Jan 2024" },
  { id: 20, empId: "EMP-1020", name: "Deepak Yadav", designation: "Node.js Developer", department: "Engineering", experience: "5 Years", manager: "Rahul Sharma", status: "Active", email: "deepak.yadav@peoplepulse.co", phone: "+91 98012 32345", location: "Indore HQ", type: "Full-time", joined: "Aug 2021" },
  { id: 21, empId: "EMP-1021", name: "Ritika Bansal", designation: "Customer Success Manager", department: "Customer Success", experience: "6 Years", manager: "Aman Verma", status: "Active", email: "ritika.b@peoplepulse.co", phone: "+91 97123 43456", location: "Indore HQ", type: "Full-time", joined: "May 2020" },
  { id: 22, empId: "EMP-1022", name: "Abhishek Tiwari", designation: "Support Engineer", department: "Customer Success", experience: "2 Years", manager: "Ritika Bansal", status: "Active", email: "abhishek.t@peoplepulse.co", phone: "+91 98234 54567", location: "Remote", type: "Full-time", joined: "Mar 2024" },
  { id: 23, empId: "EMP-1023", name: "Tanvi Kulkarni", designation: "Data Scientist", department: "Analytics", experience: "5 Years", manager: "Priya Nair", status: "Active", email: "tanvi.k@peoplepulse.co", phone: "+91 99345 65678", location: "Indore HQ", type: "Full-time", joined: "Oct 2021" },
  { id: 24, empId: "EMP-1024", name: "Mohit Saxena", designation: "Cybersecurity Engineer", department: "Engineering", experience: "6 Years", manager: "Rahul Sharma", status: "Active", email: "mohit.saxena@peoplepulse.co", phone: "+91 98456 76789", location: "Indore HQ", type: "Full-time", joined: "Dec 2020" },
  { id: 25, empId: "EMP-1025", name: "Shreya Ghosh", designation: "Software Engineer", department: "Engineering", experience: "1 Year", manager: "Rahul Sharma", status: "Active", email: "shreya.ghosh@peoplepulse.co", phone: "+91 97567 87890", location: "Indore HQ", type: "Full-time", joined: "Jun 2025" },
];

INITIAL_EMPLOYEES_DATA.forEach((employee, index) => {
  employee.initials = employee.name.split(" ").map((word) => word[0]).slice(0, 2).join("");
  employee.attendance = generateMockAttendance(index + 1);
  employee.skills = [
    { name: "React", level: 3 + (index % 3) },
    { name: "Node.js", level: 2 + (index % 4) },
    { name: "MongoDB", level: 1 + (index % 5) },
    { name: "Communication", level: 3 + ((index + 1) % 3) },
  ];
  employee.documents = ["Resume", "Offer Letter", "ID Proof", "Certificates"];
  employee.perf = {
    Technical: 6 + (index % 4),
    Communication: 6 + ((index + 2) % 4),
    Leadership: 5 + ((index + 1) % 5),
    "Problem Solving": 6 + ((index + 3) % 4),
    Teamwork: 7 + (index % 3),
  };
  employee.salary = {
    gross: 55000 + index * 2200,
    tax: 6200 + index * 180,
    pf: 2100 + index * 60,
    bonus: 2000 + (index % 4) * 400,
    net: 48700 + index * 1960,
  };
  employee.birthdayToday = index === 3 || index === 1;
});

const DEPARTMENTS_DATA = [
  { name: "Engineering", head: "Aman Verma", count: 128, avgExp: "3.5 Years", projects: 18 },
  { name: "HR", head: "Priya Nair", count: 34, avgExp: "4.1 Years", projects: 4 },
  { name: "Finance", head: "Meera Iyer", count: 52, avgExp: "5.2 Years", projects: 6 },
  { name: "Marketing", head: "Arjun Malhotra", count: 61, avgExp: "3.8 Years", projects: 9 },
  { name: "Sales", head: "—", count: 45, avgExp: "2.9 Years", projects: 11 },
  { name: "Operations", head: "Nikhil Bhatt", count: 39, avgExp: "4.6 Years", projects: 5 },
];

export function DashboardPage({ role, onLogout }) {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [employeesList, setEmployeesList] = useState(() => {
    const saved = localStorage.getItem("peoplepulse_employees");
    try {
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && Array.isArray(parsed) && parsed.length >= 25) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse local employee storage", e);
    }
    return INITIAL_EMPLOYEES_DATA;
  });

  useEffect(() => {
    localStorage.setItem("peoplepulse_employees", JSON.stringify(employeesList));
  }, [employeesList]);

  const [selectedEmployee, setSelectedEmployee] = useState(() => (employeesList && employeesList.length > 0 ? employeesList[1] || employeesList[0] : INITIAL_EMPLOYEES_DATA[0]));

  let loggedInUser = (employeesList && employeesList.length > 0 ? employeesList[1] || employeesList[0] : INITIAL_EMPLOYEES_DATA[0]);
  if (role === "Admin") {
    loggedInUser = (employeesList && employeesList.length > 0 ? employeesList[0] : INITIAL_EMPLOYEES_DATA[0]);
  } else if (role === "Manager") {
    loggedInUser = (employeesList && employeesList.length > 0 ? employeesList[2] || employeesList[0] : INITIAL_EMPLOYEES_DATA[0]);
  }

  const navigateToProfile = (targetEmployee) => {
    setSelectedEmployee(targetEmployee);
    setCurrentPage("empProfile");
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    const updatedList = employeesList.map((emp) => {
      if (emp.empId === updatedEmployee.empId) {
        return updatedEmployee;
      }
      return emp;
    });
    setEmployeesList(updatedList);
    setSelectedEmployee(updatedEmployee);
  };

  const handleAddEmployee = (newEmp) => {
    const updatedList = [newEmp, ...employeesList];
    setEmployeesList(updatedList);

    try {
      const savedMetrics = localStorage.getItem("peoplepulse_dashboard_metrics");
      const currentMetrics = savedMetrics ? JSON.parse(savedMetrics) : {};
      const newMetrics = {
        ...currentMetrics,
        totalEmployees: updatedList.length,
        employeesPresent: Math.round(updatedList.length * 0.88),
      };
      localStorage.setItem("peoplepulse_dashboard_metrics", JSON.stringify(newMetrics));

      const savedNotifs = localStorage.getItem("peoplepulse_notifications");
      const currentNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
      const newNotif = {
        id: Date.now(),
        title: "New Employee Joined",
        message: `${newEmp.name} (${newEmp.designation}) has joined the ${newEmp.department} department as ${newEmp.empId}.`,
        time: "Just now",
        unread: true,
      };
      localStorage.setItem("peoplepulse_notifications", JSON.stringify([newNotif, ...currentNotifs]));
    } catch (e) {
      console.error("Failed syncing metrics or notification", e);
    }
  };

  const handleDeleteEmployee = (empId) => {
    const targetEmp = employeesList.find((e) => e.empId === empId || e.id === empId);
    const updatedList = employeesList.filter((e) => e.empId !== empId && e.id !== empId);
    setEmployeesList(updatedList);

    try {
      const savedMetrics = localStorage.getItem("peoplepulse_dashboard_metrics");
      const currentMetrics = savedMetrics ? JSON.parse(savedMetrics) : {};
      const newMetrics = {
        ...currentMetrics,
        totalEmployees: updatedList.length,
        employeesPresent: Math.round(updatedList.length * 0.88),
      };
      localStorage.setItem("peoplepulse_dashboard_metrics", JSON.stringify(newMetrics));

      const savedNotifs = localStorage.getItem("peoplepulse_notifications");
      const currentNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
      const newNotif = {
        id: Date.now(),
        title: "Employee Departure Record",
        message: `Employee record for ${targetEmp?.name || empId} (${targetEmp?.empId || empId}) was removed by ${role}.`,
        time: "Just now",
        unread: true,
      };
      localStorage.setItem("peoplepulse_notifications", JSON.stringify([newNotif, ...currentNotifs]));
    } catch (e) {
      console.error("Failed syncing metrics or notification", e);
    }
  };

  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const saved = localStorage.getItem("peoplepulse_leave_requests");
      return saved ? JSON.parse(saved) : [
        { id: "l1", employee: "Vanshika Tripathi", type: "Medical", days: 3, start: "28 Jul", end: "30 Jul", reason: "Medical leave", status: "Approved" },
        { id: "l2", employee: "Devansh Patil", type: "Casual", days: 1, start: "26 Jul", end: "26 Jul", reason: "Personal work", status: "Pending" },
        { id: "l3", employee: "Ishita Rao", type: "Earned", days: 5, start: "01 Aug", end: "05 Aug", reason: "Family trip", status: "Approved" },
        { id: "l4", employee: "Zara Ahmed", type: "Casual", days: 2, start: "22 Jul", end: "23 Jul", reason: "Home relocation", status: "Approved" },
      ];
    } catch (e) {
      return [
        { id: "l1", employee: "Vanshika Tripathi", type: "Medical", days: 3, start: "28 Jul", end: "30 Jul", reason: "Medical leave", status: "Approved" },
        { id: "l2", employee: "Devansh Patil", type: "Casual", days: 1, start: "26 Jul", end: "26 Jul", reason: "Personal work", status: "Pending" },
        { id: "l3", employee: "Ishita Rao", type: "Earned", days: 5, start: "01 Aug", end: "05 Aug", reason: "Family trip", status: "Approved" },
        { id: "l4", employee: "Zara Ahmed", type: "Casual", days: 2, start: "22 Jul", end: "23 Jul", reason: "Home relocation", status: "Approved" },
      ];
    }
  });

  const handleUpdateLeaveStatus = (id, newStatus) => {
    const updated = leaveRequests.map((x) => (x.id === id ? { ...x, status: newStatus } : x));
    setLeaveRequests(updated);

    try {
      localStorage.setItem("peoplepulse_leave_requests", JSON.stringify(updated));

      const approvedCount = updated.filter((r) => r.status === "Approved").length;

      const savedMetrics = localStorage.getItem("peoplepulse_dashboard_metrics");
      const currentMetrics = savedMetrics ? JSON.parse(savedMetrics) : {};
      const newMetrics = {
        ...currentMetrics,
        onLeave: approvedCount,
      };
      localStorage.setItem("peoplepulse_dashboard_metrics", JSON.stringify(newMetrics));

      if (newStatus === "Approved") {
        const targetReq = updated.find((r) => r.id === id);
        const savedNotifs = localStorage.getItem("peoplepulse_notifications");
        const currentNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
        const newNotif = {
          id: Date.now(),
          title: "Leave Approved",
          message: `Leave request for ${targetReq?.employee || "Employee"} (${targetReq?.type || "Leave"}) was approved by ${role}.`,
          time: "Just now",
          unread: true,
        };
        localStorage.setItem("peoplepulse_notifications", JSON.stringify([newNotif, ...currentNotifs]));
      }
    } catch (e) {
      console.error("Failed syncing leave status", e);
    }
  };

  const handleApplyLeave = (newReq) => {
    const updated = [newReq, ...leaveRequests];
    setLeaveRequests(updated);
    try {
      localStorage.setItem("peoplepulse_leave_requests", JSON.stringify(updated));
    } catch (e) {}
  };

  let pageContent = null;
  if (currentPage === "dashboard") {
    pageContent = <DashboardModule role={role} employees={employeesList} leaveRequests={leaveRequests} goProfile={navigateToProfile} />;
  } else if (currentPage === "directory") {
    pageContent = (
      <DirectoryModule
        role={role}
        employees={employeesList}
        departments={DEPARTMENTS_DATA}
        goProfile={navigateToProfile}
        onAddEmployee={handleAddEmployee}
        onDeleteEmployee={handleDeleteEmployee}
      />
    );
  } else if (currentPage === "empProfile") {
    pageContent = <ProfileModule emp={selectedEmployee} back={() => setCurrentPage("directory")} onUpdateEmp={handleUpdateEmployee} currentUser={loggedInUser} />;
  } else if (currentPage === "profile") {
    pageContent = <ProfileModule emp={loggedInUser} back={() => setCurrentPage("dashboard")} onUpdateEmp={handleUpdateEmployee} currentUser={loggedInUser} />;
  } else if (currentPage === "attendance") {
    pageContent = <AttendanceModule role={role} employees={employeesList} />;
  } else if (currentPage === "leave") {
    pageContent = <LeaveModule role={role} leaveRequests={leaveRequests} onUpdateStatus={handleUpdateLeaveStatus} onApplyLeave={handleApplyLeave} />;
  } else if (currentPage === "departments") {
    pageContent = <DepartmentsModule role={role} departments={DEPARTMENTS_DATA} />;
  } else if (currentPage === "tasks") {
    pageContent = <TasksModule role={role} employees={employeesList} />;
  } else if (currentPage === "performance") {
    pageContent = <PerformanceModule role={role} employees={employeesList} onUpdateEmp={handleUpdateEmployee} />;
  } else if (currentPage === "aisearch") {
    pageContent = <AIResumeSearchModule employees={employeesList} />;
  } else if (currentPage === "assets") {
    pageContent = <AssetsModule role={role} employees={employeesList} />;
  } else if (currentPage === "rooms") {
    pageContent = <MeetingRoomsModule employees={employeesList} />;
  } else if (currentPage === "orgchart") {
    pageContent = <OrgChartModule role={role} />;
  } else if (currentPage === "payroll") {
    pageContent = <PayrollModule role={role} self={loggedInUser} employees={employeesList} />;
  } else if (currentPage === "analytics") {
    pageContent = <AnalyticsModule employees={employeesList} />;
  } else if (currentPage === "notifications") {
    pageContent = <NotificationsModule />;
  }

  return (
    <div className="nf-shell">
      <Sidebar role={role} page={currentPage} setPage={setCurrentPage} onLogout={onLogout} />
      <div className="nf-main">
        <Topbar role={role} setPage={setCurrentPage} employees={employeesList} goProfile={navigateToProfile} />
        <div className="nf-content">{pageContent}</div>
      </div>
    </div>
  );
}
