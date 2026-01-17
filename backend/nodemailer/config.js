import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "nestcare8@gmail.com",
        pass: "lciu qwnk kmnq rncc"
    }
})

export default transport;