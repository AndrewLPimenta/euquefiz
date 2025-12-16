import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: {
    url: string;
    alt: string;
    text?: string;
  };
  slogan?: string;
  title: React.ReactNode;
  subtitle: string;
  callToAction: {
    text: string;
    href: string;
  };
  backgroundImage: string;
  contactInfo: {
    website: string;
    phone: string;
    address: string;
  };
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  ({ className, logo, slogan, title, subtitle, callToAction, backgroundImage, contactInfo, ...props }, ref) => {

    // Animation variants for the container to orchestrate children animations
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
          delayChildren: 0.2,
        },
      },
    };

    // Animation variants for individual text/UI elements
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    };

    return (
      <motion.section
        ref={ref}
        className={cn(
          "relative flex w-full flex-col overflow-hidden bg-background text-foreground flex-row",
          className
        )}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        {...props}
      >
        {/* Left Side: Content */}
        <div className="flex w-full flex-col justify-between p-8 md:w-1/2 md:p-12 lg:w-3/5 lg:p-16">
          {/* Top Section: Logo & Main Content */}
          <div>
           <motion.header className="mb-3" variants={itemVariants}>
  {logo && (
    <div className="">
      <img 
        src={logo.url} 
        alt={logo.alt} 
        className="w-24 h-24 object-contain" 
      />
    </div>
  )}
</motion.header>

            <motion.main variants={containerVariants}>
              <motion.h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl" variants={itemVariants}>
                {title}
              </motion.h1>
              <motion.div className="my-6 h-1 w-20 bg-primary" variants={itemVariants}></motion.div>
              <motion.p className="mb-8 max-w-md text-base text-muted-foreground" variants={itemVariants}>
                {subtitle}
              </motion.p>
              <motion.a
                href={callToAction.href}
                variants={itemVariants}
              className="
  inline-flex items-center gap-2
  rounded-full
  border border-background
  bg-primary text-background
  font-medium

  px-3 py-2 text-sm        /* mobile (menor) */

  sm:px-4 sm:py-2.5 sm:text-sm
  md:px-6 md:py-3 md:text-base
  lg:px-8 lg:py-4 lg:text-lg

  transition-colors duration-300
"

              >
                {callToAction.text}


                  <ArrowLeft className="h-5 w-5 rotate-180 font-bold" />

              </motion.a>

            </motion.main>
          </div>


        </div>

        {/* Right Side: Image with Clip Path Animation */}
        <motion.div
          className="w-full min-h-[300px] bg-cover bg-center md:w-1/2 md:min-h-full lg:w-2/5"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
          initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
          animate={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' }}
          transition={{ duration: 1.8, ease: "circOut" }}
        >
        </motion.div>
      </motion.section>
    );
  }
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
