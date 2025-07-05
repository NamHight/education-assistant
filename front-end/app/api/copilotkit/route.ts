import { NextRequest } from 'next/server';
import { CopilotRuntime, GoogleGenerativeAIAdapter, copilotRuntimeNextJSAppRouterEndpoint } from '@copilotkit/runtime';
import { DichVuCSDL, taoKetNoi } from '@/lib/mysql';
import { GoogleGenerativeAI } from '@google/generative-ai';
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_API_KEY không được tìm thấy trong environment variables');
}

const google = new GoogleGenerativeAI(apiKey);

const runtime = new CopilotRuntime({
  actions: [
    {
      name: 'truyVanCSDL',
      description: 'Truy vấn cơ sở dữ liệu MySQL dựa trên yêu cầu bằng tiếng Việt',
      parameters: [
        {
          name: 'yeuCau',
          type: 'string',
          description: 'Yêu cầu bằng tiếng Việt để truy vấn cơ sở dữ liệu',
          required: true
        },
        {
          name: 'bang',
          type: 'string',
          description: 'Tùy chọn: tên bảng cụ thể để truy vấn',
          required: false
        }
      ],
      handler: async ({ yeuCau, bang }: { yeuCau: string; bang?: string }) => {
        try {
          // Chuyển đổi tiếng Việt sang SQL bằng OpenAI
          const cauTruyVanSQL = await taoSQLTuTiengViet(yeuCau, bang);
          // Thực hiện câu truy vấn SQL đã tạo
          const ketQua = await DichVuCSDL.thucHienTruyVan(cauTruyVanSQL);

          return {
            thanhCong: true,
            truyVan: cauTruyVanSQL,
            duLieu: ketQua,
            soLuong: Array.isArray(ketQua) ? ketQua.length : 0,
            thongBao: `Truy vấn thành công. Tìm thấy ${Array.isArray(ketQua) ? ketQua.length : 0} kết quả.`
          };
        } catch (loi: any) {
          return {
            thanhCong: false,
            loi: loi.message,
            thongBao: 'Không thể thực hiện truy vấn cơ sở dữ liệu'
          };
        }
      }
    },
    {
      name: 'layThongTinBang',
      description: 'Lấy thông tin về bảng: cấu trúc hoặc dữ liệu thực tế',
      parameters: [
        {
          name: 'tenBang',
          type: 'string',
          description: 'Tên bảng cần xem (VD: bo_mon, sinh_vien, giang_vien)',
          required: false
        },
        {
          name: 'loaiThongTin',
          type: 'string',
          description: 'Loại thông tin: "cau_truc" (schema) hoặc "du_lieu" (data)',
          required: false
        },
        {
          name: 'soLuong',
          type: 'number',
          description: 'Số lượng bản ghi cần lấy (mặc định: 10)',
          required: false
        }
      ],
      handler: async (params: any) => {
        try {
          const { tenBang, loaiThongTin = 'du_lieu', soLuong = 10 } = params || {};

          console.log('📋 layThongTinBang được gọi:', { tenBang, loaiThongTin, soLuong });

          if (tenBang) {
            if (loaiThongTin === 'cau_truc') {
              // Lấy cấu trúc bảng
              const cauTruc = await DichVuCSDL.layCauTrucBang(tenBang);
              return {
                thanhCong: true,
                bang: tenBang,
                loai: 'Cấu trúc bảng',
                cauTruc: cauTruc,
                thongBao: `📋 Cấu trúc bảng ${tenBang}`
              };
            } else {
              // Lấy dữ liệu từ bảng
              const truyVan = `SELECT * FROM ${tenBang} LIMIT ${soLuong}`;
              const duLieu = await DichVuCSDL.thucHienTruyVan(truyVan);

              return {
                thanhCong: true,
                bang: tenBang,
                loai: 'Dữ liệu thực tế',
                duLieu: duLieu,
                soLuong: Array.isArray(duLieu) ? duLieu.length : 0,
                thongBao: `📊 Dữ liệu từ bảng ${tenBang}: ${Array.isArray(duLieu) ? duLieu.length : 0} bản ghi`
              };
            }
          } else {
            // Lấy danh sách tất cả bảng
            const danhSachBang = await DichVuCSDL.layDanhSachBang();
            return {
              thanhCong: true,
              loai: 'Danh sách bảng',
              danhSachBang: danhSachBang,
              soLuong: Array.isArray(danhSachBang) ? danhSachBang.length : 0,
              thongBao: `📋 Tìm thấy ${Array.isArray(danhSachBang) ? danhSachBang.length : 0} bảng trong database`,
              huongDan: 'Hỏi "dữ liệu bảng [tên_bảng]" để xem dữ liệu cụ thể'
            };
          }
        } catch (loi: any) {
          console.error('❌ Lỗi trong layThongTinBang:', loi);
          return {
            thanhCong: false,
            loi: loi.message,
            thongBao: 'Không thể lấy thông tin bảng'
          };
        }
      }
    },
    {
      name: 'timKiemSinhVien',
      description: 'Tìm kiếm sinh viên trong cơ sở dữ liệu giáo dục',
      parameters: [
        {
          name: 'tuKhoa',
          type: 'string',
          description: 'Từ khóa tìm kiếm tên sinh viên, mã số hoặc tiêu chí khác',
          required: true
        },
        {
          name: 'gioiHan',
          type: 'number',
          description: 'Số lượng kết quả tối đa trả về',
          required: false
        }
      ],
      handler: async (params: any) => {
        try {
          // Xử lý trường hợp params null hoặc undefined
          const { tuKhoa, gioiHan = 10 } = params || {};

          console.log('📋 timKiemSinhVien được gọi với params:', params);
          console.log('🔍 tuKhoa:', tuKhoa, 'gioiHan:', gioiHan);

          if (!tuKhoa) {
            return {
              thanhCong: false,
              thongBao: 'Vui lòng cung cấp từ khóa tìm kiếm'
            };
          }

          const truyVan = `
                        SELECT sv.*, lh.ma_lop_hoc 
                        FROM sinh_vien sv 
                        LEFT JOIN lop_hoc lh ON sv.lop_hoc_id = lh.id 
                        WHERE sv.ho_ten LIKE ? OR sv.mssv LIKE ? OR sv.email LIKE ?
                        LIMIT ?
                    `;
          const thamSo = [`%${tuKhoa}%`, `%${tuKhoa}%`, `%${tuKhoa}%`, gioiHan];
          const ketQua = await DichVuCSDL.thucHienTruyVan(truyVan, thamSo);

          return {
            thanhCong: true,
            duLieu: ketQua,
            soLuong: Array.isArray(ketQua) ? ketQua.length : 0,
            thongBao: `Tìm thấy ${Array.isArray(ketQua) ? ketQua.length : 0} sinh viên khớp với "${tuKhoa}"`
          };
        } catch (loi: any) {
          console.error('❌ Lỗi trong timKiemSinhVien:', loi);
          return {
            thanhCong: false,
            loi: loi.message,
            thongBao: 'Không thể tìm kiếm sinh viên'
          };
        }
      }
    },
    // Cũng cập nhật action đầu tiên
    {
      name: 'truyVanCSDL',
      description: 'Truy vấn cơ sở dữ liệu MySQL dựa trên yêu cầu bằng tiếng Việt',
      parameters: [
        {
          name: 'yeuCau',
          type: 'string',
          description: 'Yêu cầu bằng tiếng Việt để truy vấn cơ sở dữ liệu',
          required: true
        },
        {
          name: 'bang',
          type: 'string',
          description: 'Tùy chọn: tên bảng cụ thể để truy vấn',
          required: false
        }
      ],
      handler: async (params: any) => {
        try {
          // Xử lý trường hợp params null hoặc undefined
          const { yeuCau, bang } = params || {};

          console.log('📋 truyVanCSDL được gọi với params:', params);
          console.log('🔍 yeuCau:', yeuCau, 'bang:', bang);

          if (!yeuCau) {
            return {
              thanhCong: false,
              thongBao: 'Vui lòng cung cấp yêu cầu truy vấn'
            };
          }

          // Chuyển đổi tiếng Việt sang SQL bằng Groq
          const cauTruyVanSQL = await taoSQLTuTiengViet(yeuCau, bang);

          // Thực hiện câu truy vấn SQL đã tạo
          const ketQua = await DichVuCSDL.thucHienTruyVan(cauTruyVanSQL);

          return {
            thanhCong: true,
            truyVan: cauTruyVanSQL,
            duLieu: ketQua,
            soLuong: Array.isArray(ketQua) ? ketQua.length : 0,
            thongBao: `Truy vấn thành công. Tìm thấy ${Array.isArray(ketQua) ? ketQua.length : 0} kết quả.`
          };
        } catch (loi: any) {
          console.error('❌ Lỗi trong truyVanCSDL:', loi);
          return {
            thanhCong: false,
            loi: loi.message,
            thongBao: 'Không thể thực hiện truy vấn cơ sở dữ liệu'
          };
        }
      }
    }
  ]
});

