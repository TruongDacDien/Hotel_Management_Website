import axios from 'axios';
import databaseInstance from "../config/database.js";
import dotenv from "dotenv";
dotenv.config();

class NearbyLocation {
    static pool = databaseInstance.getPool();

    // Ánh xạ loại địa điểm sang tên tiếng Việt
    static typeMapping = {
        restaurant: "Nhà hàng",
        hotel: "Khách sạn",
        cafe: "Quán cà phê",
        bar: "Quán bar",
        amusement_park: "Công viên giải trí",
        aquarium: "Thủy cung",
        bowling_alley: "Sân chơi bowling",
        casino: "Sòng bạc",
        movie_theater: "Rạp chiếu phim",
        museum: "Bảo tàng",
        night_club: "Câu lạc bộ đêm",
        park: "Công viên",
        tourist_attraction: "Điểm tham quan du lịch",
        zoo: "Sở thú",
        lodging: "Nhà nghỉ",
        rv_park: "Khu cắm trại RV",
        campground: "Khu cắm trại",
        gym: "Phòng tập thể dục",
        stadium: "Sân vận động",
        spa: "Trung tâm spa"
    };

    // Get all nearby locations
    static async getAll() {
        try {
            const [rows] = await this.pool.query('SELECT * FROM DiaDiemXungQuanh');
            return rows;
        } catch (error) {
            console.error("Error fetching all nearby locations:", error);
            throw new Error("Error fetching all nearby locations");
        }
    }

