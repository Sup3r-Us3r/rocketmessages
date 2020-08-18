import { createTransport } from 'nodemailer';

interface ISendMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string | Buffer;
}

export default new class Mail {
  private transport() {
    // `smtps://<username>%40gmail.com:<password>@smtp.gmail.com`

    const transportOptions = {
      host: String(process.env.MAIL_HOST),
      port: Number(process.env.MAIL_PORT),
      // secure: Boolean(process.env.MAIL_SECURE),
      auth: {
        user: String(process.env.MAIL_USER),
        pass: String(process.env.MAIL_PASS),
      },
    }

    return createTransport(transportOptions);
  }

  public sendMail(send: ISendMailOptions) {
    this.transport().sendMail({
      from: send.from,
      to: send.to,
      subject: send.subject,
      html: send.html,
    }, (err) => {
      if (err) {
        return err;
      }
    });
  }

  public templateMail(codeSent: string) {
    return `
      <body
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          overflow: hidden;
          background: #ece9e6;
          background: -webkit-linear-gradient(to right, #ffffff, #ece9e6);
          background: linear-gradient(to right, #ffffff, #ece9e6);
        "
      >
        <div
          style="
            background: #ffffff;
            padding: 20px;
            border-radius: 5px;
            border-bottom: #7c72dc 4px solid;
            -webkit-box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            -moz-box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          "
        >
          <p
            style="
              font-size: 18px;
              text-align: center;
              color: #7c72dc;
              text-transform: uppercase;
              margin: 0 0 20px 0;
            "
          >
            Código para recuperar senha
          </p>
          <span
            style="
              background: rgba(125, 114, 220, 0.2);
              padding: 5px;
              color: #999;
              border-radius: 5px;
            "
            >${codeSent}</span
          >
        </div>
      </body>
    `;
  }
}
