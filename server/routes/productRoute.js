import express from 'express'
import { upload } from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { addProduct, changeStock, listProduct, singleProduct, updateProduct } from '../controllers/productController.js'


const productRouter = express.Router()

productRouter.post('/add', upload.array(["images"]), authAdmin, addProduct)
productRouter.get('/list', listProduct)
productRouter.post('/single', singleProduct)
productRouter.post('/update', upload.array(["images"]), authAdmin, updateProduct)
productRouter.post('/stock',changeStock)

export default productRouter