const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: 'gemini-1.5-flash'
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit'
  });

  return handleRequest(req);
};

// Hàm hỗ trợ chuyển đổi tiếng Việt sang SQL
// Hàm hỗ trợ chuyển đổi tiếng Việt sang SQL với fallback
async function taoSQLTuTiengViet(yeuCau: string, bang?: string): Promise<string> {
  const lenhHeThong = `
    Bạn là trình tạo câu truy vấn SQL cho cơ sở dữ liệu MySQL giáo dục.
    Chuyển đổi yêu cầu bằng tiếng Việt thành câu truy vấn SQL an toàn.
    
    MAPPING TỪ TIẾNG VIỆT SANG TÊN BẢNG:
    - "sinh viên", "sinhviên", "student" → sinh_vien
    - "giảng viên", "giangvien", "thầy", "cô", "teacher" → giang_vien
    - "môn học", "monhoc", "môn", "subject" → mon_hoc
    - "lớp học", "lophoc", "lớp", "class" → lop_hoc
    - "bộ môn", "bomon", "department" → bo_mon (BoMon)
    - "khoa", "faculty" → khoa (Khoa)
    - "phòng học", "phonghoc", "phòng", "room" → phong_hoc (PhongHoc)
    - "lịch biểu", "lichbieu", "lịch", "schedule" → lich_bieu (LichBieu)
    - "điểm", "diem", "grade" → diem (Diem)
    - "thông báo", "thongbao", "tin tức", "announcement" → thong_bao (ThongBao)
    - "tài khoản", "taikhoan", "account" → tai_khoan (TaiKhoan)

    
    CẤU TRÚC DATABASE THỰC TẾ:

    1. BẢNG SINH VIÊN:
    - sinh_vien (id, mssv, cccd, anh_dai_dien, ho_ten, email, so_dien_thoai, ngay_sinh, gioi_tinh, dia_chi, trang_thai_sinh_vien, tinh_trang_hoc_tap, ngay_tot_nghiep, ngay_nhap_hoc, lop_hoc_id, created_at, updated_at, deleted_at)

    2. BẢNG LỚP HỌC:
    - lop_hoc (id, ma_lop_hoc, si_so, nam_hoc, giang_vien_id, nganh_id, created_at, updated_at, deleted_at)
    - lop_hoc_phan (id, ma_hoc_phan, si_so, trang_thai, mon_hoc_id, giang_vien_id, created_at, updated_at, deleted_at, "loai-lop")

    3. BẢNG GIẢNG VIÊN:
    - giang_vien (id, ma_hoc_phan, si_so, trang_thai, mon_hoc_id, giang_vien_id, created_at, updated_at, deleted_at, "loai-lop")

    4. BẢNG MÔN HỌC:
    - mon_hoc (id, ma_mon_hoc, ten_mon_hoc, mo_ta, khoa_id, created_at, updated_at, deleted_at)
    - DangKyMonHoc (id, sinhVienId, lopHocPhanId, ngayDangKy, trangThai, diem)

    5. BẢNG LỊCH BIỂU:
    - LichBieu (id, thu, tietBatDau, tietKetThuc, lopHocPhanId, phongHocId, tuanId)
    - Tuan (id, soTuan, namHoc, tuNgay, denNgay)

    6. BẢNG PHÒNG HỌC:
    - PhongHoc (id, tenPhong, sucChua, viTri, trangThai, toaNha, tang)

    7. BẢNG TỔ CHỨC:
    - BoMon (id, tenBoMon, moTa, truongBoMonId, khoaId)
    - Khoa (id, tenKhoa, moTa, truongKhoaId)

    8. BẢNG ĐIỂM SỐ:
    - Diem (id, sinhVienId, monHocId, loaiDiem, diem, ngayNhap, giangVienId, ghiChu)
    - BangDiem (id, sinhVienId, lopHocPhanId, diemGiuaKy, diemCuoiKy, diemTongKet, xepLoai)

    9. BẢNG THÔNG BÁO:
    - ThongBao (id, tieuDe, noiDung, ngayTao, nguoiTao, doiTuong, trangThai)

    10. BẢNG TÀI KHOẢN:
    - TaiKhoan (id, email, ngay_dang_nhap, trang_thai, loai_tai_khoan, created_at, updated_at, deleted_at)
    ${bang ? `Tập trung vào bảng "${bang}" nếu có liên quan.` : ''}
    
    QUAN TRỌNG: Chỉ trả về câu SQL thuần, không thêm giải thích hay markdown.
    `;

  try {
    console.log('🤖 Đang tạo SQL từ yêu cầu:', yeuCau);

    // SỬ DỤNG GOOGLE GENERATIVE AI ĐÚNG CÁCH
    const model = google.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `${lenhHeThong}\n\nYêu cầu của người dùng: ${yeuCau}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let sql = response.text().trim();

    // Dọn dẹp SQL
    sql = sql
      .replace(/```sql\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/;$/g, '')
      .trim();

    console.log('✅ SQL được tạo:', sql);
    return sql;
  } catch (loi) {
    console.error('❌ Lỗi tạo SQL với Google Generative AI, sử dụng fallback:', loi);

    // Fallback với predefined queries
    const yeuCauLower = yeuCau.toLowerCase();

    if (yeuCauLower.includes('sinh viên') || yeuCauLower.includes('sinhvien')) {
      return 'SELECT * FROM sinh_vien WHERE deleted_at IS NULL LIMIT 10';
    }
    if (yeuCauLower.includes('giảng viên') || yeuCauLower.includes('giangvien')) {
      return 'SELECT * FROM giang_vien WHERE deleted_at IS NULL LIMIT 10';
    }
    if (yeuCauLower.includes('bảng') || yeuCauLower.includes('table')) {
      return 'SHOW TABLES';
    }
    if (yeuCauLower.includes('môn học') || yeuCauLower.includes('monhoc')) {
      return 'SELECT * FROM mon_hoc WHERE deleted_at IS NULL LIMIT 10';
    }

    // Default fallback
    return 'SELECT 1 as fallback_query';
  }
}
// ...existing code...

// Thêm GET endpoint để test kết nối database
export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Đang kiểm tra kết nối database...');

    // Test kết nối cơ bản
    const ketNoi = await taoKetNoi();
    console.log('✅ Kết nối database thành công!');

    // Test query đơn giản
    const [result] = await ketNoi.execute('SELECT 1 as test_connection');
    console.log('✅ Test query thành công:', result);

    // Test lấy danh sách bảng
    const danhSachBang = await DichVuCSDL.layDanhSachBang();
    console.log('✅ Lấy danh sách bảng thành công:', danhSachBang);

    await ketNoi.end();

    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Database connection OK',
        database: process.env.DB_NAME || 'education',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '3306',
        tables: danhSachBang,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('❌ Lỗi kết nối database:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
