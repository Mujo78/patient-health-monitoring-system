const nodemailer = require("nodemailer")

module.exports = class Email {
    constructor(user, firstName) {
        this.to = user.email;
        this.firstName = firstName;
        this.from = `Application Support ${process.env.EMAIL_SUPPORT}`
    }

    newTransport(){
        if(process.env.NODE_ENV.match('production')){
            console.log('production')
            //sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            })
        }else{
            console.log("development")
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            })
        }
    }

    async send(subject, message){

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: message
        }

        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcomeMessage(){
        await this.send("Welcome!", `Dear ${this.firstName}, Welcome to the Patient Health Monitoring System` )
    }

}

/*
const sendEmail = async options =>{

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: `Application Support <${process.env.EMAIL_SUPPORT}>`,
        to: options.email,
        subject: options.subject,
        text: options.message    
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
*/