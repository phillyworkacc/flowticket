'use client'
import './ColorSelector.css'
import { motion } from 'framer-motion';
import { useState } from 'react';

type ColorSelectorProps = {
   options: string[];
   onSelect: (option: any) => void;
   defaultOptionIndex?: number;
}

export default function ColorSelector ({ options, defaultOptionIndex, onSelect }: ColorSelectorProps) {
   const [optionSelected, setOptionSelected] = useState(defaultOptionIndex || 0);

   return (
      <div className="color-selector">
         {options.map((option, index) => {
            return <motion.div 
               key={index} 
               initial={{ scale: 1, transform: 'rotate(0deg)' }}
               whileTap={{ scale: 1.5, transform: 'rotate(356deg)' }}
               transition={{ duration: 0.3 }}
               className={`option ${(index == optionSelected) && 'selected'}`}
               onClick={() => {
                  setOptionSelected(index);
                  onSelect(option);
            }}>
               <div className="option-bg" style={{ background: option }} />
            </motion.div>
         })}
      </div>
   )
}
