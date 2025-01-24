import React from 'react';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="py-2 mt-2 border-t-2">
            <div className="container mx-auto text-center">
                <p>&copy; 2025 Your Company. All rights reserved.</p>
                <div className='flex items-center justify-center gap-4 mt-2'>
                <div className='flex items-center'>
                        <FaFacebook className='text-md' />
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2 hover:text-blue-500">
                        Facebook
                        </a>
                    </div>
                    <div className='flex items-center'>
                        <FaXTwitter className='text-md' />
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2 hover:text-blue-500">
                        Twitter
                        </a>
                    </div>
                    <div className='flex items-center'>
                        <FaInstagram className='text-md' />
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2 hover:text-blue-500">
                        Instagram
                        </a>
                    </div>
                </div>
        <div className="mt-4">
          <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a> |
          <a href="#" className="text-gray-400 hover:text-white"> Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
