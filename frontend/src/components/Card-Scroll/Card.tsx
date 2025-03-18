import React from 'react';
import Image from "next/image";
import "@/styles/cards/cards.css";

interface CardProps {
    title: string;
    content: string;
    language: string[];
    link: string;
    index: number;
  }

 const Card = ({ title, content, index, language, link }: CardProps) => {
  return (
    <div className="card" id={`card-${index + 1}`}>
        <div className="card-inner">
          <div className="card-content pb-3">
            <div className="fnt-1">{title}</div>
            <p>{content}</p>
          </div>
          <div className="card-img flex flex-row flex-wrap gap-6">
            <div className='flex flex-wrap lg:w-full gap-6'>
              {language.map((item) => (
                <div className='h-fit' key={item}>
                  <Image src={`/assets/logo/${item}.svg`}  alt={`${item} logo`} width={50} height={50} title={item}/>
                </div>
              ))}
            </div>
            <div className=''>
              <a className='btn v1' href={link} target='_blank'>View Project</a>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Card;