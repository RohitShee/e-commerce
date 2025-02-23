import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({products});
    } catch (error) {
        console.log("Error in getProducts",error);
        res.status(500).json({message:error.message});
    }

}

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if(featuredProducts){
            res.json(JSON.parse(featuredProducts));
        }
        //if not in redis find in mongo
        featuredProducts = await Product.find({isFeatured:true}).lean();

        if(!featuredProducts) return res.status(404).json({message:"Featured products not found"});
        //set in redis
        await redis.set("featured_products",JSON.stringify(featuredProducts));
        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts",error);
        res.status(500).json({message:error.message});
    }
}

export const createProduct = async (req, res) => {
    try {
        const {name,description,price,image,category} = req.body;
        let cloudinaryResponse = null;
        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image);
        }
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        });
        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct",error);
        res.status(500).json({message:error.message});
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        if(!product) return res.status(404).json({message:"Product not found"});
        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`product/${publicId}`);
                console.log("image deleted from cloudinary");
            } catch (error) {
                console.log("error in deleting image from cloudinary",error);
            }
        }
        await Product.findByIdAndDelete(id);
        res.json({message:"Product deleted successfully"});
    } catch (error) {
        console.log("Error in deleteProduct",error);
        res.status(500).json({message:error.message});
    }
}