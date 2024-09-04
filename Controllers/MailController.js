
const Mail =  require('../models/MailsModel');


// exports.PostMails = async (req,res) =>{

//     const Request = req.body;
//     // const parsed_Request = JSON.parse(Request);
//     const {name, email,subject,message} = Request;
//     console.log(req.body);
//     // console.log(parsed_Request);
//     try{

//         const mail = await Mail.create({name:name,email:email,subject:subject,message:message});
//         res.status(201).json(mail);
//     }catch{
//         res.status(400).json({message:"Error Occured"});
//     }

// }
exports.PostMails = async (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log(req.body);
  
    try {
      const mail = await Mail.create({ name, email, subject, message });
      res.status(201).json(mail);
    } catch {
      res.status(400).json({ message: "Error Occurred" });
    }
  };
  