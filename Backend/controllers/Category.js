import Category from "../models/Category";

// create Tag ka handler function

exports.createCategory=async (req,res)=>{
    try{
        //fetch data
        const {name,description}=req.body;
        //validation
        if(!name || !description){
            return res.status(402).json({
                success:false,
                message:"All Filed are required ",
            })
        }
        // create entry in db
        const CategoryDetails=await Category.create({
            name:name,
            description:description,
        });

        console.log(CategoryDetails);

        return res.status(200).json({
            success:true,
            ymessage:"Category created Successfully !"
        })
    } catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.showAllCategories=async (req,res)=>{
    try{
         const allCategories=await Category.find({},{name:true,description:true});
         res.status(200).json({
            success:true,
            message:"All tags returned successfully ",
            data:allCategories,
         })
    } catch (error){
        return res.status(500).json({
            success:false,
            message:"error.message"
        })
    }
}

//categorypage Details
 exports.categorypageDetails=async(req,res)=>{
    try{
        //get category id
        const {categoryId}=req.body;
        //get courses for specified categoryId
        const selectedCategory=await Category.findById(categoryId)
                                             .populate("courses")
                                             .exec();

        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data Not Found",
            });
        }
        //get courses for diffrent categories
        const diffrentCategories= await Category.find({
            _id:{$ne:categoryId}
        })
        .populate("courses")
        .exec();

        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                diffrentCategories,
            }
        })
    }
     catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
     }
 }