'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Nav.css';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTopHovered, setIsTopHovered] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <Image
            src={isHovered || isTopHovered ? '/icon_hover.svg' : '/icon.svg'}
            alt="ホーム千郷"
            width={50}
            height={50}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          &#x2630;
        </button>
        <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <li className="navbar-item">
            <Link
              href="/"
              className="navbar-link"
              onMouseEnter={() => setIsTopHovered(true)}
              onMouseLeave={() => setIsTopHovered(false)}
            >
              トップ
            </Link>
          </li>
          <li className="navbar-item">
            <Link href="/articles" className="navbar-link">記事一覧</Link>
          </li>
          <li className="navbar-item">
            <Link href="/notices" className="navbar-link">お知らせ一覧</Link>
          </li>
          <li className="navbar-item">
            <Link href="/contact" className="navbar-link">お問い合わせ</Link>
          </li>
        </ul>
      </div>
      
    </nav>
    
  );
};

export default Nav;