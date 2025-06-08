import "./Card.css"
import { ReactNode } from "react"

type CardProps = {
   children: ReactNode;
   padding?: string;
   height?: string;
   cursor?: boolean;
   small?: boolean;
   onClick?: Function;
}

export default function Card({ children, padding, height, cursor, small, onClick }: CardProps) {
   return (
      <div 
         className={'card'} 
         style={{
            maxWidth: small ? '400px' : 'none',
            padding: padding || '',
            height: height || 'fit-content',
            cursor: cursor ? 'pointer' : 'default'
         }}
         onClick={() => onClick ? onClick() : {}}
      >{children}</div>
   )
}
