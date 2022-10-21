import { userDetailsFormSchema } from '../../utils/YupSchemas.js';
import { userModal } from '../../models/UserSchema.js';
import UploadToS3 from './UploadToS3.js';

export const userCV = (data, req, res) => {
    userDetailsFormSchema.validate(data)
        .then(async (response) => {
            try {
                const filename = `${Date.now()}_${response.file.name}`;

                // checking if user already submitted the CV
                const { email } = response;
                const user = await userModal.findOne({ email });
                if (user) {
                    return res.json({ success: false, msg: "Already Registered" });
                }

                // save details to db and file to s3
                else if (response.file?.data) {
                    const isFileUploaded = await UploadToS3(filename, response);
                    
                    if(isFileUploaded?.success !== true){
                        return res.json({success:false, msg:isFileUploaded.msg || "File not saved"})
                    }

                    // save to database
                    let s3File = 'https://luke-pdf.s3.ap-south-1.amazonaws.com/' + filename
                    const dataToSave = { ...data, file: s3File };
                    const newCV = new userModal(dataToSave);
                    await newCV.save();
                    
                    return res.json({ success: true, msg: "File uploaded and data successfully submitted", user:{email:email, userID:newCV?._id}})
                }
                else {
                    return res.json({ success: false, msg: "Something went wrong, Possibly file not found" })
                }
            }
            catch (error) {
                console.log(error)
                return res.json({ success: false, msg: "Internal Server Error Occurred!!" })
            }
        })
        .catch(err => {
            return res.json({ success: false, msg: "Validation error occurred, Please re-check you details", error: err.message?.replace(".mimetype", " type") })
        })
}