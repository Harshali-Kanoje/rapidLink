import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Link from './models/link.js';
dotenv.config();

const app = express();

app.use(express.json());

const __dirname = path.resolve();

const connectToDB = async () => {
    const connection = await mongoose.connect(process.env.MONGODB_URI)
    if (connection) {
        console.log("Successfully connect to MongoDB");
    }
}
connectToDB();

app.post('/api/link', async (req , res) => {
    const {url , slug} = req.body;

    const randomSlug = Math.random().toString(36).substring(2,7)

    const link = new Link({
        url : url,
        slug : slug || randomSlug
    })

    try{
        const savelinkd = await link.save()
        return res.json({
            success : true,
            data : {
                shortUrl : `${process.env.BASE_URL}/${savelinkd.slug}`
            },
            message : "Link save successfully"
        })
    }

    catch(e){
        return res.json({
            success : false,
            message : e.message
        })
    }

})

app.get('/:slug', async (req , res) => {

 const {slug} = req.params;

 if(!link)
 {
    return res.json({
        success : false,
        message : "Link not Found"
    })
 }

 const link = await Link.findOne({slug : slug})

 await Link.updateOne({slug:slug} ,{$set: {clicks:link.clicks + 1}})

 

 res.redirect(link.url)

 
})

app.get('/api/links', async (req ,res) => {
    const links = await Link.find()

    return res.json({
        success: true,
        data: links,
        message: "Successfully fetch all links"
    })
})


if(process.env.NODE_ENV === 'production')
{
    app.use(express.static(path.join(__dirname , '..','client' , 'build')))

    app.get('*' , (req , res) => {
        res.sendFile(path.join(__dirname , '..','client' , 'index.html'))
    })
}

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`server is running on port ${PORT}`)
})