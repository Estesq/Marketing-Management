import { userDetailsFormSchemaWithoutCV } from '../../utils/YupSchemas.js';
import { userModal } from '../../models/UserSchema.js';

export const userDetails = (data, req, res) => {
    userDetailsFormSchemaWithoutCV.validate(data)
        .then(async (response) => {
            try {
                // checking if user already submitted the CV
                const { email } = response;
                const user = await userModal.findOne({ email });
                if (user) {
                    return res.json({ success: false, msg: "Already Registered" });
                }

                // save to database
                const newCV = new userModal(data);
                await newCV.save();
                
                return res.json({ success: true, msg: "Data successfully submitted", user: { email: email, userID: newCV?._id } })
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