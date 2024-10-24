const FormData = require('form-data');
const fetch = require('node-fetch');
const sharp = require('sharp');

// Cấu hình Imgur API
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = await req.formData();
        const imageFile = form.get('image');  // Ảnh gốc
        const watermarkText = form.get('watermark') || '';  // Văn bản watermark

        if (!imageFile) {
            return res.status(400).json({ status: 'fail', message: 'No image uploaded' });
        }

        // Đọc file ảnh gốc
        const buffer = await imageFile.arrayBuffer();
        const imageBuffer = Buffer.from(buffer);

        // Thêm watermark vào ảnh
        const watermarkedImage = await addWatermark(imageBuffer, watermarkText);

        // Upload ảnh đã có watermark lên Imgur
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
        return res.status(405).json({ status: 'fail', message: 'Invalid request method' });
    }
}

// Hàm xử lý thêm watermark bằng Sharp
async function addWatermark(imageBuffer, text) {
    const watermarkedImage = await sharp(imageBuffer)
        .composite([{
            input: Buffer.from(
                `<svg>
                    <text x="10" y="20" font-size="20" fill="white">${text}</text>
                </svg>`
            ),
            gravity: 'southeast'
        }])
        .toBuffer();

    return watermarkedImage;
}

// Hàm upload ảnh lên Imgur
async function uploadToImgur(imageBuffer) {
    const formData = new FormData();
    formData.append('image', imageBuffer.toString('base64'));

    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
        body: formData,
    });

    return response.json();
}