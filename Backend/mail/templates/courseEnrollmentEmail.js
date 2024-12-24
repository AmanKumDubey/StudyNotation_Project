exports.courseEnrollment=(courseName,name)=>{

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Course Registration Confirmation </title>

            <style>
                body{
                    background-color: #ffffff;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 1.4;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                }
                .container{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    text-align: center;
                }
                .logo{
                    max-width: 200px;
                    margin-bottom: 20px;

                }
                .body{
                    font-size: 16px;
                    margin-bottom: 20px;
                }
                .cta{
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #ffd6ff;
                    color: #000000;
                    text-decoration: node;
                    border-radius: 5px;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 20px;
                }
                .support{
                    font-size: 14px;
                    color: #999999;
                    margin-top: 20px;
                }
                .highlight{
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
                <div class="container">
                    <a href="https://studynotion-edtech-project.vercel.app">
                        <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="Study Notaion Logo ">
                    </a>
                    <div  class=" message">Course Resistration Confirmation</div>

                    <div class="body">
                        <p>Dear ${name}, </p>
                        <p> You have Successfully registered for the course <span class="highlight">"${courseName}"</span>.
                            We are excited to have you as a participant!</p>
                    
                    <a class="cta" href="https://studynotion-edtech-project.vercel.app/dashboard">Go to Deashboard</a>
                    </div>
                <div class="support">
                    If you have any questions or need assistance, please feel free to reach out to us at 
                <a href = "mailto:info@studynotion.com"> info@studynotion.com</a>. We are here to help!
            
                </div>
                </div>
        </body>
        </html>`;
};