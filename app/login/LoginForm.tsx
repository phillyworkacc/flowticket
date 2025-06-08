'use client'
import "@/styles/auth.css"
import { FlowTicketSvgLogoText } from "@/components/Icons/Icon"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { checkUserExists, createUserAccount } from "../actions/user"
import { validateEmail } from "@/utils/validation"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

function Spinner () {
   return <span className="spinner" />;
}

export default function LoginForm () {
   const router = useRouter();
   const [currentAuthStep, setCurrentAuthStep] = useState(0)
   const [buttonLoading, setButtonLoading] = useState(false)
   const [email, setEmail] = useState('')
   const [name, setName] = useState('')
   const [password, setPassword] = useState('')
   const [password2, setPassword2] = useState('')

   const authSteps = [
      <div className="form-content">
         <input type="email" name="email" className="s" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>,
      <>
         <div className="text-xs bold-600 dfb align-center">What's your name ?</div>
         <div className="form-content">
            <input type="text" className="s" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
         </div>
      </>,
      <>
         <div className="text-xs bold-600 dfb align-center">Create your password</div>
         <div className="form-content">
            <input type="password" className="s" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
         </div>
         <div className="form-content">
            <input type="password" className="s" placeholder="Password (again)" value={password2} onChange={(e) => setPassword2(e.target.value)} />
         </div>
      </>,
      <>
         <div className="text-xs bold-600 dfb align-center">Enter your password</div>
         <div className="form-content">
            <input type="password" className="s" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
         </div>
      </>
   ]

   const nextAuthStep = async () => {
      if (currentAuthStep == 0) {
         // validate email
         if (email == "") { toast.error("Please enter your email"); return; }
         if (!validateEmail(email)) { toast.error("Please enter a valid email"); return; }
         // check if user email exists
         // if user email exists then login else sign up
         setButtonLoading(true)
         const userExists = await checkUserExists(email);
         setCurrentAuthStep(userExists ? 3 : 1);
         setButtonLoading(false)
      } else if ([2,3].includes(currentAuthStep)) {
         setButtonLoading(true);

         if (currentAuthStep == 2) {
            // create user account
            if (password !== password2) { toast.error("Passwords do not match"); setButtonLoading(false); return; }
            const response = await createUserAccount({ name, email, password });
            if (!response) { toast.error("Please try again. Couldn't create account"); setButtonLoading(false); return; }
         }

         // sign user in
         const res = await signIn("credentials", { email, password, redirect: false });
         if (!res?.error) router.push("/app");
         if (res?.error) toast.error("Incorrect email or password");

         setButtonLoading(false)
      } else {
         setCurrentAuthStep(2);
      }
   }  

   return (
      <div className="auth">
         <div className="auth-box">

            <div className="text-s pd-1 dfb justify-center align-center text-center">
               <FlowTicketSvgLogoText size={20} />
            </div>
            <div className="text-ml bold-700 text-center">Login or Sign Up</div>

            <AnimatePresence mode="wait">
               <motion.div
                  key={currentAuthStep}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="form"
               >
                  {currentAuthStep !== 0 && <>
                     <div className="text-xs cursor-pointer grey-4 dfb align-center pd-05 gap-4" onClick={() => setCurrentAuthStep(0)}>
                        <ArrowLeft size={20} /> {email}
                     </div>
                  </>}
                  {authSteps[currentAuthStep]}
                  <button onClick={nextAuthStep} className="s full" disabled={buttonLoading}>
                     {buttonLoading ? <Spinner /> : ('Continue')}
                  </button>
               </motion.div>
            </AnimatePresence>

         </div>
      </div>
   )
}
