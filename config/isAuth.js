import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        console.log("Authorization", req.headers)
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "unauthorized request" })
        }

        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedToken);

        if (!decodedToken) {
            throw new Error("Invalid Access Token");
        }
        req.person = decodedToken;
        console.log(req.person);

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error validating token" });
    }
}




// "password": "$2b$10$byAx5X0U1/rBDIxJzM.i8u51KImHfHVBLsOQ0kgmc8PX5143huxuC",
// "_id": "65dca1a9adf0e61fbd11271f",

//$2b$10$RQWm49IGidbM6hPEunSSWe8IDvNxrP3OlwzkQLoP7eba5gY.H2hYa

// $2b$10$LpYVOxrff.6k58K.SfBpNe0r2gUxC0AXpGOrcWqYlCLvsqXxhkHda


// app.post('/reset-password', async (req, res) => {
//     const { resetToken, newPassword } = req.body;
  
//     try {
//       // Verify the reset token
//       const decoded = jwt.verify(resetToken, secretKey);
  
//       // Find the user associated with the token
//       const user = await User.findOne({ _id: decoded.userId });
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Validate the expiration time of the token
//       if (Date.now() > decoded.exp * 1000) {
//         return res.status(401).json({ message: 'Token has expired' });
//       }
  
//       // Update the user's password
//       user.password = newPassword;
//       user.resetToken = null; // Clear the reset token after using it
//       await user.save();
  
//       return res.json({ message: 'Password reset successful' });
//     } catch (error) {
//       console.error(error);
//       return res.status(401).json({ message: 'Invalid or expired token' });
//     }
//   });