// "use client"
// import { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// // Cấu hình chart.js
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// export default function RevenueChart() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // Gọi API để lấy dữ liệu doanh thu theo ngày
//     fetch("http://localhost:3000/revenue")
//       .then((res) => res.json())
//       .then((data) => setData(data))
//       .catch((error) => console.error(error));
//   }, []);

//   // Dữ liệu cho biểu đồ
//   const chartData = {
//     labels: data.map(
//       (item) => `${item._id.day}-${item._id.month}-${item._id.year}`
//     ), // Hiển thị ngày theo format (ngày-tháng-năm)
//     datasets: [
//       {
//         label: "Tổng Doanh Thu (VNĐ)",
//         data: data.map((item) => item.totalRevenue), // Dữ liệu tổng doanh thu theo ngày
//         borderColor: "rgba(75,192,192,1)",
//         backgroundColor: "rgba(75,192,192,0.2)",
//         fill: true,
//       },
//     ],
//   };

//   return (
//     <div style={{width: "100%", height: "400px"}}>
//       <h2>Biểu đồ doanh thu theo ngày </h2>
//       <Line data={chartData} />
//     </div>
//   );
// }



"use client"
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Thay vì Line, sử dụng Bar
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Cấu hình chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Gọi API để lấy dữ liệu doanh thu theo ngày
    fetch("http://localhost:3000/revenue")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: data.map(
      (item) => `${item._id.day}-${item._id.month}-${item._id.year}`
    ), // Hiển thị ngày theo format (ngày-tháng-năm)
    datasets: [
      {
        label: "Tổng Doanh Thu (VNĐ)",
        data: data.map((item) => item.totalRevenue), // Dữ liệu tổng doanh thu theo ngày
        backgroundColor: "rgba(75,192,192,0.6)", // Màu sắc của các cột
        borderColor: "rgba(75,192,192,1)", // Màu sắc đường biên của các cột
        borderWidth: 1, // Độ dày của đường biên
        barThickness: 80,
      },
    ],
  };

  return (
    <div style={{width: "1300px", height: "500px"}}>
      <h2 style={{ textAlign: "center", marginTop: "20px",marginLeft:'350px'}}>Biểu Đồ Doanh Thu Theo Ngày</h2>
      <Bar data={chartData} /> {/* Sử dụng Bar để tạo biểu đồ cột */}
    </div>
  );
}