    // Get nearby location by ID
    static async getById(id) {
        try {
            const [rows] = await this.pool.query('SELECT * FROM DiaDiemXungQuanh WHERE MaDD = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error(`Error fetching nearby location (ID: ${id}):`, error);
            throw new Error("Error fetching nearby location");
        }
    }

    // Get locations by branch ID
    static async getByBranchId(branchId) {
        try {
            const [rows] = await this.pool.query('SELECT * FROM DiaDiemXungQuanh WHERE MaCN = ?', [branchId]);
            return rows;
        } catch (error) {
            console.error(`Error fetching locations by branch ID (ID: ${branchId}):`, error);
            throw new Error("Error fetching locations by branch ID");
        }
    }

    // Create new nearby location
    static async create(locationData) {
        const { MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach, ThoiGianDiChuyen, ThoiGianCapNhat } = locationData;
        try {
            const [rows] = await this.pool.query(
                'INSERT INTO DiaDiemXungQuanh (MaCN, TenDD, LoaiDD, DiaChi, DanhGia, KinhDo, ViDo, KhoangCach, ThoiGianDiChuyen, ThoiGianCapNhat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
                [MaCN, TenDD, LoaiDD, DiaChi, DanhGia, KinhDo, ViDo, KhoangCach, ThoiGianDiChuyen, ThoiGianCapNhat]
            );
            return rows;
        } catch (error) {
            console.error("Error creating nearby location:", error);
            throw new Error("Error creating nearby location");
        }
    }

    // Fetch and save nearby locations using Google Places API
    static async fetchAndSaveNearbyLocations(branchId, radius, type, limit) {
        // Kiểm tra biến môi trường
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('Thiếu GOOGLE_API_KEY trong biến môi trường');
        }

        // Kiểm tra type hợp lệ
        if (!this.typeMapping[type]) {
            throw new Error(`Loại địa điểm không được hỗ trợ: ${type}`);
        }

        // Truy vấn tọa độ chi nhánh
        let rows;
        try {
            [rows] = await this.pool.query(
                'SELECT KinhDo, ViDo FROM ChiNhanh WHERE MaCN = ?',
                [branchId]
            );
        } catch (error) {
            console.error('Lỗi khi truy vấn ChiNhanh:', error);
            throw new Error(`Lỗi khi truy vấn chi nhánh với MaCN = ${branchId}`);
        }

        if (rows.length === 0) {
            throw new Error(`Không tìm thấy chi nhánh với MaCN = ${branchId}`);
        }

        const { KinhDo, ViDo } = rows[0];
        const origin = `${ViDo},${KinhDo}`;

        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${origin}&radius=${radius}&type=${type}&language=vi&key=${process.env.GOOGLE_API_KEY}`;

        try {
            const response = await axios.get(url);
            const places = response.data.results;

            if (!places || places.length === 0) {
                console.warn("Không có địa điểm nào được trả về từ Google Places API.");
                return { message: "Không có địa điểm nào được trả về từ Google Places API." };
            }

            // Giới hạn số lượng địa điểm
            const limitedPlaces = places.slice(0, limit);

            // Lấy danh sách bản ghi hiện có trong DB với MaCN và LoaiDD
            const loaiDD = this.typeMapping[type];
            let existingLocations;
            try {
                [existingLocations] = await this.pool.query(
                    'SELECT MaDD FROM DiaDiemXungQuanh WHERE MaCN = ? AND LoaiDD = ? ORDER BY MaDD ASC',
                    [branchId, loaiDD]
                );
            } catch (error) {
                console.error('Lỗi khi truy vấn bản ghi hiện có:', error);
                throw new Error('Lỗi khi kiểm tra bản ghi hiện có');
            }

            // Tính toán số lượng bản ghi cần xử lý
            const routePromises = limitedPlaces.map(async (place, index) => {
                if (!place.geometry || !place.geometry.location) {
                    console.warn(`Địa điểm ${place.name} thiếu thông tin tọa độ, bỏ qua.`);
                    return null;
                }
                const destination = `${place.geometry.location.lat},${place.geometry.location.lng}`;
                try {
                    const routeData = await this.getRouteDistanceAndDuration(origin, destination);
                    return { place, routeData, index };
                } catch (error) {
                    console.warn(`Không thể lấy tuyến đường cho địa điểm ${place.name}: ${error.message}`);
                    return null;
                }
            });
            const results = await Promise.all(routePromises);

            // Lọc các kết quả hợp lệ
            const validResults = results.filter(result => result !== null);

            // Xử lý cập nhật hoặc tạo bản ghi
            for (let i = 0; i < validResults.length; i++) {
                const { place, routeData } = validResults[i];
                const locationData = {
                    MaCN: branchId,
                    TenDD: place.name,
                    LoaiDD: loaiDD,
                    DiaChi: place.vicinity || '',
                    DanhGia: place.rating || 0,
                    ViDo: place.geometry.location.lat,
                    KinhDo: place.geometry.location.lng,
                    KhoangCach: routeData.distance,
                    ThoiGianDiChuyen: routeData.duration,
                };
                try {
                    if (i < existingLocations.length) {
                        // Cập nhật bản ghi hiện có
                        const locationId = existingLocations[i].MaDD;
                        console.log(`Updating location MaDD=${locationId}:`, locationData);
                        await this.update(locationId, locationData);
                    } else {
                        // Tạo bản ghi mới
                        console.log('Creating new location:', locationData);
                        await this.create(locationData);
                    }
                } catch (error) {
                    console.error(`Lỗi khi xử lý địa điểm ${locationData.TenDD}:`, error);
                }
            }
            return { message: `Đã xử lý ${validResults.length} địa điểm cho MaCN=${branchId} và LoaiDD=${loaiDD}` };
        } catch (error) {
            console.error('Lỗi khi gọi Google Places API:', error);
            throw error;
        }
    }

    // Get distance and duration from Routes API
    static async getRouteDistanceAndDuration(origin, destination) {
         // Kiểm tra biến môi trường
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('Thiếu GOOGLE_API_KEY trong biến môi trường');
        }

        // Validate tọa độ
        const [originLat, originLng] = origin.split(",").map(parseFloat);
        const [destLat, destLng] = destination.split(",").map(parseFloat);

        if (
            !origin || !destination ||
            isNaN(originLat) || isNaN(originLng) ||
            isNaN(destLat) || isNaN(destLng)
        ) {
            throw new Error(`Tọa độ không hợp lệ: origin=${origin}, destination=${destination}`);
        }

        const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

        try {
            const response = await axios.post(
                url,
                {
                    origin: {
                        location: { latLng: { latitude: originLat, longitude: originLng } }
                    },
                    destination: {
                        location: { latLng: { latitude: destLat, longitude: destLng } }
                    },
                    travelMode: "DRIVE",
                    routingPreference: "TRAFFIC_AWARE",
                    computeAlternativeRoutes: false,
                    languageCode: "en-US",
                    units: "METRIC"
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
                        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
                    },
                    timeout: 10000 // 10 giây
                }
            );

            if (!response.data.routes || response.data.routes.length === 0) {
                throw new Error('Không tìm được tuyến đường từ Routes API');
            }

            const route = response.data.routes[0];
            if (!route.distanceMeters || !route.duration) {
                throw new Error('Thiếu thông tin khoảng cách hoặc thời gian từ Routes API');
            }

            return {
                distance: route.distanceMeters,
                duration: route.duration
            };
        } catch (error) {
            const errorMessage = error.response
                ? `Lỗi Routes API: ${error.response.status} - ${JSON.stringify(error.response.data)}`
                : `Lỗi khi gọi Routes API: ${error.message}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    // Update nearby location
    static async update(id, locationData) {
        const { MaCN, TenDD, LoaiDD, DiaChi, DanhGia, KinhDo, ViDo, KhoangCach, ThoiGianDiChuyen } = locationData;
        try {
            await this.pool.query(
                'UPDATE DiaDiemXungQuanh SET MaCN = ?, TenDD = ?, LoaiDD = ?, DiaChi = ?, DanhGia = ?, KinhDo = ?, ViDo = ?, KhoangCach = ?, ThoiGianDiChuyen = ?, ThoiGianCapNhat = NOW() WHERE MaDD = ?',
                [MaCN, TenDD, LoaiDD, DiaChi, DanhGia, KinhDo, ViDo, KhoangCach, ThoiGianDiChuyen, id]
            );
            return { MaDD: id, ...locationData };
        } catch (error) {
            console.error(`Error updating nearby location (ID: ${id}):`, error);
            throw new Error("Error updating nearby location");
        }
    }

    // Delete nearby location
    static async delete(id) {
        try {
            await this.pool.query('DELETE FROM DiaDiemXungQuanh WHERE MaDD = ?', [id]);
            return true;
        } catch (error) {
            console.error(`Error deleting nearby location (ID: ${id}):`, error);
            throw new Error("Error deleting nearby location");
        }
    }
}

export default NearbyLocation;
