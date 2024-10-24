// api/upload.js

const FormData = require('form-data');
const fetch = require('node-fetch');

// Cấu hình Imgur API
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = req.body;

        // Lấy file ảnh và watermark từ request
        const image = form.get('image');
        const watermarkText = form.get('watermark') || '';

        // Nếu không có ảnh, trả về lỗi
        if (!image) {
            return res.status(400).json({ status: 'fail', message: 'No image uploaded' });
        }

        // Thêm watermark vào ảnh (tạm thời trả về ảnh gốc do thiếu xử lý)
        const watermarkedImage = await addWatermark(image, watermarkText);

        // Upload ảnh lên Imgur
        const imgurResponse = await uploadToImgur(watermarkedImage);

        if (imgurResponse.success) {
            return res.status(200).json({
                status: 'success',
                link: imgurResponse.data.link,
            });
        } else {
            return res.status(500).json({ status: 'fail', message: 'Upload to Imgur failed' });
        }
    } else {
        res.status(405).json({ status: 'fail', message: 'Invalid request method' });
    }
}

// Hàm xử lý thêm watermark (chỉ là placeholder, bạn có thể sử dụng Sharp hoặc Canvas)
async function addWatermark(image, text) {
    // Hiện tại trả về ảnh gốc, có thể thêm xử lý watermark ở đây
    return image;
}

// Hàm upload ảnh lên Imgur
async function uploadToImgur(image) {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
        body: formData,
    });

    return response.json();
}