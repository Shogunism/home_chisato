"use client";

import React, { useState } from 'react'; // ReactとuseStateをインポート

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('送信に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('送信エラー:', error);
      alert('送信中にエラーが発生しました。');
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>お問い合わせの送信が完了しました</h1>
        <p>ご連絡ありがとうございます。追ってご返信いたします。</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '0px' }}> {/* 中央揃えとパディングを設定 */}
              <div className="title-text">CONTACT</div>
      <p>ご依頼、ご相談は下記フォームからお気兼ねなくご相談ください。</p>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name">お名前</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email">ご自身の メールアドレス</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="message">メッセージ</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px', height: '150px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>送信</button>
      </form>
    </div>
  );
};

export default ContactPage; // コンポーネントをエクスポート
