"use client"
import "./Footer.css"

export default function Footer() {
   return (
      <footer className="footer">
         <p className="footer-copy text-xxxs">&copy; {new Date().getFullYear()} FlowTicket. All rights reserved.</p>
      </footer>
   );
}
