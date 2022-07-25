import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
                type: String,
                required: true
                },
        password: {
                type: String,
                required: true
                },
        firstname: {
                type: String,
                required: true
                },
        lastname: {
                type: String,
                required: true
                },
        isAdmin: {
                type: Boolean,
                default: false
                },
        profilePicture: String,
        coverPicture: String,
        about: String,
        livesIn: String,
        worksAt: String,
        worksAs : String,
        relationship: String,
        followers: [],
        following: []
    },
    {timestamps: true}
)

const userModel = mongoose.model("Users", userSchema)

export default userModel