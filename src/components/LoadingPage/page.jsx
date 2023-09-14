"use client"

import { motion as m } from 'framer-motion'
import Image from "next/image";

const LoadingPage = () => {
  return (
    <m.div initial={{opacity: 0}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, transition: { duration: 5 }}} transition={{duration: 0.5}}  className="bg-white h-screen w-full flex justify-center items-center">
<m.div     initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.75, repeat: Infinity }}>
 <Image
        alt="brand-logo"
        className="mt-3"
        width={147}
        height={160}
        src={"/static/img/brand.png"}
      />
    </m.div>
    </m.div>
  )
}

export default LoadingPage