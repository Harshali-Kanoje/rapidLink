import { Schema,model } from "mongoose";

const linkSchema = new Schema({
    url : {
        type : String,
        required : true
    },
    slug : {
        type : String,
        required : true,
        unique : true
    },
    clicks : {
        type : Number,
        default : 0,
        required : true
    }
},
{
    timestamps : true
}
)
 
const Link = model('Link' , linkSchema)
export default Link;