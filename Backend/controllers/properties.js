const Properties = require("../Models/properties");
const errors = require("../utils/error");
const { verifyAdmin } = require("../utils/verifytoken");

const multer = require("multer");
const path = require("path");

// Storing property images

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  // limits:{fileSize: 1000000},
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("uploadedImages");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

//creating property
const postproperty = async (req, res, next) => {

  upload(req, res, async (err) => {

    console.log("called");
    console.log("req", req.files)
    const imgArray = req.files.map((i)=>i.path)
    if (err) {
      res.send({
        msg: err,
      });
    } else {
      if (req.file == undefined) {
        try {
          const post = new Properties({
            // Title: req.body.Title,
            // Price: req.body.Price,
            // Type: req.body.Type,
            // city: req.body.city,
            // Purpose: req.body.Purpose,
            // DetailLocation: req.body.DetailLocation,
            // "Bedroom(s)": req.body["Bedroom(s)"],
            // Area: req.body.Area,
            // 'Bath(s)': req.body['Bath(s)'],
            // kitchen: req.body.kitchen,
            // storeroom: req.body.storeroom,
            // Description: req.body.Description,
            // postedBy: req.body.postedBy,
            propertyImages:imgArray,

            ...req.body
            
          });
          console.log(req.body);
          await post.save();
        } catch (error) {
          next(error);
        }
        res.send({
          msg: "Error: No File Selected!",
          file: `${req.files}`

        });
      } else {
        res.send({
          msg: "File Uploaded!",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });


};

// const getProperty = async (req, res, next) => {
//   try {
//     console.log("getting All documents");
//     const detail = await Properties.find({}).populate("owner").exec();
//     // const property = await Properties.find({}).populate('owner').exe();
//     detail && res.status(200).json(detail);
//   } catch (error) {
//     next(error);
//   }
// };

const getProperty = async (req, res) => {
  res.json(res.paginatedResults);
};

//getting properties with owner information

function paginatedResults(model) {
  return async (req, res, next) => {

    console.log("purpose",req.query)

    const property = req.query.propertyType;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const title = req.query.title

    console.log(property, page, limit);

    const startIndex = (page - 1) * limit;

    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      if (property == "all_properties") {




        if (title !="" ){

     




          results.count = await model.find( {Title: {$regex:title,  $options: 'i'}}).count()
        
          results.results = await model
            .find({Title: {$regex:title,  $options: 'i'}})
            .limit(limit)
            .skip(startIndex)
            .exec();



        }

        else{

         

          if  (req.query.purpose){

            results.count = await model.find({Purpose:req.query.purpose}).count()
        
            results.results = await model
              .find({Purpose:req.query.purpose})
              .limit(limit)
              .skip(startIndex)
              .exec();

          }

          else{



        results.count = await model.find().count()
        
        results.results = await model
          .find()
          .limit(limit)
          .skip(startIndex)
          .exec();
      
        }}
      
      
        } else if (title=="" || title==undefined) {

        results.count = await model.find({ Type: property }).count()

        results.results = await model
          .find({ Type: property })
          .limit(limit)
          .skip(startIndex)
          .exec();
          console.log( results.results.length)
      }
      else{

        results.count = await model.find({ Type: property, Title: {$regex:title,  $options: 'i'} }).count()


        results.results = await model
        .find({ Type: property, Title: {$regex:title,  $options: 'i'} })
        .limit(limit)
        .skip(startIndex)
        .exec();
        console.log( results.results.length)

      }





    //   results.results = JSON.parse(JSON.stringify(results.results))



    // const filterResults = await results.results.filter((f)=>f.Type == "House")

    console.log("filter", results.results.length)


    const finalResult = {results:results.results, count: results.count}

      
    
      res.paginatedResults = finalResult;

      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

//edit property
const editProperty = async (req, res, next) => {
  try {
    const property = await Properties.findById(req.params.id);
    if (String(property.owner._id) === req.body.owner || verifyAdmin)
      try {
        const updated = await Properties.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        updated && res.status(200).json(updated);
      } catch (error) {
        next(error);
      }
    else {
      next(errors.createError(401, "You can only update your Property"));
    }
  } catch (error) {
    next(error);
  }
};

//delete a property
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Properties.findById(req.params.id);
    console.log(property);
    console.log(property.owner);
    if (String(property.owner._id) === req.body.owner || verifyAdmin)
      try {
        const deleteProperty = await Properties.findByIdAndDelete(
          req.params.id
        );
        deleteProperty && res.status(200).json(deleteProperty);
        console.log("SuccessFully Deleted property");
      } catch (error) {
        console.log(error);
      }
    else {
      next(errors.createError(401, "you can only delete your property"));
      console.log("You can delete only your property");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postproperty,
  getProperty,
  editProperty,
  deleteProperty,
  paginatedResults,
};
