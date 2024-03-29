import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Person } from '../models/personModels.js';

const signUp = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        console.log(req.body);

        // Check if the input fields are valid
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Please Input Username and Password" })
        }

        // Check if Person exists in the Database
        const existingPerson = await Person.findOne({ username });

        if (existingPerson) {
            return res.status(400).json({ message: "Person already exists" })
        }

        // Hashing the Person's Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the Person to the Database

        const newPerson = new Person({
            username,
            password: hashedPassword,
            email,
        });

        await newPerson.save();

        return res
            .status(201)
            .json({
                message: "Person created successfully", newPerson
            });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Error Creating Person" })
    }
}

const login = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if the Input Fields are Valid
        if (!username || !password || !email) {
            return res
                .status(400)
                .json({ message: "Please Input Username, Email and Password" })
        }

        // Check if Person Exists in the Database
        const person = await Person.findOne({ username });

        if (!person) {
            return res.status(401).json({ message: "User Does Not Exist" })
        }

        // Compare Passwords using bcrypt
        const passwordMatch = await bcrypt.compare(password, person.password)

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid Username or Password" })
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                personId: person._id,
                username: person.username,
                email: person.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
        return res
            .status(200)
            .json({ message: "Login Successfull", data: person, accessToken: token })

    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ message: "Error during Login" })
    }
}

const getAllPerson = async (req, res) => {
    try {
        // Retrieve all users form the Database
        const persons = await Person.find({}, { password: 0 }); // Exclude the password field from the response
        return res.status(200).json({ persons });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "error fetching persons/people" })
    }
}

const getSinglePerson = async (req, res) => {
    try {
        // Retrieve single user form the Database
        const persons = await Person.findById(req.params.id);
        return res.status(200).json({ persons });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "error fetching person" })
    }
}



const generateToken = ({
    _id: personId,
}) => {
    const secretKey = "backend-secret-key"
    const resetToken = jwt.sign(
        { personId },
        secretKey,
        { expiresIn: "1h" }
    )
    return resetToken
}


// export const getPasswordResetURL = (person, resetToken) =>
//   `http://localhost:5000/passwordReset/${person._id}/${resetToken}`

// resetPassword
// email - from req body
// check if that email exists in the database
// generate resetToken
// store the reset token in the person document and save it in database
// return the resetToken and personId in json 

const resetPassword = async (req, res) => {
    const { email } = req.body;
    console.log("person : ", req.body)

    let person;
    try {
        person = await Person.findOne({ email })
    } catch (error) {
        return res.status(404).json({ message: "No user found" })
    }

    const resetToken = generateToken(person);
    console.log("rexieved resetToken: ", resetToken)


    // Store the reset token in the person document
    person.resetToken = resetToken;
    await person.save();


    return res.json({ resetToken, personId: person._id });

    // const url = getPasswordResetURL(person, resetToken);
    // console.log("generated url", url )
}


// req.body - id, resetToken, newPassword (id and resetToken - resetPassword se le liya)
// server verifies the token (that is not expired + user Id from payload)
// resetToken validation and expiration (jwt methods)
// saving oldPassword -> newPassword hash of user into database
// return password change successful message in json

const updatePassword = async (req, res) => {
    const { personId, resetToken, newPassword } = req.body;

    const secretKey = "backend-secret-key";





    // const decoded = jwt.verify(resetToken, secretKey)

    // if (resetToken) {
    //     jwt.verify(resetToken, secretKey, function (error, decodedData) {
    //         if (error) {
    //             return res.status(400).json({ error: "Incorrect token or token is expired" })
    //         }

    //         let person;
    //         try {
    //             person =  Person.findOne({ resetToken });
    //             person.password = newPassword;
    //             // person.save((err, result) => {
    //             //     if (err) {
    //             //         return res.status(400).json({ error: "Reset Password Error" })
    //             //     } else {
    //             //         return res.status(200).json({ message: "Password Changed Successfully" })
    //             //     }
    //             // })
    //             person.save();
    //             return res.status(200).json({message: "password changed successfully"})
    //         } catch (error) {
    //             return res.status(404).json({ message: "No user found" })
    //         }
    //         // Person.findOne({ personId }, (err, person) => {
    //         //     if (err || !person) {
    //         //         return res.status(400).json({ error: "User with this token does not exist" })
    //         //     }

                
    //         // })
    //     })
    // } else {
    //     return res.status(401).json({ error: "Authentication Error" })
    // }
}

export { signUp, login, getAllPerson, getSinglePerson, generateToken, resetPassword, updatePassword }