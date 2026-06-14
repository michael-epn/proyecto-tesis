import { v2 as cloudinary } from 'cloudinary'
import fs from "fs-extra"


const subirImagenCloudinary = async (filePath, folder = "ESFOT") => {

    const { secure_url, public_id } = await cloudinary.uploader.upload(filePath, { folder })
    await fs.unlink(filePath)
    return { secure_url, public_id }
}


export {
    subirImagenCloudinary,
}