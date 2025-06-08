'use client'
import '@/styles/app.css'
import Footer from '@/components/Landing/Footer/Footer';
import { Home, LogOut, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Spacing from '@/components/Spacing/Spacing';

export default function Account() {
   const router = useRouter();
   const { data: session } = useSession();

   return (
      <div className='app-wrapper'>
         <header>
            <div className="header-container">
               <div className="app-msg">Your Account</div>
               <div className="account" onClick={() => router.push('/app')}>
                  <button className="transparent xs">
                     <Home size={20} />Back to Home
                  </button>
               </div>
            </div>
         </header>

         <main>
            <div className="app-container">
               <div className="text-m bold-600">{session?.user?.name}</div>
               <div className="text-s">{session?.user?.email}</div>
               <Spacing size={1} />
               <div className="text-m bold-600">
                  <button className='xxs'>Sign Out <LogOut size={14} /></button>
               </div>

               <Spacing size={1} />
               <hr />
               <Spacing size={1} />

               <div className="text-m bold-600 mb-1">Account Deletion</div>
               <div className="text-m bold-600">
                  <button className='xxs delete'>Delete Account <Trash2 size={14} /></button>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   )
}
