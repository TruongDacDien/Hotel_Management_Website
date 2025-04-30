const axios = require('axios');
require("dotenv").config();

class NearbyLocation {
    constructor(pool) {
        this.pool = pool;
    }

    // Get all nearby locations
    async getAll() {
        const [rows] = await this.pool.query('SELECT * FROM DiaDiemXungQuanh');
        return rows;
    }

    // Get nearby location by ID
    async getById(id) {
        const [rows] = await this.pool.query('SELECT * FROM DiaDiemXungQuanh WHERE MaDD = ?', [id]);
        return rows[0];
    }

    // Get locations by branch ID
    async getByBranchId(branchId) {
        const [rows] = await this.pool.query('SELECT * FROM DiaDiemXungQuanh WHERE MaCN = ?', [branchId]);
        return rows;
    }

    // Create new nearby location
    // async create(locationData) {
    //     const { MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach } = locationData;
    //     const [result] = await this.pool.query(
    //         'INSERT INTO DiaDiemXungQuanh (MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach, ThoiGianCapNhat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
    //         [MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach]
    //     );
    //     return { MaDD: result.insertId, ...locationData };
    // } 

    async create(locationData) {
        const { MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach } = locationData;
      
        const [rows] = await this.pool.query(
            'INSERT INTO DiaDiemXungQuanh (MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach]
        );
      
        return rows;
    }

    // async fetchAndSaveNearbyLocations(branchId, radius, type) {
    //     // Lấy tọa độ từ bảng ChiNhanh
    //     const [rows] = await this.pool.query(
    //         'SELECT KinhDo, ViDo FROM ChiNhanh WHERE MaCN = ?',
    //         [branchId]
    //     );
    
    //     if (rows.length === 0) {
    //         throw new Error(`Không tìm thấy chi nhánh với MaCN = ${branchId}`);
    //     }
    
    //     const { KinhDo, ViDo } = rows[0];
    //     const location = `${ViDo},${KinhDo}`;
    
    //     const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    
    //     try {
    //         const response = await axios.get(url);
    //         const places = response.data.results;
    
    //         // 🔥 Chỉ lấy 5 địa điểm đầu tiên
    //         const limitedPlaces = places.slice(0, 5);
    
    //         for (const place of limitedPlaces) {
    //             const locationData = {
    //                 MaCN: branchId,
    //                 TenDD: place.name,
    //                 LoaiDD: place.types,
    //                 DiaChi: place.vicinity || '',
    //                 MoTa: place.opening_hours?.open_now ? 'Open now' : 'Closed',
    //                 DanhGia: place.rating || null,
    //                 KinhDo: place.geometry.location.lng,
    //                 ViDo: place.geometry.location.lat,
    //                 KhoangCach: 0, // Cập nhật nếu cần tính khoảng cách thực tế

    //             };
    //             await this.create(locationData);
    //         }
    //     } catch (error) {
    //         console.error('Lỗi khi gọi Google Places API:', error);
    //         throw error;
    //     }
    // }
    
    mapTypeToCategory(type) {
        const map = {
            restaurant: '13065',
            hotel: '19014',
            cafe: '13032',
            bar: '13003',
            mall: '19009',
            bank: '11100',
            atm: '11111',
            gas_station: '12040',
            pharmacy: '17069',
            supermarket: '17069'
        };
        return map[type] || '13000'; // fallback chung nếu không khớp
    }

    async fetchAndSaveNearbyLocations(branchId, radius, type) {
        // Bước 1: Lấy toạ độ chi nhánh
        const [rows] = await this.pool.query(
            'SELECT ViDo, KinhDo FROM ChiNhanh WHERE MaCN = ?',
            [branchId]
        );
    
        if (rows.length === 0) {
            throw new Error(`Không tìm thấy chi nhánh với MaCN = ${branchId}`);
        }
    
        const { ViDo, KinhDo } = rows[0];
        const latlng = `${ViDo},${KinhDo}`;
    
        // Bước 2: Gọi Foursquare API
        const url = `https://api.foursquare.com/v3/places/search`;
    
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': process.env.FOURSQUARE_API_KEY
                },
                params: {
                    ll: latlng,
                    radius: radius,
                    categories: this.mapTypeToCategory(type),
                    limit: 5
                }
            });
    
            const places = response.data.results;
    
            if (!places || places.length === 0) {
                console.warn('Không tìm thấy địa điểm nào từ Foursquare.');
                return;
            }
    
            // Bước 3: Lưu vào DB
            for (const place of places) {
                const locationData = {
                    MaCN: branchId,
                    TenDD: place.name,
                    LoaiDD: type,
                    DiaChi: place.location?.formatted_address || place.location?.address || '',
                    MoTa: place.categories?.[0]?.name || '',
                    DanhGia: 5, // Foursquare không trả về rating miễn phí
                    ViDo: place.geocodes.main.latitude,
                    KinhDo: place.geocodes.main.longitude,
                    KhoangCach: 0 // bạn có thể tính thêm nếu muốn
                };
    
                console.log('Saving Foursquare location:', locationData);
                await this.create(locationData);
            }
        } catch (error) {
            console.error('Lỗi khi gọi Foursquare API:', error.response?.data || error.message);
            throw error;
        }
    }

    // Update nearby location
    async update(id, locationData) {
        const { MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach } = locationData;
        await this.pool.query(
            'UPDATE DiaDiemXungQuanh SET MaCN = ?, TenDD = ?, LoaiDD = ?, DiaChi = ?, MoTa = ?, DanhGia = ?, KinhDo = ?, ViDo = ?, KhoangCach = ?, ThoiGianCapNhat = NOW() WHERE MaDD = ?',
            [MaCN, TenDD, LoaiDD, DiaChi, MoTa, DanhGia, KinhDo, ViDo, KhoangCach, id]
        );
        return { MaDD: id, ...locationData };
    }

    // Delete nearby location
    async delete(id) {
        await this.pool.query('DELETE FROM DiaDiemXungQuanh WHERE MaDD = ?', [id]);
        return true;
    }
}

module.exports = NearbyLocation;