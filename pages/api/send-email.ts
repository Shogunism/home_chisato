import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail', // 使用するメールサービスを指定
      auth: {
        user: process.env.EMAIL_USER, // 環境変数から取得
        pass: process.env.EMAIL_PASS, // 環境変数から取得
      },
    });


    const mailOptions = {
      from: email,
      to: process.env.EMAIL_TO, // 環境変数から取得
      subject: 'お問い合わせ',
      text: `お名前: ${name}\nメールアドレス: ${email}\nメッセージ:\n${message}`,
    };


    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'メールが送信されました' });
    } catch (error) {
      console.error('メール送信エラー:', error);
      res.status(500).json({ error: 'メール送信に失敗しました' });
    }
  } else {
    res.status(405).json({ error: 'このメソッドは許可されていません' });
  }
};

export default handler;