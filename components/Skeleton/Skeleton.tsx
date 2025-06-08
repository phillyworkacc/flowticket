"use client"
import "./Skeleton.css"

type SkeletonProps = {
   full?: boolean;
   size: number;
   round?: boolean;
}

export default function Skeleton({ full, size, round }: SkeletonProps) {
   return (
      <div 
         className='skeleton'
         style={{
            width: round ? `${size*10}px` : full ? '100%' : '100px',
            height: `${size*10}px`,
            borderRadius: round ? '100%' : '7px'
         }}
      ></div>
   )
}
