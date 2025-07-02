import mysql from 'mysql2/promise';
export async function taoKetNoi() {
    return mysql.createConnection({
        host: process.env.NEXT_PUBLIC_DB_HOST || "localhost",
        port: parseInt(process.env.NEXT_PUBLIC_DB_PORT || "3306"),
        user: process.env.NEXT_PUBLIC_DB_USER || "root",
        password: process.env.NEXT_PUBLIC_DB_PASSWORD || "",
        database: process.env.NEXT_PUBLIC_DB_NAME || "education",
        charset: "utf8mb4",

    });
}

// Các hàm tiện ích cơ sở dữ liệu
export class DichVuCSDL {
    static async thucHienTruyVan(truyVan: string, thamSo: any[] = []) {
        const ketNoi = await taoKetNoi();
        console.log("Kết nối CSDL thành công");
        try {
            const [ketQua] = await ketNoi.execute(truyVan, thamSo);
            return ketQua;
        } finally {
            await ketNoi.end();
        }
    }

    static async layCauTrucBang(tenBang: string) {
        const ketNoi = await taoKetNoi();
        console.log("Kết nối CSDL thành công");
        try {
            // Validate table name to prevent SQL injection
            if (!/^[a-zA-Z0-9_]+$/.test(tenBang)) {
                throw new Error("Tên bảng không hợp lệ");
            }
            const [cot] = await ketNoi.execute(
                `DESCRIBE \`${tenBang}\``
            );
            return cot;
        } finally {
            await ketNoi.end();
        }
    }

    static async layDanhSachBang() {
        const ketNoi = await taoKetNoi();
        console.log("Kết nối CSDL thành công");
        try {
            const [bang] = await ketNoi.execute(
                'SHOW TABLES'
            );
            return bang;
        } finally {
            await ketNoi.end();
        }
    }
}