export const swipeActions = {
  left: { label: 'Bỏ qua', points: -5 },
  right: { label: 'Thích', points: 10 },
  up: { label: 'Làm bạn', points: -5 },
};

export const profiles = [
  { id: 'mai-anh', name: 'Mai Anh', age: 23, city: 'TP. Hồ Chí Minh', work: 'Thiết kế đồ họa', interests: ['Nhiếp ảnh', 'Cà phê'], bio: 'Cuối tuần mình thường mang máy ảnh đi dạo và tìm quán cà phê mới.' },
  { id: 'quoc-bao', name: 'Quốc Bảo', age: 25, city: 'Đà Nẵng', work: 'Kỹ sư phần mềm', interests: ['Chạy bộ', 'Nhạc indie'], bio: 'Mình thích chạy dọc bờ biển và chia sẻ các playlist tự làm.' },
  { id: 'thanh-truc', name: 'Thanh Trúc', age: 24, city: 'Cần Thơ', work: 'Biên tập viên', interests: ['Đọc sách', 'Làm bánh'], bio: 'Luôn sẵn lòng trao đổi sách và thử một công thức bánh mới.' },
  { id: 'minh-khoi', name: 'Minh Khôi', age: 26, city: 'Hà Nội', work: 'Kiến trúc sư', interests: ['Đạp xe', 'Phim tài liệu'], bio: 'Cuộc hẹn lý tưởng của mình là đạp xe quanh hồ rồi đi xem phim.' },
  { id: 'linh-chi', name: 'Linh Chi', age: 22, city: 'Huế', work: 'Sinh viên mỹ thuật', interests: ['Vẽ màu nước', 'Đi bộ'], bio: 'Mình ghi lại những chuyến đi ngắn bằng một cuốn sổ vẽ.' },
];

export function scoreHistory(history) {
  return history.reduce((score, entry) => score + swipeActions[entry.direction].points, 0);
}

export function getSwipeDirection(dx, dy) {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return null;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy < 0 ? 'up' : null;
}
