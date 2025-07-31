const express = require("express");
const productModel = require("../models/product.model");
const ImageKit = require("imagekit");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();



router.get("/", (req, res) => {
 
});



router.post("/add", upload.single("image"), async (req, res) => {

  const imagekit = new ImageKit({
    publicKey: "public_M0PAK4NmC1d2995cVHB6hjiBgaE=",
    privateKey : "private_KT7FkfaTOTLNy6lVG+V7iKE2ba4=",
    urlEndpoint: "https://ik.imagekit.io/ls436o8px",
  });


  const result = await imagekit.upload({
    file : req.file.buffer,
    fileName : req.file.originalname,
    isPrivateFile : false,
    isPublished : true
  })

  const imageUrl = result.url

 
  const { title, description, category, price } = req.body;
  

      const product = new productModel(
          {
              title : title,
              description : description,
              category : category,
              price : price,
              image : imageUrl
           }
  )

      await product.save()

  res.json({message : "data aaya"})
});

router.get("/:id",async (req, res)=>{
    const productId = req.params.id

    const product = await productModel.findById(productId)

    console.log(product);


    res.status(200).json({message : "data mil gya " , product})
    
})

router.get("/update/:id", async(req, res)=>{

    const productId = req.params.id

    const product = await productModel.findById(productId)


    res.render("updateForm",{product : product})
})


router.post("/update/:id", upload.single("image"), async (req, res) => {
    const productId = req.params.id;
    const { title, description, category, price } = req.body;

    let updateData = { title, description, category, price };

    if (req.file) {
        const imagekit = new ImageKit({
            publicKey: process.env.PUBLIC_KEY,
            privateKey : process.env.PRIVATE_KEY,
            urlEndpoint: process.env.URLENDPOINT,
        });
        const result = await imagekit.upload({
            file : req.file.buffer,
            fileName : req.file.originalname,
            isPrivateFile : false,
            isPublished : true
        });
        updateData.image = result.url;
    }

    await productModel.findByIdAndUpdate(productId, updateData);
    res.redirect(`/products/${productId}`);
});


router.get("/delete/:id" , async (req,res)=>{
    const productId = req.params.id

    await productModel.findByIdAndDelete(productId)

    res.redirect("/")
})



module.exports = router;
