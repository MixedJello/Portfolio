import React from 'react';
import Image from "next/image";
import "@/styles/cards/cards.css";

interface CardProps {
    title: string;
    content: string;
    index: number;
  }

 const Card = ({ title, content, index }: CardProps) => {
  return (
    <div className="card" id={`card-${index + 1}`}>
        <div className="card-inner">
          <div className="card-content">
            <div className="fnt-1">{title}</div>
            <p>{content}</p>
          </div>
          <div className="card-img">
            <Image src={`/assets/card-${index + 1}.jpg`}  alt={`${title} image`} width={500} height={500} />
          </div>
        </div>
      </div>
  )
}

export default Card;